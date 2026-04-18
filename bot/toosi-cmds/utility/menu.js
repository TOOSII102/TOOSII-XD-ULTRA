'use strict';
const path = require('path');
const fs   = require('fs');
const os   = require('os');
const { getBotName } = require('../../lib/botname');
const cfg  = require('../../config');

const CMDS_DIR  = path.join(__dirname, '..');
const LOGO_PATH = path.join(__dirname, '../../../assets/xd-logo.jpg');

const CHANNEL_URL = 'https://whatsapp.com/channel/0029VbCGMJeEquiVSIthcK03';

let BOT_VERSION = 'v1.2.0';
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
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

const CATEGORY_ORDER = [
    'utility','owner','ai','group','automation','channel',
    'download','education','spiritual','fun','sports',
    'news','stalker','image','movie','search','adult','games'
];

// Read commands from the bot's live registry (populated at startup).
// Falls back to reading files if registry isn't ready yet.
function getCategoryData() {
    const liveRegistry = globalThis._botCommandCategories;

    if (liveRegistry && liveRegistry.size > 0) {
        // Use authoritative loaded-command registry
        const allCats = [...liveRegistry.keys()];
        const ordered = [
            ...CATEGORY_ORDER.filter(c => allCats.includes(c)),
            ...allCats.filter(c => !CATEGORY_ORDER.includes(c)).sort()
        ];
        const catData = [];
        let totalCmds = 0;
        for (const cat of ordered) {
            // commandCategories stores all names including aliases — deduplicate by
            // cross-checking with the commands Map (which holds canonical names only once)
            const cmdNames = [...new Set((liveRegistry.get(cat) || []))];
            if (cmdNames.length === 0) continue;
            totalCmds += cmdNames.length;
            catData.push({ cat, cmdNames });
        }
        return { catData, totalCmds };
    }

    // Fallback: read files from disk
    const allCats = fs.readdirSync(CMDS_DIR).filter(item =>
        fs.statSync(path.join(CMDS_DIR, item)).isDirectory()
    );
    const ordered = [
        ...CATEGORY_ORDER.filter(c => allCats.includes(c)),
        ...allCats.filter(c => !CATEGORY_ORDER.includes(c)).sort()
    ];
    let totalCmds = 0;
    const catData = [];
    for (const cat of ordered) {
        const names = [];
        try {
            const files = fs.readdirSync(path.join(CMDS_DIR, cat))
                .filter(f => f.endsWith('.js') && !f.includes('.test.') && !f.includes('.disabled.'))
                .sort();
            for (const file of files) {
                try {
                    const mod = require(path.join(CMDS_DIR, cat, file));
                    const raw = mod.default || mod;
                    const list = Array.isArray(raw) ? raw : (raw && raw.name ? [raw] : []);
                    for (const cmd of list) {
                        if (cmd && cmd.name) names.push(cmd.name);
                    }
                } catch {}
            }
        } catch {}
        if (names.length === 0) continue;
        totalCmds += names.length;
        catData.push({ cat, cmdNames: names });
    }
    return { catData, totalCmds };
}

function getPlatform() {
    if (process.env.DYNO) return 'Heroku';
    if (process.env.RAILWAY_ENVIRONMENT) return 'Railway';
    if (process.env.RENDER) return 'Render';
    return 'VPS';
}

function getUptime() {
    const s = Math.floor(process.uptime());
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
}

function getUsage() {
    try {
        const used  = process.memoryUsage().rss / 1024 / 1024;
        const total = os.totalmem() / 1024 / 1024 / 1024;
        return `${used.toFixed(1)} MB of ${total.toFixed(2)} GB`;
    } catch { return 'N/A'; }
}

function getSpeed(msg) {
    try {
        if (msg._botReceivedAt) return `${Date.now() - msg._botReceivedAt}ms`;
    } catch {}
    return 'N/A';
}

module.exports = {
    name:        'menu',
    aliases:     ['help', 'cmds', 'commands', 'list'],
    description: 'Show all available bot commands',
    category:    'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();
        const p       = prefix || cfg.PREFIX || '.';
        const owner   = cfg.OWNER_NUMBER ? `+${cfg.OWNER_NUMBER}` : (cfg.OWNER_NAME || 'TOOSII');
        const mode    = (cfg.MODE || 'public').charAt(0).toUpperCase() + (cfg.MODE || 'public').slice(1);

        const { catData, totalCmds } = getCategoryData();

        const lines = [
            `╔═| ●-¤○《  ${botName}  》○¤-●`,
            `║`,
            `║  ▸ ■  *Prefix*    :  ${p}`,
            `║  ▸ ■  *Owner*     :  ${owner}`,
            `║  ▸ ■  *Mode*      :  🌐 ${mode}`,
            `║  ▸ ■  *Version*   :  ${BOT_VERSION}`,
            `║  ▸ ■  *Platform*  :  ${getPlatform()}`,
            `║  ▸ ■  *Speed*     :  ${getSpeed(msg)}`,
            `║  ▸ ■  *Uptime*    :  ${getUptime()}`,
            `║  ▸ ■  *Commands*  :  ${totalCmds}`,
            `║  ▸ ■  *Usage*     :  ${getUsage()}`,
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

        const caption = lines.join('\n');

        const newsletterJid = cfg.NEWSLETTER_JID || '';
        const msgOptions = { quoted: msg };

        // Build contextInfo: newsletter attribution + View Channel button at bottom
        msgOptions.contextInfo = {
            ...(newsletterJid ? {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid,
                    serverMessageId: -1,
                    newsletterName: botName,
                }
            } : {}),
            externalAdReply: {
                title: botName,
                body: '📢 View Channel',
                sourceUrl: CHANNEL_URL,
                mediaType: 1,
                renderLargerThumbnail: false,
                showAdAttribution: true,
            }
        };

        // Send as image with caption (XD logo), fall back to text only
        try {
            const img = fs.readFileSync(LOGO_PATH);
            await sock.sendMessage(chatId, {
                image: img,
                caption,
                mimetype: 'image/jpeg',
            }, msgOptions);
        } catch {
            await sock.sendMessage(chatId, { text: caption }, msgOptions);
        }
    },
};
