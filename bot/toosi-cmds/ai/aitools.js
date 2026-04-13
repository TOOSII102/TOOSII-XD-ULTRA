const { keithGet, dlBuffer } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

async function uploadToCatbox(buffer, filename = 'image.jpg') {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('userhash', '');
    form.append('fileToUpload', new Blob([buffer]), filename);
    const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(30000)
    });
    const url = await res.text();
    if (!url.startsWith('http')) throw new Error('Catbox upload failed: ' + url);
    return url.trim();
}

async function getImageBuffer(sock, msg) {
    const ctxInfo = msg.message?.extendedTextMessage?.contextInfo
                 || msg.message?.imageMessage?.contextInfo;
    const quoted  = ctxInfo?.quotedMessage;
    const direct  = msg.message?.imageMessage;

    if (direct) {
        return downloadMediaMessage(msg, 'buffer', {});
    }
    if (quoted?.imageMessage) {
        const synth = {
            key: { ...msg.key, id: ctxInfo.stanzaId, participant: ctxInfo.participant },
            message: quoted
        };
        return downloadMediaMessage(synth, 'buffer', {});
    }
    return null;
}

const visionCmd = {
    name: 'vision',
    aliases: ['analyze', 'imgai', 'seeimage'],
    description: 'Analyze any image using AI — send/quote an image or provide a URL',
    category: 'ai',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        const name    = getBotName();

        let imageUrl = null;
        let question = args.join(' ').trim() || 'What is in this image?';

        if (args[0]?.startsWith('http')) {
            imageUrl = args[0];
            question = args.slice(1).join(' ').trim() || 'What is in this image?';
        }

        if (!imageUrl) {
            try {
                const buf = await getImageBuffer(sock, msg);
                if (buf) {
                    await sock.sendMessage(chatId, { react: { text: '👁️', key: msg.key } });
                    imageUrl = await uploadToCatbox(buf);
                }
            } catch (e) {
            }
        }

        if (!imageUrl) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  👁️ AI VISION 〕\n║\n║ ▸ *Usage* : Send/quote an image with caption ${prefix}vision <question>\n║ ▸ *Or*    : ${prefix}vision <image_url> <question>\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '👁️', key: msg.key } });

            const data = await keithGet('/ai/vision', { image: imageUrl, q: question });
            if (!data.status || !data.result) throw new Error(data.error || 'No response from Vision AI');

            const reply = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);

            await sock.sendMessage(chatId, {
                text: `╔═|〔  👁️ AI VISION 〕\n║\n${reply}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  👁️ AI VISION 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const dreamCmd = {
    name: 'dream',
    aliases: ['dreamanalyze', 'dreamer', 'dreams'],
    description: 'Interpret and analyze your dream using AI',
    category: 'ai',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        const name    = getBotName();
        const prompt  = args.join(' ').trim();

        if (!prompt) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  🌙 DREAM ANALYZER 〕\n║\n║ ▸ *Usage*   : ${prefix}dream <describe your dream>\n║ ▸ *Example* : ${prefix}dream I dreamt about flying over a city\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '🌙', key: msg.key } });

            const data = await keithGet('/ai/dreamanalyzer', { q: prompt });
            if (!data.status || !data.result) throw new Error(data.error || 'No response');

            const reply = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);

            await sock.sendMessage(chatId, {
                text: `╔═|〔  🌙 DREAM ANALYZER 〕\n║\n${reply}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🌙 DREAM ANALYZER 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const speechCmd = {
    name: 'speechwrite',
    aliases: ['speech', 'writespeech', 'speechwriter'],
    description: 'Generate a speech on any topic using AI',
    category: 'ai',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        const flagMap = {};
        const leftover = [];
        for (const a of args) {
            if (a.startsWith('--')) {
                const [k, ...v] = a.slice(2).split('=');
                flagMap[k] = v.join('=') || 'true';
            } else {
                leftover.push(a);
            }
        }

        const topic  = leftover.join(' ').trim();
        const length = flagMap.length || 'medium';
        const type   = flagMap.type   || 'general';
        const tone   = flagMap.tone   || 'professional';

        if (!topic) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  🎤 SPEECH WRITER 〕\n║\n║ ▸ *Usage*   : ${prefix}speech <topic> [--length=short/medium/long] [--tone=formal/friendly/serious] [--type=dedication/general]\n║ ▸ *Example* : ${prefix}speech climate change --length=short --tone=serious\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '🎤', key: msg.key } });

            const data = await keithGet('/ai/speechwriter', { topic, length, type, tone });
            if (!data.status || !data.result) throw new Error(data.error || 'No response');

            const raw = data.result;
            let speech = '';

            if (typeof raw === 'string') {
                speech = raw;
            } else if (raw?.data?.speech) {
                speech = raw.data.speech;
            } else if (raw?.speech) {
                speech = raw.speech;
            } else {
                speech = JSON.stringify(raw);
            }

            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎤 SPEECH WRITER 〕\n║\n║ ▸ *Topic* : ${topic}\n║ ▸ *Tone*  : ${tone} | *Length* : ${length}\n║\n${speech}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🎤 SPEECH WRITER 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

const ttsCmd = {
    name: 'tts',
    aliases: ['texttospeech', 'speak', 'voice'],
    description: 'Convert text to speech using AI voices',
    category: 'ai',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        if (!args.length || args[0] === 'voices') {
            try {
                const data = await keithGet('/ai/tts', { q: 'test' });
                if (!data.status || !data.result?.voices) throw new Error('Could not fetch voices');
                const voices = data.result.voices;
                const list = voices.map((v, i) => `║ ▸ [${i + 1}] ${v.voice_name}`).join('\n');
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  🔊 TTS VOICES 〕\n║\n${list}\n║\n║ *Usage* : ${prefix}tts <number> <text>\n║ *Example* : ${prefix}tts 1 Hello world\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            } catch (e) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  🔊 TTS 〕\n║\n║ ▸ *Usage*   : ${prefix}tts <text>\n║ ▸ *Voices*  : ${prefix}tts voices\n║ ▸ *Pick*    : ${prefix}tts <number> <text>\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }
        }

        let voiceIndex = 0;
        let textArgs = args;

        if (!isNaN(args[0]) && args.length > 1) {
            voiceIndex = Math.max(0, parseInt(args[0]) - 1);
            textArgs = args.slice(1);
        }

        const text = textArgs.join(' ').trim();
        if (!text) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  🔊 TTS 〕\n║\n║ ▸ *Usage*  : ${prefix}tts <text>\n║ ▸ *Voices* : ${prefix}tts voices\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '🔊', key: msg.key } });

            const data = await keithGet('/ai/tts', { q: text });
            if (!data.status || !data.result?.voices?.length) throw new Error(data.error || 'No voices returned');

            const voices = data.result.voices;
            const voice  = voices[Math.min(voiceIndex, voices.length - 1)];
            if (!voice?.audio_url) throw new Error('No audio URL for selected voice');

            const buf = await dlBuffer(voice.audio_url);

            const caption = `╔═|〔  🔊 TTS 〕\n║\n║ ▸ *Voice* : ${voice.voice_name}\n║ ▸ *Text*  : ${text.substring(0, 80)}${text.length > 80 ? '...' : ''}\n║\n╚═|〔 ${name} 〕`;
            await sock.sendMessage(chatId, { audio: buf, mimetype: 'audio/mpeg', ptt: false, caption }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🔊 TTS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

module.exports = [visionCmd, dreamCmd, speechCmd, ttsCmd];
