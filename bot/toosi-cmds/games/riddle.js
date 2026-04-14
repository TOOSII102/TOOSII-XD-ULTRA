'use strict';

const { getBotName } = require('../../lib/botname');

const pending = new Map(); // chatId → { answer, timer }

async function fetchRiddle() {
    const res  = await fetch('https://riddles-api.vercel.app/random', { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.riddle || !data.answer) throw new Error('Invalid riddle returned');
    return { question: data.riddle, answer: data.answer };
}

module.exports = [
    {
        name: 'riddle',
        aliases: ['startriddle', 'brainteaser', 'puzzle'],
        description: 'Get a random riddle to solve — .riddle',
        category: 'games',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            try { await sock.sendMessage(chatId, { react: { text: '🧩', key: msg.key } }); } catch {}

            if (pending.has(chatId)) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  RIDDLE 〕\n║\n║ ▸ A riddle is active! Guess or type\n║   *${prefix}riddleanswr* to reveal the answer\n║\n╚═╝`
                }, { quoted: msg });
            }

            try {
                const { question, answer } = await fetchRiddle();

                const timer = setTimeout(async () => {
                    pending.delete(chatId);
                    await sock.sendMessage(chatId, {
                        text: `╔═|〔  RIDDLE 🧩 〕\n║\n║ ▸ ⏰ Time's up!\n║ ▸ *Answer* : ${answer}\n║\n╚═╝`
                    });
                }, 90000);

                pending.set(chatId, { answer: answer.toLowerCase().trim(), raw: answer, timer, name });

                await sock.sendMessage(chatId, {
                    text: [
                        `╔═|〔  RIDDLE 🧩 〕`,
                        `║`,
                        `║ 🤔 *${question}*`,
                        `║`,
                        `║ ▸ Type your answer in chat`,
                        `║ ▸ *${prefix}riddleanswr* to reveal`,
                        `║ ▸ 90 seconds on the clock ⏱️`,
                        `║`,
                        `╚═╝`,
                    ].join('\n')
                }, { quoted: msg });

            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  RIDDLE 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═╝`
                }, { quoted: msg });
            }
        }
    },

    {
        name: 'riddleanswr',
        aliases: ['riddleans', 'revealriddle', 'showriddle', 'riddleskip'],
        description: 'Reveal the answer to the active riddle',
        category: 'games',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const q = pending.get(chatId);

            if (!q) return sock.sendMessage(chatId, {
                text: `╔═|〔  RIDDLE 〕\n║\n║ ▸ No active riddle. Start one with *${prefix}riddle*\n║\n╚═╝`
            }, { quoted: msg });

            clearTimeout(q.timer);
            pending.delete(chatId);

            await sock.sendMessage(chatId, {
                text: `╔═|〔  RIDDLE 🧩 〕\n║\n║ ▸ *Answer* : ${q.raw}\n║ ▸ Start another with *${prefix}riddle*\n║\n╚═╝`
            }, { quoted: msg });
        }
    },

    {
        name: 'riddlecheck',
        description: 'Internal handler — checks if a message is a correct riddle answer',
        category: 'games',
        hidden: true,

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const q = pending.get(chatId);
            if (!q) return;

            const body = (args.join(' ') || '').toLowerCase().trim();
            if (!body) return;

            if (body.includes(q.answer) || q.answer.includes(body)) {
                clearTimeout(q.timer);
                pending.delete(chatId);

                const sender = (msg.key.participant || msg.key.remoteJid).split('@')[0].split(':')[0];
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  RIDDLE 🧩 〕\n║\n║ ▸ ✅ Correct! @${sender} got it!\n║ ▸ *Answer* : ${q.raw}\n║\n╚═╝`,
                    mentions: [`${sender}@s.whatsapp.net`],
                }, { quoted: msg });
            }
        }
    },

];
