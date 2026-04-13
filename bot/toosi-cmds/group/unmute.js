'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name:        'unmute',
    aliases:     ['open', 'unlock', 'unlockgroup', 'unmutegrp'],
    description: 'Unmute the group — all members can send messages (sudo/admin only)',
    category:    'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        try { await sock.sendMessage(chatId, { react: { text: '🔊', key: msg.key } }); } catch {}

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  🔊 UNMUTE 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        // — permission check (sender) —
        let isPrivileged = ctx?.isOwnerUser || ctx?.isSudoUser;
        if (!isPrivileged) {
            try {
                const meta     = await sock.groupMetadata(chatId);
                const rawJid   = msg.key.participant || msg.key.remoteJid || '';
                const bareJid  = rawJid.replace(/:[\d]+@/, '@');
                const numPart  = rawJid.split('@')[0].split(':')[0];
                isPrivileged   = meta.participants.some(p => {
                    if (p.admin !== 'admin' && p.admin !== 'superadmin') return false;
                    const pId   = p.id || '';
                    const pBare = pId.replace(/:[\d]+@/, '@');
                    const pNum  = pId.split('@')[0].split(':')[0];
                    return pId === rawJid || pBare === bareJid || pNum === numPart;
                });
            } catch {}
        }

        if (!isPrivileged) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  🔊 UNMUTE 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        // — execute —
        try {
            const meta = await sock.groupMetadata(chatId);
            await sock.groupSettingUpdate(chatId, 'not_announcement');
            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  🔊 UNMUTE 〕`,
                    `║`,
                    `║ ▸ *Group*  : ${meta.subject}`,
                    `║ ▸ *Status* : 🔊 Group unmuted`,
                    `║ ▸ *Effect* : All members can now send messages`,
                    `║`,
                    `╚═|〔 ${name} 〕`,
                ].join('\n')
            }, { quoted: msg });
        } catch (e) {
            const reason = /not-authorized|forbidden/i.test(e.message)
                ? 'Bot is not an admin — promote the bot first'
                : e.message;
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🔊 UNMUTE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${reason}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};
