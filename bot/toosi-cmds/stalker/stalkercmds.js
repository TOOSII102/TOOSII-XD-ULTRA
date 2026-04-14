'use strict';

const { getBotName } = require('../../lib/botname');

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

function wrap(title, icon, lines) {
    const name = getBotName();
    return `╔═|〔  ${icon} ${title} 〕\n║\n${lines.join('\n')}\n║\n╚═|〔 ${name} 〕`;
}

function errMsg(title, icon, reason) {
    const name = getBotName();
    return `╔═|〔  ${icon} ${title} 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${reason}\n║\n╚═|〔 ${name} 〕`;
}

async function ghFetch(path) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const headers = { 'User-Agent': 'ToosiiBot/1.0', Accept: 'application/vnd.github.v3+json' };
    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    if (token) headers['Authorization'] = `token ${token}`;
    try {
        const res = await fetch(`https://api.github.com${path}`, { signal: controller.signal, headers });
        if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
        return res.json();
    } finally { clearTimeout(timer); }
}

async function apiFetch(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
        const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'ToosiiBot/1.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } finally { clearTimeout(timer); }
}

// ── GitHub Trending (GitHub Search API — free) ────────────────────────────────
const ghTrendCmd = {
    name: 'ghtrend',
    aliases: ['gittrend', 'githubtrend', 'trending'],
    description: 'Get trending GitHub repositories',
    category: 'stalker',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const lang   = args[0] ? `+language:${encodeURIComponent(args[0])}` : '';
        try {
            await sock.sendMessage(chatId, { react: { text: '⭐', key: msg.key } });
            const data = await ghFetch(`/search/repositories?q=stars:>1000${lang}&sort=stars&order=desc&per_page=8`);
            if (!data.items?.length) throw new Error('No trending repos found');

            const list = data.items.slice(0, 8).map((r, i) => [
                `║ ▸ [${i + 1}] *${r.full_name}*`,
                `║      ⭐ ${num(r.stargazers_count)} stars | 🍴 ${num(r.forks_count)} forks | ${r.language || 'N/A'}`,
                `║      📝 ${trunc(r.description, 70)}`,
                `║      🔗 ${r.html_url}`,
            ].join('\n')).join('\n║\n');

            const langLabel = args[0] ? ` · ${args[0]}` : '';
            await sock.sendMessage(chatId, {
                text: wrap(`GITHUB TRENDING${langLabel}`, '⭐', [list])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: errMsg('GITHUB TRENDING', '⭐', e.message) }, { quoted: msg });
        }
    }
};

// ── GitHub Repo Stalk (GitHub API — free) ─────────────────────────────────────
const ghStalkCmd = {
    name: 'ghstalk',
    aliases: ['gitrepo', 'ghrepo', 'githubstalk'],
    description: 'Get info about a GitHub repo — .ghstalk <user/repo>',
    category: 'stalker',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        // Accept full GitHub URLs or user/repo shorthand
        const raw = args.join('').trim();
        const urlMatch = raw.match(/github\.com\/([^/?#]+\/[^/?#]+)/i);
        const input = urlMatch ? urlMatch[1].replace(/\.git$/, '') : raw;

        if (!input || !input.includes('/')) return sock.sendMessage(chatId, {
            text: errMsg('GITHUB STALK', '🐙', `Usage: ${prefix}ghstalk <user/repo> or full GitHub URL`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🐙', key: msg.key } });
            const repo = await ghFetch(`/repos/${input}`);
            if (!repo?.full_name) throw new Error('Repo not found');

            await sock.sendMessage(chatId, {
                text: wrap('GITHUB REPO', '🐙', [
                    `║ ▸ *Repo*        : ${repo.full_name}`,
                    `║ ▸ *Description* : ${trunc(repo.description, 80)}`,
                    `║ ▸ *Language*    : ${repo.language || 'N/A'}`,
                    `║ ▸ *Stars*       : ⭐ ${num(repo.stargazers_count)}`,
                    `║ ▸ *Forks*       : 🍴 ${num(repo.forks_count)}`,
                    `║ ▸ *Watchers*    : 👁️ ${num(repo.watchers_count)}`,
                    `║ ▸ *Issues*      : 🐛 ${num(repo.open_issues_count)} open`,
                    `║ ▸ *License*     : ${repo.license?.name || 'None'}`,
                    `║ ▸ *Created*     : ${fmtDate(repo.created_at)}`,
                    `║ ▸ *Updated*     : ${fmtDate(repo.updated_at)}`,
                    `║ ▸ *Topics*      : ${(repo.topics || []).slice(0, 5).join(', ') || 'N/A'}`,
                    `║ ▸ 🔗 ${repo.html_url}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: errMsg('GITHUB STALK', '🐙', e.message) }, { quoted: msg });
        }
    }
};

// ── Country Info (restcountries.com — free, no key) ───────────────────────────
const countryCmd = {
    name: 'countryinfo',
    aliases: ['country', 'countrydata', 'countrycheck'],
    description: 'Get information about any country',
    category: 'stalker',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const region = args.join(' ').trim();
        if (!region) return sock.sendMessage(chatId, {
            text: errMsg('COUNTRY INFO', '🌍', `Usage: ${prefix}countryinfo <country name>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🌍', key: msg.key } });
            const data = await apiFetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(region)}?fullText=false`);
            if (!Array.isArray(data) || !data.length) throw new Error('Country not found');
            const c = data[0];

            const capital    = (c.capital || ['N/A']).join(', ');
            const currencies = Object.values(c.currencies || {}).map(x => `${x.name} (${x.symbol || '?'})`).join(', ') || 'N/A';
            const languages  = Object.values(c.languages || {}).slice(0, 3).join(', ') || 'N/A';
            const region2    = [c.region, c.subregion].filter(Boolean).join(' › ');
            const borders    = (c.borders || []).slice(0, 5).join(', ') || 'None';

            await sock.sendMessage(chatId, {
                text: wrap('COUNTRY INFO', '🌍', [
                    `║ ▸ *Country*     : ${c.name?.common} ${c.flag || ''}`,
                    `║ ▸ *Official*    : ${c.name?.official}`,
                    `║ ▸ *Capital*     : ${capital}`,
                    `║ ▸ *Region*      : ${region2}`,
                    `║ ▸ *Population*  : ${num(c.population)}`,
                    `║ ▸ *Area*        : ${num(c.area)} km²`,
                    `║ ▸ *Currencies*  : ${currencies}`,
                    `║ ▸ *Languages*   : ${languages}`,
                    `║ ▸ *Borders*     : ${borders}`,
                    `║ ▸ *Calling*     : ${(c.idd?.root || '') + (c.idd?.suffixes?.[0] || '')}`,
                    `║ ▸ *TLD*         : ${(c.tld || []).join(', ') || 'N/A'}`,
                    `║ ▸ *UN Member*   : ${c.unMember ? 'Yes' : 'No'}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: errMsg('COUNTRY INFO', '🌍', e.message) }, { quoted: msg });
        }
    }
};

// ── NPM Package Info (registry.npmjs.org — free) ─────────────────────────────
const npmStalkCmd = {
    name: 'npmstalk',
    aliases: ['npminfo', 'npm', 'npmlookup'],
    description: 'Look up an NPM package — .npmstalk <package>',
    category: 'stalker',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const q      = args.join(' ').trim().toLowerCase();
        if (!q) return sock.sendMessage(chatId, {
            text: errMsg('NPM STALK', '📦', `Usage: ${prefix}npmstalk <package-name>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '📦', key: msg.key } });
            const data = await apiFetch(`https://registry.npmjs.org/${encodeURIComponent(q)}`);
            if (!data?.name) throw new Error('Package not found');

            const latest  = data['dist-tags']?.latest || 'N/A';
            const ver     = data.versions?.[latest] || {};
            const deps    = Object.keys(ver.dependencies || {}).length;
            const devDeps = Object.keys(ver.devDependencies || {}).length;

            await sock.sendMessage(chatId, {
                text: wrap('NPM STALK', '📦', [
                    `║ ▸ *Name*        : ${data.name}`,
                    `║ ▸ *Version*     : ${latest}`,
                    `║ ▸ *Description* : ${trunc(data.description, 80)}`,
                    `║ ▸ *Author*      : ${typeof data.author === 'string' ? data.author : data.author?.name || 'N/A'}`,
                    `║ ▸ *License*     : ${ver.license || data.license || 'N/A'}`,
                    `║ ▸ *Homepage*    : ${ver.homepage || data.homepage || 'N/A'}`,
                    `║ ▸ *Keywords*    : ${(data.keywords || []).slice(0, 5).join(', ') || 'N/A'}`,
                    `║ ▸ *Deps*        : ${deps} dependencies | ${devDeps} devDeps`,
                    `║ ▸ *Published*   : ${fmtDate(data.time?.[latest])}`,
                    `║ ▸ 🔗 https://npmjs.com/package/${data.name}`,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: errMsg('NPM STALK', '📦', e.message) }, { quoted: msg });
        }
    }
};

module.exports = [ghTrendCmd, ghStalkCmd, countryCmd, npmStalkCmd];
