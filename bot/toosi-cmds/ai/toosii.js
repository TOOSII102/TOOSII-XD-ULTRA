const { keithGet } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'ai',
    aliases: ['toosii', 'toosiiAi', 'toosiiai', 'ask'],
    description: 'Chat with Toosii AI — built from scratch',
    category: 'ai',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const prompt = args.join(' ').trim();

        if (!prompt) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  🤖 TOOSII AI 〕\n║\n║ ▸ *Usage*   : ${prefix}ai <your question>\n║ ▸ *Example* : ${prefix}ai what is the meaning of life?\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '🤖', key: msg.key } });

            const data = await keithGet('/keithai', { q: prompt });
            if (!data.status || !data.result) throw new Error(data.error || 'No response from Toosii AI');

            const reply = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);

            await sock.sendMessage(chatId, {
                text: `╔═|〔  🤖 TOOSII AI 〕\n║\n${reply}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🤖 TOOSII AI 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};
