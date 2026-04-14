const { casperGet, keithTry, extractUrl, dlBuffer } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'ig',
    aliases: ['insta', 'instagram', 'instadl'],
    description: 'Download Instagram post/reel/story',
    category: 'download',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const url    = args[0];

        if (!url) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  INSTAGRAM 〕\n║\n║ ▸ *Usage* : ${prefix}ig <url>\n║\n╚═╝`
            }, { quoted: msg });
        }

        try {
            let dlUrl, isVid;

            // 1. Primary: ig endpoint
            try {
                const data = await casperGet('/api/downloader/ig', { url });
                if (data.success) {
                    dlUrl = data.download_url || data.all_media?.[0]?.url;
                    if (dlUrl) {
                        isVid = dlUrl.includes('.mp4') || data.type === 'video';
                    }
                }
            } catch {}

            // 2. Fallback: reelsvideo endpoint (great for reels/videos)
            if (!dlUrl) {
                try {
                    const data = await casperGet('/api/downloader/reelsvideo', { url });
                    if (data.success) {
                        if (data.videos?.length) {
                            dlUrl = data.videos[0]?.url || data.videos[0]?.download_url;
                            isVid = true;
                        } else if (data.images?.length) {
                            dlUrl = data.images[0]?.url || data.images[0];
                            isVid = false;
                        }
                    }
                } catch {}
            }

            // 3. Keith fallback
            if (!dlUrl) {
                const data2 = await keithTry(['/download/instadl', '/download/instaposts'], { url });
                dlUrl = extractUrl(data2.result);
                if (!dlUrl) throw new Error('No download URL found');
                isVid = dlUrl.includes('.mp4') || dlUrl.includes('video');
            }

            const buf    = await dlBuffer(dlUrl);
            const banner = `╔═|〔  INSTAGRAM 〕\n║\n║ ▸ *Type* : ${isVid ? '📹 Video' : '🖼️ Image'}\n║ ▸ *Size* : ${(buf.length/1024/1024).toFixed(2)} MB\n║\n╚═╝`;

            if (isVid) await sock.sendMessage(chatId, { video: buf, caption: banner }, { quoted: msg });
            else        await sock.sendMessage(chatId, { image: buf, caption: banner }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  INSTAGRAM 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
            }, { quoted: msg });
        }
    }
};
