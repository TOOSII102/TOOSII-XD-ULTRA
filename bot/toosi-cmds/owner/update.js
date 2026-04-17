'use strict';
    const { execSync } = require('child_process');
    const https = require('https');
    const http  = require('http');
    const fs    = require('fs');
    const path  = require('path');
    const { getBotName } = require('../../lib/botname');

    const REPO   = 'TOOSII102/toosii-xd-ultra';
    const BRANCH = 'main';

    const IS_HEROKU = !!(process.env.DYNO || process.env.HEROKU_APP_NAME);
    const IS_PANEL  = !!(process.env.PTERODACTYL_SERVER_UUID || process.env.P_SERVER_UUID ||
                         process.env.BOT_PLATFORM_PANEL || process.env.PANEL_HOST);
    const PLATFORM      = IS_HEROKU ? 'Heroku' : IS_PANEL ? 'Panel' : 'VPS';
    const PLATFORM_ICON = IS_HEROKU ? '☁️'     : IS_PANEL ? '🖥️'   : '💻';

    // ── Session backup helpers ────────────────────────────────────────────────
    const SESSION_DIR  = './session';
    const CREDS_FILE   = path.join(SESSION_DIR, 'creds.json');
    const BACKUP_DIR   = './data';
    const BACKUP_CREDS = path.join(BACKUP_DIR, 'session_creds_backup.json');

    function backupSession() {
        try {
            if (fs.existsSync(CREDS_FILE)) {
                if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
                fs.copyFileSync(CREDS_FILE, BACKUP_CREDS);
                return true;
            }
        } catch {}
        return false;
    }

    function restoreSession() {
        try {
            if (fs.existsSync(BACKUP_CREDS)) {
                if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });
                fs.copyFileSync(BACKUP_CREDS, CREDS_FILE);
                return true;
            }
        } catch {}
        return false;
    }

    function run(cmd, opts = {}) {
        return execSync(cmd, { encoding: 'utf8', timeout: 120000, stdio: 'pipe', ...opts }).trim();
    }
    function hasGit() {
        try { run('git rev-parse --git-dir'); return true; } catch { return false; }
    }
    function getCurrentCommit() {
        try { return run('git rev-parse HEAD'); } catch { return null; }
    }

    function getLatestCommit() {
        return new Promise((resolve, reject) => {
            const token   = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
            const headers = { 'User-Agent': 'toosii-xd-bot', 'Accept': 'application/vnd.github.v3+json' };
            if (token) headers['Authorization'] = 'token ' + token;

            const url = `https://api.github.com/repos/${REPO}/commits/${BRANCH}`;
            https.get(url, { headers }, res => {
                let body = '';
                res.on('data', d => body += d);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(body);
                        if (json.sha) {
                            resolve({ sha: json.sha, message: json.commit?.message?.split('\n')[0] || '' });
                        } else if (json.message) {
                            reject(new Error('GitHub: ' + json.message.slice(0, 120)));
                        } else {
                            reject(new Error('Unexpected response (HTTP ' + res.statusCode + ')'));
                        }
                    } catch {
                        reject(new Error('Could not parse GitHub response (HTTP ' + res.statusCode + ', ' + body.length + 'b)'));
                    }
                });
            }).on('error', err => reject(new Error('Network error: ' + err.message)));
        });
    }

    function downloadFile(url, dest) {
        return new Promise((resolve, reject) => {
            const follow = (u, hops) => {
                if (hops > 10) return reject(new Error('Too many redirects'));
                const lib = u.startsWith('https') ? https : http;
                lib.get(u, { headers: { 'User-Agent': 'toosii-xd-bot' } }, res => {
                    if ([301,302,307,308].includes(res.statusCode))
                        return res.destroy(), follow(res.headers.location, hops + 1);
                    if (res.statusCode !== 200)
                        return res.destroy(), reject(new Error('HTTP ' + res.statusCode));
                    const stream = fs.createWriteStream(dest);
                    res.pipe(stream);
                    stream.on('finish', () => stream.close(resolve));
                    stream.on('error', err => { fs.unlink(dest, () => {}); reject(err); });
                }).on('error', reject);
            };
            follow(url, 0);
        });
    }

    module.exports = {
        name: 'update',
        aliases: ['upd', 'upgrade'],
        description: 'Pull latest updates from GitHub and restart the bot',
        category: 'owner',
        ownerOnly: true,
        async execute(sock, msg, args, prefix, opts) {
            const jid      = msg.key.remoteJid;
            const botName  = getBotName();
            const header   = '╔═|〔  UPDATE 〕';
            const footer   = `╚═|〔 ${botName} 〕`;

            if (!opts?.isOwner && !opts?.isSudoer)
                return sock.sendMessage(jid, { text: header + '\n║\n║  ⚠️ Owner only command\n║\n' + footer }, { quoted: msg });

            try { await sock.sendMessage(jid, { react: { text: '🔄', key: msg.key } }); } catch {}

            // ── Fetch latest commit ───────────────────────────────────────────
            let latest;
            try {
                latest = await getLatestCommit();
            } catch (err) {
                return sock.sendMessage(jid, { text: [
                    header, '║',
                    '║  ❌ Could not reach GitHub',
                    '║  ' + err.message,
                    '║', footer
                ].join('\n') }, { quoted: msg });
            }

            const latestShort = latest.sha?.slice(0, 7) || 'unknown';

            // ── Heroku: show manual redeploy instructions ─────────────────────
            if (IS_HEROKU) {
                return sock.sendMessage(jid, { text: [
                    header, '║',
                    '║  ▸ *Platform* : ' + PLATFORM_ICON + ' ' + PLATFORM,
                    '║  ▸ *Status*   : ℹ️ Heroku detected',
                    '║',
                    '║  Heroku auto-deploys from GitHub.',
                    '║  To update, push new code to GitHub',
                    '║  and Heroku will redeploy automatically.',
                    '║',
                    '║  ▸ *Latest commit* : ' + latestShort,
                    '║  ▸ *Message*       : ' + latest.message,
                    '║',
                    '║  Or trigger manually in Heroku dashboard:',
                    '║  Deploy → Manual deploy → Deploy branch',
                    '║', footer
                ].join('\n') }, { quoted: msg });
            }

            // ── Backup session before ANYTHING else ──────────────────────────
            const sessionBacked = backupSession();

            // ── Git-based update ──────────────────────────────────────────────
            if (hasGit()) {
                const current      = getCurrentCommit();
                const currentShort = current?.slice(0, 7) || 'unknown';

                if (current && latest.sha && current === latest.sha) {
                    return sock.sendMessage(jid, { text: [
                        header, '║',
                        '║  ▸ *Status*   : ✅ Already up to date',
                        '║  ▸ *Platform* : ' + PLATFORM_ICON + ' ' + PLATFORM,
                        '║  ▸ *Commit*   : ' + currentShort,
                        '║  ▸ *Message*  : ' + latest.message,
                        '║', footer
                    ].join('\n') }, { quoted: msg });
                }

                let pullErr, npmFailed;
                try {
                    run('git fetch origin ' + BRANCH);
                    run('git reset --hard origin/' + BRANCH);
                } catch (e) { pullErr = e.message?.slice(0, 100); }

                if (pullErr) {
                    return sock.sendMessage(jid, { text: [
                        header, '║',
                        '║  ▸ *Status*   : ❌ Pull failed',
                        '║  ▸ *Platform* : ' + PLATFORM_ICON + ' ' + PLATFORM,
                        '║  ▸ *Error*    : ' + pullErr,
                        '║', footer
                    ].join('\n') }, { quoted: msg });
                }

                // Restore session immediately after git reset (before npm or exit)
                restoreSession();

                try { run('npm install --omit=dev --no-audit', { cwd: process.cwd() }); } catch { npmFailed = true; }

                await sock.sendMessage(jid, { text: [
                    header, '║',
                    '║  ▸ *Status*   : ✅ Updated via git',
                    '║  ▸ *Platform* : ' + PLATFORM_ICON + ' ' + PLATFORM,
                    '║  ▸ *From*     : ' + currentShort,
                    '║  ▸ *To*       : ' + latestShort,
                    '║  ▸ *Message*  : ' + latest.message,
                    '║  ▸ *Deps*     : ' + (npmFailed ? '⚠️ npm had warnings' : '✅ OK'),
                    '║  ▸ *Session*  : ' + (sessionBacked ? '✅ Protected' : '⚠️ No session to protect'),
                    '║', footer
                ].join('\n') }, { quoted: msg });

                setTimeout(() => process.exit(1), 2000);
                return;
            }

            // ── Tarball download (no git) ─────────────────────────────────────
            const tarUrl  = `https://api.github.com/repos/${REPO}/tarball/${BRANCH}`;
            const tarPath = '/tmp/toosii-update.tar.gz';
            const tmpDir  = '/tmp/toosii-update-extract';

            let dlErr;
            try {
                await downloadFile(tarUrl, tarPath);
                run(`rm -rf ${tmpDir} && mkdir -p ${tmpDir}`);
                run(`tar xzf ${tarPath} -C ${tmpDir} --strip-components=1`);
                // Node.js copy — rsync not available on all panels
                (function copyDir(src, dst) {
                    const nodePath = require('path'), nodefs = require('fs');
                    const SKIP = new Set(['session', 'session_backup', 'data', '.env', 'node_modules', '.git']);
                    nodefs.mkdirSync(dst, { recursive: true });
                    for (const item of nodefs.readdirSync(src)) {
                        if (SKIP.has(item)) continue;
                        const s = nodePath.join(src, item), d = nodePath.join(dst, item);
                        if (nodefs.statSync(s).isDirectory()) copyDir(s, d);
                        else nodefs.copyFileSync(s, d);
                    }
                })(tmpDir, process.cwd());
                // Restore session immediately after file copy (extra safety)
                restoreSession();
                run('npm install --omit=dev --no-audit', { cwd: process.cwd() });
                run(`rm -rf ${tarPath} ${tmpDir}`);
            } catch (e) { dlErr = e.message?.slice(0, 120); }

            if (dlErr) {
                return sock.sendMessage(jid, { text: [
                    header, '║',
                    '║  ▸ *Status*   : ❌ Download failed',
                    '║  ▸ *Platform* : ' + PLATFORM_ICON + ' ' + PLATFORM,
                    '║  ▸ *Error*    : ' + dlErr,
                    '║', footer
                ].join('\n') }, { quoted: msg });
            }

            await sock.sendMessage(jid, { text: [
                header, '║',
                '║  ▸ *Status*   : ✅ Updated via download',
                '║  ▸ *Platform* : ' + PLATFORM_ICON + ' ' + PLATFORM,
                '║  ▸ *To*       : ' + latestShort,
                '║  ▸ *Message*  : ' + latest.message,
                '║  ▸ *Session*  : ' + (sessionBacked ? '✅ Protected' : '⚠️ No session to protect'),
                '║', footer
            ].join('\n') }, { quoted: msg });

            setTimeout(() => process.exit(1), 2000);
        }
    };
  