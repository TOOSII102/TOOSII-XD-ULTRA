/**
 * plugins/tools.js
 * Tools: sticker, toimage, tts
 */

const sticker = {
    name: ['sticker', 'stiker', 's'],
    description: 'Convert image/video to sticker',
    category: 'Tools',
    async handler({ sock, jid, msg, reply, getRaw }) {
        // Check for quoted image or directly sent image
        const raw = msg.message;
        const quoted = raw?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMsg = raw?.imageMessage || quoted?.imageMessage;
        const videoMsg = raw?.videoMessage || quoted?.videoMessage;

        if (!imageMsg && !videoMsg) {
            return reply('⚠️ Please send or quote an image/video with the command.');
        }

        try {
            const { downloadMediaMessage } = require('gifted-baileys');
            const buffer = await downloadMediaMessage(
                { message: imageMsg ? { imageMessage: imageMsg } : { videoMessage: videoMsg },
                  key: msg.key },
                'buffer',
                {}
            );

            await sock.sendMessage(jid, {
                sticker: buffer,
            }, { quoted: msg });
        } catch (e) {
            await reply(`❌ Failed to create sticker: ${e.message}`);
        }
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const toimage = {
    name: ['toimage', 'toimg'],
    description: 'Convert sticker to image',
    category: 'Tools',
    async handler({ sock, jid, msg, reply }) {
        const raw    = msg.message;
        const quoted = raw?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stickerMsg = raw?.stickerMessage || quoted?.stickerMessage;

        if (!stickerMsg) return reply('⚠️ Please quote a sticker with this command.');

        try {
            const { downloadMediaMessage } = require('gifted-baileys');
            const buffer = await downloadMediaMessage(
                { message: { stickerMessage: stickerMsg }, key: msg.key },
                'buffer',
                {}
            );
            await sock.sendMessage(jid, { image: buffer, caption: '✅ Here is your image!' }, { quoted: msg });
        } catch (e) {
            await reply(`❌ Failed: ${e.message}`);
        }
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const tts = {
    name: ['tts'],
    description: 'Text to speech',
    category: 'Tools',
    async handler({ query, reply, sock, jid, msg }) {
        if (!query) return reply('⚠️ Usage: .tts <text>');

        try {
            const fetch = require('node-fetch');
            const text  = encodeURIComponent(query);
            const url   = `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=en&client=tw-ob`;

            const res    = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const buffer = Buffer.from(await res.arrayBuffer());

            await sock.sendMessage(jid, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: true,
            }, { quoted: msg });
        } catch (e) {
            await reply(`❌ TTS failed: ${e.message}`);
        }
    },
};

// ─────────────────────────────────────────────────────────────────────────────

module.exports = [sticker, toimage, tts];
