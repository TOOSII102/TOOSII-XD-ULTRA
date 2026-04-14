'use strict';

const { getBotName } = require('../../lib/botname');
const path           = require('path');
const fs             = require('fs');

// Load local quotes collection
let LOCAL = {};
try {
    LOCAL = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/quotes.json'), 'utf-8'));
} catch {}

const ALL_CATS = Object.keys(LOCAL);

function pickLocal(keyword) {
    if (!keyword) {
        // Pick random from any category
        const cat   = ALL_CATS[Math.floor(Math.random() * ALL_CATS.length)];
        const list  = LOCAL[cat];
        return list[Math.floor(Math.random() * list.length)];
    }
    const kw = keyword.toLowerCase();
    // Exact category match
    const exact = ALL_CATS.find(c => c === kw);
    if (exact) {
        const list = LOCAL[exact];
        return list[Math.floor(Math.random() * list.length)];
    }
    // Partial category match
    const partial = ALL_CATS.find(c => c.includes(kw) || kw.includes(c));
    if (partial) {
        const list = LOCAL[partial];
        return list[Math.floor(Math.random() * list.length)];
    }
    // Search across all quotes by author or content
    const matches = [];
    for (const list of Object.values(LOCAL)) {
        for (const item of list) {
            if (item.q.toLowerCase().includes(kw) || item.a.toLowerCase().includes(kw)) {
                matches.push(item);
            }
        }
    }
    if (matches.length) return matches[Math.floor(Math.random() * matches.length)];
    return null;
}

async function fetchApiQuote(keyword) {
    const url = keyword
        ? `https://zenquotes.io/api/quotes/${encodeURIComponent(keyword)}`
        : 'https://zenquotes.io/api/random';
    const res  = await fetch(url, {
        headers: { 'User-Agent': 'TOOSII-XD-Bot/1.0' },
        signal:  AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length || !data[0]?.q) throw new Error('No quotes');
    const item = data[Math.floor(Math.random() * data.length)];
    return { q: item.q, a: item.a || 'Unknown' };
}

function totalQuotes() {
    return Object.values(LOCAL).reduce((s, a) => s + a.length, 0);
}

module.exports = {
    name:        'quote',
    aliases:     ['randomquote', 'inspire', 'motivation', 'qod'],
    description: 'Get an inspirational quote (300+ local quotes)',
    category:    'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();
        const keyword = args.join(' ').trim().toLowerCase() || null;
        const H = `╔═|〔  💬 QUOTE 〕`;
        const F = `╚═╝`;

        // Show categories list
        if (keyword === 'list' || keyword === 'categories') {
            const catList = ALL_CATS.map((c, i) => `║  ${i + 1}. ${c} (${LOCAL[c].length})`).join('\n');
            return sock.sendMessage(chatId, {
                text: [
                    H, `║`,
                    `║ ▸ *Total* : ${totalQuotes()} quotes`,
                    `║ ▸ *Categories* :`,
                    catList,
                    `║`,
                    `║  Usage: ${prefix}quote <category>`,
                    `║`, F,
                ].join('\n')
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '💬', key: msg.key } });

            // Try local first
            let item = pickLocal(keyword);
            let source = 'local';

            // Fall back to API if nothing matched locally
            if (!item) {
                try {
                    const api = await fetchApiQuote(keyword);
                    item = { q: api.q, a: api.a };
                    source = 'api';
                } catch {
                    // If API also fails, just pick any random local
                    item   = pickLocal(null);
                    source = 'local';
                }
            }

            const lines = [
                H, `║`,
                `║  _"${item.q}"_`,
                `║`,
                `║ ▸ *Author*  : ${item.a}`,
            ];
            if (keyword && keyword !== 'list') lines.push(`║ ▸ *Topic*   : ${keyword}`);
            lines.push(`║ ▸ *Library* : ${totalQuotes()} quotes`);
            lines.push(`║`, F);

            await sock.sendMessage(chatId, { text: lines.join('\n') }, { quoted: msg });
            await sock.sendMessage(chatId, { react: { text: '✅', key: msg.key } });

        } catch (e) {
            await sock.sendMessage(chatId, { react: { text: '❌', key: msg.key } });
            await sock.sendMessage(chatId, {
                text: [H, `║`, `║ ▸ *Status* : ❌ Failed`, `║ ▸ *Reason* : ${e.message}`, `║`, F].join('\n')
            }, { quoted: msg });
        }
    }
};
