'use strict';

const { getBotName } = require('../../lib/botname');
const { casperGet, keithGet } = require('../../lib/keithapi');

const CASPER_SPORTS = '/api/sports';
const LEAGUES = ['premier-league','la-liga','serie-a','bundesliga','ligue-1','champions-league','europa-league','championship'];

async function casperSports(params = {}) {
    return casperGet(CASPER_SPORTS, params, 15000);
}

function trunc(s, n = 70) {
    if (!s) return 'N/A';
    return String(s).length > n ? String(s).substring(0, n) + '…' : String(s);
}

function fmtDate(d) {
    if (!d) return 'N/A';
    try { return new Date(d).toDateString(); } catch { return String(d); }
}

function box(title, icon, lines) {
    const name = getBotName();
    return `╔═|〔  ${icon} ${title} 〕\n║\n` + lines.filter(Boolean).join('\n') + `\n║\n╚═|〔 ${name} 〕`;
}

function err(title, icon, reason) {
    const name = getBotName();
    return `╔═|〔  ${icon} ${title} 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${reason}\n║\n╚═|〔 ${name} 〕`;
}

async function sdbFetch(path) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3${path}`, {
            signal: controller.signal, headers: { 'User-Agent': 'ToosiiBot/1.0' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } finally { clearTimeout(timer); }
}

// ── Player Search (TheSportsDB — free) ───────────────────────────────────────
const playerSearchCmd = {
    name: 'playersearch',
    aliases: ['player', 'findplayer', 'playerinfo', 'pinfo'],
    description: 'Search for a sports player — .playersearch <name>',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const query  = args.join(' ').trim();
        if (!query) return sock.sendMessage(chatId, {
            text: err('PLAYER SEARCH', '⚽', `Usage: ${prefix}playersearch <player name>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '⚽', key: msg.key } });
            const data = await sdbFetch(`/searchplayers.php?p=${encodeURIComponent(query)}`);
            const list = data.player || [];
            if (!list.length) throw new Error('No players found');

            const top = list.slice(0, 5).map((p, i) => [
                `║ ▸ [${i + 1}] *${p.strPlayer}*  (${p.strTeam || 'N/A'})`,
                `║      🏅 ${p.strPosition || 'N/A'} | 🌍 ${p.strNationality || 'N/A'} | 🎂 ${fmtDate(p.dateBorn)}`,
                `║      🏆 ${p.strSport || 'Soccer'} | #${p.strNumber || 'N/A'}`,
            ].join('\n')).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: box(`PLAYER SEARCH · ${query}`, '⚽', [top])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('PLAYER SEARCH', '⚽', e.message) }, { quoted: msg });
        }
    }
};

// ── Team Search (TheSportsDB — free) ─────────────────────────────────────────
const teamSearchCmd = {
    name: 'teamsearch',
    aliases: ['team', 'findteam', 'clubinfo', 'club'],
    description: 'Search for a sports team/club — .teamsearch <name>',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const query  = args.join(' ').trim();
        if (!query) return sock.sendMessage(chatId, {
            text: err('TEAM SEARCH', '🛡️', `Usage: ${prefix}teamsearch <team name>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🛡️', key: msg.key } });
            const data = await sdbFetch(`/searchteams.php?t=${encodeURIComponent(query)}`);
            const teams = data.teams || [];
            if (!teams.length) throw new Error('No teams found');
            const t = teams[0];
            const others = teams.slice(1, 4).map(x => x.strTeam).join(', ');

            await sock.sendMessage(chatId, {
                text: box(`TEAM INFO · ${t.strTeam}`, '🛡️', [
                    `║ ▸ *Name*      : ${t.strTeam}`,
                    `║ ▸ *Short*     : ${t.strTeamShort || t.strTeamAlternate || 'N/A'}`,
                    `║ ▸ *Sport*     : ${t.strSport || 'Soccer'}`,
                    `║ ▸ *League*    : ${t.strLeague || 'N/A'}`,
                    `║ ▸ *Country*   : ${t.strCountry || 'N/A'}`,
                    `║ ▸ *Stadium*   : ${t.strStadium || 'N/A'} (${t.intStadiumCapacity ? Number(t.intStadiumCapacity).toLocaleString() + ' cap' : 'N/A'})`,
                    `║ ▸ *Founded*   : ${t.intFormedYear || 'N/A'}`,
                    `║ ▸ *Colors*    : ${t.strKitColour1 || 'N/A'}`,
                    `║ ▸ *About*     : ${trunc(t.strDescriptionEN, 100)}`,
                    others ? `║\n║ 🔍 Also found: ${others}` : null,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('TEAM SEARCH', '🛡️', e.message) }, { quoted: msg });
        }
    }
};

// ── Venue Search (TheSportsDB — free) ────────────────────────────────────────
const venueSearchCmd = {
    name: 'venuesearch',
    aliases: ['venue', 'stadium', 'findvenue', 'arena'],
    description: 'Search for a sports venue/stadium — .venuesearch <name>',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const query  = args.join(' ').trim();
        if (!query) return sock.sendMessage(chatId, {
            text: err('VENUE SEARCH', '🏟️', `Usage: ${prefix}venuesearch <stadium name>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🏟️', key: msg.key } });
            const data = await sdbFetch(`/searchvenues.php?e=${encodeURIComponent(query)}`);
            const venues = data.venues || [];
            if (!venues.length) throw new Error('No venues found');

            const top = venues.slice(0, 4).map((v, i) => [
                `║ ▸ [${i + 1}] *${v.strVenue}*`,
                `║      📍 ${v.strLocation || 'N/A'}, ${v.strCountry || 'N/A'}`,
                `║      👥 Capacity: ${v.intCapacity ? Number(v.intCapacity).toLocaleString() : 'N/A'} | 🏆 ${v.strSport || 'N/A'}`,
                v.strDescriptionEN ? `║      ${trunc(v.strDescriptionEN, 60)}` : null,
            ].filter(Boolean).join('\n')).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: box(`VENUE SEARCH · ${query}`, '🏟️', [top])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('VENUE SEARCH', '🏟️', e.message) }, { quoted: msg });
        }
    }
};

// ── Event Search / H2H (TheSportsDB — free) ───────────────────────────────────
const gameEventsCmd = {
    name: 'h2h',
    aliases: ['gameevents', 'matchhistory', 'headtohead', 'versus'],
    description: 'Head-to-head / event search — .h2h <Team A> vs <Team B>',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const query  = args.join(' ').trim();
        if (!query) return sock.sendMessage(chatId, {
            text: err('H2H SEARCH', '⚔️', `Usage: ${prefix}h2h <Team A> vs <Team B>`)
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '⚔️', key: msg.key } });
            const search = query.replace(/\s+vs\s+/i, ' ');
            const data   = await sdbFetch(`/searchevents.php?e=${encodeURIComponent(search)}`);
            const events = data.event || [];
            if (!events.length) throw new Error('No match history found');

            const sorted = events.slice(0, 8);
            const list = sorted.map((m, i) => [
                `║ ▸ [${i + 1}] *${m.strEvent}*`,
                `║      📅 ${m.dateEvent || 'N/A'} | Status: ${m.strStatus || 'N/A'}`,
                `║      🏟️ ${m.strVenue || 'N/A'}`,
                m.strLeague ? `║      🏆 ${m.strLeague} — Season ${m.strSeason || 'N/A'}` : null,
                (m.intHomeScore != null && m.intAwayScore != null)
                    ? `║      📊 Score: ${m.intHomeScore} — ${m.intAwayScore}` : null,
            ].filter(Boolean).join('\n')).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: box(`H2H · ${query}`, '⚔️', [
                    `║ 📊 *${events.length} events found* (showing ${sorted.length})`,
                    '║',
                    list,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('H2H SEARCH', '⚔️', e.message) }, { quoted: msg });
        }
    }
};

// ── Live Scores / Matches (Casper) ───────────────────────────────────────────
const liveScoresCmd = {
    name: 'livescores',
    aliases: ['scores', 'footballscores', 'smatches', 'footballmatches'],
    description: 'Live football scores & fixtures — .livescores [competition]',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const filter = args.join(' ').trim().toLowerCase();
        try {
            await sock.sendMessage(chatId, { react: { text: '⚽', key: msg.key } });
            const data = await casperSports({ action: 'matches', limit: 50 });
            if (!data.success) throw new Error(data.message || 'API error');
            let matches = data.matches || [];
            if (filter) matches = matches.filter(m =>
                m.competition?.name?.toLowerCase().includes(filter) ||
                m.competition?.short?.toLowerCase().includes(filter) ||
                m.homeTeam?.toLowerCase().includes(filter) ||
                m.awayTeam?.toLowerCase().includes(filter)
            );
            if (!matches.length) throw new Error(filter ? `No matches found for "${filter}"` : 'No matches available');

            const live    = matches.filter(m => m.status?.isLive);
            const results = matches.filter(m => m.status?.isResult);
            const fixtures = matches.filter(m => m.status?.isFixture);

            const fmtMatch = (m) => {
                const score = m.status?.isLive || m.status?.isResult
                    ? `*${m.score?.home ?? '-'} - ${m.score?.away ?? '-'}*`
                    : m.startTime || 'TBA';
                const badge = m.status?.isLive ? '🔴 LIVE' : m.status?.isResult ? '✅' : '🕐';
                return `║ ${badge} *${m.homeTeam}* vs *${m.awayTeam}* — ${score}\n║      🏆 ${m.competition?.short || m.competition?.name || 'N/A'} | 📅 ${m.startDate || 'N/A'}`;
            };

            const sections = [];
            if (live.length) {
                sections.push(`║ 🔴 *LIVE MATCHES (${live.length})*`, '║', ...live.slice(0,5).map(fmtMatch));
            }
            if (results.length) {
                sections.push('║', `║ ✅ *RESULTS (${results.length})*`, '║', ...results.slice(0,5).map(fmtMatch));
            }
            if (fixtures.length) {
                sections.push('║', `║ 🕐 *UPCOMING (${fixtures.length})*`, '║', ...fixtures.slice(0,6).map(fmtMatch));
            }
            sections.push('║', `║ 📊 Total: ${matches.length} matches`);
            if (filter) sections.push(`║ 🔍 Filter: "${filter}"`);

            await sock.sendMessage(chatId, {
                text: box('FOOTBALL SCORES', '⚽', sections)
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('LIVE SCORES', '⚽', e.message) }, { quoted: msg });
        }
    }
};

// ── Sports News (Casper) ─────────────────────────────────────────────────────
const sportsNewsCmd = {
    name: 'sportsnews',
    aliases: ['snews', 'sportnews', 'footballnews', 'fnews'],
    description: 'Latest sports news headlines — .sportsnews',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        try {
            await sock.sendMessage(chatId, { react: { text: '📰', key: msg.key } });
            const data = await casperSports({ action: 'news' });
            if (!data.success) throw new Error(data.message || 'API error');
            const articles = data.articles || [];
            if (!articles.length) throw new Error('No news articles found');

            const lines = articles.slice(0, 10).map((a, i) =>
                `║ *${i + 1}.* ${trunc(a.title, 80)}\n║      🔗 ${trunc(a.url, 60)}`
            ).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: box('SPORTS NEWS', '📰', [
                    `║ 📊 *${articles.length} articles*`,
                    '║',
                    lines,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('SPORTS NEWS', '📰', e.message) }, { quoted: msg });
        }
    }
};

// ── Team News (Casper) ───────────────────────────────────────────────────────
const teamNewsCmd = {
    name: 'teamnews',
    aliases: ['clubnews', 'tnews', 'squadnews'],
    description: 'News for a football team — .teamnews <team>  e.g. .teamnews arsenal',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const team = args.join(' ').trim().toLowerCase().replace(/\s+/g, '-');
        if (!team) return sock.sendMessage(chatId, {
            text: err('TEAM NEWS', '🗞️', `Usage: ${prefix}teamnews <team>\nE.g: ${prefix}teamnews arsenal`)
        }, { quoted: msg });
        try {
            await sock.sendMessage(chatId, { react: { text: '🗞️', key: msg.key } });
            const data = await casperSports({ action: 'teamnews', team });
            if (!data.success) {
                const teams = (data.availableTeams || []).slice(0,20).map(t => t.slug).join(', ');
                throw new Error(`${data.message || 'Unknown team'}\n*Available:* ${teams}…`);
            }
            const articles = data.articles || [];
            if (!articles.length) throw new Error('No news found for this team');
            const teamName = data.team?.name || team;

            const lines = articles.slice(0, 10).map((a, i) =>
                `║ *${i + 1}.* ${trunc(a.title, 80)}\n║      🔗 ${trunc(a.url, 60)}`
            ).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: box(`${teamName} NEWS`, '🗞️', [
                    `║ 📊 *${articles.length} articles*`,
                    '║',
                    lines,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('TEAM NEWS', '🗞️', e.message) }, { quoted: msg });
        }
    }
};

// ── Fixtures (Casper) ────────────────────────────────────────────────────────
const fixturesCmd = {
    name: 'fixtures',
    aliases: ['schedule', 'fixtureslist', 'upcoming', 'matchschedule'],
    description: 'Football fixtures for a league — .fixtures <league>\nLeagues: premier-league, la-liga, serie-a, bundesliga, ligue-1, champions-league, europa-league, championship',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const league = args.join(' ').trim().toLowerCase().replace(/\s+/g, '-') || 'premier-league';
        if (!LEAGUES.includes(league)) {
            return sock.sendMessage(chatId, {
                text: err('FIXTURES', '📅', `Invalid league.\n*Available leagues:*\n${LEAGUES.map(l=>`• ${l}`).join('\n')}`)
            }, { quoted: msg });
        }
        try {
            await sock.sendMessage(chatId, { react: { text: '📅', key: msg.key } });
            const data = await casperSports({ action: 'fixtures', league, type: 'upcoming' });
            if (!data.success) throw new Error(data.message || 'API error');
            const matches = data.matches || [];
            if (!matches.length) throw new Error(`No upcoming fixtures for *${league}*`);

            const lines = matches.slice(0, 10).map((m, i) =>
                `║ *${i+1}.* *${m.homeTeam}* vs *${m.awayTeam}*\n║      📅 ${m.startDate || 'N/A'} at ${m.startTime || 'TBA'}`
            ).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: box(`FIXTURES · ${league.toUpperCase()}`, '📅', [
                    `║ 📊 *${matches.length} matches* (showing ${Math.min(matches.length,10)})`,
                    '║',
                    lines,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('FIXTURES', '📅', e.message) }, { quoted: msg });
        }
    }
};

// ── Top Scorers (Casper) ─────────────────────────────────────────────────────
const topScorersCmd = {
    name: 'topscorers',
    aliases: ['scorers', 'goldenboot', 'topscorerlist'],
    description: 'Top goal scorers for a league — .topscorers <league>',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const league = args.join(' ').trim().toLowerCase().replace(/\s+/g, '-') || 'premier-league';
        if (!LEAGUES.includes(league)) {
            return sock.sendMessage(chatId, {
                text: err('TOP SCORERS', '🥅', `Invalid league.\n*Available leagues:*\n${LEAGUES.map(l=>`• ${l}`).join('\n')}`)
            }, { quoted: msg });
        }
        try {
            await sock.sendMessage(chatId, { react: { text: '🥅', key: msg.key } });
            const data = await casperSports({ action: 'topscorers', slug: league });
            if (!data.success) throw new Error(data.message || 'API error');
            const scorers = data.topScorers || [];
            if (!scorers.length) throw new Error(`No scorer data available for *${league}* yet`);

            const lines = scorers.slice(0, 10).map((s, i) => {
                const name  = s.name || s.player || s.playerName || 'Unknown';
                const goals = s.goals ?? s.goal ?? '?';
                const club  = s.team || s.club || '';
                return `║ *${i+1}.* ${name}${club ? ` (${club})` : ''} — ⚽ ${goals} goals`;
            }).join('\n');

            await sock.sendMessage(chatId, {
                text: box(`TOP SCORERS · ${league.toUpperCase()}`, '🥅', [
                    `║ 📊 *${scorers.length} scorers*`,
                    '║',
                    lines,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('TOP SCORERS', '🥅', e.message) }, { quoted: msg });
        }
    }
};

// ── Keith: Live Scores ───────────────────────────────────────────────────────
const keithLiveCmd = {
    name: 'klivescores',
    aliases: ['klive', 'footballresults', 'allscores', 'kscores'],
    description: 'Football live scores & results (189+ games) — .klivescores [team name]',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const filter = args.join(' ').trim().toLowerCase();
        try {
            await sock.sendMessage(chatId, { react: { text: '⚽', key: msg.key } });
            const data = await keithGet('/livescore');
            if (!data.status) throw new Error(data.error || 'API returned no data');
            let games = Object.values(data.result?.games || {});
            if (!games.length) throw new Error('No match data available right now');
            if (filter) games = games.filter(g =>
                g.p1?.toLowerCase().includes(filter) || g.p2?.toLowerCase().includes(filter)
            );
            if (!games.length) throw new Error(`No matches found for "${filter}"`);

            const live    = games.filter(g => g.R?.st && g.R.st !== 'FT' && g.R.st !== 'NS' && g.R.st !== '-');
            const ft      = games.filter(g => g.R?.st === 'FT');
            const ns      = games.filter(g => !g.R?.st || g.R.st === 'NS' || g.R.st === '-');

            const fmtGame = (g) => {
                const st = g.R?.st || 'NS';
                const s1 = g.R?.r1 ?? '-';
                const s2 = g.R?.r2 ?? '-';
                const badge = st === 'FT' ? '✅' : st === 'HT' ? '⏸' : (st !== 'NS' && st !== '-') ? '🔴' : '🕐';
                const score = (st !== 'NS' && st !== '-') ? `${s1} - ${s2}` : g.tm || 'TBA';
                return `║ ${badge} *${g.p1}* vs *${g.p2}* — ${score} [${st}]`;
            };

            const sections = [];
            if (live.length) {
                sections.push(`║ 🔴 *LIVE (${live.length})*`, '║', ...live.slice(0,6).map(fmtGame));
            }
            if (ft.length) {
                sections.push('║', `║ ✅ *FULL TIME (${ft.length})*`, '║', ...ft.slice(0,8).map(fmtGame));
            }
            if (ns.length && !filter) {
                sections.push('║', `║ 🕐 *UPCOMING (${ns.length})*`, '║', ...ns.slice(0,5).map(fmtGame));
            }
            sections.push('║', `║ 📊 Total: ${games.length} matches`);

            await sock.sendMessage(chatId, {
                text: box('FOOTBALL SCORES', '⚽', sections)
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('LIVE SCORES', '⚽', e.message) }, { quoted: msg });
        }
    }
};

// ── Keith: Bet Predictions ───────────────────────────────────────────────────
const betPredCmd = {
    name: 'betpredictions',
    aliases: ['bettips', 'surebets', 'oddtips', 'footballodds', 'betodd'],
    description: 'Today\'s football bet predictions & odds — .betpredictions',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        try {
            await sock.sendMessage(chatId, { react: { text: '🎯', key: msg.key } });
            const data = await keithGet('/bet');
            if (!data.status) throw new Error(data.error || 'No bet data available');
            const tips = data.result || [];
            if (!tips.length) throw new Error('No bet predictions available today');

            const lines = tips.map((t, i) => {
                const ft  = t.predictions?.fulltime;
                const o25 = t.predictions?.over_2_5;
                const btts = t.predictions?.bothTeamToScore;
                const time = t.time ? new Date(t.time).toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit'}) : 'TBA';
                return [
                    `║ *${i+1}.* ⚽ *${t.match}*`,
                    `║      🏆 ${t.league} | 🕐 ${time}`,
                    ft  ? `║      📊 FT: H ${ft.home?.toFixed(0)}% | D ${ft.draw?.toFixed(0)}% | A ${ft.away?.toFixed(0)}%` : null,
                    o25 ? `║      📈 Over 2.5: Yes ${o25.yes?.toFixed(0)}% | No ${o25.no?.toFixed(0)}%` : null,
                    btts? `║      ⚡ BTTS: Yes ${btts.yes?.toFixed(0)}%` : null,
                    t.predictions?.value_bets ? `║      💎 Value Bet: YES` : null,
                ].filter(Boolean).join('\n');
            }).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: box('BET PREDICTIONS', '🎯', [
                    `║ 📊 *${tips.length} matches today*`,
                    '║',
                    lines,
                    '║',
                    '║ ⚠️ _Bet responsibly — 18+ only_',
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('BET PREDICTIONS', '🎯', e.message) }, { quoted: msg });
        }
    }
};

// ── Keith: Football News ─────────────────────────────────────────────────────
const keithNewsCmd = {
    name: 'kfootballnews',
    aliases: ['kfnews', 'footballnews2', 'fnews2', 'latestfootball'],
    description: 'Latest football news — .kfootballnews',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        try {
            await sock.sendMessage(chatId, { react: { text: '📰', key: msg.key } });
            const data = await keithGet('/football/news');
            if (!data.status) throw new Error(data.error || 'News unavailable');
            const items = data.result?.data?.items || data.result?.data?.list || [];
            if (!items.length) throw new Error('No football news found');

            const lines = items.slice(0, 10).map((a, i) => {
                const summary = a.summary ? `\n║      📝 ${trunc(a.summary, 90)}` : '';
                return `║ *${i+1}.* ${trunc(a.title, 80)}${summary}`;
            }).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: box('FOOTBALL NEWS', '📰', [
                    `║ 📊 *${items.length} articles*`,
                    '║',
                    lines,
                ])
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('FOOTBALL NEWS', '📰', e.message) }, { quoted: msg });
        }
    }
};

// ── Keith: League (matches / standings / scorers / upcoming) ─────────────────
const KEITH_LEAGUES = {
    epl: 'Premier League', bundesliga: 'Bundesliga',
    laliga: 'La Liga', ucl: 'Champions League',
    euros: 'Euros', fifa: 'FIFA'
};

const leagueCmd = {
    name: 'league',
    aliases: ['lstat', 'leagueinfo', 'leaguestats'],
    description: 'League stats — .league <epl|bundesliga|laliga|ucl> <matches|standings|scorers|upcoming>\nE.g: .league epl standings',
    category: 'sports',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const leagueKey = (args[0] || '').toLowerCase();
        const action    = (args[1] || 'matches').toLowerCase();

        if (!KEITH_LEAGUES[leagueKey]) {
            return sock.sendMessage(chatId, {
                text: err('LEAGUE', '🏆', `Invalid league.\n*Available:* ${Object.keys(KEITH_LEAGUES).join(', ')}\n*Actions:* matches, standings, scorers, upcoming\n*E.g:* ${prefix}league epl standings`)
            }, { quoted: msg });
        }
        const actionMap = { matches: 'matches', standings: 'standings', scorers: 'scorers', upcoming: 'upcomingmatches', table: 'standings', goals: 'scorers' };
        const ep = actionMap[action] || 'matches';

        try {
            await sock.sendMessage(chatId, { react: { text: '🏆', key: msg.key } });
            const data = await keithGet(`/${leagueKey}/${ep}`);
            if (!data.status) throw new Error(data.error || `No ${action} data for ${leagueKey} right now`);
            const comp = KEITH_LEAGUES[leagueKey];

            if (ep === 'standings') {
                const rows = data.result?.standings || [];
                if (!rows.length) throw new Error(`No standings data for ${comp}`);
                const lines = rows.slice(0,15).map(s =>
                    `║ *${s.position}.* ${trunc(s.team||s.name,20).padEnd(20)} | P${s.played??'-'} W${s.won??'-'} D${s.drawn??'-'} L${s.lost??'-'} | *${s.points??'-'} pts*`
                ).join('\n');
                await sock.sendMessage(chatId, { text: box(`${comp} STANDINGS`, '🏆', ['║', lines]) }, { quoted: msg });

            } else if (ep === 'scorers') {
                const rows = data.result?.topScorers || [];
                if (!rows.length) throw new Error(`No scorer data for ${comp}`);
                const lines = rows.slice(0,10).map(s =>
                    `║ *${s.rank||s.position||'?'}.* ${s.name||s.player||'?'} (${s.team||s.club||'?'}) — ⚽ ${s.goals??'?'} goals`
                ).join('\n');
                await sock.sendMessage(chatId, { text: box(`${comp} TOP SCORERS`, '🥅', ['║', lines]) }, { quoted: msg });

            } else {
                const rows = data.result?.matches || data.result?.upcomingMatches || [];
                if (!rows.length) throw new Error(`No match data for ${comp}`);
                const lines = rows.slice(0,10).map((m, i) => {
                    const home = m.homeTeam || m.home || m.p1 || '?';
                    const away = m.awayTeam || m.away || m.p2 || '?';
                    const date = m.date || m.matchdate || m.dt || '';
                    const time = m.time || m.startTime || m.tm || '';
                    const score = (m.homeScore != null && m.awayScore != null) ? `${m.homeScore}-${m.awayScore}` : (m.score || `${time}`);
                    return `║ *${i+1}.* *${home}* vs *${away}* — ${score}\n║      📅 ${date} ${time}`.trim();
                }).join('\n║\n');
                await sock.sendMessage(chatId, { text: box(`${comp} ${ep.toUpperCase()}`, '🏆', ['║', lines]) }, { quoted: msg });
            }
        } catch (e) {
            await sock.sendMessage(chatId, { text: err('LEAGUE', '🏆', e.message) }, { quoted: msg });
        }
    }
};

module.exports = [playerSearchCmd, teamSearchCmd, venueSearchCmd, gameEventsCmd,
    liveScoresCmd, sportsNewsCmd, teamNewsCmd, fixturesCmd, topScorersCmd,
    keithLiveCmd, betPredCmd, keithNewsCmd, leagueCmd];
