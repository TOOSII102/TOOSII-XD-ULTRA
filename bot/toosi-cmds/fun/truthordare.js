'use strict';

const { getBotName } = require('../../lib/botname');

const TRUTHS = [
    "What's the most embarrassing thing you've ever done in public?",
    "Have you ever lied to get out of trouble? What was the lie?",
    "What is your biggest fear and why?",
    "What's the most childish thing you still do?",
    "Have you ever cheated on a test or game?",
    "What's the worst thing you've ever said about a friend behind their back?",
    "Have you ever pretended to be sick to avoid something? What was it?",
    "What's one secret you've never told anyone?",
    "What's the most embarrassing song on your playlist?",
    "Have you ever sent a text to the wrong person? What did it say?",
    "What's the strangest dream you've ever had?",
    "Have you ever stood someone up? What happened?",
    "What's the dumbest thing you've ever done for love?",
    "What's something you've done that you hope your parents never find out about?",
    "Have you ever walked into a room, forgotten why, and just pretended you knew?",
    "What's the most embarrassing nickname someone has given you?",
    "Have you ever ugly-cried at a movie? Which one?",
    "What's one thing you're terrible at but pretend to be good at?",
    "What's the pettiest thing you've ever done to get back at someone?",
    "Have you ever laughed so hard you cried in public?",
];

const DARES = [
    "Send a voice note saying 'I love you' to the last person you texted",
    "Post an embarrassing childhood photo to your status for 10 minutes",
    "Call someone and sing them 'Happy Birthday' even if it's not their birthday",
    "Text your crush 'We need to talk' and wait 5 minutes before explaining",
    "Send a funny selfie to 3 people in your contacts",
    "Change your WhatsApp profile picture to a funny animal for 1 hour",
    "Type your next 5 messages using only your nose (or elbows)",
    "Send a voice note imitating a chicken for 30 seconds",
    "Text your mom or dad: 'I did something bad today'",
    "Send the 10th photo in your gallery to this group right now",
    "Do your best celebrity impression in a voice note",
    "Text the 5th person in your contacts: 'Are you okay? I had a dream about you'",
    "Send a voice note talking in a robot voice for 30 seconds",
    "Share your most recent Google search in this chat",
    "Change your bio to 'TOOSII-XD is life 🔥' for 30 minutes",
    "Send a voice note of you beatboxing for 20 seconds",
    "Share the last app you opened and what you were doing on it",
    "Send a voice note saying 'Hello? Is anyone there?' in a spooky voice",
    "Text someone: 'I know what you did' and don't explain for 2 minutes",
    "Send a selfie making the silliest face you can",
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = [
    {
        name: 'truth',
        aliases: ['asktruth', 'confessnow', 'truthquestion'],
        description: 'Get a random truth question — .truth',
        category: 'fun',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            try { await sock.sendMessage(chatId, { react: { text: '💬', key: msg.key } }); } catch {}

            const sender = (msg.key.participant || msg.key.remoteJid).split('@')[0].split(':')[0];
            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  TRUTH 💬 〕`,
                    `║`,
                    `║ @${sender}, answer honestly:`,
                    `║`,
                    `║ 🤔 *${pick(TRUTHS)}*`,
                    `║`,
                    `║ ▸ No lying allowed! 😏`,
                    `║`,
                    `╚═|〔 ${name} 〕`,
                ].join('\n'),
                mentions: [`${sender}@s.whatsapp.net`],
            }, { quoted: msg });
        }
    },

    {
        name: 'dare',
        aliases: ['dodare', 'darechallenge', 'darequest'],
        description: 'Get a random dare challenge — .dare',
        category: 'fun',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            try { await sock.sendMessage(chatId, { react: { text: '😈', key: msg.key } }); } catch {}

            const sender = (msg.key.participant || msg.key.remoteJid).split('@')[0].split(':')[0];
            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  DARE 😈 〕`,
                    `║`,
                    `║ @${sender}, you DARE to:`,
                    `║`,
                    `║ 🎯 *${pick(DARES)}*`,
                    `║`,
                    `║ ▸ No backing out now! 👀`,
                    `║`,
                    `╚═|〔 ${name} 〕`,
                ].join('\n'),
                mentions: [`${sender}@s.whatsapp.net`],
            }, { quoted: msg });
        }
    },

    {
        name: 'tod',
        aliases: ['truthordare', 'tordare', 'totd'],
        description: 'Get a random truth OR dare — .tod',
        category: 'fun',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const sender = (msg.key.participant || msg.key.remoteJid).split('@')[0].split(':')[0];

            if (Math.random() < 0.5) {
                try { await sock.sendMessage(chatId, { react: { text: '💬', key: msg.key } }); } catch {}
                await sock.sendMessage(chatId, {
                    text: [
                        `╔═|〔  TRUTH OR DARE — TRUTH 💬 〕`,
                        `║`,
                        `║ @${sender}, the universe chose *TRUTH*!`,
                        `║`,
                        `║ 🤔 *${pick(TRUTHS)}*`,
                        `║`,
                        `╚═|〔 ${name} 〕`,
                    ].join('\n'),
                    mentions: [`${sender}@s.whatsapp.net`],
                }, { quoted: msg });
            } else {
                try { await sock.sendMessage(chatId, { react: { text: '😈', key: msg.key } }); } catch {}
                await sock.sendMessage(chatId, {
                    text: [
                        `╔═|〔  TRUTH OR DARE — DARE 😈 〕`,
                        `║`,
                        `║ @${sender}, the universe chose *DARE*!`,
                        `║`,
                        `║ 🎯 *${pick(DARES)}*`,
                        `║`,
                        `╚═|〔 ${name} 〕`,
                    ].join('\n'),
                    mentions: [`${sender}@s.whatsapp.net`],
                }, { quoted: msg });
            }
        }
    }
];
