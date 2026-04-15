'use strict';

  const { getBotName }                          = require('../../lib/botname');
  const { isEnabled, getMode, setEnabled, listEnabled } = require('../../lib/chatbot-store');
  const { detectIntent, runIntent }             = require('../../lib/ai-intent');
  const cfg                                     = require('../../config');

  // ── Persona for plain AI fallback ─────────────────────────────────────────────
  const BOT_PERSONA =
      `You are Toosii AI — a witty, funny, and friendly WhatsApp assistant created by Toosii Tech (also known as TOOSII XD). ` +
      `Always reply in the SAME language the user writes in. ` +
      `Use relevant emojis naturally. Be humorous and playful while still being helpful. ` +
      `Keep replies concise (1-4 sentences) unless the question clearly needs more detail. ` +
      `If asked who made you — say Toosii Tech, also known as TOOSII XD. ` +
      `Never reveal you are powered by an external AI model.`;

  async function pollinationsReply(userText, timeoutMs = 25000) {
      const prompt = encodeURIComponent(`${BOT_PERSONA}\n\nUser: ${userText}\nToosii AI:`);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
          const res = await fetch(`https://text.pollinations.ai/${prompt}?model=openai`, {
              signal: controller.signal,
              headers: { 'User-Agent': 'ToosiiBot/1.0', Accept: 'text/plain,*/*' }
          });
          if (!res.ok) throw new Error(`AI HTTP ${res.status}`);
          const text = (await res.text()).trim();
          if (!text) throw new Error('Empty response from AI');
          return text;
      } finally { clearTimeout(timer); }
  }

  function formatReply(reply) {
      return reply.split('\n').map(l => `║ ${l}`).join('\n');
  }

  // Rate limiter — 1 reply per chat per 5s
  const _lastReply = new Map();
  function isRateLimited(chatId) {
      const last = _lastReply.get(chatId) || 0;
      if (Date.now() - last < 5000) return true;
      _lastReply.set(chatId, Date.now());
      return false;
  }

  function botWasMentioned(msg, sock) {
      const botNum = (sock.user?.id || '').split('@')[0].split(':')[0];
      const m = msg.message;
      const mentions = (
          m?.extendedTextMessage?.contextInfo?.mentionedJid ||
          m?.imageMessage?.contextInfo?.mentionedJid ||
          m?.videoMessage?.contextInfo?.mentionedJid || []
      );
      return mentions.some(j => j.split('@')[0].split(':')[0] === botNum);
  }

  function isChatbotActiveForChat(chatId) { return isEnabled(chatId); }

  async function handleChatbotMessage(sock, msg) {
      const chatId  = msg.key.remoteJid;
      if (!isEnabled(chatId)) return;

      const isGroup = chatId.endsWith('@g.us');
      if (isGroup && getMode(chatId) === 'mention') {
          if (!botWasMentioned(msg, sock)) return;
      }

      if (isRateLimited(chatId)) return;

      const m = msg.message;
      if (!m) return;
      const text = (
          m.conversation ||
          m.extendedTextMessage?.text ||
          m.imageMessage?.caption ||
          m.videoMessage?.caption || ''
      ).trim();
      if (!text) return;

      // ── Step 1: Try intent detection — use real APIs ───────────────────────
      try {
          const detected = detectIntent(text);
          if (detected && detected.args.length) {
              const prefix  = cfg.PREFIX || ',';
              const handled = await runIntent(sock, msg, detected, prefix, null);
              if (handled) return;
          }
      } catch {}

      // ── Step 2: Fall back to plain AI chatbot reply ────────────────────────
      try {
          await sock.sendMessage(chatId, { react: { text: '🤖', key: msg.key } });
          const reply = await pollinationsReply(text);
          await sock.sendMessage(chatId, {
              text: `╔═|〔  🤖 TOOSII AI 〕\n║\n${formatReply(reply)}\n║\n╚═╝`
          }, { quoted: msg });
      } catch {
          // silent — chatbot failures must not flood the chat
      }
  }

  async function senderIsAdmin(sock, msg, chatId) {
      if (!chatId.endsWith('@g.us')) return true;
      try {
          const senderJid = msg.key.participant || msg.key.remoteJid;
          const senderNum = senderJid.split('@')[0].split(':')[0];
          const meta      = await sock.groupMetadata(chatId);
          const p = meta.participants.find(p =>
              p.id.split('@')[0].split(':')[0] === senderNum
          );
          return p?.admin === 'admin' || p?.admin === 'superadmin';
      } catch { return false; }
  }

  module.exports = [
      {
          name: 'chatbot',
          aliases: ['cb', 'autoai', 'toosiimode', 'aimode'],
          description: 'Toggle Toosii AI auto-reply — detects plain text intents + chatbot fallback',
          category: 'ai',

          async execute(sock, msg, args, prefix, ctx) {
              const chatId  = msg.key.remoteJid;
              const isGroup = chatId.endsWith('@g.us');
              const sub     = (args[0] || '').toLowerCase();
              const modeArg = (args[1] || '').toLowerCase();

              const H   = `╔═|〔  🤖 TOOSII AI MODE 〕`;
              const F   = `╚═╝`;
              const SEP = '║';

              if (sub === 'list') {
                  if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
                      return sock.sendMessage(chatId, {
                          text: `${H}\n${SEP}\n${SEP} ▸ Owner/sudo only\n${SEP}\n${F}`
                      }, { quoted: msg });
                  }
                  const enabled = listEnabled();
                  if (!enabled.length) {
                      return sock.sendMessage(chatId, {
                          text: `${H}\n${SEP}\n${SEP} ▸ No active chats\n${SEP}\n${F}`
                      }, { quoted: msg });
                  }
                  const lines = enabled.map(({ chatId: cid, mode }) => {
                      const label = cid.endsWith('@g.us') ? `Group: ${cid.split('@')[0]}` : `DM: ${cid.split('@')[0]}`;
                      return `${SEP} ▸ ${label} [${mode}]`;
                  }).join('\n');
                  return sock.sendMessage(chatId, {
                      text: `${H}\n${SEP}\n${SEP} 📋 Active in ${enabled.length} chat(s)\n${SEP}\n${lines}\n${SEP}\n${F}`
                  }, { quoted: msg });
              }

              if (!sub || sub === 'status') {
                  const on   = isEnabled(chatId);
                  const mode = getMode(chatId);
                  return sock.sendMessage(chatId, {
                      text: [
                          H, SEP,
                          `${SEP} ▸ *Status* : ${on ? `✅ ON (mode: ${mode})` : '❌ OFF'}`,
                          SEP,
                          `${SEP} ▸ *Usage*:`,
                          `${SEP}   ${prefix}chatbot on          → all messages`,
                          `${SEP}   ${prefix}chatbot on mention  → groups: @tag only`,
                          `${SEP}   ${prefix}chatbot off`,
                          SEP, F
                      ].join('\n')
                  }, { quoted: msg });
              }

              if (sub === 'on' || sub === 'off') {
                  const isOwnerOrSudo = ctx?.isOwnerUser || ctx?.isSudoUser;

                  if (!isOwnerOrSudo) {
                      if (!isGroup) {
                          // DM — only owner/sudo can toggle chatbot
                          return sock.sendMessage(chatId, {
                              text: `${H}\n${SEP}\n${SEP} ▸ ❌ Owner/sudo only\n${SEP}\n${F}`
                          }, { quoted: msg });
                      }
                      // Group — group admin, owner, or sudo required
                      const admin = await senderIsAdmin(sock, msg, chatId);
                      if (!admin) {
                          return sock.sendMessage(chatId, {
                              text: `${H}\n${SEP}\n${SEP} ▸ ❌ Group admins, owner, or sudo only\n${SEP}\n${F}`
                          }, { quoted: msg });
                      }
                  }

                  if (sub === 'on') {
                      const mode    = isGroup && modeArg === 'mention' ? 'mention' : 'all';
                      setEnabled(chatId, true, mode);
                      const modeMsg = mode === 'mention' ? 'Replies only when @mentioned' : 'Replies to every message + detects commands';
                      return sock.sendMessage(chatId, {
                          text: [
                              H, SEP,
                              `${SEP} ▸ *Status* : ✅ ON`,
                              `${SEP} ▸ *Mode*   : ${modeMsg}`,
                              SEP,
                              `${SEP} ▸ Now I'll respond to plain text too!`,
                              `${SEP}   e.g. just type "play Davido" or`,
                              `${SEP}   "weather in Lagos" — no prefix needed`,
                              SEP, F
                          ].join('\n')
                      }, { quoted: msg });
                  }

                  setEnabled(chatId, false);
                  return sock.sendMessage(chatId, {
                      text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ❌ OFF\n${SEP}\n${F}`
                  }, { quoted: msg });
              }

              return sock.sendMessage(chatId, {
                  text: [
                      H, SEP,
                      `${SEP} ▸ ${prefix}chatbot on          → all messages`,
                      `${SEP} ▸ ${prefix}chatbot on mention  → @tag only`,
                      `${SEP} ▸ ${prefix}chatbot off`,
                      `${SEP} ▸ ${prefix}chatbot status`,
                      `${SEP} ▸ ${prefix}chatbot list        → owner only`,
                      SEP, F
                  ].join('\n')
              }, { quoted: msg });
          }
      }
  ];

  module.exports.isChatbotActiveForChat = isChatbotActiveForChat;
  module.exports.handleChatbotMessage   = handleChatbotMessage;