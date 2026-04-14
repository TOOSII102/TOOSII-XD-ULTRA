'use strict';

const { getBotName } = require('../../lib/botname');

const CATEGORIES = {
    general: 9, books: 10, film: 11, music: 12, tv: 14, games: 15,
    nature: 17, science: 17, computers: 18, math: 19, sports: 21,
    geography: 22, history: 23, politics: 24, art: 25, animals: 27,
    vehicles: 28, comics: 29, anime: 31, cartoon: 32,
};

const pending = new Map(); // chatId → { answer, timer }

function decodeHtml(s) {
    return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"');
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function fetchTrivia(catId) {
    const url = catId
        ? `https://opentdb.com/api.php?amount=1&type=multiple&category=${catId}`
        : `https://opentdb.com/api.php?amount=1&type=multiple`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`Trivia API HTTP ${res.status}`);
    const data = await res.json();
    if (!data.results?.length) throw new Error('No trivia returned');
    return data.results[0];
}

module.exports = [
    {
        name: 'trivia',
        aliases: ['quiz', 'triviastart', 'startquiz'],
        description: 'Start a trivia question — .trivia [category]',
        category: 'games',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            try { await sock.sendMessage(chatId, { react: { text: '🧠', key: msg.key } }); } catch {}

            if (pending.has(chatId)) {
                const cur = pending.get(chatId);
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  TRIVIA 〕\n║\n║ ▸ A question is already active!\n║ ▸ Answer it or type *${prefix}triviaend* to skip\n║\n╚═╝`
                }, { quoted: msg });
            }

            const catRaw = args.join(' ').toLowerCase().trim();
            const catId  = CATEGORIES[catRaw] || null;

            try {
                const q       = await fetchTrivia(catId);
                const correct = decodeHtml(q.correct_answer);
                const wrong   = q.incorrect_answers.map(decodeHtml);
                const opts    = shuffle([correct, ...wrong]);
                const letters = ['A', 'B', 'C', 'D'];
                const correctLetter = letters[opts.indexOf(correct)];

                const optLines = opts.map((o, i) => `║  ${letters[i]}) ${o}`).join('\n');
                const cat = decodeHtml(q.category);
                const diff = q.difficulty[0].toUpperCase() + q.difficulty.slice(1);

                const text = [
                    `╔═|〔  TRIVIA 🧠 〕`,
                    `║`,
                    `║ ▸ *Category*   : ${cat}`,
                    `║ ▸ *Difficulty* : ${diff}`,
                    `║`,
                    `║ ❓ *${decodeHtml(q.question)}*`,
                    `║`,
                    optLines,
                    `║`,
                    `║ ▸ Type *A / B / C / D* to answer`,
                    `║ ▸ *${prefix}triviaend* to skip`,
                    `║`,
                    `╚═╝`,
                ].join('\n');

                const timer = setTimeout(async () => {
                    pending.delete(chatId);
                    await sock.sendMessage(chatId, {
                        text: `╔═|〔  TRIVIA 〕\n║\n║ ▸ ⏰ Time's up! Answer was: *${correctLetter}) ${correct}*\n║\n╚═╝`
                    });
                }, 60000);

                pending.set(chatId, { answer: correctLetter, correct, timer, name });
                await sock.sendMessage(chatId, { text }, { quoted: msg });

            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  TRIVIA 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═╝`
                }, { quoted: msg });
            }
        }
    },

    {
        name: 'triviaanswer',
        aliases: ['ta', 'answer'],
        description: 'Answer the active trivia question — .ta A',
        category: 'games',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const q = pending.get(chatId);
            if (!q) return;

            const guess = (args[0] || '').toUpperCase().trim();
            if (!['A','B','C','D'].includes(guess)) return;

            clearTimeout(q.timer);
            pending.delete(chatId);

            const sender = (msg.key.participant || msg.key.remoteJid).split('@')[0].split(':')[0];
            const correct = guess === q.answer;

            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  TRIVIA 🧠 〕`,
                    `║`,
                    `║ ▸ *@${sender}* answered: ${guess}`,
                    `║ ▸ *Result* : ${correct ? '✅ Correct! 🎉' : `❌ Wrong! It was *${q.answer}) ${q.correct}*`}`,
                    `║`,
                    `║ ▸ Start another with *${prefix}trivia*`,
                    `║`,
                    `╚═╝`,
                ].join('\n'),
                mentions: [`${sender}@s.whatsapp.net`],
            }, { quoted: msg });
        }
    },

    {
        name: 'triviaend',
        aliases: ['skipquiz', 'endtrivia', 'stoptrivia'],
        description: 'Skip the current trivia question',
        category: 'games',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const q = pending.get(chatId);
            if (!q) return sock.sendMessage(chatId, {
                text: `╔═|〔  TRIVIA 〕\n║\n║ ▸ No active question\n║\n╚═╝`
            }, { quoted: msg });

            clearTimeout(q.timer);
            pending.delete(chatId);
            await sock.sendMessage(chatId, {
                text: `╔═|〔  TRIVIA 〕\n║\n║ ▸ ⏭️ Skipped! Answer was: *${q.answer}) ${q.correct}*\n║\n╚═╝`
            }, { quoted: msg });
        }
    },
];
