const { casperGet, keithTry, extractUrl, dlBuffer, convertTo128kbps } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

const KEITH_AUDIO = ['/download/ytmp3','/download/audio','/download/dlmp3','/download/mp3','/download/yta','/download/yta2','/download/yta3','/download/yta4','/download/yta5'];
const KEITH_VIDEO = ['/download/ytmp4','/download/video','/download/dlmp4','/download/mp4','/download/ytv','/download/ytv2','/download/ytv3','/download/ytv4','/download/ytv5'];

// Try all active Casper audio endpoints in order
async function tryCasperAudio(url) {
    // 1. ytmp3
    try {
        const d = await casperGet('/api/downloader/ytmp3', { url, quality: '128' });
        if (d.success && d.url) return { dlUrl: d.url, title: d.title || 'audio', quality: d.quality || '128kbps' };
    } catch {}

    // 2. yt-audio (proxied stream with quality)
    try {
        const d = await casperGet('/api/downloader/yt-audio', { url });
        if (d.success && d.audios?.length) {
            const pick = d.audios[0];
            return { dlUrl: pick.url, title: d.title || 'audio', quality: pick.quality || pick.label || 'HQ' };
        }
    } catch {}

    // 3. ytmp5
    try {
        const d = await casperGet('/api/downloader/ytmp5', { url });
        if (d.success && d.url) return { dlUrl: d.url, title: d.title || 'audio', quality: d.quality || '128kbps' };
    } catch {}

    // 4. ytmp6
    try {
        const d = await casperGet('/api/downloader/ytmp6', { url });
        if (d.success && d.url) return { dlUrl: d.url, title: d.title || 'audio', quality: d.quality || '128kbps' };
    } catch {}

    // 5. yt-dl (pick audio media)
    try {
        const d = await casperGet('/api/downloader/yt-dl', { url });
        if (d.success && d.medias?.length) {
            const pick = d.medias.find(m => m.is_audio || m.type === 'audio') || d.medias[0];
            if (pick?.original_url) return { dlUrl: pick.original_url, title: d.title || 'audio', quality: pick.quality || 'HQ' };
        }
    } catch {}

    // 6. yt-dl2
    try {
        const d = await casperGet('/api/downloader/yt-dl2', { url });
        if (d.success && d.medias?.length) {
            const pick = d.medias.find(m => m.is_audio || m.type === 'audio') || d.medias[0];
            if (pick?.original_url) return { dlUrl: pick.original_url, title: d.title || 'audio', quality: pick.quality || 'HQ' };
        }
    } catch {}

    return null;
}

// Try all active Casper video endpoints in order
async function tryCasperVideo(url) {
    // 1. ytmp4
    try {
        const d = await casperGet('/api/downloader/ytmp4', { url });
        if (d.success && d.data?.downloads?.length) {
            const best = d.data.downloads.find(x => x.hasAudio) || d.data.downloads[0];
            return { dlUrl: best.url, title: d.data.title || 'video', quality: best.quality || 'HD' };
        }
    } catch {}

    // 2. yt-video (proxied stream, 720p preferred)
    try {
        const d = await casperGet('/api/downloader/yt-video', { url });
        if (d.success && d.videos?.length) {
            const pick = d.videos.find(v => v.quality === '720p') || d.videos[0];
            return { dlUrl: pick.url, title: d.title || 'video', quality: pick.quality || pick.label || 'HD' };
        }
    } catch {}

    // 3. yt-dl3 (direct download_url)
    try {
        const d = await casperGet('/api/downloader/yt-dl3', { url });
        if (d.success && d.download_url) return { dlUrl: d.download_url, title: d.title || 'video', quality: d.quality || 'HD' };
    } catch {}

    // 4. yt-dl2 (medias array, pick video)
    try {
        const d = await casperGet('/api/downloader/yt-dl2', { url });
        if (d.success && d.medias?.length) {
            const pick = d.medias.find(m => m.type === 'video' && m.original_url) || d.medias[0];
            if (pick?.original_url) return { dlUrl: pick.original_url, title: d.title || 'video', quality: pick.quality || 'HD' };
        }
    } catch {}

    // 5. yt-dl4
    try {
        const d = await casperGet('/api/downloader/yt-dl4', { url });
        if (d.success && d.medias?.length) {
            const pick = d.medias.find(m => m.type === 'video' && m.original_url) || d.medias[0];
            if (pick?.original_url) return { dlUrl: pick.original_url, title: d.title || 'video', quality: pick.quality || 'HD' };
        }
    } catch {}

    // 6. yt-dl5
    try {
        const d = await casperGet('/api/downloader/yt-dl5', { url });
        if (d.success && d.medias?.length) {
            const pick = d.medias.find(m => m.type === 'video' && m.original_url) || d.medias[0];
            if (pick?.original_url) return { dlUrl: pick.original_url, title: d.title || 'video', quality: pick.quality || 'HD' };
        }
    } catch {}

    return null;
}

async function ytDownload(sock, msg, args, prefix, ctx, type) {
    const chatId = msg.key.remoteJid;
    const name   = getBotName();
    const url    = args[0];

    if (!url) {
        return sock.sendMessage(chatId, {
            text: `╔═|〔  YOUTUBE ${type.toUpperCase()} 〕\n║\n║ ▸ *Usage* : ${prefix}yt${type === 'audio' ? 'a' : 'v'} <url>\n║\n╚═╝`
        }, { quoted: msg });
    }

    try {
        if (type === 'audio') {
            let buf, title, quality;
            const result = await tryCasperAudio(url);
            if (result) {
                buf = await dlBuffer(result.dlUrl);
                title   = result.title;
                quality = result.quality;
            } else {
                const data2 = await keithTry(KEITH_AUDIO, { url });
                const dlUrl = extractUrl(data2.result);
                if (!dlUrl) throw new Error('All audio APIs failed');
                buf     = await dlBuffer(dlUrl);
                buf     = await convertTo128kbps(buf);
                title   = 'audio';
                quality = '128kbps';
            }
            const banner = `╔═|〔  YOUTUBE AUDIO 〕\n║\n║ ▸ *Track*   : ${title}\n║ ▸ *Quality* : ${quality}\n║ ▸ *Size*    : ${(buf.length/1024/1024).toFixed(2)} MB\n║\n╚═╝`;
            await sock.sendMessage(chatId, { document: buf, mimetype: 'audio/mpeg', fileName: `${title}.mp3`, caption: banner }, { quoted: msg });

        } else {
            let buf, title, quality;
            const result = await tryCasperVideo(url);
            if (result) {
                buf     = await dlBuffer(result.dlUrl);
                title   = result.title;
                quality = result.quality;
            } else {
                const data2 = await keithTry(KEITH_VIDEO, { url });
                const dlUrl = extractUrl(data2.result);
                if (!dlUrl) throw new Error('All video APIs failed');
                buf     = await dlBuffer(dlUrl);
                title   = 'video';
                quality = 'HD';
            }
            const banner = `╔═|〔  YOUTUBE VIDEO 〕\n║\n║ ▸ *Title*   : ${title}\n║ ▸ *Quality* : ${quality}\n║ ▸ *Size*    : ${(buf.length/1024/1024).toFixed(2)} MB\n║\n╚═╝`;
            await sock.sendMessage(chatId, { video: buf, caption: banner }, { quoted: msg });
        }

    } catch (e) {
        await sock.sendMessage(chatId, {
            text: `╔═|〔  YOUTUBE ${type.toUpperCase()} 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
        }, { quoted: msg });
    }
}

module.exports = [
    {
        name: 'yta',
        aliases: ['ytaudio', 'ytmp3', 'youtubeaudio'],
        description: 'Download YouTube audio (128kbps MP3)',
        category: 'download',
        async execute(sock, msg, args, prefix, ctx) { return ytDownload(sock, msg, args, prefix, ctx, 'audio'); }
    },
    {
        name: 'ytv',
        aliases: ['ytvideo', 'ytmp4', 'youtubevideo'],
        description: 'Download YouTube video (MP4)',
        category: 'download',
        async execute(sock, msg, args, prefix, ctx) { return ytDownload(sock, msg, args, prefix, ctx, 'video'); }
    }
];
