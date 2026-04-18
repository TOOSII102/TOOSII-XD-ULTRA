'use strict';
const path = require('path');
const fs   = require('fs');
const os   = require('os');
const { getBotName } = require('../../lib/botname');
const cfg  = require('../../config');

const CMDS_DIR = path.join(__dirname, '..');

// Try to read version from package.json
let BOT_VERSION = 'v1.2.0';
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../bot/package.json'), 'utf8'));
    if (pkg.version) BOT_VERSION = `v${pkg.version}`;
} catch {}

const CATEGORY_LABELS = {
    ai:          '🤖 AI',
    adult:       '🔞 ADULT',
    automation:  '⚙️ AUTOMATION',
    channel:     '📢 CHANNEL',
    download:    '📥 DOWNLOAD',
    education:   '📚 EDUCATION',
    fun:         '😂 FUN',
    games:       '🎮 GAMES',
    group:       '👥 GROUP',
    image:       '🖼️ IMAGE',
    movie:       '🎬 MOVIE',
    news:        '📰 NEWS',
    owner:       '👑 OWNER',
    search:      '🔎 SEARCH',
    spiritual:   '🕊️ SPIRITUAL',
    sports:      '⚽ SPORTS',
    stalker:     '🔍 STALKER',
    utility:     '🔧 UTILITY',
};

// Category display order
const CATEGORY_ORDER = [
    'utility','owner','ai','group','automation','channel',
    'download','education','spiritual','fun','sports',
    'news','stalker','image','movie','search','adult','games'
];

function getCommandsForCategory(categoryPath) {
    const names = [];
    try {
        const files = fs.readdirSync(categoryPath)
            .filter(f => f.endsWith('.js') && !f.includes('.test.') && !f.includes('.disabled.'))
            .sort();
        for (const file of files) {
            try {
                const mod = require(path.join(categoryPath, file));
                const raw = mod.default || mod;
                const list = Array.isArray(raw) ? raw : (raw && raw.name ? [raw] : []);
                for (const cmd of list) {
                    if (cmd && cmd.name) names.push(cmd.name);
                }
            } catch {}
        }
    } catch {}
    return names;
}

function getRamBar() {
    try {
        const total = os.totalmem();
        const free  = os.freemem();
        const used  = total - free;
        const pct   = Math.round((used / total) * 100);
        const filled = Math.round(pct / 10);
        const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
        return `[${bar}] ${pct}%`;
    } catch { return 'N/A'; }
}

function getCurrentTime() {
    try {
        return new Date().toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit',
            hour12: true,
            timeZone: cfg.TIME_ZONE || 'Africa/Nairobi'
        });
    } catch { return new Date().toLocaleTimeString(); }
}

module.exports = {
    name:        'menu',
    aliases:     ['help', 'cmds', 'commands', 'list'],
    description: 'Show all available bot commands',
    category:    'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId   = msg.key.remoteJid;
        const botName  = getBotName();
        const p        = prefix || cfg.PREFIX || '.';
        const owner    = cfg.OWNER_NAME  || 'TOOSII';
        const mode     = (cfg.MODE || 'public').charAt(0).toUpperCase() + (cfg.MODE || 'public').slice(1);

        // Collect and order categories
        const allCats = fs.readdirSync(CMDS_DIR).filter(item =>
            fs.statSync(path.join(CMDS_DIR, item)).isDirectory()
        );
        const ordered = [
            ...CATEGORY_ORDER.filter(c => allCats.includes(c)),
            ...allCats.filter(c => !CATEGORY_ORDER.includes(c)).sort()
        ];

        // Count total commands first (for header)
        let totalCmds = 0;
        const catData = [];
        for (const cat of ordered) {
            const cmdNames = getCommandsForCategory(path.join(CMDS_DIR, cat));
            if (cmdNames.length === 0) continue;
            totalCmds += cmdNames.length;
            catData.push({ cat, cmdNames });
        }

        const lines = [
            `╔═| ●-¤○《  ${botName}  》○¤-●`,
            `║`,
            `║  ▸ ■  *Prefix*    :  ${p}`,
            `║  ▸ ■  *Owner*     :  ${owner}`,
            `║  ▸ ■  *Mode*      :  🌐 ${mode}`,
            `║  ▸ ■  *Version*   :  ${BOT_VERSION}`,
            `║  ▸ ■  *Commands*  :  ${totalCmds}`,
            `║  ▸ ■  *RAM*       :  ${getRamBar()}`,
            `║  ▸ ■  *Time*      :  ${getCurrentTime()}`,
            `║`,
            `║  👨‍💻  *Creator*   »  @toosiitech`,
            `║  📢  *Channel*   »  https://whatsapp.com/channel/0029VbCGMJeEquiVSIthcK03`,
            `║`,
        ];

        for (const { cat, cmdNames } of catData) {
            const label = CATEGORY_LABELS[cat] || `📁 ${cat.toUpperCase()}`;
            lines.push(`╠═| ■-${label} -■`);
            for (const name of cmdNames) {
                lines.push(`║  ◇ ${p}${name}`);
            }
        }

        lines.push(`║`);
        lines.push(`╚═╝`);

        const newsletterJid = cfg.NEWSLETTER_JID || '';
        const msgOptions = { quoted: msg };

        if (newsletterJid) {
            msgOptions.contextInfo = {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid,
                    serverMessageId: -1,
                    newsletterName: botName,
                }
            };
        }

        await sock.sendMessage(chatId, { text: lines.join('\n') }, msgOptions);
    },
};
