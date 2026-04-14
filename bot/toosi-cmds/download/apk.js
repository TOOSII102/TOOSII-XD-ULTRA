'use strict';

const { keithGet, dlBuffer } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

function fmtSize(bytes) {
    if (!bytes) return '? MB';
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
}

function fmtNum(n) {
    if (!n) return '0';
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
    return String(n);
}

module.exports = {
    name:        'apk',
    aliases:     ['apkdl', 'getapk'],
    description: 'Search and download APK from Aptoide',
    category:    'download',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();
        const q       = args.join(' ').trim();
        const H = `╔═|〔  APK DOWNLOADER 〕`;
        const F = `╚═╝`;

        if (!q) {
            return sock.sendMessage(chatId, {
                text: [
                    H, `║`,
                    `║ ▸ *Usage*   : ${prefix}apk <app name>`,
                    `║ ▸ *Example* : ${prefix}apk whatsapp`,
                    `║`, F,
                ].join('\n')
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '🔍', key: msg.key } });

            const search = await keithGet('/search/aptoide', { q });
            if (!search?.status) throw new Error(search?.error || 'Search failed');

            const list = search?.result?.datalist?.list;
            if (!list?.length) throw new Error(`No APK found for "${q}"`);

            // Pick best result — prefer name match, then fall back to highest downloads
            const withPath   = list.filter(a => a.file?.path);
            const qLower     = q.toLowerCase();
            const qWords     = qLower.split(/\s+/);

            // Score: exact name match = 1000, each query word in name = 100, downloads bonus
            const scored = withPath.map(a => {
                const nameLower = (a.name || '').toLowerCase();
                let score = 0;
                if (nameLower === qLower) score += 1000;
                for (const w of qWords) if (nameLower.includes(w)) score += 100;
                score += Math.log10((a.stats?.downloads || 1));
                return { a, score };
            });

            const app = scored.sort((x, y) => y.score - x.score)[0]?.a;
            if (!app) throw new Error(`No downloadable APK found for "${q}"`);

            const appName   = app.name || q;
            const version   = app.file?.vername || '?';
            const sizeBytes = app.file?.filesize || app.size || 0;
            const developer = app.developer?.name || 'Unknown';
            const rating    = app.stats?.rating?.avg ? `${app.stats.rating.avg.toFixed(1)} ⭐` : 'N/A';
            const dls       = fmtNum(app.stats?.downloads || 0);
            const dlUrl     = app.file?.path || app.file?.path_alt;
            const iconUrl   = app.icon || null;
            const safeFile  = `${appName.replace(/[^a-zA-Z0-9._-]/g, '_')}_v${version}.apk`;

            const caption = [
                H, `║`,
                `║ ▸ *App*        : ${appName}`,
                `║ ▸ *Version*    : v${version}`,
                `║ ▸ *Developer*  : ${developer}`,
                `║ ▸ *Size*       : ${fmtSize(sizeBytes)}`,
                `║ ▸ *Rating*     : ${rating}`,
                `║ ▸ *Downloads*  : ${dls}`,
                `║`, F,
            ].join('\n');

            await sock.sendMessage(chatId, { react: { text: '⏬', key: msg.key } });

            // Fetch icon as thumbnail (best-effort)
            let thumb = null;
            if (iconUrl) {
                try {
                    const ir = await fetch(iconUrl, { signal: AbortSignal.timeout(8000) });
                    if (ir.ok) thumb = Buffer.from(await ir.arrayBuffer());
                } catch {}
            }

            // If file is over 60 MB, send the link instead of buffering
            if (sizeBytes > 60 * 1024 * 1024) {
                await sock.sendMessage(chatId, {
                    text: `${caption}\n\n🔗 *Download Link*:\n${dlUrl}`
                }, { quoted: msg });
            } else {
                const buf     = await dlBuffer(dlUrl);
                const fileMsg = {
                    document: buf,
                    mimetype: 'application/vnd.android.package-archive',
                    fileName: safeFile,
                    caption,
                };
                if (thumb) fileMsg.jpegThumbnail = thumb;
                await sock.sendMessage(chatId, fileMsg, { quoted: msg });
            }

            await sock.sendMessage(chatId, { react: { text: '✅', key: msg.key } });

        } catch (e) {
            await sock.sendMessage(chatId, { react: { text: '❌', key: msg.key } });
            await sock.sendMessage(chatId, {
                text: [
                    H, `║`,
                    `║ ▸ *Status* : ❌ Failed`,
                    `║ ▸ *Reason* : ${e.message}`,
                    `║`, F,
                ].join('\n')
            }, { quoted: msg });
        }
    }
};
