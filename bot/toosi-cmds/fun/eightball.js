'use strict';

const { getBotName } = require('../../lib/botname');

const RESPONSES = [
    // Positive
    '✅ It is certain',
    '✅ It is decidedly so',
    '✅ Without a doubt',
    '✅ Yes, definitely',
    '✅ You may rely on it',
    '✅ As I see it, yes',
    '✅ Most likely',
    '✅ Outlook good',
    '✅ Yes',
    '✅ Signs point to yes',
    // Neutral
    '🔮 Reply hazy, try again',
    '🔮 Ask again later',
    '🔮 Better not tell you now',
    '🔮 Cannot predict now',
    '🔮 Concentrate and ask again',
    // Negative
    '❌ Don\'t count on it',
    '❌ My reply is no',
    '❌ My sources say no',
    '❌ Outlook not so good',
    '❌ Very doubtful',
];

const EXTRAS = [
    '💀 Are you sure you want to know?',
    '😂 Lol okay okay... let me check',
    '🔮 The spirits are consulting...',
    '🤔 Hmm, interesting question',
    '👀 I\'ve seen things you wouldn\'t believe...',
    '🫡 One moment, consulting the oracle',
];

module.exports = {
    name: '8ball',
    aliases: ['eightball', 'magic8', 'oracle', 'askball', 'ask8'],
    description: 'Ask the magic 8-ball anything — .8ball <question>',
    category: 'fun',

    async execute(sock, msg, args, prefix) {
        const chatId  = msg.key.remoteJid;
        const name    = getBotName();
        const question = args.join(' ').trim();

        try { await sock.sendMessage(chatId, { react: { text: '🎱', key: msg.key } }); } catch {}

        if (!question) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  MAGIC 8-BALL 🎱 〕\n║\n║ ▸ *Usage* : ${prefix}8ball <your question>\n║ ▸ *Example* : ${prefix}8ball Will I be rich?\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        const answer = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
        const extra  = Math.random() < 0.3 ? `\n║ ▸ *Psst*   : ${EXTRAS[Math.floor(Math.random() * EXTRAS.length)]}` : '';

        await sock.sendMessage(chatId, {
            text: [
                `╔═|〔  MAGIC 8-BALL 🎱 〕`,
                `║`,
                `║ ▸ *Question* : ${question}`,
                `║`,
                `║ ▸ *Answer*   : ${answer}${extra}`,
                `║`,
                `╚═|〔 ${name} 〕`,
            ].join('\n')
        }, { quoted: msg });
    }
};
