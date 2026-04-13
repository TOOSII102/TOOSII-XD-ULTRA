'use strict';

const { removeSudoNumber, getSudoList } = require('../../lib/sudo-store');
const { getBotName } = require('../../lib/botname');

const H = '╔═|〔  DEL SUDO 〕';
const F = () => `╚═|〔 ${getBotName()} 〕`;

function resolveRealNumber(jid, sock) {
    if (!jid) return null;
    if (!jid.includes('@lid')) {
        const raw = jid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
        return (raw && raw.length >= 7 && raw.length <= 15) ? raw : null;
    }
    if (sock) {
        try {
            if (sock.signalRepository?.lidMapping?.getPNForLID) {
                const pn = sock.signalRepository.lidMapping.getPNForLID(jid);
                if (pn) {
                    const num = String(pn).split('@')[0].replace(/[^0-9]/g, '');
                    if (num.length >= 7) return num;
                }
            }
        } catch {}
    }
    return null;
}

module.exports = {
    name:        'delsudo',
    aliases:     ['removesudo', 'unsudo'],
    description: 'Remove a user from the sudo list',
    category:    'owner',
    ownerOnly:   true,
    sudoAllowed: false,

    async execute(sock, msg, args, PREFIX, ctx) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '🗑️', key: msg.key } }); } catch {}

        if (!ctx.isOwner()) {
            return sock.sendMessage(chatId, {
                text: `${H}\n║\n║ ▸ *Status* : ❌ Owner only command\n║\n${F()}`
            }, { quoted: msg });
        }

        const quoted    = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        let targetNumber = null;

        if (quoted) {
            const resolved = resolveRealNumber(quoted, sock);
            targetNumber   = resolved || args[0]?.replace(/[^0-9]/g, '') || null;
        } else if (mentioned) {
            const resolved = resolveRealNumber(mentioned, sock);
            targetNumber   = resolved || args[0]?.replace(/[^0-9]/g, '') || null;
        } else if (args[0]) {
            targetNumber = args[0].replace(/[^0-9]/g, '');
        }

        if (!targetNumber || targetNumber.length < 7) {
            const { sudoers } = getSudoList();
            const list = sudoers.length
                ? sudoers.map((n, i) => `║  ${i + 1}. +${n}`).join('\n')
                : '║  (none)';
            return sock.sendMessage(chatId, {
                text: `${H}\n║\n║ ▸ *Usage*   : ${PREFIX}delsudo <number>\n║ ▸ *Reply*   : reply a message + ${PREFIX}delsudo\n║ ▸ *Mention* : @tag someone + ${PREFIX}delsudo\n║\n║ 📋 *Current sudo list:*\n${list}\n║\n${F()}`
            }, { quoted: msg });
        }

        const { sudoers: before } = getSudoList();
        if (!before.includes(targetNumber)) {
            return sock.sendMessage(chatId, {
                text: `${H}\n║\n║ ▸ *Number* : +${targetNumber}\n║ ▸ *Status* : ⚠️ Not in sudo list\n║\n${F()}`
            }, { quoted: msg });
        }

        removeSudoNumber(targetNumber);

        const { sudoers: after } = getSudoList();
        if (!after.includes(targetNumber)) {
            return sock.sendMessage(chatId, {
                text: `${H}\n║\n║ ▸ *Number* : +${targetNumber}\n║ ▸ *Status* : ✅ Removed from sudo list\n║ ▸ *Access* : Revoked\n║\n${F()}`
            }, { quoted: msg });
        }

        return sock.sendMessage(chatId, {
            text: `${H}\n║\n║ ▸ *Number* : +${targetNumber}\n║ ▸ *Status* : ❌ Failed to remove\n║\n${F()}`
        }, { quoted: msg });
    }
};
