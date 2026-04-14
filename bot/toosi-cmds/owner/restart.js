'use strict';

  const { getBotName } = require('../../lib/botname');
  const { spawn } = require('child_process');

  module.exports = {
      name: 'restart',
      aliases: ['reboot', 'reloadbot'],
      description: 'Restart the bot process (owner only)',
      category: 'owner',

      async execute(sock, msg, args, prefix, ctx) {
          const chatId = msg.key.remoteJid;
          const name   = getBotName();

          if (!ctx.isOwner()) {
              return sock.sendMessage(chatId, {
                  text: `╔═|〔  RESTART 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 ${name} 〕`
              }, { quoted: msg });
          }

          await sock.sendMessage(chatId, {
              text: `╔═|〔  RESTART 〕\n║\n║ ▸ *Status* : ♻️ Restarting...\n║ ▸ *Note*   : Bot will be back in ~10s\n║\n╚═|〔 ${name} 〕`
          }, { quoted: msg });

          // Spawn a brand-new process then let this one exit cleanly
          // Works on bot-hosting.net (Pterodactyl) without needing panel interaction
          setTimeout(() => {
              const child = spawn(process.execPath, process.argv.slice(1), {
                  detached: true,
                  stdio: 'inherit',
                  env: process.env,
                  cwd: process.cwd()
              });
              child.unref();
              setTimeout(() => process.exit(0), 1000);
          }, 1500);
      }
  };
  