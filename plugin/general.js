/**
 * plugins/general.js
 * General commands: ping, menu, help, info, alive, owner, repo
 */

const cfg = require('../config');
const os  = require('os');

const startTime = Date.now();

function uptime() {
    const ms  = Date.now() - startTime;
    const s   = Math.floor(ms / 1000);
    const m   = Math.floor(s / 60);
    const h   = Math.floor(m / 60);
    const d   = Math.floor(h / 24);
    if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

// ─────────────────────────────────────────────────────────────────────────────

const ping = {
    name: ['ping', 'speed'],
    description: 'Check bot response speed',
    category: 'General',
    async handler({ reply }) {
        const start = Date.now();
        const m     = await reply('🏓 Pinging...');
        const ms    = Date.now() - start;
        await reply(`🏓 *Pong!*\n⚡ Response: *${ms}ms*`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const alive = {
    name: ['alive', 'awake'],
    description: 'Check if bot is online',
    category: 'General',
    async handler({ reply }) {
        const text =
            `╔══════════════════════════════╗\n` +
            `║   🤖 *${cfg.BOT_NAME}*\n` +
            `╚══════════════════════════════╝\n\n` +
            `✅ Bot is *alive and running!*\n\n` +
            `⏱️ *Uptime:* ${uptime()}\n` +
            `🖥️ *Platform:* ${os.platform()} ${os.arch()}\n` +
            `💾 *RAM:* ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB\n` +
            `📦 *Version:* v${cfg.BOT_VERSION}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🔗 *Repo:* ${cfg.REPO_URL}\n` +
            `💬 *Support:* ${cfg.OWNER_TG}`;
        await reply(text);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const menu = {
    name: ['menu', 'help', 'commands', 'cmds'],
    description: 'Show all available commands',
    category: 'General',
    async handler({ reply, prefix, pushName }) {
        const text =
            `╔══════════════════════════════╗\n` +
            `║   🤖 *${cfg.BOT_NAME}*  v${cfg.BOT_VERSION}\n` +
            `╚══════════════════════════════╝\n\n` +
            `👋 Hello *${pushName}*!\n` +
            `Here are all available commands:\n\n` +

            `━━━━━━ 🔹 *GENERAL* ━━━━━━\n` +
            `${prefix}ping       - Check bot speed\n` +
            `${prefix}alive      - Is the bot online?\n` +
            `${prefix}menu       - Show this menu\n` +
            `${prefix}info       - Bot information\n` +
            `${prefix}owner      - Contact the owner\n` +
            `${prefix}repo       - Bot source code\n\n` +

            `━━━━━━ 🔹 *TOOLS* ━━━━━━\n` +
            `${prefix}sticker    - Convert image to sticker\n` +
            `${prefix}toimage    - Convert sticker to image\n` +
            `${prefix}tagall     - Tag all group members\n` +
            `${prefix}tts <text> - Text to speech\n\n` +

            `━━━━━━ 🔹 *GROUP* ━━━━━━\n` +
            `${prefix}kick @user  - Remove member\n` +
            `${prefix}add number  - Add member\n` +
            `${prefix}promote @   - Make admin\n` +
            `${prefix}demote @    - Remove admin\n` +
            `${prefix}mute        - Mute group\n` +
            `${prefix}unmute      - Unmute group\n` +
            `${prefix}groupinfo   - Group details\n\n` +

            `━━━━━━ 🔹 *OWNER* ━━━━━━\n` +
            `${prefix}broadcast   - Broadcast message\n` +
            `${prefix}restart     - Restart the bot\n\n` +

            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📌 Prefix: *${prefix}*\n` +
            `🔗 Repo: ${cfg.REPO_URL}\n` +
            `💬 Support: ${cfg.OWNER_TG}\n` +
            `_© ${cfg.OWNER_NAME}_`;
        await reply(text);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const info = {
    name: ['info', 'botinfo'],
    description: 'Bot information',
    category: 'General',
    async handler({ reply }) {
        const mem = process.memoryUsage();
        const text =
            `╔══════════════════════════════╗\n` +
            `║   ℹ️  *Bot Information*\n` +
            `╚══════════════════════════════╝\n\n` +
            `🤖 *Name:* ${cfg.BOT_NAME}\n` +
            `📦 *Version:* v${cfg.BOT_VERSION}\n` +
            `👤 *Owner:* ${cfg.OWNER_NAME}\n` +
            `⏱️ *Uptime:* ${uptime()}\n` +
            `🖥️ *OS:* ${os.type()} ${os.release()}\n` +
            `⚙️ *Node.js:* ${process.version}\n` +
            `💾 *RAM Used:* ${(mem.rss / 1024 / 1024).toFixed(1)} MB\n` +
            `🏗️ *Heap:* ${(mem.heapUsed / 1024 / 1024).toFixed(1)} / ${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🔗 *GitHub:* ${cfg.REPO_URL}\n` +
            `💬 *Telegram:* ${cfg.OWNER_TG}\n` +
            `📞 *WhatsApp:* ${cfg.OWNER_WA}`;
        await reply(text);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const owner = {
    name: ['owner', 'creator', 'dev'],
    description: 'Contact the bot owner',
    category: 'General',
    async handler({ reply }) {
        const text =
            `👤 *Bot Owner*\n\n` +
            `🏷️ *Name:* ${cfg.OWNER_NAME}\n` +
            `📞 *WhatsApp:* ${cfg.OWNER_WA}\n` +
            `💬 *Telegram:* ${cfg.OWNER_TG}`;
        await reply(text);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const repo = {
    name: ['repo', 'github', 'source'],
    description: 'Bot source code',
    category: 'General',
    async handler({ reply }) {
        await reply(`🔗 *Source Code*\n\n${cfg.REPO_URL}`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

module.exports = [ping, alive, menu, info, owner, repo];
