'use strict';
  const _userCount = new Map();
  const MAX = 10;

  function parseTime(s) {
      const m = s.match(/^(\d+)(s|m|h|d)$/i);
      if (!m) return null;
      const n = parseInt(m[1]);
      const u = m[2].toLowerCase();
      if (n < 1) return null;
      if (u === 's' && n < 5)  return null;
      if (u === 'd' && n > 7)  return null;
      return n * ({ s: 1000, m: 60000, h: 3600000, d: 86400000 }[u]);
  }

  module.exports = {
      name: 'remind', aliases: ['reminder', 'remindme'],
      description: 'Set a personal reminder — bot DMs you after the given time',
      category: 'utility',
      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;
          const sender = msg.key.participant || msg.key.remoteJid;

          // Correctly build the DM JID — strip device suffix (:N) then force @s.whatsapp.net
          const senderDm = sender.split('@')[0].split(':')[0] + '@s.whatsapp.net';

          if (!args[0]) {
              return sock.sendMessage(chatId, {
                  text: [
                      `╔═|〔  REMIND 〕`, `║`,
                      `║ ▸ *Usage* : ${prefix}remind <time> <message>`, `║`,
                      `║ ▸ *Examples*:`,
                      `║   ${prefix}remind 30m call mom`,
                      `║   ${prefix}remind 2h submit report`,
                      `║   ${prefix}remind 1d water plants`, `║`,
                      `║ ▸ *Units* : s (≥5s)  m  h  d (≤7d)`,
                      `║`, `╚═╝`
                  ].join('\n')
              }, { quoted: msg });
          }

          const delay = parseTime(args[0]);
          if (!delay)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  REMIND 〕\n║\n║ ▸ ❌ Invalid time — e.g. 30m, 2h, 1d\n║\n╚═╝`
              }, { quoted: msg });

          const text = args.slice(1).join(' ').trim();
          if (!text)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  REMIND 〕\n║\n║ ▸ ❌ Provide a reminder message\n║\n╚═╝`
              }, { quoted: msg });

          const key   = senderDm.split('@')[0];
          const count = _userCount.get(key) || 0;
          if (count >= MAX)
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  REMIND 〕\n║\n║ ▸ ⚠️ Max ${MAX} active reminders\n║\n╚═╝`
              }, { quoted: msg });

          _userCount.set(key, count + 1);

          await sock.sendMessage(chatId, {
              text: `╔═|〔  REMIND 〕\n║\n║ ▸ ✅ Set\n║ ▸ *In*  : ${args[0]}\n║ ▸ *Msg* : ${text}\n║\n╚═╝`
          }, { quoted: msg });

          setTimeout(async () => {
              _userCount.set(key, Math.max(0, (_userCount.get(key) || 1) - 1));
              try {
                  await sock.sendMessage(senderDm, {
                      text: `╔═|〔  ⏰ REMINDER 〕\n║\n║ ▸ ${text}\n║\n╚═╝`
                  });
              } catch {}
          }, delay);
      }
  };