const { keithGet } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

// ── Helpers ────────────────────────────────────────────────────────────────

function trunc(str, n = 80) {
    if (!str) return 'N/A';
    return String(str).length > n ? String(str).substring(0, n) + '…' : String(str);
}

function num(n) {
    if (n == null) return 'N/A';
    return Number(n).toLocaleString();
}

function fmtDate(d) {
    if (!d) return 'N/A';
    try { return new Date(d).toDateString(); } catch { return d; }
}

function wrap(title, icon, lines, extra) {
    const name = getBotName();
    let out = `╔═|〔  ${icon} ${title} 〕\n║\n`;
    out += lines.join('\n');
    if (extra) out += `\n║\n${extra}`;
    out += `\n║\n╚═|〔 ${name} 〕`;
    return out;
}

function errMsg(title, icon, reason) {
    const name = getBotName();
    return `╔═|〔  ${icon} ${title} 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${reason}\n║\n╚═|〔 ${name} 〕`;
}

// ── Commands ───────────────────────────────────────────────────────────────

// .ttstalk <username>
const tikTokCmd = {
    name: 'ttstalk',
    aliases: ['tikstalk', 'tiktokstalk', 'tiktok'],
    description: 'Stalk a TikTok profile — .ttstalk <username>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const user = args[0];
        if (!user) return sock.sendMessage(chatId, {
            text: errMsg('TIKTOK STALK', '🎵', `Usage: ${prefix}ttstalk <username>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🎵', key: msg.key } });
            const data = await keithGet('/stalker/tiktok', { user });
            if (!data.status || !data.result?.profile) throw new Error(data.error || 'User not found');
            const p = data.result.profile;
            const s = data.result.stats || {};
            await sock.sendMessage(chatId, {
                text: wrap('TIKTOK STALK', '🎵', [
                    `║ ▸ *Username*  : @${p.username || user}`,
                    `║ ▸ *Nickname*  : ${p.nickname || 'N/A'}`,
                    `║ ▸ *Bio*       : ${trunc(p.bio, 90)}`,
                    `║ ▸ *Verified*  : ${p.verified ? '✅ Yes' : '❌ No'} | *Private* : ${p.private ? '🔒 Yes' : '🌐 No'}`,
                    `║ ▸ *Followers* : ${num(s.followers)} | *Following* : ${num(s.following)}`,
                    `║ ▸ *Likes*     : ${num(s.likes)} | *Videos* : ${num(s.videos)} | *Friends* : ${num(s.friends)}`,
                    `║ ▸ *Joined*    : ${fmtDate(p.createdAt)}`,
                    `║ ▸ *Language*  : ${p.language || 'N/A'}`,
                    `║ ▸ *Avatar*    : ${p.avatars?.medium || p.avatars?.large || 'N/A'}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('TIKTOK STALK', '🎵', e.message)
            }, { quoted: msg });
        }
    }
};

// .igstalk <username>
const igCmd = {
    name: 'igstalk',
    aliases: ['instastalk', 'instagram', 'iginfo'],
    description: 'Stalk an Instagram profile — .igstalk <username>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const user = args[0];
        if (!user) return sock.sendMessage(chatId, {
            text: errMsg('INSTAGRAM STALK', '📸', `Usage: ${prefix}igstalk <username>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '📸', key: msg.key } });
            const data = await keithGet('/stalker/ig', { user });
            if (!data.status || !data.result?.profile) throw new Error(data.error || 'User not found');
            const p = data.result.profile;
            await sock.sendMessage(chatId, {
                text: wrap('INSTAGRAM STALK', '📸', [
                    `║ ▸ *Username*  : ${p.username || '@' + user}`,
                    `║ ▸ *Full Name* : ${p.fullName || 'N/A'}`,
                    `║ ▸ *Bio*       : ${trunc(p.biography, 100)}`,
                    `║ ▸ *Category*  : ${p.category || 'N/A'}`,
                    `║ ▸ *Type*      : ${p.accountType || 'N/A'}`,
                    `║ ▸ *Website*   : ${p.externalUrl || 'N/A'}`,
                    `║ ▸ *Profile*   : ${p.profileUrl || 'N/A'}`,
                    `║ ▸ *Avatar*    : ${p.avatars?.standard || 'N/A'}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('INSTAGRAM STALK', '📸', e.message)
            }, { quoted: msg });
        }
    }
};

// .ghtrend [language] [daily|weekly|monthly]
const ghTrendCmd = {
    name: 'ghtrend',
    aliases: ['gittrend', 'githubtrend', 'trending'],
    description: 'GitHub trending repos — .ghtrend [language] [daily|weekly|monthly]',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const PERIODS = new Set(['daily', 'weekly', 'monthly']);
        let language = 'all';
        let since = 'daily';

        for (const a of args) {
            if (PERIODS.has(a.toLowerCase())) since = a.toLowerCase();
            else if (a) language = a.toLowerCase();
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '📈', key: msg.key } });
            const data = await keithGet('/stalker/githubtrend', { language, since });
            if (!data.status) throw new Error(data.error || 'No trending data');
            const items = data.data || data.result?.data || [];
            if (!items.length) throw new Error('No repos found for that filter');

            const top = items.slice(0, 7);
            const label = `${language === 'all' ? 'All Languages' : language.toUpperCase()} · ${since}`;
            const list = top.map(r =>
                `║ ▸ [${r.rank}] *${trunc(r.title, 50)}*\n` +
                `║      ⭐ ${num(r.stars)} (+${num(r.starsToday)} today) | 🍴 ${num(r.forks)} | 💬 ${r.language || 'N/A'}\n` +
                `║      ${trunc(r.description, 65)}\n` +
                `║      🔗 ${r.url}`
            ).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: wrap(`GITHUB TRENDING · ${label}`, '📈', [list],
                    `║ 💡 Usage: ${prefix}ghtrend [language] [daily|weekly|monthly]`)
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('GITHUB TRENDING', '📈', e.message)
            }, { quoted: msg });
        }
    }
};

// .ytstalk <username>
const ytStalkCmd = {
    name: 'ytstalk',
    aliases: ['ytstalkch', 'ytchannel', 'ytchannelinfo'],
    description: 'Stalk a YouTube channel — .ytstalk <username or @handle>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const user = args.join(' ').trim();
        if (!user) return sock.sendMessage(chatId, {
            text: errMsg('YOUTUBE STALK', '▶️', `Usage: ${prefix}ytstalk <username>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '▶️', key: msg.key } });
            const data = await keithGet('/stalker/ytchannel', { user });
            if (!data.status || !data.result?.channel) throw new Error(data.error || 'Channel not found');
            const c = data.result.channel;
            await sock.sendMessage(chatId, {
                text: wrap('YOUTUBE CHANNEL STALK', '▶️', [
                    `║ ▸ *Name*      : ${c.name || 'N/A'}`,
                    `║ ▸ *Handle*    : ${c.username || 'N/A'}`,
                    `║ ▸ *Channel ID*: ${c.id || 'N/A'}`,
                    `║ ▸ *Country*   : ${c.country || 'N/A'}`,
                    `║ ▸ *Created*   : ${fmtDate(c.createdAt)}`,
                    `║ ▸ *About*     : ${trunc(c.description, 100)}`,
                    `║ ▸ *Avatar*    : ${c.avatar || 'N/A'}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('YOUTUBE STALK', '▶️', e.message)
            }, { quoted: msg });
        }
    }
};

// .wachstalk <channel-url>
const waChCmd = {
    name: 'wachstalk',
    aliases: ['wachannel', 'wachinfo', 'wach'],
    description: 'Stalk a WhatsApp channel — .wachstalk <channel-url>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const url = args[0];
        if (!url || !url.startsWith('http')) return sock.sendMessage(chatId, {
            text: errMsg('WA CHANNEL STALK', '📢', `Usage: ${prefix}wachstalk <whatsapp channel url>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '📢', key: msg.key } });
            const data = await keithGet('/stalker/wachannel2', { url });
            if (!data.status && !data.data) throw new Error(data.error || 'Channel not found');
            const d = data.data || data.result?.data || {};
            if (!d.title) throw new Error('No channel data returned');
            await sock.sendMessage(chatId, {
                text: wrap('WA CHANNEL STALK', '📢', [
                    `║ ▸ *Title*       : ${d.title || 'N/A'}`,
                    `║ ▸ *Followers*   : ${d.followers || num(d.followersCount)}`,
                    `║ ▸ *Description* : ${trunc(d.description, 100)}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('WA CHANNEL STALK', '📢', e.message)
            }, { quoted: msg });
        }
    }
};

// .countryinfo <country name or region>
const countryCmd = {
    name: 'countryinfo',
    aliases: ['country', 'countrydata', 'countrycheck'],
    description: 'Get info about any country — .countryinfo <country>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const region = args.join(' ').trim();
        if (!region) return sock.sendMessage(chatId, {
            text: errMsg('COUNTRY INFO', '🌍', `Usage: ${prefix}countryinfo <country name>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🌍', key: msg.key } });
            const data = await keithGet('/stalker/country', { region });
            if (!data.status || !data.result?.basicInfo) throw new Error(data.error || 'Country not found');
            const b = data.result.basicInfo;
            const g = data.result.geography || {};
            const c = data.result.culture || {};
            const gov = data.result.government || {};
            const iso = data.result.isoCodes || {};

            const continent = g.continent?.name || 'N/A';
            const emoji = g.continent?.emoji || '';
            const area = g.area ? `${num(g.area.sqKm)} km² / ${num(g.area.sqMiles)} mi²` : 'N/A';
            const neighbors = Array.isArray(g.neighbors) ? g.neighbors.map(n => n.name || n).slice(0, 5).join(', ') : 'N/A';
            const landlocked = g.landlocked != null ? (g.landlocked ? '🏔️ Yes' : '🌊 No') : 'N/A';
            const languages = Array.isArray(c.languages) ? c.languages.join(', ') : (c.languages || 'N/A');
            const religions = Array.isArray(c.religions) ? c.religions.slice(0,3).join(', ') : (c.religions || 'N/A');
            const govType = gov.type || gov.governmentType || 'N/A';
            const leader = gov.leader || gov.headOfState || 'N/A';

            await sock.sendMessage(chatId, {
                text: wrap('COUNTRY INFO', `🌍${emoji}`, [
                    `║ ▸ *Country*     : ${b.name} ${b.flag ? '🏳️' : ''}`,
                    `║ ▸ *Capital*     : ${b.capital || 'N/A'}`,
                    `║ ▸ *Continent*   : ${continent}`,
                    `║ ▸ *Area*        : ${area}`,
                    `║ ▸ *Landlocked*  : ${landlocked}`,
                    `║ ▸ *Neighbors*   : ${neighbors}`,
                    `║ ▸ *Phone Code*  : ${b.phoneCode || 'N/A'}`,
                    `║ ▸ *Internet TLD*: ${b.internetTLD || 'N/A'}`,
                    `║ ▸ *Languages*   : ${trunc(languages, 80)}`,
                    `║ ▸ *Religions*   : ${trunc(religions, 80)}`,
                    `║ ▸ *Gov Type*    : ${trunc(govType, 60)}`,
                    `║ ▸ *Leader*      : ${trunc(leader, 60)}`,
                    `║ ▸ *Maps*        : ${b.googleMaps || 'N/A'}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('COUNTRY INFO', '🌍', e.message)
            }, { quoted: msg });
        }
    }
};

// .npmstalk <package>
const npmCmd = {
    name: 'npmstalk',
    aliases: ['npminfo', 'npm', 'npmlookup'],
    description: 'Look up an NPM package — .npmstalk <package-name>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const q = args[0];
        if (!q) return sock.sendMessage(chatId, {
            text: errMsg('NPM STALK', '📦', `Usage: ${prefix}npmstalk <package-name>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '📦', key: msg.key } });
            const data = await keithGet('/stalker/npm', { q });
            if (!data.status || !data.result?.metadata) throw new Error(data.error || 'Package not found');
            const m = data.result.metadata;
            const versions = data.result.versions || [];
            const deps = data.result.dependencies || {};
            const maintainers = data.result.maintainers || [];
            const repo = data.result.repository || {};

            const latestVer = versions[0] || 'N/A';
            const depCount = Array.isArray(deps) ? deps.length : Object.keys(deps).length;
            const maintenrs = Array.isArray(maintainers) ? maintainers.slice(0, 3).join(', ') : 'N/A';
            const keywords = Array.isArray(m.keywords) ? m.keywords.slice(0, 6).join(', ') : (m.keywords || 'N/A');
            const repoUrl = repo.url || repo.link || '';

            await sock.sendMessage(chatId, {
                text: wrap('NPM PACKAGE', '📦', [
                    `║ ▸ *Name*        : ${m.name || q}`,
                    `║ ▸ *Description* : ${trunc(m.description, 90)}`,
                    `║ ▸ *License*     : ${m.license || 'N/A'}`,
                    `║ ▸ *Latest*      : v${latestVer}`,
                    `║ ▸ *Updated*     : ${fmtDate(m.lastUpdated)}`,
                    `║ ▸ *Dependencies*: ${depCount}`,
                    `║ ▸ *Maintainers* : ${trunc(maintenrs, 80)}`,
                    `║ ▸ *Keywords*    : ${trunc(keywords, 90)}`,
                    repoUrl ? `║ ▸ *Repo*        : ${repoUrl}` : null,
                ].filter(Boolean))
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('NPM STALK', '📦', e.message)
            }, { quoted: msg });
        }
    }
};

// .pinstalk <username>
const pinterestCmd = {
    name: 'pinstalk',
    aliases: ['pinterest', 'pininfo', 'pinterestlook'],
    description: 'Stalk a Pinterest profile — .pinstalk <username>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const q = args[0];
        if (!q) return sock.sendMessage(chatId, {
            text: errMsg('PINTEREST STALK', '📌', `Usage: ${prefix}pinstalk <username>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '📌', key: msg.key } });
            const data = await keithGet('/stalker/pinterest', { q });
            if (!data.status || !data.result?.data) throw new Error(data.error || 'User not found');
            const d = data.result.data;
            const s = d.stats || {};
            await sock.sendMessage(chatId, {
                text: wrap('PINTEREST STALK', '📌', [
                    `║ ▸ *Username*  : ${d.username || q}`,
                    `║ ▸ *Full Name* : ${d.full_name || 'N/A'}`,
                    `║ ▸ *Bio*       : ${trunc(d.bio, 100)}`,
                    `║ ▸ *Location*  : ${d.location || d.country || 'N/A'}`,
                    `║ ▸ *Verified*  : ${(d.is_verified === true || d.is_verified?.value === true) ? '✅ Yes' : '❌ No'}`,
                    `║ ▸ *Followers* : ${num(s.followers)}`,
                    `║ ▸ *Following* : ${num(s.following)}`,
                    `║ ▸ *Pins*      : ${num(s.pins)} | *Boards* : ${num(s.boards)}`,
                    `║ ▸ *Joined*    : ${fmtDate(d.created_at)}`,
                    `║ ▸ *Profile*   : ${d.profile_url || 'N/A'}`,
                    `║ ▸ *Avatar*    : ${d.image?.medium || d.image?.large || 'N/A'}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('PINTEREST STALK', '📌', e.message)
            }, { quoted: msg });
        }
    }
};

// .ghstalk <github-repo-url>
const ghRepoCmd = {
    name: 'ghstalk',
    aliases: ['gitrepo', 'ghrepo', 'githubstalk'],
    description: 'Stalk a GitHub repo — .ghstalk <github-url>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const url = args[0];
        if (!url || !url.startsWith('http')) return sock.sendMessage(chatId, {
            text: errMsg('GITHUB STALK', '🐙', `Usage: ${prefix}ghstalk <github repo url>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🐙', key: msg.key } });
            const data = await keithGet('/stalker/repostalk', { url });
            if (!data.status || !data.result) throw new Error(data.error || 'Repo not found or server busy — try again');
            const r = data.result;
            await sock.sendMessage(chatId, {
                text: wrap('GITHUB REPO STALK', '🐙', [
                    `║ ▸ *Name*        : ${r.name || r.fullName || 'N/A'}`,
                    `║ ▸ *Owner*       : ${r.owner || r.author || 'N/A'}`,
                    `║ ▸ *Description* : ${trunc(r.description, 90)}`,
                    `║ ▸ *Language*    : ${r.language || 'N/A'}`,
                    `║ ▸ *Stars*       : ⭐ ${num(r.stars || r.stargazers)}`,
                    `║ ▸ *Forks*       : 🍴 ${num(r.forks)}`,
                    `║ ▸ *Watchers*    : 👁️ ${num(r.watchers)}`,
                    `║ ▸ *Issues*      : ${num(r.openIssues || r.issues)}`,
                    `║ ▸ *License*     : ${r.license || 'N/A'}`,
                    `║ ▸ *Created*     : ${fmtDate(r.createdAt || r.created)}`,
                    `║ ▸ *Updated*     : ${fmtDate(r.updatedAt || r.updated)}`,
                    `║ ▸ *URL*         : ${url}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('GITHUB STALK', '🐙', e.message)
            }, { quoted: msg });
        }
    }
};

// .ipinfo <ip-address>
const ipCmd = {
    name: 'ipinfo',
    aliases: ['ipstalk', 'iplookup', 'iptrace'],
    description: 'Look up info on an IP address — .ipinfo <ip>',
    category: 'stalker',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const q = args[0];
        if (!q) return sock.sendMessage(chatId, {
            text: errMsg('IP INFO', '🔎', `Usage: ${prefix}ipinfo <ip-address>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🔎', key: msg.key } });
            const data = await keithGet('/stalker/ip', { q });
            if (!data.status || !data.result) throw new Error(data.error || 'IP not found or server busy — try again');
            const r = data.result;
            await sock.sendMessage(chatId, {
                text: wrap('IP INFO', '🔎', [
                    `║ ▸ *IP*          : ${r.ip || q}`,
                    `║ ▸ *City*        : ${r.city || 'N/A'}`,
                    `║ ▸ *Region*      : ${r.region || r.state || 'N/A'}`,
                    `║ ▸ *Country*     : ${r.country || r.countryName || 'N/A'}`,
                    `║ ▸ *Continent*   : ${r.continent || r.continentName || 'N/A'}`,
                    `║ ▸ *Latitude*    : ${r.lat || r.latitude || 'N/A'}`,
                    `║ ▸ *Longitude*   : ${r.lon || r.longitude || 'N/A'}`,
                    `║ ▸ *Timezone*    : ${r.timezone || r.tz || 'N/A'}`,
                    `║ ▸ *ISP*         : ${r.isp || r.org || 'N/A'}`,
                    `║ ▸ *ASN*         : ${r.asn || r.as || 'N/A'}`,
                    `║ ▸ *Proxy/VPN*   : ${r.proxy || r.vpn || r.isProxy ? '⚠️ Yes' : '✅ No'}`,
                    `║ ▸ *Hosting*     : ${r.hosting || r.datacenter ? '🖥️ Yes' : 'No'}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: errMsg('IP INFO', '🔎', e.message)
            }, { quoted: msg });
        }
    }
};

module.exports = [
    tikTokCmd, igCmd, ghTrendCmd, ytStalkCmd, waChCmd,
    countryCmd, npmCmd, pinterestCmd, ghRepoCmd, ipCmd
];
