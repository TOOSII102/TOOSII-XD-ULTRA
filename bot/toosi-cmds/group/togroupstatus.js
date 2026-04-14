const { downloadContentFromMessage, generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { getBotName } = require('../../lib/botname');
const crypto = require('crypto');

async function downloadToBuffer(message, type) {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

async function sendGroupStatus(sock, jid, content) {
    const inside       = await generateWAMessageContent(content, { upload: sock.waUploadToServer });
    const messageSecret = crypto.randomBytes(32);
    const m = generateWAMessageFromContent(jid, {
        messageContextInfo: { messageSecret },
        groupStatusMessageV2: {
            message: { ...inside, messageContextInfo: { messageSecret } }
        }
    }, {});
    await sock.relayMessage(jid, m.message, { messageId: m.key.id });
    return m;
}

module.exports = {
    name:        'togroupstatus',
    aliases:     ['groupstatus', 'gstatus'],
    description: 'Post text / image / video / audio to the group status (Updates tab)',
    category:    'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();
        const foot    = `╚═╝`;

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser && !ctx?.isGroupAdmin) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GROUP STATUS 〕\n║\n║ ▸ *Status* : ❌ Admins/Owner only\n║\n${foot}`
            }, { quoted: msg });
        }

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GROUP STATUS 〕\n║\n║ ▸ *Status* : ❌ Groups only\n║\n${foot}`
            }, { quoted: msg });
        }

        const ctxInfo   = msg.message?.extendedTextMessage?.contextInfo;
        const quotedMsg = ctxInfo?.quotedMessage;
        const rawArgs   = args.join(' ').trim();

        // ── Colour picker ──────────────────────────────────────────────────────
        const colorMap  = { red:'#FF6B6B', blue:'#34B7F1', green:'#25D366', black:'#000000', purple:'#8B5CF6', yellow:'#F59E0B', teal:'#128C7E' };
        let bgColor = '#25D366';
        let caption = rawArgs;
        const colorMatch = rawArgs.match(/^(#[0-9a-fA-F]{3,6}|red|blue|green|black|purple|yellow|teal)\s*(.*)/i);
        if (colorMatch) {
            bgColor = colorMap[colorMatch[1].toLowerCase()] || colorMatch[1];
            caption = colorMatch[2].trim();
        }

        // ── Usage ──────────────────────────────────────────────────────────────
        if (!caption && !quotedMsg) {
            return sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  GROUP STATUS 〕`,
                    `║`,
                    `║ ▸ *Usage* :`,
                    `║   ${prefix}gstatus <text>`,
                    `║   ${prefix}gstatus <color> <text>`,
                    `║   Reply image/video/audio + ${prefix}gstatus`,
                    `║`,
                    `║ ▸ *Colors* : red blue green black`,
                    `║   purple yellow teal  or  #hex`,
                    `║`,
                    `${foot}`,
                ].join('\n')
            }, { quoted: msg });
        }

        try {
            let payload   = null;
            let typeLabel = '📝 Text';

            // ── Quoted media ───────────────────────────────────────────────────
            if (quotedMsg) {
                if (quotedMsg.videoMessage) {
                    const buf = await downloadToBuffer(quotedMsg.videoMessage, 'video');
                    payload   = { video: buf, caption: caption || quotedMsg.videoMessage.caption || '', mimetype: quotedMsg.videoMessage.mimetype || 'video/mp4' };
                    typeLabel = '📹 Video';
                } else if (quotedMsg.imageMessage) {
                    const buf = await downloadToBuffer(quotedMsg.imageMessage, 'image');
                    payload   = { image: buf, caption: caption || quotedMsg.imageMessage.caption || '' };
                    typeLabel = '🖼️ Image';
                } else if (quotedMsg.audioMessage) {
                    const buf = await downloadToBuffer(quotedMsg.audioMessage, 'audio');
                    payload   = { audio: buf, mimetype: quotedMsg.audioMessage.mimetype || 'audio/mpeg', ptt: quotedMsg.audioMessage.ptt || false };
                    typeLabel = '🎵 Audio';
                } else {
                    const text = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || caption;
                    payload    = { text: text || caption };
                }
            }

            // ── Plain text ─────────────────────────────────────────────────────
            if (!payload) {
                payload = { text: caption };
            }

            // ── Add background/font for text payloads ──────────────────────────
            if (payload.text && !payload.image && !payload.video && !payload.audio) {
                payload = { ...payload, backgroundColor: bgColor, font: 2 };
            }

            await sendGroupStatus(sock, chatId, payload);

            return sock.sendMessage(chatId, {
                text: `╔═|〔  GROUP STATUS 〕\n║\n║ ▸ *Type*   : ${typeLabel}\n║ ▸ *Status* : ✅ Posted\n║\n${foot}`
            }, { quoted: msg });

        } catch (e) {
            console.error('[GS] ERROR:', e.message);
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GROUP STATUS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n${foot}`
            }, { quoted: msg });
        }
    },
};
