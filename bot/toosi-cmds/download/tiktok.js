const { casperGet, keithGet, extractUrl, dlBuffer } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'tiktok',
    aliases: ['tt', 'tik', 'tok'],
    description: 'Download TikTok video (no watermark)',
    category: 'download',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const url    = args[0];

        if (!url) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  TIKTOK 〕\n║\n║ ▸ *Usage* : ${prefix}tiktok <url>\n║\n╚═╝`
            }, { quoted: msg });
        }

        try {
            let dlUrl, title, author;

            try {
                const data = await casperGet('/api/downloader/tiktok', { url });
                if (!data.success) throw new Error(data.error || 'Casper: no result');
                dlUrl  = data.download_url || data.video_hd_url || data.video_url;
                title  = (data.title  || 'TikTok').slice(0, 50);
                author = data.author  || '';
                if (!dlUrl) throw new Error('Casper: no video URL');
            } catch {
                const data2 = await keithGet('/download/tiktokdl3', { url });
                if (!data2.status) throw new Error(data2.error || 'fallback failed');
                dlUrl  = extractUrl(data2.result);
                title  = 'TikTok';
                author = '';
                if (!dlUrl) throw new Error('No download URL found');
            }

            const buf    = await dlBuffer(dlUrl);
            const banner = `╔═|〔  TIKTOK 〕\n║\n║ ▸ *Title* : ${title}\n║ ▸ *By*    : @${author}\n║ ▸ *Size*  : ${(buf.length/1024/1024).toFixed(2)} MB\n║\n╚═╝`;
            await sock.sendMessage(chatId, { video: buf, caption: banner }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  TIKTOK 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
            }, { quoted: msg });
        }
    }
};
