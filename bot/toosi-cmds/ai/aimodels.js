const { keithGet } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

function makeModel({ name, aliases, description, endpoint, label, emoji }) {
    return {
        name,
        aliases,
        description,
        category: 'ai',
        async execute(sock, msg, args, prefix, ctx) {
            const chatId = msg.key.remoteJid;
            const botName = getBotName();
            const prompt  = args.join(' ').trim();

            if (!prompt) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  ${emoji} ${label} 〕\n║\n║ ▸ *Usage*   : ${prefix}${name} <your question>\n║ ▸ *Example* : ${prefix}${name} explain quantum computing\n║\n╚═|〔 ${botName} 〕`
                }, { quoted: msg });
            }

            try {
                await sock.sendMessage(chatId, { react: { text: emoji, key: msg.key } });

                const data = await keithGet(endpoint, { q: prompt });
                if (!data.status || !data.result) throw new Error(data.error || 'No response');

                const reply = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);

                await sock.sendMessage(chatId, {
                    text: `╔═|〔  ${emoji} ${label} 〕\n║\n${reply}\n║\n╚═|〔 ${botName} 〕`
                }, { quoted: msg });

            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  ${emoji} ${label} 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${botName} 〕`
                }, { quoted: msg });
            }
        }
    };
}

module.exports = [
    makeModel({
        name: 'gpt',
        aliases: ['chatgpt', 'gptai'],
        description: 'Chat with GPT AI model',
        endpoint: '/ai/gpt',
        label: 'GPT AI',
        emoji: '🧠'
    }),
    makeModel({
        name: 'claude',
        aliases: ['claudeai', 'anthropic'],
        description: 'Chat with Claude AI model',
        endpoint: '/ai/claudeai',
        label: 'CLAUDE AI',
        emoji: '🧩'
    }),
    makeModel({
        name: 'mistral',
        aliases: ['mistralai'],
        description: 'Chat with Mistral AI model',
        endpoint: '/ai/mistral',
        label: 'MISTRAL AI',
        emoji: '🌪️'
    }),
    makeModel({
        name: 'bard',
        aliases: ['bardai', 'google'],
        description: 'Chat with Bard AI model',
        endpoint: '/ai/bard',
        label: 'BARD AI',
        emoji: '🎭'
    }),
    makeModel({
        name: 'perplexity',
        aliases: ['perp', 'perplx'],
        description: 'Chat with Perplexity AI model',
        endpoint: '/ai/perplexity',
        label: 'PERPLEXITY AI',
        emoji: '🔭'
    }),
    makeModel({
        name: 'o3',
        aliases: ['o3ai', 'openai-o3'],
        description: 'Chat with OpenAI o3 model',
        endpoint: '/ai/o3',
        label: 'O3 AI',
        emoji: '🔬'
    }),
    makeModel({
        name: 'chatgpt4',
        aliases: ['cgpt4', 'gpt4chat'],
        description: 'Chat with ChatGPT-4 model',
        endpoint: '/ai/chatgpt4',
        label: 'CHATGPT-4',
        emoji: '💬'
    }),
    makeModel({
        name: 'gpt4nano',
        aliases: ['nano', 'gpt41nano', 'gptnano'],
        description: 'Chat with GPT-4.1 Nano model',
        endpoint: '/ai/gpt41Nano',
        label: 'GPT-4 NANO',
        emoji: '⚡'
    }),
    makeModel({
        name: 'deepseek',
        aliases: ['ds', 'deepseekr1', 'dsr1'],
        description: 'Chat with DeepSeek R1 model',
        endpoint: '/ai/deepseek',
        label: 'DEEPSEEK R1',
        emoji: '🌊'
    }),
    makeModel({
        name: 'deepseekv3',
        aliases: ['dsv3', 'deepseek-v3'],
        description: 'Chat with DeepSeek V3 model',
        endpoint: '/ai/deepseekV3',
        label: 'DEEPSEEK V3',
        emoji: '🌀'
    }),
    makeModel({
        name: 'gpt4',
        aliases: ['gptfour', 'openai4'],
        description: 'Chat with GPT-4 model',
        endpoint: '/ai/gpt4',
        label: 'GPT-4',
        emoji: '🤖'
    }),
    makeModel({
        name: 'qwen',
        aliases: ['qwenai', 'qwena'],
        description: 'Chat with Qwen AI model',
        endpoint: '/ai/qwenai',
        label: 'QWEN AI',
        emoji: '🐉'
    }),
    makeModel({
        name: 'llama',
        aliases: ['ilama', 'llamaai', 'meta-llama'],
        description: 'Chat with Llama AI model',
        endpoint: '/ai/ilama',
        label: 'LLAMA AI',
        emoji: '🦙'
    }),
];
