'use strict';

const { getBotName }              = require('../../lib/botname');
const { keithGet, casperGet, dlBuffer } = require('../../lib/keithapi');
const BASE = 'https://apiskeith.top';

async function kFetch(path) {
    const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// ── 1. BIBLE SEARCH ───────────────────────────────────────────────────────────
const bibleCmd = {
    name: 'biblesearch',
    aliases: ['biblesrch', 'bverse', 'findbible'],
    description: 'Search Bible verses by keyword',
    category: 'spiritual',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '✝️', key: msg.key } }); } catch {}

        const q = args.join(' ').trim();
        if (!q) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  BIBLE SEARCH 〕\n║\n║ ▸ *Usage*   : ${prefix}biblesearch <keyword>\n║ ▸ *Example* : ${prefix}biblesearch love\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            const data   = await kFetch(`/bible/search?q=${encodeURIComponent(q)}`);
            const r      = data?.result;
            const verses = r?.verses || r?.results || [];
            if (!verses.length) throw new Error('No verses found');

            let out = `╔═|〔  BIBLE SEARCH 〕\n║\n║ ▸ *Query*   : ${q}\n║ ▸ *Found*   : ${r?.totalResults || verses.length} results\n║ ▸ *Version* : ${r?.version || 'KJV'}\n║`;
            for (const v of verses.slice(0, 4)) {
                const ref  = v.reference || v.verse || v.book_name || '';
                const text = v.text || v.verse_text || v.content || '';
                if (ref || text) out += `\n║ 📖 *${ref}*\n║   _${String(text).slice(0, 200)}_\n║`;
            }
            out += `\n╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, { text: out }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  BIBLE SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── 2. RANDOM BIBLE VERSE ─────────────────────────────────────────────────────
const randBibleCmd = {
    name: 'randverse',
    aliases: ['dailyverse', 'bibleverse', 'devotional'],
    description: 'Get a random Bible verse',
    category: 'spiritual',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '📖', key: msg.key } }); } catch {}

        try {
            const data = await kFetch(`/random/bible`);
            const r    = data?.result;
            const v    = r?.verse;
            if (!v) throw new Error('No verse returned');

            const ref  = [v.book_name || v.bookId, v.chapter, v.verse_start || v.verse].filter(Boolean).join(' ');
            const text = v.text || v.content || '';
            const trans = r?.translation?.name || 'Bible';

            await sock.sendMessage(chatId, {
                text: `╔═|〔  DAILY VERSE 〕\n║\n║ ▸ *Ref*     : ${ref}\n║ ▸ *Version* : ${trans}\n║\n_${text.slice(0, 500)}_\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  DAILY VERSE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── 3. AI BIBLE ───────────────────────────────────────────────────────────────
const aiBibleCmd = {
    name: 'aibibl',
    aliases: ['askbible', 'biblai', 'godai'],
    description: 'Ask a question and get Bible-based AI answer',
    category: 'spiritual',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '✝️', key: msg.key } }); } catch {}

        const ctxQuoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quoted    = ctxQuoted?.conversation || ctxQuoted?.extendedTextMessage?.text;
        const q         = args.join(' ').trim() || quoted;

        if (!q) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  AI BIBLE 〕\n║\n║ ▸ *Usage*   : ${prefix}aibibl <question>\n║ ▸ *Example* : ${prefix}aibibl who is Jesus\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            const data    = await kFetch(`/ai/bible?q=${encodeURIComponent(q)}`);
            const r       = data?.result;
            const results = r?.results || [];
            const trans   = r?.translation || 'ESV';

            let out = `╔═|〔  AI BIBLE 〕\n║\n║ ▸ *Q*       : ${q.slice(0, 100)}\n║ ▸ *Version* : ${trans}\n║`;
            for (const item of results.slice(0, 3)) {
                const ref  = item.reference || '';
                const text = item.text || item.content || '';
                if (text) out += `\n║ 📖 *${ref}*\n║   _${String(text).slice(0, 250)}_\n║`;
            }
            if (!results.length) {
                const plain = r?.answer || r?.text || String(r || '').slice(0, 1000);
                out += `\n${plain}\n║`;
            }
            out += `\n╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, { text: out }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  AI BIBLE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── 4. QURAN SURAH LIST ───────────────────────────────────────────────────────
const surahListCmd = {
    name: 'surahlist',
    aliases: ['slist', 'quranlist', 'surahs'],
    description: 'List all 114 Quran surahs with numbers',
    category: 'spiritual',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '🕌', key: msg.key } }); } catch {}

        try {
            const data   = await kFetch(`/surahlist`);
            const surahs = data?.result?.data || [];
            if (!surahs.length) throw new Error('No data returned');

            const page = parseInt(args[0]) || 1;
            const SIZE = 20;
            const start = (page - 1) * SIZE;
            const slice = surahs.slice(start, start + SIZE);
            const total = Math.ceil(surahs.length / SIZE);

            let out = `╔═|〔  QURAN SURAHS — Page ${page}/${total} 〕\n║`;
            for (const s of slice) {
                out += `\n║ ${String(s.number).padStart(3, ' ')}. ${s.name || s.englishName} — ${s.englishNameTranslation || s.meaning || ''}`;
            }
            out += `\n║\n║ ▸ Page ${page}/${total} — use ${prefix}surahlist ${page + 1 <= total ? page + 1 : 1} for next\n╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, { text: out }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  SURAH LIST 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── 5. AI MUSLIM ──────────────────────────────────────────────────────────────
const aiMuslimCmd = {
    name: 'aimuslim',
    aliases: ['askquran', 'islamai', 'allahq'],
    description: 'Ask an Islamic question and get an AI answer with Quran references',
    category: 'spiritual',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '🕌', key: msg.key } }); } catch {}

        const ctxQuoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quoted    = ctxQuoted?.conversation || ctxQuoted?.extendedTextMessage?.text;
        const q         = args.join(' ').trim() || quoted;

        if (!q) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  AI MUSLIM 〕\n║\n║ ▸ *Usage*   : ${prefix}aimuslim <question>\n║ ▸ *Example* : ${prefix}aimuslim what is Ramadan\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            const data    = await kFetch(`/ai/muslim?q=${encodeURIComponent(q)}`);
            const results = data?.result?.results || [];

            let out = `╔═|〔  AI MUSLIM 〕\n║\n║ ▸ *Q* : ${q.slice(0, 100)}\n║`;
            for (const item of results.slice(0, 3)) {
                const surah = item.surah_name || item.surah || '';
                const ayah  = item.ayah || item.verse || item.id || '';
                const text  = item.text || item.content || item.translation || '';
                if (text) {
                    out += `\n║ 📿 ${surah ? `*${surah}` : ''}${ayah ? ` (${ayah})*` : '*'}\n║   _${String(text).slice(0, 250)}_\n║`;
                }
            }
            if (!results.length) {
                const plain = data?.result?.answer || String(data?.result || '').slice(0, 1000);
                out += `\n${plain}\n║`;
            }
            out += `\n╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, { text: out }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  AI MUSLIM 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── 6. ADVENTIST HYMNAL ───────────────────────────────────────────────────────
const hymnCmd = {
    name: 'hymn',
    aliases: ['hymnal', 'adventhymn', 'sda'],
    description: 'Look up an Adventist hymnal by number (1–695)',
    category: 'spiritual',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '🎼', key: msg.key } }); } catch {}

        const num = parseInt(args[0]);
        if (!num || num < 1 || num > 695) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  ADVENTIST HYMNAL 〕\n║\n║ ▸ *Usage*   : ${prefix}hymn <number>\n║ ▸ *Example* : ${prefix}hymn 1\n║ ▸ *Range*   : 1 – 695\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            const data   = await kFetch(`/adventist/hymnal?q=${num}`);
            const r      = data?.result;
            if (!r?.title) throw new Error('Hymn not found');

            const verses = (r.verses || []).slice(0, 4);
            let out = `╔═|〔  ADVENTIST HYMNAL 〕\n║\n║ ▸ *#${r.number}* — ${r.title}\n║`;
            for (const v of verses) {
                out += `\n║ ── *Verse ${v.number}*\n`;
                for (const line of (v.lines || [])) {
                    out += `║   ${line}\n`;
                }
                out += `║`;
            }
            if (r.chorus?.lines?.length) {
                out += `\n║ ── *Chorus*\n`;
                for (const line of r.chorus.lines) {
                    out += `║   ${line}\n`;
                }
                out += `║`;
            }
            out += `\n╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, { text: out }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  ADVENTIST HYMNAL 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

// ── 7. MEDITATE ───────────────────────────────────────────────────────────────
const SESSIONS = [
    {
        title   : '🌅 Morning Clarity',
        steps   : ['Sit comfortably and close your eyes', 'Breathe in slowly for *4 counts*', 'Hold for *4 counts*', 'Breathe out for *6 counts*', 'Repeat 5 times, letting each exhale release tension'],
        focus   : 'Set one clear intention for today. What matters most?',
        affirm  : '_I am focused, calm, and ready for the day ahead._',
    },
    {
        title   : '🌊 Deep Calm',
        steps   : ['Find a quiet space and sit or lie down', 'Breathe in through your nose for *5 counts*', 'Hold gently for *2 counts*', 'Exhale fully through your mouth for *7 counts*', 'Feel your body soften with every breath out'],
        focus   : 'Notice any tension in your body. Breathe directly into it and let it melt.',
        affirm  : '_I release what I cannot control. Peace flows through me._',
    },
    {
        title   : '🔥 Inner Strength',
        steps   : ['Sit tall with your spine straight', 'Take a powerful breath in for *3 counts*', 'Hold at the top for *3 counts*', 'Exhale with purpose for *3 counts*', 'Repeat 7 times, feeling energy build with each cycle'],
        focus   : 'Visualize a challenge you are facing. See yourself moving through it with ease.',
        affirm  : '_I have the strength to overcome anything placed before me._',
    },
    {
        title   : '🌙 Evening Wind-Down',
        steps   : ['Dim your environment and sit quietly', 'Breathe in gently for *4 counts*', 'Breathe out slowly for *8 counts*', 'With each exhale, let the events of the day dissolve', 'Repeat until your mind feels still'],
        focus   : 'Reflect on one thing you are grateful for from today, no matter how small.',
        affirm  : '_Today was enough. I did enough. I am enough._',
    },
    {
        title   : '🌿 Present Moment',
        steps   : ['Stop whatever you are doing and be still', 'Take 3 deep natural breaths', 'Name 5 things you can see around you', 'Name 3 things you can physically feel', 'Return to your breath and breathe naturally for 1 minute'],
        focus   : 'You are exactly where you need to be right now.',
        affirm  : '_This moment is enough. I am grounded and present._',
    },
];

const BREATHE_TECHNIQUES = [
    { name: '4-7-8 Breathing', steps: 'Inhale *4s* → Hold *7s* → Exhale *8s*', benefit: 'Calms the nervous system, great for anxiety' },
    { name: 'Box Breathing', steps: 'Inhale *4s* → Hold *4s* → Exhale *4s* → Hold *4s*', benefit: 'Used by Navy SEALs to stay calm under pressure' },
    { name: 'Belly Breathing', steps: 'Place hand on belly → Inhale deeply until belly rises → Exhale fully', benefit: 'Activates the relaxation response in seconds' },
    { name: '2-1-4-1 Breathing', steps: 'Inhale *2s* → Hold *1s* → Exhale *4s* → Hold *1s*', benefit: 'Quickly reduces stress and clears the mind' },
];

// Casper TTS — 9 OpenAI-quality voices. Use "nova" (female, warm) for meditation.
async function speakText(text, voice = 'nova') {
    const data = await casperGet('/api/tools/tts', { text, voice });
    if (!data.success || !data.audioUrl) throw new Error('TTS unavailable');
    const buf  = await dlBuffer(data.audioUrl);
    return { buf, mime: 'audio/mpeg', voice: data.voiceInfo?.label || voice };
}

const meditatCmd = {
    name       : 'meditate',
    aliases    : ['meditation', 'mindful', 'breathe', 'calm', 'relax'],
    description: 'Get a guided meditation session or breathing technique',
    category   : 'spiritual',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '🧘', key: msg.key } }); } catch {}

        const sub = args[0]?.toLowerCase();

        // ── breathe sub-command ───────────────────────────────────────────────
        if (sub === 'breathe' || sub === 'breathing' || sub === 'breath') {
            const t = BREATHE_TECHNIQUES[Math.floor(Math.random() * BREATHE_TECHNIQUES.length)];
            const card = [
                `╔═|〔  🌬️ BREATHING TECHNIQUE 〕`,
                `║`,
                `║ ▸ *Technique* : ${t.name}`,
                `║ ▸ *Steps*     : ${t.steps}`,
                `║ ▸ *Benefit*   : ${t.benefit}`,
                `║`,
                `║ 💡 Practice for at least 3 minutes`,
                `║`,
                `╚═|〔 ${name} 〕`,
            ].join('\n');
            await sock.sendMessage(chatId, { text: card }, { quoted: msg });
            try {
                const plainSteps = t.steps.replace(/\*/g, '');
                const ttsText = `${t.name}. ${plainSteps}. ${t.benefit}.`;
                const { buf, mime } = await speakText(ttsText);
                await sock.sendMessage(chatId, { audio: buf, mimetype: mime, ptt: false }, { quoted: msg });
            } catch {}
            return;
        }

        // ── default: full guided session ──────────────────────────────────────
        const s = SESSIONS[Math.floor(Math.random() * SESSIONS.length)];
        const stepLines = s.steps.map((st, i) => `║  ${i + 1}. ${st}`);

        const card = [
            `╔═|〔  🧘 MEDITATION 〕`,
            `║`,
            `║ *${s.title}*`,
            `║`,
            `║ 🌬️ *Breathing Guide*`,
            ...stepLines,
            `║`,
            `║ 🎯 *Focus Point*`,
            `║  ${s.focus}`,
            `║`,
            `║ ✨ *Affirmation*`,
            `║  ${s.affirm}`,
            `║`,
            `║ 💡 *Try also* : ${prefix}meditate breathe`,
            `║`,
            `╚═|〔 ${name} 〕`,
        ].join('\n');

        await sock.sendMessage(chatId, { text: card }, { quoted: msg });

        try {
            const cleanAffirm = s.affirm.replace(/_/g, '').trim();
            const ttsText = `Welcome to your ${s.title.replace(/[🌅🌊🔥🌙🌿]/g, '').trim()} session. ${s.focus} Remember this affirmation: ${cleanAffirm}`;
            const { buf, mime } = await speakText(ttsText);
            await sock.sendMessage(chatId, { audio: buf, mimetype: mime, ptt: false }, { quoted: msg });
        } catch {}
    }
};

module.exports = [
    bibleCmd,
    randBibleCmd,
    aiBibleCmd,
    surahListCmd,
    aiMuslimCmd,
    hymnCmd,
    meditatCmd,
];
