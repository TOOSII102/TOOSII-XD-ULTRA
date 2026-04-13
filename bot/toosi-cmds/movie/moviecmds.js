'use strict';

const { casperGet, dlBuffer } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

async function omdbFetch(params, timeoutMs = 12000) {
    const qs = Object.entries({ apikey: 'trilogy', ...params })
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(`https://www.omdbapi.com/?${qs}`, {
            signal: controller.signal, headers: { 'User-Agent': 'ToosiiBot/1.0' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } finally { clearTimeout(timer); }
}

// Scrape YouTube search page → return first unique video ID
async function ytSearchVideoId(query) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' }
        });
        if (!res.ok) throw new Error(`YT search HTTP ${res.status}`);
        const html = await res.text();
        const matches = [...html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)].map(m => m[1]);
        const unique  = [...new Set(matches)];
        return unique[0] || null;
    } finally { clearTimeout(timer); }
}

// ── Movie Search (OMDb — free) ────────────────────────────────────────────────
const mboxCmd = {
    name: 'mbox',
    aliases: ['moviebox', 'movbox', 'moviesearch2', 'msearch'],
    description: 'Search for movies and TV shows — .mbox <title>',
    category: 'movie',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const query  = args.join(' ').trim();
        if (!query) return sock.sendMessage(chatId, {
            text: `╔═|〔  🎥 MOVIE SEARCH 〕\n║\n║ ▸ *Usage*   : ${prefix}mbox <title>\n║ ▸ *Example* : ${prefix}mbox avengers\n║ ▸ *Tip*     : Use ${prefix}movie <title> for details | ${prefix}trailer <title> for video\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
        try {
            await sock.sendMessage(chatId, { react: { text: '🎥', key: msg.key } });
            const data = await omdbFetch({ s: query });
            if (data.Response === 'False') throw new Error(data.Error || 'No movies found');

            const results = (data.Search || []).slice(0, 6);
            const list = results.map((r, i) =>
                `║ ▸ [${i + 1}] *${r.Title}* [${r.Type}]\n║      📅 ${r.Year} | 🆔 ${r.imdbID}`
            ).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎥 MOVIE SEARCH 〕\n║\n║ 🔍 *${query}* — ${data.totalResults || results.length} results\n║\n${list}\n║\n║ 💡 ${prefix}trailer <title> to get the trailer video\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎥 MOVIE SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── Trailer Video — search YouTube + download via Casper ──────────────────────
const trailerCmd = {
    name: 'trailer',
    aliases: ['movietrailer', 'gettrailer', 'movtrailer', 'filminfo'],
    description: 'Get an actual movie trailer video — .trailer <title>',
    category: 'movie',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const input  = args.join(' ').trim();

        if (!input) return sock.sendMessage(chatId, {
            text: `╔═|〔  🎬 MOVIE TRAILER 〕\n║\n║ ▸ *Usage*   : ${prefix}trailer <movie title>\n║ ▸ *Example* : ${prefix}trailer dark knight\n║ ▸ *Note*    : Sends the actual trailer video 🎬\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🎬', key: msg.key } });

            // Step 1: Resolve exact title via OMDb (optional but improves YouTube search)
            let searchTitle = input;
            let movieInfo   = null;
            try {
                const query = /^tt\d+$/i.test(input) ? { i: input } : { t: input };
                const omdb  = await omdbFetch(query);
                if (omdb.Response !== 'False') {
                    movieInfo  = omdb;
                    searchTitle = `${omdb.Title} ${omdb.Year}`;
                }
            } catch { }

            // Step 2: Search YouTube for the trailer
            const ytQuery = `${searchTitle} official trailer`;
            const videoId = await ytSearchVideoId(ytQuery);
            if (!videoId) throw new Error('Could not find trailer on YouTube');

            const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // Step 3: Download via Casper ytmp4
            const dl = await casperGet('/api/downloader/ytmp4', { url: ytUrl });
            if (!dl.success || !dl.data?.downloads?.length) throw new Error('Download failed — trailer may be restricted');

            // Pick lowest quality to keep file size manageable
            const downloads = dl.data.downloads.filter(d => d.hasAudio && d.extension === 'mp4');
            const pick      = downloads[downloads.length - 1] || downloads[0];
            if (!pick?.url) throw new Error('No downloadable video link found');

            const buf = await dlBuffer(pick.url, 90000);
            if (!buf || buf.length < 5000) throw new Error('Downloaded file too small — trailer unavailable');

            const title  = movieInfo?.Title || dl.data.title || searchTitle;
            const info   = movieInfo
                ? `║ ▸ *Title*  : ${title} (${movieInfo.Year})\n║ ▸ *Genre*  : ${movieInfo.Genre}\n║ ▸ *IMDB*   : ⭐ ${movieInfo.imdbRating}/10\n║ ▸ *Plot*   : ${movieInfo.Plot?.substring(0, 100)}…`
                : `║ ▸ *Title*  : ${title}\n║ ▸ 🔗 ${ytUrl}`;

            const caption = `╔═|〔  🎬 MOVIE TRAILER 〕\n║\n${info}\n║ ▸ *Quality*: ${pick.quality || 'SD'}\n║\n╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, {
                video: buf,
                mimetype: 'video/mp4',
                caption
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎬 MOVIE TRAILER 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── Drama Search (OMDb TV type) ───────────────────────────────────────────────
const dramaCmd = {
    name: 'drama',
    aliases: ['dramasearch', 'dramalist', 'tvshow'],
    description: 'Search for TV dramas and series — .drama <title>',
    category: 'movie',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const query  = args.join(' ').trim();
        if (!query) return sock.sendMessage(chatId, {
            text: `╔═|〔  🎭 DRAMA SEARCH 〕\n║\n║ ▸ *Usage*   : ${prefix}drama <title>\n║ ▸ *Example* : ${prefix}drama game of thrones\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
        try {
            await sock.sendMessage(chatId, { react: { text: '🎭', key: msg.key } });
            const data = await omdbFetch({ s: query, type: 'series' });
            if (data.Response === 'False') throw new Error(data.Error || 'No dramas found');

            const results = (data.Search || []).slice(0, 6);
            const list = results.map((r, i) =>
                `║ ▸ [${i + 1}] *${r.Title}* (${r.Year})\n║      🆔 ${r.imdbID}`
            ).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎭 DRAMA SEARCH 〕\n║\n║ 🔍 *${query}*\n║\n${list}\n║\n║ 💡 ${prefix}trailer <title> for trailer video\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎭 DRAMA SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── Actor / Cast Search (OMDb) ────────────────────────────────────────────────
const actorCmd = {
    name: 'actor',
    aliases: ['actress', 'actorsearch', 'celeb', 'cast'],
    description: 'Find movies starring an actor — .actor <name>',
    category: 'movie',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const query  = args.join(' ').trim();
        if (!query) return sock.sendMessage(chatId, {
            text: `╔═|〔  🎬 ACTOR SEARCH 〕\n║\n║ ▸ *Usage* : ${prefix}actor <name>\n║ ▸ *Example* : ${prefix}actor will smith\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
        try {
            await sock.sendMessage(chatId, { react: { text: '🎬', key: msg.key } });
            const data = await omdbFetch({ s: query });
            if (data.Response === 'False') throw new Error(data.Error || 'Nothing found');

            const results = (data.Search || []).slice(0, 6);
            const list = results.map((r, i) =>
                `║ ▸ [${i + 1}] *${r.Title}* [${r.Type}] (${r.Year})`
            ).join('\n');

            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎬 ACTOR SEARCH 〕\n║\n║ 🔍 *${query}*\n║\n${list}\n║\n║ 💡 ${prefix}trailer <title> for trailer video\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎬 ACTOR SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

module.exports = [mboxCmd, trailerCmd, dramaCmd, actorCmd];
