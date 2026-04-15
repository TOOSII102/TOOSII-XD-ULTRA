'use strict';
  module.exports = {
      name: 'groupstats', aliases: ['gstats','groupinfo2'],
      description: 'Show detailed stats about the current group',
      category: 'group', groupOnly: true,
      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;
          if (!chatId.endsWith('@g.us'))
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  GROUP STATS 〕\n║\n║ ▸ ❌ Group only command\n║\n╚═╝`
              }, { quoted: msg });

          try {
              const meta    = await sock.groupMetadata(chatId);
              const members = meta.participants || [];
              const admins  = members.filter(m => m.admin === 'admin' || m.admin === 'superadmin');
              const created = meta.creation
                  ? new Date(meta.creation * 1000).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
                  : 'Unknown';
              const desc    = (meta.desc || '(no description)').slice(0, 100);

              const text = [
                  `╔═|〔  GROUP STATS 〕`,`║`,
                  `║ ▸ *Name*       : ${meta.subject || '-'}`,
                  `║ ▸ *Created*    : ${created}`,
                  `║ ▸ *Members*    : ${members.length}`,
                  `║ ▸ *Admins*     : ${admins.length}`,
                  `║ ▸ *Regular*    : ${members.length - admins.length}`,
                  `║ ▸ *Announce*   : ${meta.announce ? 'Yes (admin-only)' : 'No'}`,
                  `║ ▸ *Restricted* : ${meta.restrict ? 'Yes' : 'No'}`,
                  `║ ▸ *Description*:`,
                  `║   ${desc}`,
                  `║`,`╚═╝`
              ].join('\n');

              await sock.sendMessage(chatId, { text }, { quoted: msg });
          } catch {
              await sock.sendMessage(chatId, {
                  text: `╔═|〔  GROUP STATS 〕\n║\n║ ▸ ❌ Failed to fetch group data\n║\n╚═╝`
              }, { quoted: msg });
          }
      }
  };