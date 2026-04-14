'use strict';

const { getBotName } = require('../../lib/botname');

async function wikiSearch(query) {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=5&format=json&origin=*`;
    const res = await fetch(searchUrl, { signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'ToosiiBot/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const [, titles] = await res.json();
    return titles;
}

async function wikiSummary(title) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'ToosiiBot/1.0' } });
    if (!res.ok) throw new Error(res.status === 404 ? 'Page not found' : `HTTP ${res.status}`);
    return res.json();
}

module.exports = [
    {
        name: 'wiki',
        aliases: ['wikipedia', 'wp', 'wikisearch', 'define'],
        description: 'Search Wikipedia for any topic — .wiki <topic>',
        category: 'search',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const query  = args.join(' ').trim();
            try { await sock.sendMessage(chatId, { react: { text: '📚', key: msg.key } }); } catch {}

            if (!query) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  WIKIPEDIA 📚 〕\n║\n║ ▸ *Usage*   : ${prefix}wiki <topic>\n║ ▸ *Example* : ${prefix}wiki Nairobi\n║ ▸ *Example* : ${prefix}wiki artificial intelligence\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            try {
                const titles = await wikiSearch(query);
                if (!titles.length) throw new Error('No results found');

                const data = await wikiSummary(titles[0]);
                if (!data.extract) throw new Error('No summary available');

                const extract = data.extract.length > 800
                    ? data.extract.slice(0, 800) + '…'
                    : data.extract;

                const lines = [
                    `╔═|〔  WIKIPEDIA 📚 〕`,
                    `║`,
                    `║ ▸ *Topic* : ${data.title}`,
                    data.description ? `║ ▸ *Type*  : ${data.description}` : null,
                    `║`,
                    ...extract.split('\n').filter(Boolean).map(l => `║ ${l}`),
                    `║`,
                    `║ 🔗 https://en.wikipedia.org/wiki/${encodeURIComponent(data.title.replace(/ /g, '_'))}`,
                    `║`,
                    `╚═|〔 ${name} 〕`,
                ].filter(Boolean).join('\n');

                await sock.sendMessage(chatId, { text: lines }, { quoted: msg });

            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  WIKIPEDIA 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }
        }
    },

    {
        name: 'wikisearch',
        aliases: ['wpsearch', 'wikifind', 'wikilist'],
        description: 'List Wikipedia search results for a topic',
        category: 'search',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const query  = args.join(' ').trim();
            try { await sock.sendMessage(chatId, { react: { text: '🔍', key: msg.key } }); } catch {}

            if (!query) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  WIKI SEARCH 〕\n║\n║ ▸ *Usage* : ${prefix}wikisearch <topic>\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            try {
                const titles = await wikiSearch(query);
                if (!titles.length) throw new Error('No results found');

                const list = titles.map((t, i) => `║ ▸ [${i + 1}] ${t}`).join('\n');
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  WIKI SEARCH 🔍 〕\n║\n║ 🔍 *${query}*\n║\n${list}\n║\n║ 💡 ${prefix}wiki <title> for full summary\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });

            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  WIKI SEARCH 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }
        }
    }
];
