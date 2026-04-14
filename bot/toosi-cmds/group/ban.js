'use strict';

const { getTarget, resolveDisplay, checkPrivilege } = require('../../lib/groupUtils');
const { getBotName } = require('../../lib/botname');

module.exports = {
    name:        'ban',
    aliases:     ['kick', 'remove'],
    description: 'Remove a member from the group (sudo/admin only)',
    category:    'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '🔨', key: msg.key } }); } catch {}

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  BAN 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═╝`
            }, { quoted: msg });
        }

        const { ok } = await checkPrivilege(sock, chatId, msg, ctx);
        if (!ok) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  BAN 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═╝`
            }, { quoted: msg });
        }

        const target = getTarget(msg, args);
        if (!target) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  BAN 〕\n║\n║ ▸ *Usage* : ${prefix}ban @user or reply a message\n║\n╚═╝`
            }, { quoted: msg });
        }

        try {
            const display = await resolveDisplay(sock, chatId, target);
            await sock.groupParticipantsUpdate(chatId, [target], 'remove');
            await sock.sendMessage(chatId, {
                text: `╔═|〔  BAN 〕\n║\n║ ▸ *User*   : ${display}\n║ ▸ *Status* : ✅ Removed from group\n║\n╚═╝`
            }, { quoted: msg });
        } catch (e) {
            const reason = /not-authorized|forbidden/i.test(e.message)
                ? 'Bot is not an admin — promote the bot first'
                : e.message;
            await sock.sendMessage(chatId, {
                text: `╔═|〔  BAN 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${reason}\n║\n╚═╝`
            }, { quoted: msg });
        }
    }
};
