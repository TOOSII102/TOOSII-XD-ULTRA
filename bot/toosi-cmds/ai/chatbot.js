'use strict';

const { getBotName }                          = require('../../lib/botname');
const { isEnabled, getMode, setEnabled, listEnabled } = require('../../lib/chatbot-store');

// ── Pollinations AI ──────────────────────────────────────────────────────────
const BOT_PERSONA =
    `You are Toosii AI — a witty, funny, and friendly WhatsApp assistant created by Toosii Tech (also known as TOOSII XD). ` +
    `Always reply in the SAME language the user writes in — if they write in Swahili, reply in Swahili; Spanish, reply in Spanish; etc. ` +
    `Use relevant emojis naturally throughout your replies to make them lively and expressive. ` +
    `Be humorous and playful while still being helpful — think funny best friend who also knows everything. ` +
    `Keep replies concise (1-4 sentences) unless the question clearly needs more detail. ` +
    `If asked who made you, who your founder is, or who created you — say you were created by Toosii Tech, also known as TOOSII XD. ` +
    `Never reveal you are powered by an external AI model. You are simply Toosii AI, built by Toosii Tech.`;

async function pollinationsReply(userText, timeoutMs = 25000) {
    const prompt = encodeURIComponent(`${BOT_PERSONA}\n\nUser: ${userText}\nToosii AI:`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(`https://text.pollinations.ai/${prompt}?model=openai`, {
            signal: controller.signal,
            headers: { 'User-Agent': 'ToosiiBot/1.0', Accept: 'text/plain,*/*' }
        });
        if (!res.ok) throw new Error(`AI HTTP ${res.status}`);
        const text = (await res.text()).trim();
        if (!text) throw new Error('Empty response from AI');
        return text;
    } finally { clearTimeout(timer); }
}

// ── Format potentially multi-line AI reply inside the box ────────────────────
function formatReply(reply) {
    return reply.split('\n')
        .map(l => `║ ${l}`)
        .join('\n');
}

// ── Rate limiter — 1 AI reply per chat per 5s ─────────────────────────────────
const _lastReply = new Map(); // chatId → timestamp
function isRateLimited(chatId) {
    const last = _lastReply.get(chatId) || 0;
    if (Date.now() - last < 5000) return true;
    _lastReply.set(chatId, Date.now());
    return false;
}

// ── Check if bot was @mentioned in this message ───────────────────────────────
function botWasMentioned(msg, sock) {
    const botJid = sock.user?.id || '';
    const botNum = botJid.split('@')[0].split(':')[0];
    const m = msg.message;
    const mentions = (
        m?.extendedTextMessage?.contextInfo?.mentionedJid ||
        m?.imageMessage?.contextInfo?.mentionedJid ||
        m?.videoMessage?.contextInfo?.mentionedJid ||
        []
    );
    return mentions.some(j => j.split('@')[0].split(':')[0] === botNum);
}

// ── Exported for index.js hook ───────────────────────────────────────────────
function isChatbotActiveForChat(chatId) {
    return isEnabled(chatId);
}

async function handleChatbotMessage(sock, msg) {
    const chatId  = msg.key.remoteJid;
    if (!isEnabled(chatId)) return;

    // Mention-only mode: in groups only reply when bot is @mentioned
    const isGroup = chatId.endsWith('@g.us');
    if (isGroup && getMode(chatId) === 'mention') {
        if (!botWasMentioned(msg, sock)) return;
    }

    if (isRateLimited(chatId)) return;

    const m = msg.message;
    if (!m) return;
    const text = (
        m.conversation ||
        m.extendedTextMessage?.text ||
        m.imageMessage?.caption ||
        m.videoMessage?.caption ||
        ''
    ).trim();
    if (!text) return;

    try {
        await sock.sendMessage(chatId, { react: { text: '🤖', key: msg.key } });
        const reply = await pollinationsReply(text);
        const name  = getBotName();
        await sock.sendMessage(chatId, {
            text: `╔═|〔  🤖 TOOSII AI 〕\n║\n${formatReply(reply)}\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
    } catch {
        // silent — chatbot failures must not flood the chat
    }
}

// ── Admin check helper ────────────────────────────────────────────────────────
async function senderIsAdmin(sock, msg, chatId) {
    if (!chatId.endsWith('@g.us')) return true; // DMs: always allow
    try {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const senderNum = senderJid.split('@')[0].split(':')[0];
        const meta      = await sock.groupMetadata(chatId);
        const p = meta.participants.find(p =>
            p.id.split('@')[0].split(':')[0] === senderNum
        );
        return p?.admin === 'admin' || p?.admin === 'superadmin';
    } catch { return false; }
}

// ── .chatbot command ─────────────────────────────────────────────────────────
module.exports = [
    {
        name: 'chatbot',
        aliases: ['cb', 'autoai', 'autoreply'],
        description: 'Toggle Toosii AI auto-reply for this chat — .chatbot on|off|status|list',
        category: 'ai',

        async execute(sock, msg, args, prefix, ctx) {
            const chatId  = msg.key.remoteJid;
            const isGroup = chatId.endsWith('@g.us');
            const name    = getBotName();
            const sub     = (args[0] || '').toLowerCase();
            const modeArg = (args[1] || '').toLowerCase(); // 'mention' or 'all'

            const H   = `╔═|〔  🤖 CHATBOT 〕`;
            const F   = `╚═|〔 ${name} 〕`;
            const SEP = '║';

            // ── list (owner/sudo only) ────────────────────────────────────────
            if (sub === 'list') {
                if (!ctx?.isOwner?.() && !ctx?.isSudo?.()) {
                    return sock.sendMessage(chatId, {
                        text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ❌ Owner/sudo only\n${SEP}\n${F}`
                    }, { quoted: msg });
                }
                const enabled = listEnabled();
                if (!enabled.length) {
                    return sock.sendMessage(chatId, {
                        text: `${H}\n${SEP}\n${SEP} ▸ No chats have chatbot enabled\n${SEP}\n${F}`
                    }, { quoted: msg });
                }
                const lines = enabled.map(({ chatId: cid, mode }) => {
                    const label = cid.endsWith('@g.us') ? `Group: ${cid.split('@')[0]}` : `DM: ${cid.split('@')[0]}`;
                    return `${SEP} ▸ ${label} [${mode}]`;
                }).join('\n');
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} 📋 *Enabled in ${enabled.length} chat(s)*\n${SEP}\n${lines}\n${SEP}\n${F}`
                }, { quoted: msg });
            }

            // ── status / no args ──────────────────────────────────────────────
            if (!sub || sub === 'status') {
                const on    = isEnabled(chatId);
                const mode  = getMode(chatId);
                const state = on ? `✅ *ON* (mode: ${mode})` : '❌ *OFF*';
                const scope = isGroup ? 'this group' : 'this DM';
                const opts  = isGroup
                    ? `\`${prefix}chatbot on\` _(all messages)_\n${SEP} ▸ \`${prefix}chatbot on mention\` _(only when @tagged)_\n${SEP} ▸ \`${prefix}chatbot off\``
                    : `\`${prefix}chatbot on\` / \`${prefix}chatbot off\``;
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Chat*   : ${scope}\n${SEP} ▸ *Status* : ${state}\n${SEP}\n${SEP} ▸ ${opts}\n${SEP}\n${F}`
                }, { quoted: msg });
            }

            // ── on / off — require admin in groups ────────────────────────────
            if (sub === 'on' || sub === 'off') {
                const isOwnerOrSudo = ctx?.isOwner?.() || ctx?.isSudo?.();
                if (isGroup && !isOwnerOrSudo) {
                    const admin = await senderIsAdmin(sock, msg, chatId);
                    if (!admin) {
                        return sock.sendMessage(chatId, {
                            text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ❌ Group admins only\n${SEP}\n${F}`
                        }, { quoted: msg });
                    }
                }

                if (sub === 'on') {
                    const mode  = isGroup && modeArg === 'mention' ? 'mention' : 'all';
                    setEnabled(chatId, true, mode);
                    const scope   = isGroup ? 'This group' : 'This DM';
                    const modeMsg = mode === 'mention'
                        ? 'Replies only when @mentioned'
                        : 'Replies to every message';
                    return sock.sendMessage(chatId, {
                        text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ✅ Enabled\n${SEP} ▸ *Scope*  : ${scope}\n${SEP} ▸ *Mode*   : ${modeMsg}\n${SEP} ▸ _Type_ \`${prefix}chatbot off\` _to disable_\n${SEP}\n${F}`
                    }, { quoted: msg });
                }

                // off
                setEnabled(chatId, false);
                const scope = isGroup ? 'This group' : 'This DM';
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ❌ Disabled\n${SEP} ▸ *Scope*  : ${scope}\n${SEP}\n${F}`
                }, { quoted: msg });
            }

            // ── unknown subcommand ────────────────────────────────────────────
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Usage* :\n${SEP}   \`${prefix}chatbot on\`         → all messages\n${SEP}   \`${prefix}chatbot on mention\` → groups: @tag only\n${SEP}   \`${prefix}chatbot off\`\n${SEP}   \`${prefix}chatbot status\`\n${SEP}   \`${prefix}chatbot list\`        → owner only\n${SEP}\n${F}`
            }, { quoted: msg });
        }
    }
];

module.exports.isChatbotActiveForChat = isChatbotActiveForChat;
module.exports.handleChatbotMessage   = handleChatbotMessage;
