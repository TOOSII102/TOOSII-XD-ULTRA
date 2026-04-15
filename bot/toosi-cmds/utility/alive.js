const cfg            = require('../../config');
const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'alive',
    aliases: ['awake','status','online'],
    description: 'Check if the bot is alive and running',
    category: 'utility',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        try { await sock.sendMessage(chatId, { react: { text: '💚', key: msg.key } }); } catch {}
        const name   = getBotName();
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        const _rawOwner = process.env.OWNER_NUMBER || cfg.OWNER_NUMBER || '';
          const _cleanOwnerNum = _rawOwner.replace(/[^0-9]/g, '');
          const ownerNum = _cleanOwnerNum.length >= 7 && _cleanOwnerNum.length <= 13 ? _cleanOwnerNum : '';
          const owner  = ownerNum ? `+${ownerNum}` : 'Unknown';
        const mode   = (process.env.BOT_MODE || cfg.MODE || 'public').toUpperCase();

        const text = [
            `╔═| ●-《  ${name} 》-●`,
            `║`,
            `║ ▸ *Name*     : ${name}`,
            `║ ▸ *Prefix*   : ${prefix || '.'}`,
            `║ ▸ *Owner*    : ${owner}`,
            `║ ▸ *Platform* : Replit`,
            `║ ▸ *Mode*     : ${mode}`,
            `║ ▸ *Uptime*   : ${h}h ${m}m ${s}s`,
            `║ ▸ *Status*   : CONNECTED ✅`,
            `║`,
            `╚═|  ☆ SYSTEM ONLINE  ☆`,
        ].join('\n');

        await sock.sendMessage(chatId, { text }, { quoted: msg });
    }
};
