'use strict';

const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { getBotName }           = require('../../lib/botname');
const { execFile }             = require('child_process');
const { promisify }            = require('util');
const sharp                    = require('sharp');
const crypto                   = require('crypto');
const fs                       = require('fs');
const os                       = require('os');
const path                     = require('path');

const execFileAsync = promisify(execFile);

// ── Exif metadata injection into WebP RIFF ──────────────────────────────────
function buildExifChunk(packName, packAuthor) {
    const json = JSON.stringify({
        'sticker-pack-id':        crypto.randomBytes(8).toString('hex'),
        'sticker-pack-name':      packName,
        'sticker-pack-publisher': packAuthor,
        'android-app-store-link': '',
        'ios-app-store-link':     '',
    });
    const jBuf = Buffer.from(json, 'utf8');

    // Build a minimal TIFF/Exif structure with ImageDescription tag (0x010E)
    // Layout: Exif\0\0 (6) + TIFF header (8) + IFD entry count (2) + IFD entry (12) + next-IFD (4) + data
    const dataOffset = 6 + 8 + 2 + 12 + 4;          // = 32
    const exif = Buffer.alloc(dataOffset + jBuf.length);

    exif.write('Exif\x00\x00', 0, 'ascii');          // Exif header
    exif.writeUInt16LE(0x4949, 6);                   // Little-endian marker
    exif.writeUInt16LE(42, 8);                        // TIFF magic
    exif.writeUInt32LE(8, 10);                        // IFD0 offset (relative to TIFF start = offset 6)
    exif.writeUInt16LE(1, 14);                        // 1 IFD entry
    exif.writeUInt16LE(0x010E, 16);                   // Tag: ImageDescription
    exif.writeUInt16LE(2, 18);                        // Type: ASCII
    exif.writeUInt32LE(jBuf.length, 20);              // Count (bytes)
    exif.writeUInt32LE(dataOffset - 6, 24);           // Offset from TIFF start → 26
    exif.writeUInt32LE(0, 28);                        // Next IFD = 0
    jBuf.copy(exif, dataOffset);

    // Wrap as WebP EXIF chunk
    const chunk = Buffer.alloc(8 + exif.length);
    chunk.write('EXIF', 0, 'ascii');
    chunk.writeUInt32LE(exif.length, 4);
    exif.copy(chunk, 8);
    return chunk;
}

function injectExifToWebp(webpBuf, packName, packAuthor) {
    if (webpBuf.slice(0, 4).toString('ascii') !== 'RIFF') throw new Error('Not a RIFF buffer');
    if (webpBuf.slice(8, 12).toString('ascii') !== 'WEBP') throw new Error('Not a WebP file');

    // Remove any existing EXIF chunk
    const body = webpBuf.slice(12);
    const clean = [];
    let i = 0;
    while (i + 8 <= body.length) {
        const tag  = body.slice(i, i + 4).toString('ascii');
        const size = body.readUInt32LE(i + 4);
        const pad  = size % 2;                 // WebP chunks are word-aligned
        if (tag !== 'EXIF') clean.push(body.slice(i, i + 8 + size + pad));
        i += 8 + size + pad;
    }

    const exifChunk   = buildExifChunk(packName, packAuthor);
    const newBody     = Buffer.concat([...clean, exifChunk]);
    const fileHeader  = Buffer.alloc(12);
    fileHeader.write('RIFF', 0, 'ascii');
    fileHeader.writeUInt32LE(4 + newBody.length, 4);
    fileHeader.write('WEBP', 8, 'ascii');
    return Buffer.concat([fileHeader, newBody]);
}

module.exports = {
    name:        'take',
    aliases:     ['steal', 'stickerpack', 'stkpack', 'taka'],
    description: 'Re-pack a sticker with a custom name & author — .take [PackName | Author]',
    category:    'utility',

    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        try { await sock.sendMessage(chatId, { react: { text: '🎨', key: msg.key } }); } catch {}

        // ── Parse optional pack/author from args ──────────────────────────
        const raw        = args.join(' ').trim();
        const [rawPack, rawAuthor] = raw.includes('|') ? raw.split('|').map(s => s.trim()) : [raw, ''];
        const packName   = rawPack   || name;
        const packAuthor = rawAuthor || name;

        // ── Find quoted media ─────────────────────────────────────────────
        const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;
        const quoted  = ctxInfo?.quotedMessage;

        const hasStk = quoted?.stickerMessage;
        const hasImg = quoted?.imageMessage;
        const hasVid = quoted?.videoMessage;
        const hasDoc = quoted?.documentMessage;

        if (!quoted || (!hasStk && !hasImg && !hasVid && !hasDoc)) {
            return sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  🎨 TAKE STICKER 〕`, `║`,
                    `║ ▸ *Usage*   : Reply to a sticker or image`,
                    `║              with *${prefix}take*`,
                    `║ ▸ *Custom*  : ${prefix}take MyPack | Author`,
                    `║`,
                    `╚═╝`,
                ].join('\n')
            }, { quoted: msg });
        }

        const tmpDir  = os.tmpdir();
        const tmpIn   = path.join(tmpDir, `take_in_${Date.now()}`);
        const tmpOut  = path.join(tmpDir, `take_out_${Date.now()}.webp`);

        try {
            // Download media
            const syntheticMsg = {
                key: { remoteJid: chatId, id: ctxInfo.stanzaId, participant: ctxInfo.participant, fromMe: false },
                message: quoted,
            };
            const buf = await downloadMediaMessage(syntheticMsg, 'buffer', {});
            if (!buf || buf.length === 0) throw new Error('Could not download media');

            let webpBuf;

            if (hasStk) {
                // Already a WebP — just inject metadata
                webpBuf = buf;

            } else if (hasImg || hasDoc) {
                // Convert image → 512×512 WebP via sharp
                webpBuf = await sharp(buf)
                    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .webp({ lossless: true })
                    .toBuffer();

            } else if (hasVid) {
                // Convert short video → animated WebP via ffmpeg
                const inExt = 'mp4';
                const inPath = tmpIn + '.' + inExt;
                fs.writeFileSync(inPath, buf);
                await execFileAsync('ffmpeg', [
                    '-y', '-i', inPath,
                    '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,fps=15',
                    '-t', '10', '-loop', '0', '-preset', 'default', '-an', '-vsync', '0',
                    tmpOut
                ], { timeout: 30000 });
                webpBuf = fs.readFileSync(tmpOut);
                try { fs.unlinkSync(inPath); } catch {}
                try { fs.unlinkSync(tmpOut); } catch {}
            }

            // Inject Exif metadata
            const finalBuf = injectExifToWebp(webpBuf, packName, packAuthor);

            await sock.sendMessage(chatId, { sticker: finalBuf }, { quoted: msg });
            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  🎨 TAKE STICKER 〕`, `║`,
                    `║ ▸ *Pack*   : ${packName}`,
                    `║ ▸ *Author* : ${packAuthor}`,
                    `║ ▸ *Status* : ✅ Done`,
                    `║`,
                    `╚═╝`,
                ].join('\n')
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎨 TAKE STICKER 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
            }, { quoted: msg });
        } finally {
            try { if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut); } catch {}
        }
    }
};
