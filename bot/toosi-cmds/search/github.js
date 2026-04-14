'use strict';

  const { getBotName } = require('../../lib/botname');

  const GH_API = 'https://api.github.com';

  // Accept: "user/repo", "https://github.com/user/repo", "@user", full profile URLs
  function parseGHRepo(args) {
      const raw = args.join(' ').replace(/\s+/g, '').trim();
      const urlMatch = raw.match(/github\.com\/([^/?#]+\/[^/?#]+)/i);
      if (urlMatch) return urlMatch[1].replace(/\.git$/, '');
      if (raw.includes('/')) return raw.replace(/\.git$/, '');
      return raw;
  }

  function parseGHUser(args) {
      const raw = args.join(' ').trim();
      const urlMatch = raw.match(/github\.com\/([^/?#]+)/i);
      if (urlMatch) return urlMatch[1];
      return raw.replace(/^@/, '');
  }

  async function ghFetch(path) {
      const headers = {
          'User-Agent': 'ToosiiBot/1.0',
          'Accept': 'application/vnd.github.v3+json',
      };
      const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
      if (token) headers['Authorization'] = `token ${token}`;

      const res = await fetch(`${GH_API}${path}`, { signal: AbortSignal.timeout(12000), headers });
      if (res.status === 404) throw new Error('Not found');
      if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
      return res.json();
  }

  function num(n) {
      if (n === null || n === undefined) return '0';
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
      return String(n);
  }

  function age(dateStr) {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      const now = new Date();
      const days = Math.floor((now - d) / 86400000);
      if (days === 0)  return 'today';
      if (days === 1)  return 'yesterday';
      if (days < 30)   return `${days}d ago`;
      if (days < 365)  return `${Math.floor(days / 30)}mo ago`;
      return `${Math.floor(days / 365)}yr ago`;
  }

  function starBar(stars) {
      const maxStars = 5;
      const filled = Math.min(Math.round((stars / Math.max(stars, 100)) * maxStars), maxStars);
      return '⭐'.repeat(filled) + '✩'.repeat(maxStars - filled);
  }

  module.exports = [
      {
          name: 'github',
          aliases: ['gh', 'ghuser', 'gituser', 'gitprofile'],
          description: 'Lookup a GitHub user profile — .github <username>',
          category: 'search',

          async execute(sock, msg, args, prefix) {
              const chatId = msg.key.remoteJid;
              const name   = getBotName();
              try { await sock.sendMessage(chatId, { react: { text: '🐙', key: msg.key } }); } catch {}

              const username = parseGHUser(args);
              if (!username) {
                  return sock.sendMessage(chatId, {
                      text: [
                          `╔═|〔  GITHUB 🐙 〕`,
                          `║`,
                          `║ ▸ *Usage*   : ${prefix}github <username>`,
                          `║ ▸ *Example* : ${prefix}github TOOSII102`,
                          `║`,
                          `║ ▸ *Repo*    : ${prefix}ghrepo <user/repo>`,
                          `║ ▸ *Example* : ${prefix}ghrepo TOOSII102/toosii-xd-ultra`,
                          `║`,
                          `╚═╝`,
                      ].join('\n')
                  }, { quoted: msg });
              }

              try {
                  const u = await ghFetch(`/users/${username}`);

                  const lines = [
                      `╔═|〔  GITHUB PROFILE 🐙 〕`,
                      `║`,
                      `║ ▸ *Name*      : ${u.name || u.login}`,
                      `║ ▸ *Username*  : @${u.login}`,
                      u.bio      ? `║ ▸ *Bio*       : ${u.bio.slice(0, 80)}` : null,
                      u.company  ? `║ ▸ *Company*   : ${u.company}` : null,
                      u.location ? `║ ▸ *Location*  : ${u.location}` : null,
                      `║`,
                      `║ ▸ *Repos*     : ${num(u.public_repos)}`,
                      `║ ▸ *Followers* : ${num(u.followers)}`,
                      `║ ▸ *Following* : ${num(u.following)}`,
                      `║ ▸ *Gists*     : ${num(u.public_gists)}`,
                      `║`,
                      `║ ▸ *Joined*    : ${age(u.created_at)}`,
                      u.blog     ? `║ ▸ *Website*   : ${u.blog}` : null,
                      `║ ▸ *Profile*   : github.com/${u.login}`,
                      `║`,
                      `╚═╝`,
                  ].filter(Boolean).join('\n');

                  if (u.avatar_url) {
                      try {
                          const imgRes = await fetch(u.avatar_url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0' } });
                          if (imgRes.ok) {
                              const buf = Buffer.from(await imgRes.arrayBuffer());
                              return sock.sendMessage(chatId, { image: buf, caption: lines }, { quoted: msg });
                          }
                      } catch {}
                  }

                  await sock.sendMessage(chatId, { text: lines }, { quoted: msg });

              } catch (e) {
                  await sock.sendMessage(chatId, {
                      text: `╔═|〔  GITHUB 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═╝`
                  }, { quoted: msg });
              }
          }
      },

      {
          name: 'ghrepo',
          aliases: ['gitrepo', 'repo', 'githubr', 'repoinfo'],
          description: 'Lookup a GitHub repo — .ghrepo <user/repo>',
          category: 'search',

          async execute(sock, msg, args, prefix) {
              const chatId = msg.key.remoteJid;
              const name   = getBotName();
              try { await sock.sendMessage(chatId, { react: { text: '📦', key: msg.key } }); } catch {}

              const query = parseGHRepo(args);
              if (!query || !query.includes('/')) {
                  return sock.sendMessage(chatId, {
                      text: [
                          `╔═|〔  GITHUB REPO 📦 〕`,
                          `║`,
                          `║ ▸ *Usage*      : ${prefix}ghrepo <user/repo>`,
                          `║ ▸ *Example*    : ${prefix}ghrepo TOOSII102/toosii-xd-ultra`,
                          `║ ▸ *Also works* : ${prefix}ghrepo https://github.com/user/repo`,
                          `║`,
                          `╚═╝`,
                      ].join('\n')
                  }, { quoted: msg });
              }

              try {
                  const r = await ghFetch(`/repos/${query}`);

                  const stars  = r.stargazers_count || 0;
                  const forks  = r.forks_count      || 0;
                  const bar    = starBar(stars);

                  const topicsLine = r.topics?.length
                      ? `║ ▸ *Topics*    : ${r.topics.slice(0, 5).join(' · ')}`
                      : null;

                  const lines = [
                      `╔═|〔  GITHUB REPO 📦 〕`,
                      `║`,
                      `║  📌 *${r.full_name}*`,
                      r.description ? `║  📝 ${r.description.slice(0, 70)}` : null,
                      r.language    ? `║  💻 ${r.language}` : null,
                      `║`,
                      `║  ⭐ *${num(stars)}* stars  ·  🍴 *${num(forks)}* forks  ·  👀 ${num(r.watchers_count)}`,
                      `║  🐛 ${num(r.open_issues_count)} issues  ·  🔄 Updated ${age(r.updated_at)}`,
                      `║`,
                      `║  💛 *Love it? Drop a ⭐ and 🍴 fork it!*`,
                      `║  👉 ${r.html_url}`,
                      `║`,
                      `╚═╝`,
                  ].filter(Boolean).join('\n');

                  await sock.sendMessage(chatId, { text: lines }, { quoted: msg });

              } catch (e) {
                  await sock.sendMessage(chatId, {
                      text: `╔═|〔  GITHUB REPO 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═╝`
                  }, { quoted: msg });
              }
          }
      }
  ];
  