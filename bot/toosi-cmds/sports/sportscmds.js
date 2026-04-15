'use strict';
  const BASE = 'https://www.thesportsdb.com/api/v1/json/3';

  async function fetchJson(url) {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
  }

  function flag(country) {
      if (!country) return '';
      try {
          return country.toUpperCase().replace(/./g, c =>
              String.fromCodePoint(0x1F1E6 - 65 + c.codePointAt(0)));
      } catch { return ''; }
  }

  const playerSearch = {
      name: 'playersearch', aliases: ['player','findplayer','playerinfo'],
      description: 'Search for a sports player profile',
      category: 'sports',
      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;
          if (!args.length)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  PLAYER SEARCH 〕\n║\n║ ▸ Usage: ${prefix}playersearch <name>\n║\n╚═╝`
              }, { quoted: msg });

          const query = args.join(' ');
          try {
              const data = await fetchJson(`${BASE}/searchplayers.php?p=${encodeURIComponent(query)}`);
              const p = data?.player?.[0];
              if (!p) return sock.sendMessage(chatId, {
                  text: `╔═|〔  PLAYER SEARCH 〕\n║\n║ ▸ ❌ No player found for "${query}"\n║\n╚═╝`
              }, { quoted: msg });

              const text = [
                  `╔═|〔  PLAYER INFO 〕`,`║`,
                  `║ ▸ *Name*      : ${p.strPlayer || '-'}`,
                  `║ ▸ *Sport*     : ${p.strSport || '-'}`,
                  `║ ▸ *Team*      : ${p.strTeam || '-'}`,
                  `║ ▸ *Nationality*: ${p.strNationality || '-'} ${flag(p.strNationality)}`,
                  `║ ▸ *Position*  : ${p.strPosition || '-'}`,
                  `║ ▸ *Height*    : ${p.strHeight || '-'}`,
                  `║ ▸ *Weight*    : ${p.strWeight || '-'}`,
                  `║ ▸ *Born*      : ${p.dateBorn || '-'}`,
                  `║ ▸ *Status*    : ${p.strStatus || '-'}`,
                  `║`,`╚═╝`
              ].join('\n');

              if (p.strThumb) {
                  const img = await fetch(p.strThumb, { signal: AbortSignal.timeout(10000) })
                      .then(r => r.ok ? r.arrayBuffer() : null).catch(() => null);
                  if (img) return sock.sendMessage(chatId, { image: Buffer.from(img), caption: text }, { quoted: msg });
              }
              return sock.sendMessage(chatId, { text }, { quoted: msg });
          } catch {
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  PLAYER SEARCH 〕\n║\n║ ▸ ❌ Search failed. Try again\n║\n╚═╝`
              }, { quoted: msg });
          }
      }
  };

  const teamSearch = {
      name: 'teamsearch', aliases: ['team','findteam','teaminfo','club'],
      description: 'Search for a sports team/club profile',
      category: 'sports',
      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;
          if (!args.length)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  TEAM SEARCH 〕\n║\n║ ▸ Usage: ${prefix}teamsearch <name>\n║\n╚═╝`
              }, { quoted: msg });

          const query = args.join(' ');
          try {
              const data = await fetchJson(`${BASE}/searchteams.php?t=${encodeURIComponent(query)}`);
              const t = data?.teams?.[0];
              if (!t) return sock.sendMessage(chatId, {
                  text: `╔═|〔  TEAM SEARCH 〕\n║\n║ ▸ ❌ No team found for "${query}"\n║\n╚═╝`
              }, { quoted: msg });

              const text = [
                  `╔═|〔  TEAM INFO 〕`,`║`,
                  `║ ▸ *Team*      : ${t.strTeam || '-'}`,
                  `║ ▸ *Sport*     : ${t.strSport || '-'}`,
                  `║ ▸ *League*    : ${t.strLeague || '-'}`,
                  `║ ▸ *Country*   : ${t.strCountry || '-'}`,
                  `║ ▸ *Stadium*   : ${t.strStadium || '-'}`,
                  `║ ▸ *Capacity*  : ${t.intStadiumCapacity || '-'}`,
                  `║ ▸ *Founded*   : ${t.intFormedYear || '-'}`,
                  `║ ▸ *Website*   : ${t.strWebsite ? 'https://' + t.strWebsite : '-'}`,
                  `║`,`╚═╝`
              ].join('\n');

              if (t.strBadge || t.strLogo) {
                  const imgUrl = t.strBadge || t.strLogo;
                  const img = await fetch(imgUrl, { signal: AbortSignal.timeout(10000) })
                      .then(r => r.ok ? r.arrayBuffer() : null).catch(() => null);
                  if (img) return sock.sendMessage(chatId, { image: Buffer.from(img), caption: text }, { quoted: msg });
              }
              return sock.sendMessage(chatId, { text }, { quoted: msg });
          } catch {
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  TEAM SEARCH 〕\n║\n║ ▸ ❌ Search failed. Try again\n║\n╚═╝`
              }, { quoted: msg });
          }
      }
  };

  module.exports = [playerSearch, teamSearch];