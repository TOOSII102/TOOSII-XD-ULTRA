/**
 * lib/handler.js
 * ─────────────────────────────────────────────────────────────────────────────
 * FIX: The original bot was listening on the wrong event / extracting the wrong
 *      field from the message object, so commands never triggered.
 *
 * Correct flow for gifted-baileys / @whiskeysockets/baileys:
 *   sock.ev.on('messages.upsert', ({ messages, type }) => { … })
 *
 * Key fields:
 *   msg.key.remoteJid   → chat JID
 *   msg.key.fromMe      → true if the bot sent it
 *   msg.message         → message content object (may be wrapped in ephemeralMessage etc.)
 *   msg.pushName        → sender display name
 *
 * To extract text we must unwrap nested objects:
 *   conversation | extendedTextMessage.text | imageMessage.caption | …
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');
const cfg  = require('../config');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Unwrap any nesting (ephemeral, view-once, forwarded, etc.) and return raw message object */
function getRawMessage(msg) {
    let m = msg.message;
    if (!m) return null;
    // unwrap common wrappers
    return (
        m.ephemeralMessage?.message ||
        m.viewOnceMessage?.message ||
        m.viewOnceMessageV2?.message?.viewOnceMessage?.message ||
        m.documentWithCaptionMessage?.message ||
        m.forwardedNewsletterMessageInfo?.message ||
        m
    );
}

/** Extract plain text from any message type */
function extractText(msg) {
    const raw = getRawMessage(msg);
    if (!raw) return '';
    return (
        raw.conversation ||
        raw.extendedTextMessage?.text ||
        raw.imageMessage?.caption ||
        raw.videoMessage?.caption ||
        raw.documentMessage?.caption ||
        raw.buttonsResponseMessage?.selectedButtonId ||
        raw.listResponseMessage?.singleSelectReply?.selectedRowId ||
        raw.templateButtonReplyMessage?.selectedId ||
        ''
    );
}

/** Determine message type string */
function getMessageType(msg) {
    const raw = getRawMessage(msg);
    if (!raw) return 'unknown';
    return Object.keys(raw)[0] || 'unknown';
}

/** Build a quoted-reply context */
function buildQuoted(msg) {
    return {
        key: msg.key,
        participant: msg.key.participant || msg.key.remoteJid,
        message: msg.message,
    };
}

// ── Command loader ────────────────────────────────────────────────────────────

function loadCommands() {
    const commands = new Map();
    const pluginsDir = path.join(__dirname, '..', 'plugins');
    if (!fs.existsSync(pluginsDir)) return commands;

    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
        try {
            const mod = require(path.join(pluginsDir, file));
            if (Array.isArray(mod)) {
                for (const cmd of mod) {
                    if (cmd.name) {
                        (Array.isArray(cmd.name) ? cmd.name : [cmd.name])
                            .forEach(n => commands.set(n.toLowerCase(), cmd));
                    }
                }
            } else if (mod?.name) {
                (Array.isArray(mod.name) ? mod.name : [mod.name])
                    .forEach(n => commands.set(n.toLowerCase(), mod));
            }
        } catch (e) {
            console.error(`[Handler] Failed to load plugin ${file}:`, e.message);
        }
    }
    console.log(`[Handler] ✅ Loaded ${commands.size} command(s) from ${files.length} plugin(s)`);
    return commands;
}

// ── Main handler attachment ───────────────────────────────────────────────────

function attachHandler(sock) {
    const commands = loadCommands();

    /**
     * ★ THE FIX ★
     * Listen on 'messages.upsert' — NOT 'message.new', NOT 'message', NOT 'messages.set'
     * Only process type === 'notify' (real incoming messages, not history sync)
     */
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;   // skip history sync / pre-fetch

        for (const msg of messages) {
            try {
                await processMessage(sock, msg, commands);
            } catch (err) {
                console.error('[Handler] Error processing message:', err.message);
            }
        }
    });
}

// ── Per-message processor ─────────────────────────────────────────────────────

async function processMessage(sock, msg, commands) {
    const jid      = msg.key.remoteJid;
    const fromMe   = msg.key.fromMe;
    const isGroup  = jid.endsWith('@g.us');
    const sender   = isGroup
        ? (msg.key.participant || msg.key.remoteJid)
        : jid;
    const senderNum = sender.replace(/[^0-9]/g, '');
    const isOwner  = senderNum === cfg.OWNER_NUMBER.replace(/[^0-9]/g, '');

    // Skip empty / status / broadcast
    if (!jid || jid === 'status@broadcast' || !msg.message) return;

    // Respect mode
    if (cfg.MODE === 'private' && !isOwner && !fromMe) return;
    if (!cfg.RESPOND_IN_DM    && !isGroup)              return;
    if (!cfg.RESPOND_IN_GROUP && isGroup)               return;

    const body    = extractText(msg).trim();
    const prefix  = cfg.PREFIX;
    const msgType = getMessageType(msg);

    // Auto-read
    if (cfg.AUTO_READ) {
        await sock.readMessages([msg.key]).catch(() => {});
    }

    // Must start with prefix to be a command
    if (!body.startsWith(prefix)) return;

    const args    = body.slice(prefix.length).trim().split(/\s+/);
    const cmdName = args.shift().toLowerCase();
    const query   = args.join(' ');

    const cmd = commands.get(cmdName);
    if (!cmd) return;   // unknown command — silently ignore

    // Auto-typing indicator
    if (cfg.AUTO_TYPING) {
        await sock.sendPresenceUpdate('composing', jid).catch(() => {});
    }

    // Build context object passed to every command
    const ctx = {
        sock,
        msg,
        jid,
        sender,
        senderNum,
        isOwner,
        isGroup,
        fromMe,
        body,
        args,
        query,
        cmdName,
        prefix,
        msgType,
        pushName: msg.pushName || 'User',
        quoted: buildQuoted(msg),
        /** helper: send text reply */
        reply: (text) => sock.sendMessage(jid, { text: String(text) }, { quoted: msg }),
        /** helper: send plain text (no quote) */
        send: (text)  => sock.sendMessage(jid, { text: String(text) }),
        /** helper: send image */
        sendImage: (buffer, caption = '') =>
            sock.sendMessage(jid, { image: buffer, caption }, { quoted: msg }),
        /** helper: react to message */
        react: (emoji) =>
            sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }),
    };

    try {
        if (cmd.ownerOnly && !isOwner) {
            return ctx.reply('⚠️ This command is for the *bot owner* only.');
        }
        await cmd.handler(ctx);
    } catch (err) {
        console.error(`[Handler] Command "${cmdName}" threw:`, err.message);
        await ctx.reply(`❌ An error occurred: ${err.message}`).catch(() => {});
    }

    // Stop composing
    if (cfg.AUTO_TYPING) {
        await sock.sendPresenceUpdate('paused', jid).catch(() => {});
    }
}

module.exports = { attachHandler, extractText, getRawMessage };
