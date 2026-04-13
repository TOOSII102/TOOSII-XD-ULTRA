const { keithGet } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtDate(d) {
    if (!d) return 'N/A';
    try { return new Date(d).toDateString(); } catch { return d; }
}

function truncate(str, n = 100) {
    if (!str) return '';
    return str.length > n ? str.substring(0, n) + '…' : str;
}

// ── Commands ───────────────────────────────────────────────────────────────

const kbcCmd = {
    name: 'kbcnews',
    aliases: ['kbc', 'kbc1', 'kbcnew'],
    description: 'Get latest KBC Channel 1 Kenya news',
    category: 'news',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try {
            await sock.sendMessage(chatId, { react: { text: '📺', key: msg.key } });
            const data = await keithGet('/news/kbc');
            if (!data.status || !data.result) throw new Error(data.error || 'No data');
            const r = data.result;

            const breaking  = (r.breakingNews   || []).slice(0, 3);
            const featured  = (r.featuredArticles|| []).slice(0, 3);
            const trending  = (r.trendingArticles|| []).slice(0, 3);

            let out = `╔═|〔  📺 KBC NEWS 〕\n║\n`;

            if (breaking.length) {
                out += `║ 🚨 *Breaking News*\n`;
                out += breaking.map(a => `║ ▸ ${truncate(a.title, 70)}\n║      🔗 ${a.url}`).join('\n');
                out += '\n║\n';
            }
            if (featured.length) {
                out += `║ ⭐ *Featured*\n`;
                out += featured.map(a => `║ ▸ ${truncate(a.title, 70)}`).join('\n');
                out += '\n║\n';
            }
            if (trending.length) {
                out += `║ 🔥 *Trending*\n`;
                out += trending.map(a => `║ ▸ ${truncate(a.title, 70)}`).join('\n');
                out += '\n║\n';
            }
            out += `╚═|〔 ${name} 〕`;
            await sock.sendMessage(chatId, { text: out }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  📺 KBC NEWS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const bbcCmd = {
    name: 'bbcnews',
    aliases: ['bbc', 'bbcnew', 'worldnews'],
    description: 'Get latest BBC top stories and world news',
    category: 'news',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        const section = args[0]?.toLowerCase();
        const SECTIONS = { read: 'mostRead', watch: 'mostWatched', explore: 'moreToExplore', sport: 'sportSection' };

        try {
            await sock.sendMessage(chatId, { react: { text: '🌍', key: msg.key } });
            const data = await keithGet('/news/bbc');
            if (!data.status || !data.result) throw new Error(data.error || 'No data');
            const r = data.result;

            const key      = SECTIONS[section] || 'topStories';
            const label    = section ? section.toUpperCase() : 'TOP STORIES';
            const stories  = (r[key] || r.topStories || []).slice(0, 6);

            if (!stories.length) throw new Error('No stories in that section');

            const list = stories.map((s, i) =>
                `║ ▸ [${i + 1}] *${truncate(s.title, 70)}*\n${s.description ? `║      ${truncate(s.description, 70)}\n` : ''}║      🔗 ${s.url || 'N/A'}`
            ).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: `╔═|〔  🌍 BBC — ${label} 〕\n║\n${list}\n║\n║ 💡 Sections: read | watch | explore | sport\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🌍 BBC NEWS 〕\n║\n║ ▸ *Usage*  : ${prefix}bbcnews [read|watch|explore|sport]\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const techCmd = {
    name: 'technews',
    aliases: ['tech', 'technew', 'ieeenews'],
    description: 'Get latest technology news from IEEE',
    category: 'news',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try {
            await sock.sendMessage(chatId, { react: { text: '💻', key: msg.key } });
            const data = await keithGet('/news/tech');
            if (!data.status || !data.result) throw new Error(data.error || 'No data');
            const r = data.result;

            const featured = (r.featuredArticles || []).slice(0, 2);
            const articles = (r.articles || []).slice(0, 5);

            let out = `╔═|〔  💻 TECH NEWS 〕\n║\n`;
            if (featured.length) {
                out += `║ ⭐ *Featured*\n`;
                out += featured.map(a => `║ ▸ *${truncate(a.title, 60)}*\n║      ${truncate(a.description, 70)}\n║      🔗 ${a.link}`).join('\n║\n');
                out += '\n║\n';
            }
            if (articles.length) {
                out += `║ 📰 *Latest Articles*\n`;
                out += articles.map((a, i) => `║ ▸ [${i + 1}] *${truncate(a.title, 60)}*\n║      🔗 ${a.link}`).join('\n');
                out += '\n║\n';
            }
            out += `╚═|〔 ${name} 〕`;
            await sock.sendMessage(chatId, { text: out }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  💻 TECH NEWS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const kenyansCmd = {
    name: 'kenyans',
    aliases: ['kenyanews', 'kenews', 'kenyansco'],
    description: 'Latest Kenya news — or search: .kenyans <query>',
    category: 'news',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const query  = args.join(' ').trim();

        try {
            await sock.sendMessage(chatId, { react: { text: '🇰🇪', key: msg.key } });

            if (query) {
                // Search mode
                const data = await keithGet('/news/kenyans/search', { q: query });
                if (!data.status || !data.result?.results?.length) throw new Error(data.error || 'No results found');
                const results = data.result.results.slice(0, 6);
                const total   = data.result.totalResults || results.length;
                const list = results.map((r, i) =>
                    `║ ▸ [${i + 1}] *${truncate(r.title, 65)}*\n║      📅 ${fmtDate(r.date)}\n║      🔗 ${r.url}`
                ).join('\n║\n');
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  🇰🇪 KENYANS SEARCH 〕\n║\n║ 🔍 *${query}* — ${total.toLocaleString()} results\n║\n${list}\n║\n║ 💡 ${prefix}kenyansread <url> for full article\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            } else {
                // Latest news mode
                const data = await keithGet('/news/kenyans');
                if (!data.status || !data.result?.length) throw new Error(data.error || 'No news available');
                const articles = data.result.slice(0, 7);
                const list = articles.map((a, i) =>
                    `║ ▸ [${i + 1}] *${truncate(a.title, 65)}*\n║      👤 ${a.author || 'Kenyans.co.ke'} | 📅 ${fmtDate(a.date)}\n║      🔗 ${a.url}`
                ).join('\n║\n');
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  🇰🇪 KENYANS NEWS 〕\n║\n${list}\n║\n║ 💡 ${prefix}kenyans <search> to search | ${prefix}kenyansread <url> for details\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🇰🇪 KENYANS NEWS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const kenyansReadCmd = {
    name: 'kenyansread',
    aliases: ['kread', 'kenread', 'kenyansarticle'],
    description: 'Read full article from Kenyans.co.ke — provide article URL',
    category: 'news',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const url    = args[0];

        if (!url || !url.startsWith('http')) return sock.sendMessage(chatId, {
            text: `╔═|〔  📰 KENYANS ARTICLE 〕\n║\n║ ▸ *Usage* : ${prefix}kenyansread <kenyans.co.ke url>\n║ ▸ *Tip*   : Use ${prefix}kenyans <query> to find articles first\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '📰', key: msg.key } });
            const data = await keithGet('/news/kenyans/detail', { q: url });
            if (!data.status || !data.result) throw new Error(data.error || 'Article not found');
            const r = data.result;

            const contentArr = Array.isArray(r.content) ? r.content : [r.content || r.description || ''];
            const body = contentArr.slice(0, 4).join('\n\n');

            const banner =
                `╔═|〔  📰 KENYANS ARTICLE 〕\n║\n` +
                `║ ▸ *Title*  : ${truncate(r.title, 80)}\n` +
                `║ ▸ *Author* : ${r.author || 'N/A'}\n` +
                `║ ▸ *Date*   : ${fmtDate(r.publishedDate)}\n` +
                `║\n${truncate(body, 1500)}\n║\n` +
                `║ 🔗 ${r.url}\n║\n` +
                `╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, { text: banner }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  📰 KENYANS ARTICLE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const newsTrackCmd = {
    name: 'newstrack',
    aliases: ['ntrack', 'newsupdate', 'breakingnews', 'breaking'],
    description: 'Get live Kenya news tracker with latest updates',
    category: 'news',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try {
            await sock.sendMessage(chatId, { react: { text: '🔔', key: msg.key } });
            const data = await keithGet('/news/kenyans/track');
            if (!data.status || !data.result) throw new Error(data.error || 'No data');
            const r = data.result;

            const dayGroups = Array.isArray(r.updatesByDate) ? r.updatesByDate : [];
            if (!dayGroups.length) throw new Error('No updates available');

            let out = `╔═|〔  🔔 NEWS TRACKER 〕\n║\n║ ▸ *Total Updates* : ${r.totalUpdates || 0}\n║\n`;

            // Show first 2 days, up to 3 updates each
            for (const group of dayGroups.slice(0, 2)) {
                out += `║ 📅 *${group.date}*\n`;
                for (const upd of (group.updates || []).slice(0, 3)) {
                    out += `║ ▸ ${truncate(upd.body, 90)}\n`;
                    const link = upd.links?.[0];
                    if (link?.text && link?.url) out += `║   → ${link.text}: ${link.url}\n`;
                }
                out += `║\n`;
            }
            out += `╚═|〔 ${name} 〕`;
            await sock.sendMessage(chatId, { text: out }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🔔 NEWS TRACKER 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const footballNewsCmd = {
    name: 'footballnews',
    aliases: ['fnews', 'soccernews', 'sportnews', 'footynews'],
    description: 'Get latest football/soccer news and headlines',
    category: 'news',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try {
            await sock.sendMessage(chatId, { react: { text: '⚽', key: msg.key } });
            const data = await keithGet('/football/news');
            if (!data.status || !data.result?.data?.items?.length) throw new Error(data.error || 'No football news');
            const items = data.result.data.items.slice(0, 7);
            const list = items.map((item, i) =>
                `║ ▸ [${i + 1}] *${truncate(item.title, 65)}*\n║      ${truncate(item.summary, 80)}`
            ).join('\n║\n');
            await sock.sendMessage(chatId, {
                text: `╔═|〔  ⚽ FOOTBALL NEWS 〕\n║\n${list}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  ⚽ FOOTBALL NEWS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

module.exports = [kbcCmd, bbcCmd, techCmd, kenyansCmd, kenyansReadCmd, newsTrackCmd, footballNewsCmd];
