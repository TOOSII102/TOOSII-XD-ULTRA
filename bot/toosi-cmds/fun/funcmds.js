const { keithGet, dlBuffer } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

// ── Helpers ────────────────────────────────────────────────────────────────

function box(title, icon, lines) {
    const name = getBotName();
    return `╔═|〔  ${icon} ${title} 〕\n║\n` + lines.filter(Boolean).join('\n') + `\n║\n╚═|〔 ${name} 〕`;
}

function err(title, icon, reason) {
    const name = getBotName();
    return `╔═|〔  ${icon} ${title} 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${reason}\n║\n╚═|〔 ${name} 〕`;
}

// Decode HTML entities (&amp; → &, etc.)
function decode(s) {
    return String(s || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
}

// ── Simple text commands (truth, dare, wyr, paranoia, pickupline, fact, nhie) ──

function makeTextCmd({ name, aliases, path, title, icon, label, description }) {
    return {
        name,
        aliases,
        description: description || `Get a random ${label || name}`,
        category: 'fun',
        async execute(sock, msg, args, prefix, ctx) {
            const chatId = msg.key.remoteJid;
            try {
                await sock.sendMessage(chatId, { react: { text: icon, key: msg.key } });
                const data = await keithGet(path);
                if (!data.status) throw new Error(data.error || 'No data');
                const text = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
                await sock.sendMessage(chatId, {
                    text: box(title, icon, [`║ ${text}`])
                }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(chatId, { text: err(title, icon, e.message) }, { quoted: msg });
            }
        }
    };
}

const truthCmd = makeTextCmd({
    name: 'truth', aliases: ['truthquestion', 'truthordare', 'asktruth'],
    path: '/fun/truth', title: 'TRUTH', icon: '🙊',
});

const dareCmd = makeTextCmd({
    name: 'dare', aliases: ['darechallenge', 'doit', 'dareq'],
    path: '/fun/dare', title: 'DARE', icon: '🔥',
});

const wyrCmd = makeTextCmd({
    name: 'wyr', aliases: ['wouldyourather', 'rathergame', 'rather'],
    path: '/fun/would-you-rather', title: 'WOULD YOU RATHER', icon: '🤔',
});

const paranoiaCmd = makeTextCmd({
    name: 'paranoia', aliases: ['paranoiagame', 'paraq'],
    path: '/fun/paranoia', title: 'PARANOIA', icon: '👀',
});

const pickuplineCmd = makeTextCmd({
    name: 'pickupline', aliases: ['pickup', 'flirt', 'rizz', 'line'],
    path: '/fun/pickuplines', title: 'PICKUP LINE', icon: '😏',
});

const factCmd = makeTextCmd({
    name: 'fact', aliases: ['randomfact', 'funfact', 'didyouknow'],
    path: '/fun/fact', title: 'FUN FACT', icon: '💡',
});

const nhieCmd = makeTextCmd({
    name: 'nhie', aliases: ['neverhaviever', 'neverihave', 'neverhave'],
    path: '/fun/never-have-i-ever', title: 'NEVER HAVE I EVER', icon: '🤫',
});

// ── Joke ────────────────────────────────────────────────────────────────────

const jokeCmd = {
    name: 'joke',
    aliases: ['jokes', 'funny', 'laugh', 'lol'],
    description: 'Get a random joke with setup and punchline',
    category: 'fun',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        try {
            await sock.sendMessage(chatId, { react: { text: '😂', key: msg.key } });
            const data = await keithGet('/fun/jokes');
            if (!data.status || !data.result) throw new Error(data.error || 'No joke');
            const j = data.result;
            const setup    = typeof j === 'string' ? j : (j.setup || j.joke || '');
            const punchline = j.punchline || j.delivery || '';
            await sock.sendMessage(chatId, {
                text: box('JOKE', '😂', [
                    `║ 📣 ${setup}`,
                    punchline ? `║\n║ 😂 ${punchline}` : null,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('JOKE', '😂', e.message) }, { quoted: msg });
        }
    }
};

// ── Meme ────────────────────────────────────────────────────────────────────

const memeCmd = {
    name: 'meme',
    aliases: ['randommeme', 'reditmeme', 'getmeme'],
    description: 'Get a random Reddit meme image',
    category: 'fun',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name = getBotName();
        try {
            await sock.sendMessage(chatId, { react: { text: '😹', key: msg.key } });
            const data = await keithGet('/fun/meme');
            if (!data.status || !data.url) throw new Error(data.error || 'No meme available');
            const m = data;
            if (m.nsfw) throw new Error('NSFW meme — skipped');

            const caption =
                `╔═|〔  😹 MEME 〕\n║\n` +
                `║ ▸ *${m.title}*\n` +
                `║ ▸ r/${m.subreddit} · 👍 ${(m.ups || 0).toLocaleString()} · u/${m.author}\n` +
                `║ ▸ 🔗 ${m.postLink}\n║\n╚═|〔 ${name} 〕`;

            const buf = await dlBuffer(m.url);
            const ext = m.url.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
            const mime = ext === 'gif' ? 'image/gif' : ext === 'png' ? 'image/png' : 'image/jpeg';

            if (ext === 'gif') {
                await sock.sendMessage(chatId, {
                    video: buf, gifPlayback: true, caption
                }, { quoted: msg });
            } else {
                await sock.sendMessage(chatId, {
                    image: buf, caption
                }, { quoted: msg });
            }
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('MEME', '😹', e.message) }, { quoted: msg });
        }
    }
};

// ── Quiz (Trivia) ────────────────────────────────────────────────────────────

const quizCmd = {
    name: 'quiz',
    aliases: ['trivia', 'question', 'triviaquest', 'q'],
    description: 'Get a random trivia question with multiple choice answers',
    category: 'fun',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        try {
            await sock.sendMessage(chatId, { react: { text: '🧠', key: msg.key } });
            const data = await keithGet('/fun/question');
            if (!data.status || !data.result) throw new Error(data.error || 'No question');
            const q = data.result;

            const question = decode(q.question || q.quest || '');
            const correct  = decode(q.correctAnswer || q.correct_answer || '');
            const allAns   = (q.allAnswers || q.all_answers || [correct]).map(decode);
            const incorrect = (q.incorrectAnswers || q.incorrect_answers || []).map(decode);

            // Shuffle answers (they may already be shuffled)
            const labels = ['A', 'B', 'C', 'D'];
            const choiceLines = allAns.slice(0, 4).map((a, i) =>
                `║   *${labels[i]}.*  ${a}${a === correct ? '  ✅' : ''}`
            );

            await sock.sendMessage(chatId, {
                text: box('TRIVIA QUIZ', '🧠', [
                    `║ 📚 *Category*   : ${q.category || 'General'}`,
                    `║ 🎯 *Difficulty* : ${q.difficulty || 'N/A'}`,
                    `║ 🔤 *Type*       : ${q.type || 'multiple'}`,
                    `║`,
                    `║ ❓ *${question}*`,
                    `║`,
                    ...choiceLines,
                    `║`,
                    `║ 💡 _Answer marked ✅ above_`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('TRIVIA QUIZ', '🧠', e.message) }, { quoted: msg });
        }
    }
};

// ── Quote ────────────────────────────────────────────────────────────────────

const quoteCmd = {
    name: 'quote',
    aliases: ['randomquote', 'inspire', 'motivation', 'qod'],
    description: 'Get a random inspirational quote',
    category: 'fun',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        try {
            await sock.sendMessage(chatId, { react: { text: '✨', key: msg.key } });
            const data = await keithGet('/fun/quote');
            if (!data.status || !data.result) throw new Error(data.error || 'No quote');
            const { quote, author } = data.result;
            await sock.sendMessage(chatId, {
                text: box('QUOTE', '✨', [
                    `║ 💬 _"${quote}"_`,
                    `║`,
                    `║ — *${author || 'Unknown'}*`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('QUOTE', '✨', e.message) }, { quoted: msg });
        }
    }
};

// ── Quote Audio ──────────────────────────────────────────────────────────────

const quoteAudioCmd = {
    name: 'quoteaudio',
    aliases: ['audioquote', 'inspiraudio', 'qaudiovision'],
    description: 'Get an inspirational quote as an audio clip',
    category: 'fun',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name = getBotName();
        try {
            await sock.sendMessage(chatId, { react: { text: '🎵', key: msg.key } });
            const data = await keithGet('/quote/audio');
            if (!data.status || !data.result?.mp3) throw new Error(data.error || 'No audio available');
            const { mp3, data: scenes } = data.result;

            // Extract the quote text from scenes
            const quoteLine = (scenes || []).find(s => s.type === 'quote' && s.text);
            const quoteText = quoteLine?.text || '';

            const buf = await dlBuffer(mp3);
            const caption =
                `╔═|〔  🎵 QUOTE AUDIO 〕\n║\n` +
                (quoteText ? `║ 💬 _"${quoteText}"_\n║\n` : '') +
                `╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, {
                audio: buf,
                mimetype: 'audio/mpeg',
                ptt: false,
            }, { quoted: msg });

            // Send text caption separately so it's readable
            if (quoteText) {
                await sock.sendMessage(chatId, {
                    text: caption
                }, { quoted: msg });
            }
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('QUOTE AUDIO', '🎵', e.message) }, { quoted: msg });
        }
    }
};

// ── Roast ────────────────────────────────────────────────────────────────────

const ROASTS = [
    "You're the human equivalent of a participation trophy — nobody asked for you, you serve no real purpose, and yet here you are, taking up space on the shelf.",
    "I'd roast you, but my mama said I'm not allowed to burn trash.",
    "You have the energy of a phone at 2% battery — barely alive, constantly complaining, and nobody wants to deal with you right now.",
    "You're proof that God has a sense of humor. He looked at the blueprint for a human being and said 'let's see what happens if we remove the charming parts.'",
    "Scientists say the universe is made up of protons, neutrons, and electrons. They forgot to include morons. You're filling that gap admirably.",
    "Your WiFi password is probably something like 'iamthebest' because you need to remind yourself of things nobody else believes.",
    "I've seen better-looking things crawl out of a gym bag at the end of the week — and those at least served a purpose.",
    "You're like a software update notification. Everyone ignores you, and when they finally pay attention, they regret it immediately.",
    "Calling you an idiot would be an insult to idiots. At least they have the decency to not know better. You choose this.",
    "You're the type of person who brings a fork to a soup kitchen and then complains the soup isn't finger food.",
    "If brains were petrol, you wouldn't have enough to power a toy car around the inside of a Cheerio.",
    "You have a face that could make onions cry — not because it's sad, but because it's that aggressively unpleasant.",
    "Your birth certificate should come with a refund policy.",
    "I would ask how old you are, but I can already count your rings from the outside — the ones under your eyes.",
    "You're like a broken pencil: completely pointless, and people only pick you up when there's absolutely nothing else available.",
    "The last time someone was happy to see you, they were mixing you up with someone else.",
    "You speak like someone translated your thoughts from a dead language using a dictionary written by someone who had never spoken to a human.",
    "You're the reason instructions on shampoo bottles say 'lather, rinse, repeat' — because apparently the obvious needs explaining twice.",
    "Your confidence is truly inspiring. I mean, it takes a special kind of person to be that wrong about themselves for that long.",
    "I heard your IQ test came back negative. The machine crashed, couldn't calculate results that low.",
    "You're like a cloud — when you disappear, it's a beautiful day.",
    "Your life is like a pizza with no cheese, no sauce, no toppings, no base — just a concept that never followed through.",
    "If personality was currency, you'd be broke AND in debt AND somehow still asking to borrow money.",
    "You're the type of person who googles their own name and is genuinely surprised there's no results.",
    "You bring nothing to the table. Literally. I've seen you at buffets. You don't even bring yourself a plate.",
    "If common sense was a superpower, you'd be the least threatening villain in the Marvel universe.",
    "I'm not saying you're stupid, but you once tried to put M&Ms in alphabetical order and got mad when they didn't taste different.",
    "You have the social awareness of a parking cone — fixed in one spot, impossible to reason with, and everyone just drives around you.",
    "Your vibe is like a wet sock — nobody wants it near them, and when they're stuck with it, it ruins their entire day.",
    "Your jokes land like a drunk man trying to parallel park — multiple attempts, wrong angle every time, and someone always ends up hurt.",
    "You must be the world's greatest miracle — somehow millions of brain cells joined forces and produced absolutely nothing.",
    "You're the kind of person who reads the word 'gullible' on the ceiling. And then checks again to make sure.",
    "The bags under your eyes are so heavy, you could charge an airline fee to carry them.",
    "You're like a Monday morning — unwanted, exhausting, and way too loud about it.",
    "Your fashion sense screams 'I got dressed in the dark, in a wind, in someone else's house, in a country I'd never visited.'",
    "I've met walls with better listening skills and more interesting things to say.",
    "You're the type of person who microwaves fish in the office and then acts confused when nobody invites you to lunch.",
    "You have a resting face that makes people immediately reconsider their career choices in healthcare.",
    "If I had a dollar for every smart thing you've said, I'd still owe you money.",
    "You're like a speed bump — you slow everyone down, serve no real purpose in modern society, and everyone groans when they see you coming.",
    "Your selfies don't need a filter. They need a complete renovation, an architect, and planning permission.",
    "You're like a book with a great cover, but when you open it, all the pages are just the word 'nothing' repeated in Comic Sans.",
    "I'd say you're funny, but that would be a lie, and unlike you, I have standards.",
    "You're the human version of a footnote — technically present, completely ignored, and utterly irrelevant to the main point.",
    "You talk so much but say so little, scientists are studying you as proof that words can be both abundant and empty simultaneously.",
    "Your cooking is so bad, your microwave filed a restraining order.",
    "If awkwardness was an Olympic sport, you'd still somehow trip on the podium during the medal ceremony.",
    "You're like a Wikipedia page for a minor historical footnote — technically existing, rarely visited, and not particularly accurate.",
    "I've seen better arguments come from fortune cookies. At least those are brief.",
    "You have the attention span of a goldfish, the wisdom of a parking meter, and the charisma of a broken elevator.",
    "You remind me of a broken calculator — nothing adds up, nothing works, and yet you keep showing up on my desk.",
    "Your handwriting looks like a spider fell in ink and then had a panic attack across the page.",
    "You're like a hotel pool — shallow, cold, and full of people who probably shouldn't be there.",
    "I would tell you to go outside and touch grass, but I'm afraid you'd manage to trip on it and somehow injure twelve strangers.",
    "You type like someone is using your fingers to translate morse code written in a language they don't speak.",
    "You're the type of person who listens to music on full volume through one earphone and has strong opinions about it.",
    "Your playlist probably has no skip buttons because you physically can't tell good music from bad.",
    "You're like a compass with no needle — everyone follows you for a second then immediately realizes they're going the wrong direction.",
    "You're the human equivalent of laggy internet — constantly buffering, never delivering, and everyone's already closed the tab.",
    "You're not the sharpest tool in the shed. You're not even in the shed. You're just kind of... near the shed, confused about why there's a shed.",
    "If your life was a movie, critics would walk out during the opening credits and demand a refund for their popcorn.",
    "You're so basic even your WiFi router gets bored of you and disconnects on purpose.",
    "Your presence in a room is like finding out the Wi-Fi is down — everyone notices, nobody's happy about it, and it takes too long to fix.",
    "You call yourself a vibe but you're more of a mild inconvenience on a Tuesday afternoon.",
    "I'd challenge you to a battle of wits, but I don't like fighting unarmed opponents.",
    "You look like you argue with people in YouTube comment sections and then screenshot your own responses to send to yourself.",
    "You're the type who finishes other people's sentences — always late, always wrong, always proud about it.",
    "Scientists discovered a new element. They're calling it Roastium. It's unstable, dense, and embarrassingly bad under pressure. They named it after you.",
];

const roastCmd = {
    name: 'roast',
    aliases: ['flame', 'diss', 'burnit', 'draghim', 'draghim', 'savage'],
    description: 'Get a long savage roast — optionally target someone',
    category: 'fun',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const target = args.join(' ').trim();
        const pick   = ROASTS[Math.floor(Math.random() * ROASTS.length)];
        const header = target
            ? `╔═|〔  🔥 ROAST 〕\n║\n║ 🎯 *Target:* ${target}\n║`
            : `╔═|〔  🔥 ROAST 〕\n║`;
        await sock.sendMessage(chatId, {
            text: `${header}\n║ ${pick}\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
    }
};

module.exports = [
    truthCmd, dareCmd, wyrCmd, paranoiaCmd, pickuplineCmd,
    factCmd, nhieCmd, jokeCmd, memeCmd,
    quizCmd, quoteCmd, quoteAudioCmd, roastCmd,
];
