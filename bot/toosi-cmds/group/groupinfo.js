module.exports = {
    name: 'groupinfo',
    aliases: ['ginfo'],
    description: 'Show group information',
    category: 'group',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        try { await sock.sendMessage(chatId, { react: { text: 'ℹ️', key: msg.key } }); } catch {}
        if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: `╔═|〔  GROUP INFO 〕\n║\n║ ▸ Group only command\n║\n╚═╝` }, { quoted: msg });
        try {
            const meta    = await sock.groupMetadata(chatId);
            const admins  = meta.participants.filter(p => p.admin).length;
            const members = meta.participants.length;
            const created = new Date(meta.creation * 1000).toLocaleDateString('en-KE', { timeZone: 'Africa/Nairobi' });
            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  GROUP INFO 〕`,
                    `║`,
                    `║ ▸ *Name*    : ${meta.subject}`,
                    `║ ▸ *Members* : ${members}`,
                    `║ ▸ *Admins*  : ${admins}`,
                    `║ ▸ *Created* : ${created}`,
                    meta.desc ? `║ ▸ *Desc*    : ${meta.desc.slice(0, 80)}` : null,
                    `║`,
                    `╚═╝`,
                ].filter(Boolean).join('\n')
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: `╔═|〔  GROUP INFO 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝` }, { quoted: msg });
        }
    }
};
