'use strict';
// ─────────────────────────────────────────────────────────────
//  Dice Game — multi-player dice rolling, 3 rounds, highest total wins
// ─────────────────────────────────────────────────────────────

const diceGames = new Map(); // chatId → gameState
const MAX_PLAYERS = 6;
const MAX_ROUNDS  = 3;

const DICE_FACES = ['', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

function getSender(msg)  {
      // In groups msg.key.participant holds the real sender JID (phone or LID)
      return msg.key.participant || msg.key.remoteJid;
  }
function shortNum(jid)   {
      // Strip device suffix (:12 in LID format) and domain before extracting digits
      // LID example : 123456789012345678:12@lid  →  123456789012345678  →  last 6: 345678
      // Phone example: 254706441840@s.whatsapp.net →  254706441840        →  last 6: 441840
      const clean = (jid || '').split('@')[0].split(':')[0];
      return clean.replace(/[^0-9]/g, '').slice(-6) || '??????';
  }

function rollDie() { return Math.floor(Math.random() * 6) + 1; }

module.exports = [
    {
        name: 'dice',
        aliases: ['startdice', 'dicegame'],
        description: 'Start a Dice Game in the group',
        category: 'games',
        async execute(sock, msg, args, prefix, ctx) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            if (!chatId.endsWith('@g.us'))
                return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Group only command\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });

            try { await sock.sendMessage(chatId, { react: { text: '🎲', key: msg.key } }); } catch {}

            if (diceGames.has(chatId))
                return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ A game already exists\n║ ▸ Use *${prefix}diceend* to end it\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });

            const sender = getSender(msg);
            diceGames.set(chatId, {
                host: sender,
                players: [sender],
                scores: { [sender]: 0 },
                rollsThisRound: {},
                round: 1,
                started: false,
                timeout: setTimeout(() => {
                    diceGames.delete(chatId);
                    sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Game expired (idle)\n║\n╚═|〔 ${name} 〕` }).catch(() => {});
                }, 10 * 60 * 1000),
            });

            await sock.sendMessage(chatId, {
                text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ 🎲 @${shortNum(sender)} started a Dice Game!\n║\n║ ▸ Type *${prefix}dicejoin* to join\n║ ▸ Host: *${prefix}dicebegin* to start\n║ ▸ Rules: 3 rounds, highest total wins\n║\n╚═|〔 ${name} 〕`,
                mentions: [sender],
            }, { quoted: msg });
        }
    },

    {
        name: 'dicejoin',
        aliases: ['joindice'],
        description: 'Join a waiting Dice Game',
        category: 'games',
        async execute(sock, msg, args, prefix, ctx) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const sender = getSender(msg);
            const g = diceGames.get(chatId);

            if (!g) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ No game waiting. Use *${prefix}dice*\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (g.started) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Game already started!\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (g.players.includes(sender)) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ You already joined!\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (g.players.length >= MAX_PLAYERS) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Game is full (${MAX_PLAYERS} players max)\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });

            g.players.push(sender);
            g.scores[sender] = 0;

            await sock.sendMessage(chatId, {
                text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ @${shortNum(sender)} joined! (${g.players.length}/${MAX_PLAYERS})\n║\n║ ▸ Players: ${g.players.map(p => `@${shortNum(p)}`).join(', ')}\n║\n╚═|〔 ${name} 〕`,
                mentions: g.players,
            }, { quoted: msg });
        }
    },

    {
        name: 'dicebegin',
        aliases: ['begindice', 'startroll'],
        description: 'Start the Dice Game (host only)',
        category: 'games',
        async execute(sock, msg, args, prefix, ctx) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const sender = getSender(msg);
            const g = diceGames.get(chatId);

            if (!g) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ No game found. Use *${prefix}dice*\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (g.started) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Already started!\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (sender !== g.host) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Only the host can start\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (g.players.length < 2) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Need at least 2 players\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });

            g.started = true;
            g.rollsThisRound = {};

            await sock.sendMessage(chatId, {
                text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ 🎲 Game started! Round 1 of ${MAX_ROUNDS}\n║\n║ ▸ Players: ${g.players.map(p => `@${shortNum(p)}`).join(', ')}\n║\n║ ▸ Everyone type *${prefix}roll* to roll!\n║\n╚═|〔 ${name} 〕`,
                mentions: g.players,
            }, { quoted: msg });
        }
    },

    {
        name: 'roll',
        aliases: ['rolldice', 'throwdice'],
        description: 'Roll the dice in an active Dice Game',
        category: 'games',
        async execute(sock, msg, args, prefix, ctx) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const sender = getSender(msg);
            const g = diceGames.get(chatId);

            if (!g || !g.started) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ No active game. Use *${prefix}dice*\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (!g.players.includes(sender)) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ You're not in this game\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (g.rollsThisRound[sender] !== undefined) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ You already rolled this round!\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });

            const die = rollDie();
            g.rollsThisRound[sender] = die;
            g.scores[sender] += die;

            await sock.sendMessage(chatId, {
                text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ @${shortNum(sender)} rolled ${DICE_FACES[die]} (${die})\n║ ▸ Total score: ${g.scores[sender]}\n║\n╚═|〔 ${name} 〕`,
                mentions: [sender],
            }, { quoted: msg });

            const rolled = Object.keys(g.rollsThisRound).length;
            if (rolled < g.players.length) return;

            // End of round
            const roundSummary = g.players.map(p => `║  @${shortNum(p)} — Round: ${DICE_FACES[g.rollsThisRound[p]]} | Total: ${g.scores[p]}`).join('\n');

            if (g.round >= MAX_ROUNDS) {
                // Game over
                clearTimeout(g.timeout);
                const sorted = [...g.players].sort((a, b) => g.scores[b] - g.scores[a]);
                const winner = sorted[0];
                const maxScore = g.scores[winner];
                const tied = sorted.filter(p => g.scores[p] === maxScore);
                const winText = tied.length > 1
                    ? `║ ▸ 🤝 TIE between ${tied.map(p => `@${shortNum(p)}`).join(' & ')}!`
                    : `║ ▸ 🏆 @${shortNum(winner)} WINS with ${maxScore} points!`;
                const leaderboard = sorted.map((p, i) => `║  ${['🥇','🥈','🥉'][i] || '▸'} @${shortNum(p)} — ${g.scores[p]} pts`).join('\n');
                diceGames.delete(chatId);
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Round ${g.round} results:\n${roundSummary}\n║\n${winText}\n║\n║ ─ Final Scores ─\n${leaderboard}\n║\n╚═|〔 ${name} 〕`,
                    mentions: g.players,
                });
            } else {
                g.round++;
                g.rollsThisRound = {};
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Round ${g.round - 1} done!\n${roundSummary}\n║\n║ ▸ Starting Round ${g.round} of ${MAX_ROUNDS}\n║ ▸ Everyone type *${prefix}roll*!\n║\n╚═|〔 ${name} 〕`,
                    mentions: g.players,
                });
            }
        }
    },

    {
        name: 'diceend',
        aliases: ['enddice', 'stopdice'],
        description: 'End the Dice Game',
        category: 'games',
        async execute(sock, msg, args, prefix, ctx) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const sender = getSender(msg);
            const g = diceGames.get(chatId);
            if (!g) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ No active game\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            if (sender !== g.host && !ctx?.isOwner?.()) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Only the host or owner can end\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            clearTimeout(g.timeout);
            diceGames.delete(chatId);
            await sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ 🎲 Game ended by @${shortNum(sender)}\n║\n╚═|〔 ${name} 〕`, mentions: [sender] }, { quoted: msg });
        }
    },

    {
        name: 'dicescores',
        aliases: ['dicescore', 'rollscores'],
        description: 'Show current Dice Game scores',
        category: 'games',
        async execute(sock, msg, args, prefix, ctx) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const g = diceGames.get(chatId);
            if (!g) return sock.sendMessage(chatId, { text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ No active game\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            const sorted = [...g.players].sort((a, b) => g.scores[b] - g.scores[a]);
            const board  = sorted.map((p, i) => `║  ${['🥇','🥈','🥉'][i] || `${i+1}.`} @${shortNum(p)} — ${g.scores[p]} pts`).join('\n');
            await sock.sendMessage(chatId, {
                text: `╔═|〔  DICE GAME 〕\n║\n║ ▸ Round ${g.round} of ${MAX_ROUNDS}\n║\n${board}\n║\n╚═|〔 ${name} 〕`,
                mentions: g.players,
            }, { quoted: msg });
        }
    },
];
