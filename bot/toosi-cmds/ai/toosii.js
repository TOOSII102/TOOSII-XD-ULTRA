'use strict';

  const { getBotName } = require('../../lib/botname');

  // ── Plain AI fallback ─────────────────────────────────────────────────────────
  async function pollinationsAI(prompt, model = 'openai', timeoutMs = 30000) {
      const encoded = encodeURIComponent(prompt);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
          const res = await fetch(`https://text.pollinations.ai/${encoded}?model=${model}`, {
              signal: controller.signal,
              headers: { 'User-Agent': 'ToosiiBot/1.0', Accept: 'text/plain,*/*' }
          });
          if (!res.ok) throw new Error(`AI service returned HTTP ${res.status}`);
          const text = await res.text();
          if (!text?.trim()) throw new Error('No response from AI');
          return text.trim();
      } finally { clearTimeout(timer); }
  }

  // ── Intent detection ──────────────────────────────────────────────────────────
  function detectIntent(text) {
      const t = text.toLowerCase().trim();

      // Play / download song
      if (/\b(play|playsong|download\s+song|download\s+music|play\s+song|play\s+music|sing)\b/.test(t)) {
          const query = text.replace(/^[\s\S]*?(play\s+song|play\s+music|download\s+song|download\s+music|playsong|play|sing)\s+/i, '').trim();
          return { intent: 'play', args: query.split(' ').filter(Boolean) };
      }

      // Download YouTube video
      if (/\b(download\s+video|yt\s+video|youtube\s+video|video\s+download)\b/.test(t)) {
          const query = text.replace(/download\s+video|yt\s+video|youtube\s+video|video\s+download/gi, '').trim();
          return { intent: 'youtube', args: query.split(' ').filter(Boolean) };
      }

      // Weather
      if (/\b(weather|forecast|clima)\b/.test(t)) {
          const m = text.match(/(?:weather|forecast|clima)\s+(?:in|for|at|of)?\s*(.+)/i);
          const city = m ? m[1].replace(/[?.!,]/g,'').trim() : text.replace(/weather|forecast|clima|what|is|the|check/gi,'').trim();
          return { intent: 'weather', args: city.split(' ').filter(Boolean) };
      }

      // Crypto price
      const COINS = ['bitcoin','btc','ethereum','eth','bnb','binancecoin','solana','sol','dogecoin','doge','xrp','ripple','cardano','ada','shiba','shib','matic','polygon','litecoin','ltc','pepe','ton','tron','trx','near','avalanche','avax','polkadot','dot','chainlink','link','uni','uniswap','atom','cosmos','injective','inj','sui','aptos','apt'];
      if (/\b(crypto|coin|price\s+of|coin\s+price)\b/.test(t) || COINS.some(c => new RegExp('\\b' + c + '\\b').test(t))) {
          const found = COINS.find(c => new RegExp('\\b' + c + '\\b').test(t));
          const query = found || text.replace(/price|of|crypto|coin|the|what|is|check|current/gi,'').trim();
          return { intent: 'crypto', args: query.split(' ').filter(Boolean) };
      }

      // Translate
      if (/\b(translate|translation)\b/.test(t)) {
          const langMatch = t.match(/\bto\s+(english|french|spanish|arabic|swahili|german|portuguese|chinese|japanese|korean|hindi|russian|italian|turkish)\b/i);
          const lang = langMatch ? langMatch[1] : 'english';
          const textToTrans = text.replace(/translate|translation|to\s+\w+/gi,'').trim();
          return { intent: 'translate', args: [lang, ...textToTrans.split(' ').filter(Boolean)] };
      }

      // Calculate
      if (/\b(calculate|calc|compute|solve|math)\b/.test(t)) {
          const expr = text.replace(/calculate|calc|compute|solve|math|what\s+is|what's|please/gi,'').trim();
          return { intent: 'calc', args: [expr] };
      }

      // Recipe
      if (/\b(recipe|how\s+to\s+(make|cook|prepare|bake)|cook\s+|bake\s+)/.test(t)) {
          const dish = text.replace(/recipe|how\s+to|make|cook|prepare|bake|for|a\s+|an\s+|the\s+/gi,'').trim();
          return { intent: 'recipe', args: dish.split(' ').filter(Boolean) };
      }

      // News
      if (/\b(news|headlines|latest\s+news|breaking\s+news)\b/.test(t)) {
          const topic = text.replace(/news|headlines|latest|breaking|show|me|get|the|about/gi,'').trim();
          return { intent: 'news', args: topic ? topic.split(' ').filter(Boolean) : [] };
      }

      // Wiki / define / explain / who is / what is
      if (/\b(who\s+is|what\s+is|tell\s+me\s+about|explain|define|wiki|wikipedia)\b/.test(t)) {
          const topic = text.replace(/who\s+is|what\s+is|tell\s+me\s+about|explain|define|wiki|wikipedia|please/gi,'').trim();
          return { intent: 'wiki', args: topic.split(' ').filter(Boolean) };
      }

      return null;
  }

  // ── Load command helper ───────────────────────────────────────────────────────
  function loadCmd(relPath) {
      const mod = require(relPath);
      return Array.isArray(mod) ? mod[0] : mod;
  }

  module.exports = {
      name: 'ai',
      aliases: ['toosii', 'toosiiAi', 'toosiiai', 'ask'],
      description: 'Chat with Toosii AI — powered by live bot APIs',
      category: 'ai',

      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;
          const prompt = args.join(' ').trim();

          if (!prompt) {
              return sock.sendMessage(chatId, {
                  text: [
                      `╔═|〔  🤖 TOOSII AI 〕`, `║`,
                      `║ ▸ *Usage*   : ${prefix}ai <anything>`, `║`,
                      `║ ▸ *Examples*:`,
                      `║   ${prefix}ai play Rema Calm Down`,
                      `║   ${prefix}ai weather in Nairobi`,
                      `║   ${prefix}ai price of bitcoin`,
                      `║   ${prefix}ai translate hello to french`,
                      `║   ${prefix}ai recipe for jollof rice`,
                      `║   ${prefix}ai who is Elon Musk`,
                      `║   ${prefix}ai calculate 25 * 4`,
                      `║   ${prefix}ai latest news`,
                      `║`, `╚═╝`
                  ].join('\n')
              }, { quoted: msg });
          }

          const detected = detectIntent(prompt);

          if (detected && detected.args.length) {
              try {
                  await sock.sendMessage(chatId, { react: { text: '⚡', key: msg.key } });

                  let cmd;
                  switch (detected.intent) {
                      case 'play':    cmd = loadCmd('../download/play.js');     break;
                      case 'youtube': cmd = loadCmd('../download/youtube.js');  break;
                      case 'weather': cmd = loadCmd('../utility/weather.js');   break;
                      case 'crypto':  cmd = loadCmd('../utility/crypto.js');    break;
                      case 'translate': cmd = loadCmd('../utility/translate.js'); break;
                      case 'calc':    cmd = loadCmd('../utility/calc.js');       break;
                      case 'recipe':  cmd = loadCmd('../search/recipe.js');     break;
                      case 'news':    cmd = loadCmd('../news/newscmds.js');     break;
                      case 'wiki':    cmd = loadCmd('../search/wiki.js');       break;
                  }

                  if (cmd?.execute) {
                      return await cmd.execute(sock, msg, detected.args, prefix, ctx);
                  }
              } catch (_) {
                  // fall through to plain AI
              }
          }

          // ── Plain AI fallback ─────────────────────────────────────────────────
          try {
              await sock.sendMessage(chatId, { react: { text: '🤖', key: msg.key } });
              const reply = await pollinationsAI(prompt, 'openai');
              const fmtReply = reply.split('\n').map(l => `║ ${l}`).join('\n');
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  🤖 TOOSII AI 〕\n║\n${fmtReply}\n║\n╚═╝`
              }, { quoted: msg });
          } catch (e) {
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  🤖 TOOSII AI 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
              }, { quoted: msg });
          }
      }
  };