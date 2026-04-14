'use strict';

const { getBotName } = require('../../lib/botname');

async function fetchQuote() {
    const res  = await fetch('https://zenquotes.io/api/random', { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    const q    = Array.isArray(data) ? data[0] : data;
    if (!q || !q.q) throw new Error('No quote returned');
    return { text: q.q, author: q.a || 'Unknown' };
}

async function fetchJoke() {
    const res  = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode&type=single', { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    if (data.type === 'twopart') return `${data.setup}\n${data.delivery}`;
    return data.joke || 'Could not get a joke 😅';
}

async function fetchFact() {
    const res  = await fetch('https://uselessfacts.jsph.pl/random.json?language=en', { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    return data.text || 'No fact returned';
}

const jokeCmd = {
    name: 'joke',
    aliases: ['jokes', 'funny', 'lol'],
    description: 'Get a random safe joke',
    category: 'utility',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '😂', key: msg.key } }); } catch {}
        try {
            const joke = await fetchJoke();
            await sock.sendMessage(chatId, {
                text: `╔═|〔  JOKE 😂 〕\n║\n║ ${joke.replace(/\n/g, '\n║ ')}\n║\n╚═╝`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  JOKE 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═╝`
            }, { quoted: msg });
        }
    }
};

const factCmd = {
    name: 'fact',
    aliases: ['funfact', 'facts', 'didyouknow'],
    description: 'Get a random fun fact',
    category: 'utility',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '🧠', key: msg.key } }); } catch {}
        try {
            const fact = await fetchFact();
            await sock.sendMessage(chatId, {
                text: `╔═|〔  FUN FACT 🧠 〕\n║\n║ ${fact}\n║\n╚═╝`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  FUN FACT 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═╝`
            }, { quoted: msg });
        }
    }
};

const quoteCmd = {
    name: 'quote',
    aliases: ['quotes', 'inspire', 'motivation', 'quotabl', 'qfun'],
    description: 'Get a random inspirational quote',
    category: 'utility',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '💬', key: msg.key } }); } catch {}
        try {
            const { text, author } = await fetchQuote();
            await sock.sendMessage(chatId, {
                text: `╔═|〔  QUOTE 💬 〕\n║\n║ _"${text}"_\n║\n║ ▸ *—* ${author}\n║\n╚═╝`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  QUOTE 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═╝`
            }, { quoted: msg });
        }
    }
};

module.exports = [jokeCmd, factCmd, quoteCmd];
