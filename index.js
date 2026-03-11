//═════════════════════════════════//

/*
🔗 TOOSII-XD ULTRA Bot System
by Toosii Tech • 2024 - 2026

>> Contact Links:
・WhatsApp : wa.me/254748340864
・Telegram : t.me/toosiitech
*/

//═════════════════════════════════//
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Module
require("./logger")   // ← Smart log suppressor (load FIRST)
// Load .env before anything else so SESSION_ID is available
try { require("dotenv").config() } catch {} // dotenv optional — manual login still works
require("./setting")
const { default: makeWASocket, DisconnectReason, jidDecode, proto, getContentType, useMultiFileAuthState, downloadContentFromMessage, areJidsSameUser } = require("gifted-baileys")
const { makeInMemoryStore } = require('./library/lib/store')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const readline = require("readline");
const _ = require('lodash')
const yargs = require('yargs/yargs')
const PhoneNumber = require('awesome-phonenumber')
const FileType = require('file-type')
const path = require('path')
const fetch = require("node-fetch") 
const { getBuffer } = require('./library/lib/myfunc')
const { imageToWebp, imageToWebp3, videoToWebp, writeExifImg, writeExifImgAV, writeExifVid } = require('./library/lib/exif')

const c = {
    r: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
    white: '\x1b[37m',
    bgGreen: '\x1b[42m',
    bgCyan: '\x1b[46m',
    bgYellow: '\x1b[43m',
    bgRed: '\x1b[41m',
    bgMagenta: '\x1b[45m',
    bgBlue: '\x1b[44m',
}

process.on('uncaughtException', (err) => {
    let em = (err?.message || String(err)).toLowerCase()
    let es = (err?.stack || '').toLowerCase()
    let isSignal = (
        em.includes('no sessions') || em.includes('sessionerror') ||
        em.includes('bad mac') || em.includes('failed to decrypt') ||
        em.includes('no senderkey') || em.includes('invalid prekey') ||
        em.includes('invalid message') || em.includes('nosuchsession') ||
        em.includes('connection closed') || em.includes('connection lost') ||
        em.includes('prekey bundle') || em.includes('connection replaced') ||
        em.includes('timed out') || em.includes('econnreset') ||
        em.includes('enotfound') || em.includes('socket hang up') ||
        es.includes('session_cipher') || es.includes('libsignal') || es.includes('queue_job')
    )
    if (isSignal) {
        // suppress — these are all normal WA connection lifecycle events
    } else {
        console.error('[UncaughtException]', err.message || err)
    }
})
process.on('unhandledRejection', (err) => {
    let em = (err?.message || String(err)).toLowerCase()
    let es = (err?.stack || '').toLowerCase()
    let isSignal = (
        em.includes('no sessions') || em.includes('sessionerror') ||
        em.includes('bad mac') || em.includes('failed to decrypt') ||
        em.includes('no senderkey') || em.includes('invalid prekey') ||
        em.includes('invalid message') || em.includes('nosuchsession') ||
        em.includes('connection closed') || em.includes('connection lost') ||
        em.includes('prekey bundle') || em.includes('connection replaced') ||
        em.includes('timed out') || em.includes('econnreset') ||
        em.includes('enotfound') || em.includes('socket hang up') ||
        es.includes('session_cipher') || es.includes('libsignal') || es.includes('queue_job')
    )
    if (isSignal) {
        // suppress — these are all normal WA connection lifecycle events
    } else {
        console.error('[UnhandledRejection]', err?.message || err)
    }
})

// ── Suppress gifted-baileys internal newsletter noise ──────────────────────
// The library logs "[API] Invalid JSON response" when contacts include @newsletter
// JIDs — this is a known gifted-baileys bug, not an actual error
const _origLog = console.log.bind(console)
const _origErr = console.error.bind(console)
const _isNewsletterNoise = (...args) => {
    const msg = args.map(a => typeof a === 'string' ? a : JSON.stringify(a) || '').join(' ')
    return msg.includes('@newsletter') ||
           (msg.includes('[API]') && msg.includes('Invalid JSON')) ||
           msg.includes('Closing open session') ||
           msg.includes('prekey bundle') ||
           msg.includes('Connection Closed') ||
           msg.includes('Connection Lost') ||
           msg.includes('Connection Replaced') ||
           (msg.includes('Suppressed') && msg.includes('Signal'))
}
console.log = (...args) => { if (!_isNewsletterNoise(...args)) _origLog(...args) }
console.error = (...args) => { if (!_isNewsletterNoise(...args)) _origErr(...args) }

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Anti-Tampering Protection
const _ov = '254748340864'
const _bn = 'TOOSII-XD ULTRA'
const _ba = 'Toosii Tech'
function _integrityCheck() {
    const ownerValid = global.owner && global.owner.includes(_ov)
    const nameValid = global.botname && global.botname.includes('TOOSII')
    const authorValid = global.ownername === _ba
    if (!ownerValid || !nameValid || !authorValid) {
        console.log('\n╔══════════════════════════════════════════╗')
        console.log('║  ⚠️  INTEGRITY CHECK FAILED               ║')
        console.log('║  Unauthorized modification detected.      ║')
        console.log('║  This bot is property of Toosii Tech.     ║')
        console.log('║  Restore original settings to continue.   ║')
        console.log('║  Contact: wa.me/254748340864               ║')
        console.log('╚══════════════════════════════════════════╝\n')
        process.exit(1)
    }
    global.owner = [...new Set([_ov, ...global.owner])]
    global._protectedOwner = _ov
    global._protectedBrand = _bn
    global._protectedAuthor = _ba
}
_integrityCheck()
setInterval(_integrityCheck, 300000)

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Session & State
const SESSIONS_DIR = path.join(__dirname, 'sessions')
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true })

const activeSessions = new Map()

// ── Per-phone bot state persistence ──────────────────────────────────────────
// Saves globals like autoViewStatus, autoLikeStatus etc per deployed number
// so they survive restarts without needing manual .als on each time
const _stateFile = (phone) => path.join(SESSIONS_DIR, phone, 'botstate.json')

// Per-phone settings — each deployed number has its own independent settings
// Access via: global.ps(phone).autoLikeStatus  or  global.ps(X.user.id)
if (!global.phoneSettings) global.phoneSettings = {}

function _getPhone(phoneOrJid) {
    if (!phoneOrJid) return 'default'
    return String(phoneOrJid).split(':')[0].split('@')[0]
}

// Get settings for a specific phone — merges defaults with saved state
function _ps(phoneOrJid) {
    const _p = _getPhone(phoneOrJid)
    if (!global.phoneSettings[_p]) {
        // Try loading from file first
        try {
            const _f = _stateFile(_p)
            if (fs.existsSync(_f)) {
                global.phoneSettings[_p] = JSON.parse(fs.readFileSync(_f, 'utf8'))
                return global.phoneSettings[_p]
            }
        } catch {}
        // No saved state — use defaults (autoLike + autoView ON for new numbers)
        global.phoneSettings[_p] = {
            autoViewStatus: true,
            autoLikeStatus: true,
            autoLikeEmoji: '❤️',
            arManager: null,
            antiDelete: false,
            antiDeleteMode: 'private',
            antiStatusMention: false,
            antiStatusMentionAction: 'warn',
            autoReplyStatus: false,
            autoReplyStatusMsg: '',
            muslimPrayer: 'off',
            christianDevotion: 'off',
        }
    }
    return global.phoneSettings[_p]
}
global.ps = _ps  // make accessible from client.js

function _loadPhoneState(phone) {
    try {
        const _p = _getPhone(phone)
        const _f = _stateFile(_p)
        if (!fs.existsSync(_f)) {
            console.log(`[${_p}] No saved state — using defaults (autoLike=ON autoView=ON)`)
            return
        }
        const _saved = JSON.parse(fs.readFileSync(_f, 'utf8'))
        // Load into per-phone settings object
        global.phoneSettings[_p] = { ..._ps(_p), ..._saved }
        // Also sync to globals for backward compatibility
        const _s = global.phoneSettings[_p]
        global.autoViewStatus = _s.autoViewStatus
        global.autoLikeStatus = _s.autoLikeStatus
        global.autoLikeEmoji  = _s.autoLikeEmoji
        if (_s.arManager) global.arManager = _s.arManager
        global.antiDelete     = _s.antiDelete
        global.antiDeleteMode = _s.antiDeleteMode
        global.antiStatusMention       = _s.antiStatusMention
        global.antiStatusMentionAction = _s.antiStatusMentionAction
        global.autoReplyStatus    = _s.autoReplyStatus
        global.autoReplyStatusMsg = _s.autoReplyStatusMsg
        global.muslimPrayer       = _s.muslimPrayer
        global.christianDevotion  = _s.christianDevotion
        console.log(`[${_p}] ✅ State restored: autoView=${_s.autoViewStatus} autoLike=${_s.autoLikeStatus} antiDelete=${_s.antiDelete}`)
    } catch(e) {
        console.log(`[${phone}] Could not load bot state:`, e.message)
    }
}

function _savePhoneState(phoneOrJid) {
    try {
        const _p = _getPhone(phoneOrJid)
        const _f = _stateFile(_p)
        const _dir = path.dirname(_f)
        if (!fs.existsSync(_dir)) fs.mkdirSync(_dir, { recursive: true })
        // Save current globals into this phone's per-phone settings AND file
        const _state = {
            autoViewStatus: global.autoViewStatus,
            autoLikeStatus: global.autoLikeStatus,
            autoLikeEmoji:  global.autoLikeEmoji,
            arManager:      global.arManager,
            antiDelete:     global.antiDelete,
            antiDeleteMode: global.antiDeleteMode,
            antiStatusMention:       global.antiStatusMention,
            antiStatusMentionAction: global.antiStatusMentionAction,
            autoReplyStatus:    global.autoReplyStatus,
            autoReplyStatusMsg: global.autoReplyStatusMsg,
            muslimPrayer:       global.muslimPrayer,
            christianDevotion:  global.christianDevotion,
        }
        // Update in-memory per-phone settings immediately
        global.phoneSettings[_p] = _state
        // Persist to file
        fs.writeFileSync(_f, JSON.stringify(_state, null, 2))
    } catch(e) {
        console.log(`[saveState] error:`, e.message)
    }
}
const processedMsgs = new Set()
const msgRetryCache = new Map()

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Console Login Interface

async function handleSessionLogin(sessionId) {
    if (!sessionId || sessionId.length < 10) {
        console.log(`[ ${_bn} ] Invalid Session ID. Too short.`)
        return
    }
    try {
        console.log(`[ ${_bn} ] Processing Session ID...`)

        // Strip any known prefix (e.g. "TOOSII~", "Gifted~", etc.) before decoding
        let rawId = sessionId
        const prefixMatch = rawId.match(/^[A-Za-z0-9_\-]+~/)
        if (prefixMatch) {
            rawId = rawId.slice(prefixMatch[0].length)
            console.log(`[ ${_bn} ] Stripped prefix: ${prefixMatch[0]}`)
        }

        let credsData
        const zlib = require('zlib')
        const decodedBuf = (() => { try { return Buffer.from(rawId, 'base64') } catch { return null } })()

        if (decodedBuf) {
            // Try gzip decompression first (Gifted-style session)
            let parsed = false
            try {
                const decompressed = zlib.gunzipSync(decodedBuf).toString('utf-8')
                credsData = JSON.parse(decompressed)
                parsed = true
                console.log(`[ ${_bn} ] Decoded as gzip-compressed session`)
            } catch {}

            // Try plain base64 JSON (TOOSII-style session)
            if (!parsed) {
                try {
                    credsData = JSON.parse(decodedBuf.toString('utf-8'))
                    parsed = true
                    console.log(`[ ${_bn} ] Decoded as plain base64 session`)
                } catch {}
            }

            // Try raw JSON string (no encoding)
            if (!parsed) {
                try {
                    credsData = JSON.parse(rawId)
                    parsed = true
                    console.log(`[ ${_bn} ] Decoded as raw JSON session`)
                } catch {}
            }

            if (!parsed) {
                console.log(`[ ${_bn} ] Invalid Session ID format. Must be base64 encoded or JSON.`)
                return
            }
        } else {
            // Buffer.from failed — try raw JSON
            try {
                credsData = JSON.parse(rawId)
                console.log(`[ ${_bn} ] Decoded as raw JSON session`)
            } catch {
                console.log(`[ ${_bn} ] Invalid Session ID format. Must be base64 encoded or JSON.`)
                return
            }
        }
        const sessionPhone = credsData.me?.id?.split(':')[0]?.split('@')[0] || 'imported_' + Date.now()
        const sessionDir = path.join(SESSIONS_DIR, sessionPhone)
        if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })
        fs.writeFileSync(path.join(sessionDir, 'creds.json'), JSON.stringify(credsData, null, 2))
        console.log(`[ ${_bn} ] Session ID saved for ${sessionPhone}`)
        console.log(`[ ${_bn} ] Connecting...`)
        await connectSession(sessionPhone)
    } catch (err) {
        console.log(`[ ${_bn} ] Error processing Session ID: ${err.message || err}`)
    }
}

const rl = readline.createInterface({
    input: process.stdin.isTTY ? process.stdin : process.stdin,
    output: process.stdout,
    terminal: false
})
// On non-TTY (Pterodactyl/headless), prevent readline from blocking
if (!process.stdin.isTTY) {
    try { process.stdin.resume(); process.stdin.pause() } catch {}
}

function waitForConsoleInput() {
    rl.once('line', async (input) => {
        const cmd = input.trim()
        if (cmd === '1') {
            console.log('')
            console.log(`${c.green}[ ${_bn} ]${c.r} ${c.white}Enter your WhatsApp number with country code${c.r}`)
            console.log(`${c.green}[ ${_bn} ]${c.r} ${c.dim}Example: ${c.cyan}254748340864${c.r} ${c.dim}(Kenya), ${c.cyan}2348012345678${c.r} ${c.dim}(Nigeria), ${c.cyan}12025551234${c.r} ${c.dim}(US)${c.r}`)
            console.log(`${c.green}[ ${_bn} ]${c.r} ${c.red}Do NOT include + or leading 0${c.r}`)
            console.log('')
            rl.once('line', async (phoneInput) => {
                const phone = phoneInput.trim().replace(/[^0-9]/g, '')
                if (phone.length < 10 || phone.length > 15) {
                    console.log(`${c.red}[ ${_bn} ] ✗ Invalid number. Must be 10-15 digits with country code.${c.r}`)
                    waitForConsoleInput()
                    return
                }
                if (phone.startsWith('0')) {
                    console.log(`${c.red}[ ${_bn} ] ✗ Do not start with 0. Use country code instead.${c.r}`)
                    waitForConsoleInput()
                    return
                }
                console.log(`${c.green}[ ${_bn} ]${c.r} ${c.cyan}Connecting with number: ${c.bold}${phone}${c.r}${c.cyan}...${c.r}`)
                await connectSession(phone)
                waitForConsoleInput()
            })
        } else if (cmd === '2') {
            console.log('')
            console.log(`${c.yellow}[ ${_bn} ]${c.r} ${c.white}Paste your Session ID below:${c.r}`)
            console.log('')
            rl.once('line', async (sessionInput) => {
                await handleSessionLogin(sessionInput.trim())
                waitForConsoleInput()
            })
        } else if (cmd === '3') {
            console.log(`${c.green}[ ${_bn} ]${c.r} ${c.dim}Skipped. Bot is running with existing sessions.${c.r}`)
            waitForConsoleInput()
        } else if (cmd.length >= 10 && /^[0-9]+$/.test(cmd)) {
            console.log(`${c.green}[ ${_bn} ]${c.r} Detected phone number: ${c.cyan}${c.bold}${cmd}${c.r}`)
            console.log(`${c.green}[ ${_bn} ]${c.r} ${c.cyan}Connecting...${c.r}`)
            await connectSession(cmd)
            waitForConsoleInput()
        } else if (cmd) {
            console.log(`${c.red}[ ${_bn} ] ✗ Unknown command: "${cmd}"${c.r}`)
            console.log(`${c.yellow}[ ${_bn} ]${c.r} Type ${c.green}${c.bold}1${c.r} for Pairing Code, ${c.yellow}${c.bold}2${c.r} for Session ID`)
            waitForConsoleInput()
        } else {
            waitForConsoleInput()
        }
    })
}

async function startBot() {
    console.log('')
    console.log(`${c.cyan}${c.bold}╔══════════════════════════════════════════╗${c.r}`)
    console.log(`${c.cyan}${c.bold}║${c.r}  ${c.green}${c.bold}⚡ TOOSII-XD ULTRA${c.r} ${c.yellow}v2.0.0${c.r}             ${c.cyan}${c.bold}║${c.r}`)
    console.log(`${c.cyan}${c.bold}║${c.r}  ${c.white}${c.bold}   WhatsApp Multi-Device Bot${c.r}          ${c.cyan}${c.bold}║${c.r}`)
    console.log(`${c.cyan}${c.bold}║${c.r}  ${c.magenta}     by Toosii Tech © 2024-2026${c.r}     ${c.cyan}${c.bold}║${c.r}`)
    console.log(`${c.cyan}${c.bold}╚══════════════════════════════════════════╝${c.r}`)
    console.log('')

    const existingSessions = []
    if (fs.existsSync(SESSIONS_DIR)) {
        const dirs = fs.readdirSync(SESSIONS_DIR).filter(d => {
            const p = path.join(SESSIONS_DIR, d)
            return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'creds.json'))
        })
        existingSessions.push(...dirs)
    }

    if (existingSessions.length > 0) {
        console.log(`${c.green}[ ${_bn} ]${c.r} Found ${c.yellow}${c.bold}${existingSessions.length}${c.r} existing session(s): ${c.cyan}${existingSessions.join(', ')}${c.r}`)
        console.log(`${c.green}[ ${_bn} ]${c.r} ${c.dim}Reconnecting existing sessions...${c.r}`)
        console.log('')
        for (const phone of existingSessions) {
            connectSession(phone)
        }
        console.log('')
        console.log(`${c.cyan}${c.bold}┌─────────────────────────────────────────┐${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}  ${c.white}${c.bold}Choose login method:${c.r}                    ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}                                         ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}  ${c.green}${c.bold}1)${c.r} ${c.white}Enter WhatsApp Number${c.r} ${c.dim}(Pairing Code)${c.r} ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}  ${c.yellow}${c.bold}2)${c.r} ${c.white}Paste Session ID${c.r}                     ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}  ${c.magenta}${c.bold}3)${c.r} ${c.white}Skip${c.r} ${c.dim}(already connected)${c.r}            ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}└─────────────────────────────────────────┘${c.r}`)
        console.log('')
    } else {
        console.log(`${c.yellow}[ ${_bn} ]${c.r} ${c.dim}No existing sessions found.${c.r}`)
        console.log('')
        console.log(`${c.cyan}${c.bold}┌─────────────────────────────────────────┐${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}  ${c.white}${c.bold}Choose login method:${c.r}                    ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}                                         ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}  ${c.green}${c.bold}1)${c.r} ${c.white}Enter WhatsApp Number${c.r} ${c.dim}(Pairing Code)${c.r} ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}│${c.r}  ${c.yellow}${c.bold}2)${c.r} ${c.white}Paste Session ID${c.r}                     ${c.cyan}${c.bold}│${c.r}`)
        console.log(`${c.cyan}${c.bold}└─────────────────────────────────────────┘${c.r}`)
        console.log('')
    }

    // ── Auto-login from .env SESSION_ID ─────────────────────────────────────
    const _envSession = (process.env.SESSION_ID || '').trim()
    if (_envSession && _envSession.length > 20) {
        console.log(`${c.green}[ ${_bn} ]${c.r} ${c.cyan}SESSION_ID found in .env — auto-logging in...${c.r}`)
        console.log('')
        await handleSessionLogin(_envSession)
        // Only wait for input if we have a real terminal (not Pterodactyl/headless)
        if (process.stdin.isTTY) waitForConsoleInput()
    } else if (existingSessions.length > 0) {
        // Sessions already loaded — only wait for input if terminal available
        if (process.stdin.isTTY) waitForConsoleInput()
    } else {
        waitForConsoleInput()
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Connection Bot - Multi-Session

async function connectSession(phone) {
try {
const sessionDir = path.join(SESSIONS_DIR, phone)
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })

// ── Tear down the old socket before creating a new one ──────────────────────
// Without this, every reconnect registers duplicate ev listeners on the old
// socket, causing double (or triple) responses to every message.
const _prevSession = activeSessions.get(phone)
if (_prevSession && _prevSession.socket) {
    try {
        _prevSession.socket.ev.removeAllListeners()
        _prevSession.socket.ws?.close?.()
    } catch {}
}

activeSessions.set(phone, { socket: null, status: 'connecting', connectedUser: phone })

const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
const X = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: false,
auth: state,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: false,
syncFullHistory: false,
markOnlineOnConnect: true,
sendStatusReadReceipts: true,
shouldIgnoreJid: jid => false,
browser: ["Ubuntu", "Chrome", "20.0.04"],
msgRetryCounterCache: msgRetryCache,
// getMessage is critical — Baileys calls this when retrying encrypted messages.
// Returning a valid fallback prevents "No sessions" from crashing the process.
getMessage: async (key) => {
    try {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            if (msg?.message) return msg.message
        }
    } catch {}
    // Always return a fallback so Baileys doesn't throw on missing sessions
    return { conversation: '' }
},
// patchMessageBeforeSending — called before every outgoing message.
// Wrapping it prevents crashes when the signal session hasn't been
// established yet (the "No sessions" SessionError from libsignal).
patchMessageBeforeSending: (msg) => {
    const requiresPatch = !!(
        msg.buttonsMessage ||
        msg.templateMessage ||
        msg.listMessage
    )
    if (requiresPatch) {
        msg = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadataVersion: 2,
                        deviceListMetadata: {}
                    },
                    ...msg
                }
            }
        }
    }
    return msg
},
});

activeSessions.set(phone, { socket: X, status: 'connecting', connectedUser: phone })

if (state?.creds?.me?.lid && X.user && !X.user.lid) {
    X.user.lid = state.creds.me.lid
    console.log(`[${phone}] LID pre-loaded from creds: ${X.user.lid}`)
}

if (X.ws) {
    X.ws.on('error', (err) => {
        console.log(`[${phone}] WebSocket error (handled):`, err.message || err)
    })
}
X.ev.on('CB:error', () => {})

// Suppress known Signal/session protocol errors at socket level
// Per-session signal noise suppression (already handled globally above)

if (!X.authState.creds.registered) {
    console.log(`[${phone}] Waiting for WebSocket handshake...`)
    await new Promise(resolve => setTimeout(resolve, 5000))
    console.log(`${c.cyan}[${phone}]${c.r} ${c.dim}Requesting pairing code...${c.r}`)
    let retries = 0
    const maxRetries = 3
    let paired = false
    while (retries < maxRetries && !paired) {
        try {
            let code = await X.requestPairingCode(phone);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(`[PAIRING_CODE:${code}]`)
            console.log('')
            console.log(`${c.green}${c.bold}╔══════════════════════════════════════════╗${c.r}`)
            console.log(`${c.green}${c.bold}║${c.r}  ${c.bgGreen}${c.white}${c.bold} PAIRING CODE: ${code} ${c.r}                   ${c.green}${c.bold}║${c.r}`)
            console.log(`${c.green}${c.bold}╚══════════════════════════════════════════╝${c.r}`)
            console.log('')
            console.log(`${c.yellow}${c.bold}→${c.r} ${c.white}Open WhatsApp > Settings > Linked Devices > Link a Device${c.r}`)
            console.log(`${c.yellow}${c.bold}→${c.r} ${c.white}Choose "Link with phone number" and enter the code above${c.r}`)
            console.log('')
            paired = true
        } catch (err) {
            retries++
            console.error(`[${phone}] Pairing attempt ${retries}/${maxRetries} failed:`, err.message || err)
            if (retries < maxRetries) {
                console.log(`[${phone}] Retrying in 3 seconds...`)
                await new Promise(resolve => setTimeout(resolve, 3000))
            }
        }
    }
    if (!paired) {
        console.error(`[${phone}] All pairing attempts failed`)
        activeSessions.delete(phone)
        try { X.end(); } catch(e) {}
        try {
            const sessDir = path.join(SESSIONS_DIR, phone)
            if (fs.existsSync(sessDir)) fs.rmSync(sessDir, { recursive: true, force: true })
        } catch(e) {}
        return
    }
} else {
    console.log(`[${phone}] Reconnecting existing session...`)
}

store.bind(X.ev)

X.ev.on('messages.upsert', async chatUpdate => {
try {
// ── Process ALL messages in the batch (fixes statuses being skipped) ──
for (const _batchMsg of chatUpdate.messages) {
    if (_batchMsg.key && _batchMsg.key.remoteJid === 'status@broadcast' && !_batchMsg.key.fromMe && _batchMsg.message) {
        try {
            const botSelfJid = X.decodeJid(X.user.id).replace(/:.*@/, '@')

            // Use the EXACT raw participant JID from WhatsApp — never modify it
            // Modifying it (stripping colon) causes views/likes to be rejected or disappear
            const _rawParticipant = _batchMsg.key.participant || _batchMsg.key.remoteJid
            const statusPosterJid = _rawParticipant  // keep original — do NOT strip

            // Skip newsletters and groups
            const _cleanJid = _rawParticipant.replace(/:.*@/, '@')
            if (_cleanJid.endsWith('@newsletter') || _cleanJid.endsWith('@g.us')) continue

            // ── Auto View ────────────────────────────────────────────
            // Use per-phone settings — each deployed number has independent state
            const _phoneNum = X.user?.id?.split(':')[0]?.split('@')[0] || phone
            const _pSettings = global.ps ? global.ps(_phoneNum) : {}
            const _autoView = _pSettings.autoViewStatus !== undefined ? _pSettings.autoViewStatus : global.autoViewStatus
            const _autoLike = _pSettings.autoLikeStatus !== undefined ? _pSettings.autoLikeStatus : global.autoLikeStatus

            if (_autoView) {
                try {
                    // Use the EXACT original key — WhatsApp validates the participant field strictly
                    await X.readMessages([{
                        remoteJid: 'status@broadcast',
                        id: _batchMsg.key.id,
                        participant: _rawParticipant,
                        fromMe: false
                    }])
                } catch {
                    try { await X.readMessages([_batchMsg.key]) } catch {}
                }
            }

            // ── Auto Like ────────────────────────────────────────────
            if (_autoLike) {
                try {
                    // Per-phone arManager
                    if (!_pSettings.arManager) _pSettings.arManager = {
                        enabled: true, viewMode: 'view+react', mode: 'fixed',
                        fixedEmoji: _pSettings.autoLikeEmoji || '❤️',
                        reactions: ['❤️','🔥','👍','😂','😮','👏','🎉','🎯','💯','🌟','✨','⚡','💥','🫶','🐺'],
                        totalReacted: 0, reactedIds: [], lastReactionTime: 0, rateLimitDelay: 1000,
                    }
                    global.arManager = _pSettings.arManager
                    const _ar = _pSettings.arManager
                    const _statusId = _batchMsg.key.id

                    if (_ar.reactedIds.includes(_statusId)) continue

                    const _wait = _ar.rateLimitDelay - (Date.now() - (_ar.lastReactionTime || 0))
                    if (_wait > 0) await new Promise(r => setTimeout(r, _wait + Math.random() * 1000))

                    const _emoji = (_ar.mode === 'random' && _ar.reactions.length)
                        ? _ar.reactions[Math.floor(Math.random() * _ar.reactions.length)]
                        : (_ar.fixedEmoji || global.autoLikeEmoji || '❤️')

                    // React using status@broadcast with the EXACT original participant JID
                    // This is the only format WhatsApp accepts for persistent status reactions
                    await X.sendMessage('status@broadcast', {
                        react: {
                            text: _emoji,
                            key: {
                                remoteJid: 'status@broadcast',
                                id: _statusId,
                                participant: _rawParticipant,
                                fromMe: false
                            }
                        }
                    }, {
                        statusJidList: [_cleanJid, botSelfJid].filter(j => j.endsWith('@s.whatsapp.net'))
                    })

                    _ar.lastReactionTime = Date.now()
                    _ar.reactedIds.push(_statusId)
                    _ar.totalReacted++
                    if (_ar.reactedIds.length > 500) _ar.reactedIds = _ar.reactedIds.slice(-250)

                } catch(e) {
                    if (global.arManager && (e.message?.includes('rate') || e.message?.includes('limit'))) {
                        global.arManager.rateLimitDelay = Math.min((global.arManager.rateLimitDelay || 3000) * 2, 15000)
                    }
                }
            }

            // ── Auto Reply ───────────────────────────────────────────
            if (global.autoReplyStatus && global.autoReplyStatusMsg) {
                try { if (global.autoReplyStatusMsg && global.autoReplyStatusMsg.trim()) await X.sendMessage(statusPosterJid, { text: global.autoReplyStatusMsg }) } catch {}
            }
        } catch {}
    }
}

mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') {
    if (!mek.key.fromMe) {
        try {
            let _rawPosterJid = mek.key.participant || mek.key.remoteJid
            let statusPosterJid = _rawPosterJid.includes(':') ? _rawPosterJid.replace(/:.*@/, '@') : _rawPosterJid
            let botSelfJid = X.decodeJid(X.user.id).replace(/:.*@/, '@')

            // (auto view/like/reply all handled in batch loop above)
            if (global.antiStatusMention) {
                try {
                    let msgContent2 = mek.message

                    // Skip metadata-only keys to get real content
                    const _skipKeys = ['senderKeyDistributionMessage','messageContextInfo','deviceSentMessage']
                    let ct = Object.keys(msgContent2).find(k => !_skipKeys.includes(k)) || Object.keys(msgContent2)[0]
                    let msgObj = msgContent2[ct] || {}

                    // Extract all text fields
                    let statusText = msgObj.text || msgObj.caption || msgObj.description ||
                                     msgContent2.conversation || msgContent2.extendedTextMessage?.text || ''

                    // WhatsApp sends group mentions in status as:
                    // 1. contextInfo.mentionedJid (rare)
                    // 2. invite links in text (most common — detected via inviteLinkGroupTypeV2)
                    // 3. plain chat.whatsapp.com links in text
                    let ctxInfo = msgObj.contextInfo || {}
                    let mentionedJids = ctxInfo.mentionedJid || []
                    let groupsMentioned = mentionedJids.filter(jid => jid && jid.endsWith('@g.us'))

                    // Detect invite links — also check inviteLinkGroupTypeV2 field
                    let inviteLinks = (statusText.match(/chat\.whatsapp\.com\/([A-Za-z0-9]{20,24})/g) || [])
                    const _hasGroupLink = inviteLinks.length > 0 || msgObj.inviteLinkGroupTypeV2 || ctxInfo.groupInviteJid

                    if (groupsMentioned.length === 0 && !_hasGroupLink) throw Object.assign(new Error('no_mention'), { skip: true })

                    // Resolve mentioner JID — handle LID
                    let _mentionerRaw = mek.key.participant || mek.key.remoteJid
                    let _mentionerClean = _mentionerRaw.replace(/:.*@/, '@').split('@')[0]
                    let mentioner = _mentionerClean
                    let mentionerJid = mentioner + '@s.whatsapp.net'
                    if (_mentionerRaw.endsWith('@lid') || _mentionerClean.length > 13) {
                        try {
                            const _allC = Object.keys(store?.contacts || {})
                            const _found = _allC.find(k => k.endsWith('@s.whatsapp.net') && k.split('@')[0].split(':')[0] === _mentionerClean)
                            if (_found) { mentionerJid = _found; mentioner = _found.split('@')[0] }
                        } catch {}
                    }

                    let botSelfJid = X.decodeJid(X.user.id).replace(/:.*@/, '@')
                    let alertJid = botSelfJid

                    let asmAction = global.antiStatusMentionAction || 'warn'

                    // Build unified group list — from JID mentions + invite link resolution
                    let _allGroupJids = [...groupsMentioned]

                    // Resolve invite links to group JIDs
                    for (let _lnk of inviteLinks) {
                        try {
                            let _code = _lnk.replace('chat.whatsapp.com/', '').trim()
                            console.log('[ASM-LINK] trying code:', _code)
                            let _info = await X.groupGetInviteInfo(_code).catch(e => {
                                console.log('[ASM-LINK] groupGetInviteInfo error:', e.message)
                                return null
                            })
                            console.log('[ASM-LINK] resolved:', _info?.id, _info?.subject)
                            if (_info?.id && !_allGroupJids.includes(_info.id)) {
                                _allGroupJids.push(_info.id)
                            }
                        } catch(e) { console.log('[ASM-LINK] catch:', e.message) }
                    }

                    // Fallback: if links couldn't resolve, scan bot's own groups for the mentioner
                    if (_allGroupJids.length === 0) {
                        try {
                            console.log('[ASM-FALLBACK] scanning bot groups for mentioner:', mentionerJid)
                            const _botGroups = await X.groupFetchAllParticipating().catch(() => null)
                            if (_botGroups) {
                                for (const [gid, gdata] of Object.entries(_botGroups)) {
                                    const _inGroup = (gdata.participants || []).some(p => {
                                        const pn = p.id.split('@')[0].split(':')[0]
                                        return p.id === mentionerJid || pn === mentioner
                                    })
                                    if (_inGroup) {
                                        console.log('[ASM-FALLBACK] found in group:', gid, gdata.subject)
                                        _allGroupJids.push(gid)
                                    }
                                }
                            }
                        } catch(e) { console.log('[ASM-FALLBACK] error:', e.message) }
                    }

                    console.log('[ASM] allGroupJids to act on:', _allGroupJids)

                    if (_allGroupJids.length === 0) {
                        await X.sendMessage(alertJid, {
                            text: `╔══════════════════════════╗\n║  🛡️  *ANTI STATUS MENTION*\n╚══════════════════════════╝\n\n  ⚠️ *+${mentioner}* tagged a group in their status.\n  └ Could not resolve which group — check manually.`
                        })
                    }

                    // Act on each resolved group
                    for (let gJid of _allGroupJids) {
                        try {
                            console.log('[ASM-LOOP] acting on group:', gJid)
                            let gMeta = await X.groupMetadata(gJid).catch((e) => { console.log('[ASM-META-ERR]', e.message); return null })
                            console.log('[ASM-META] gMeta:', gMeta ? gMeta.subject : 'null')
                            if (!gMeta) {
                                await X.sendMessage(alertJid, {
                                    text: `╔══════════════════════════╗\n║  🛡️  *ANTI STATUS MENTION*\n╚══════════════════════════╝\n\n  ⚠️ *+${mentioner}* tagged a group in their status.\n  └ Bot is not a member of that group.`
                                })
                                continue
                            }
                            let gName = gMeta.subject || gJid
                            // Filter out newsletter/broadcast participants
                            let _realParticipants = (gMeta.participants || []).filter(p =>
                                p.id && !p.id.endsWith('@newsletter') && !p.id.endsWith('@broadcast')
                            )

                            // Detect if this group uses LID JIDs
                            const _groupUsesLid = _realParticipants.some(p => p.id.endsWith('@lid'))
                            const _rawLidNum = _mentionerRaw.split('@')[0].split(':')[0]
                            console.log(`[ASM-PART] groupUsesLid=${_groupUsesLid} rawLidNum=${_rawLidNum} mentioner=${mentioner} mentionerJid=${mentionerJid} participants=${_realParticipants.length}`)
                            console.log('[ASM-PART] sample participants:', JSON.stringify(_realParticipants.slice(0,4).map(p => p.id)))

                            // Find mentioner — try phone match first, then LID match
                            let _foundParticipant = _realParticipants.find(p => {
                                let pNum = p.id.split('@')[0].split(':')[0]
                                return p.id === mentionerJid || pNum === mentioner
                            })
                            // LID group: match raw LID number from status key
                            if (!_foundParticipant && _groupUsesLid) {
                                _foundParticipant = _realParticipants.find(p =>
                                    p.id.split('@')[0].split(':')[0] === _rawLidNum
                                )
                            }

                            // Use the exact participant JID for kick/warn (LID or phone)
                            if (_foundParticipant) {
                                mentionerJid = _foundParticipant.id
                                mentioner = mentionerJid.split('@')[0].split(':')[0]
                            }
                            let isMember = !!_foundParticipant

                            // Check bot admin — match LID since group uses LID
                            const _botLidNum = X.user?.lid ? X.user.lid.split('@')[0].split(':')[0] : ''
                            const _botPhoneNum = X.decodeJid(X.user.id).split('@')[0]
                            let botIsAdmin = _realParticipants.some(p => {
                                const pNum = p.id.split('@')[0].split(':')[0]
                                const isBot = pNum === _botLidNum || pNum === _botPhoneNum ||
                                              areJidsSameUser(p.id, X.user.id) ||
                                              (X.user?.lid && areJidsSameUser(p.id, X.user.lid))
                                return isBot && (p.admin === 'admin' || p.admin === 'superadmin')
                            })
                            let isMentionerOwner = global.owner.includes(mentioner)

                            console.log(`[ASM-ACT] group=${gName} mentioner=+${mentioner} mentionerJid=${mentionerJid} botAdmin=${botIsAdmin} action=${asmAction}`)

                            // Alert deployed number
                            await X.sendMessage(alertJid, {
                                text: `╔══════════════════════════╗\n║  🛡️  *ANTI STATUS MENTION*\n╚══════════════════════════╝\n\n  ├ 👤 *User*   › +${mentioner}\n  ├ 🏘️  *Group*  › ${gName}\n  ├ ⚡ *Action* › ${asmAction.toUpperCase()}\n  └ 🤖 *Bot Admin* › ${botIsAdmin ? 'Yes ✅' : 'No ❌ — Make bot admin!'}`
                            })

                            if (isMentionerOwner) continue

                            if (!botIsAdmin) {
                                await X.sendMessage(gJid, {
                                    text: `╔══════════════════════════╗\n║  🛡️  *ANTI STATUS MENTION*\n╚══════════════════════════╝\n\n  ⚠️ @${mentioner} tagged this group in their status.\n  _Make bot admin to enable auto-actions._`,
                                    mentions: [mentionerJid]
                                })
                                continue
                            }

                            if (asmAction === 'kick') {
                                await X.groupParticipantsUpdate(gJid, [mentionerJid], 'remove')
                                await X.sendMessage(gJid, {
                                    text: `╔══════════════════════════╗\n║  🛡️  *ANTI STATUS MENTION*\n╚══════════════════════════╝\n\n  🚫 *@${mentioner} removed*\n  └ Reason: Tagged this group in their status.`,
                                    mentions: [mentionerJid]
                                })
                            } else if (asmAction === 'warn') {
                                if (!global.statusMentionWarns) global.statusMentionWarns = {}
                                let warnKey = `${gJid}:${mentionerJid}`
                                global.statusMentionWarns[warnKey] = (global.statusMentionWarns[warnKey] || 0) + 1
                                let wCount = global.statusMentionWarns[warnKey]
                                let maxW = 3
                                if (wCount >= maxW) {
                                    await X.groupParticipantsUpdate(gJid, [mentionerJid], 'remove')
                                    global.statusMentionWarns[warnKey] = 0
                                    await X.sendMessage(gJid, {
                                        text: `╔══════════════════════════╗\n║  🛡️  *ANTI STATUS MENTION*\n╚══════════════════════════╝\n\n  🚫 *@${mentioner} removed*\n  └ Reached ${maxW} warnings for tagging this group in status.`,
                                        mentions: [mentionerJid]
                                    })
                                } else {
                                    await X.sendMessage(gJid, {
                                        text: `╔══════════════════════════╗\n║  🛡️  *ANTI STATUS MENTION*\n╚══════════════════════════╝\n\n  ⚠️ *Warning ${wCount}/${maxW} — @${mentioner}*\n  └ You tagged this group in your status.\n  └ ${maxW - wCount} more warning(s) before removal.`,
                                        mentions: [mentionerJid]
                                    })
                                }
                            } else if (asmAction === 'delete') {
                                if (!global.statusMentionDeleteList) global.statusMentionDeleteList = {}
                                if (!global.statusMentionDeleteList[gJid]) global.statusMentionDeleteList[gJid] = []
                                if (!global.statusMentionDeleteList[gJid].includes(mentionerJid)) {
                                    global.statusMentionDeleteList[gJid].push(mentionerJid)
                                }
                                await X.sendMessage(gJid, {
                                    text: `╔══════════════════════════╗\n║  🛡️  *ANTI STATUS MENTION*\n╚══════════════════════════╝\n\n  🗑️ *@${mentioner}* — messages will be auto-deleted.\n  └ Reason: Tagged this group in your status.\n  └ _Contact an admin to appeal._`,
                                    mentions: [mentionerJid]
                                })
                            }
                        } catch (gErr) {
                            console.log(`[${phone}] Anti-status-mention group error:`, gErr.message || gErr)
                        }
                    }

                } catch (smErr) {
                    if (!smErr.skip) console.log(`[${phone}] Anti-status-mention error:`, smErr.message || smErr)
                }
            }
            if (global.statusToGroup) {
                let _fwdSender = (mek.key.participant || mek.key.remoteJid).replace(/:.*@/, '@')
                let senderNum = _fwdSender.split('@')[0]
                let msgContent = mek.message
                let contentType = Object.keys(msgContent)[0]
                let targetGroup = global.statusToGroup
                let header = `📢 *Status from +${senderNum}*`
                // standalone download helper (downloadContentFromMessage is NOT a method on X)
                const _dlBuf = async (msgObj, type) => {
                    let stream = await downloadContentFromMessage(msgObj, type)
                    let chunks = []
                    for await (let c of stream) chunks.push(c)
                    return Buffer.concat(chunks)
                }
                try {
                    if (contentType === 'imageMessage') {
                        let buf = await _dlBuf(msgContent.imageMessage, 'image')
                        let cap = msgContent.imageMessage.caption || ''
                        await X.sendMessage(targetGroup, { image: buf, caption: `${header}${cap ? '\n' + cap : ''}` })
                    } else if (contentType === 'videoMessage') {
                        let buf = await _dlBuf(msgContent.videoMessage, 'video')
                        let cap = msgContent.videoMessage.caption || ''
                        await X.sendMessage(targetGroup, { video: buf, caption: `${header}${cap ? '\n' + cap : ''}`, mimetype: 'video/mp4' })
                    } else if (contentType === 'audioMessage') {
                        let buf = await _dlBuf(msgContent.audioMessage, 'audio')
                        await X.sendMessage(targetGroup, { audio: buf, mimetype: 'audio/mpeg' })
                        await X.sendMessage(targetGroup, { text: header })
                    } else if (contentType === 'stickerMessage') {
                        let buf = await _dlBuf(msgContent.stickerMessage, 'sticker')
                        await X.sendMessage(targetGroup, { sticker: buf })
                        await X.sendMessage(targetGroup, { text: header })
                    } else if (contentType === 'extendedTextMessage') {
                        let txt = msgContent.extendedTextMessage.text || ''
                        await X.sendMessage(targetGroup, { text: `${header}\n\n${txt}` })
                    } else if (contentType === 'conversation') {
                        await X.sendMessage(targetGroup, { text: `${header}\n\n${msgContent.conversation}` })
                    } else {
                        // Unknown type — just note it was a status
                        await X.sendMessage(targetGroup, { text: `${header}\n_[${contentType.replace('Message','')} status]_` })
                    }
                    console.log(`[${phone}] ✅ Forwarded ${contentType} status from +${senderNum} to group ${targetGroup}`)
                } catch (fwdErr) {
                    console.log(`[${phone}] Status forward error:`, fwdErr.message || fwdErr)
                }
            }
        } catch (err) {
            console.log(`[${phone}] Auto status action error:`, err.message || err)
        }
    }
    return
}
if (!X.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
let msgId = mek.key.id
if (processedMsgs.has(msgId)) return
processedMsgs.add(msgId)
if (processedMsgs.size > 5000) {
    let iter = processedMsgs.values()
    for (let i = 0; i < 2000; i++) { processedMsgs.delete(iter.next().value) }
}
if (global.autoRead && !mek.key.fromMe) {
    try { await X.readMessages([mek.key]) } catch {}
}
// Anti-Status-Mention Delete Mode: auto-delete messages from flagged users
if (global.statusMentionDeleteList && mek.message && !mek.key.fromMe) {
    let chat = mek.key.remoteJid
    if (chat && chat.endsWith('@g.us')) {
        let _senderRaw = mek.key.participant || mek.key.remoteJid
        // Normalize: strip device suffix (:0) so it matches what was stored in deleteList
        let senderJid = _senderRaw.includes(':') ? _senderRaw.replace(/:.*@/, '@') : _senderRaw
        let flaggedList = global.statusMentionDeleteList[chat] || []
        if (flaggedList.includes(senderJid)) {
            try {
                let groupMeta = await X.groupMetadata(chat).catch(() => null)
                let isBotAdmin = groupMeta && groupMeta.participants.some(p => {
                    let isBot = areJidsSameUser(p.id, X.user.id) || (X.user?.lid && areJidsSameUser(p.id, X.user.lid))
                    return isBot && (p.admin === 'admin' || p.admin === 'superadmin')
                })
                if (isBotAdmin) {
                    await X.sendMessage(chat, { delete: mek.key })
                    console.log(`[${phone}] Deleted message from flagged user ${senderJid} in ${chat}`)
                }
            } catch (delErr) {
                console.log(`[${phone}] Anti-status-mention delete error:`, delErr.message || delErr)
            }
        }
    }
}
if (global.antiLink && mek.message && !mek.key.fromMe) {
    let chat = mek.key.remoteJid
    if (chat && chat.endsWith('@g.us')) {
        let msgBody = ''
        if (mek.message.conversation) msgBody = mek.message.conversation
        else if (mek.message.extendedTextMessage) msgBody = mek.message.extendedTextMessage.text || ''
        else if (mek.message.imageMessage) msgBody = mek.message.imageMessage.caption || ''
        else if (mek.message.videoMessage) msgBody = mek.message.videoMessage.caption || ''
        let linkRegex = /https?:\/\/[^\s]+|wa\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+/gi
        if (linkRegex.test(msgBody)) {
            let senderJid = mek.key.participant || mek.key.remoteJid
            let ownerNum = global.owner[0] + '@s.whatsapp.net'
            let senderNum = senderJid.replace('@s.whatsapp.net', '').replace('@lid', '').split(':')[0]
            let isOwnr = global.owner.includes(senderNum) || mek.key.fromMe
            if (!isOwnr) {
                try {
                    let groupMeta = await X.groupMetadata(chat)
                    let isBotAdmin = groupMeta.participants.some(p => {
                        let match = areJidsSameUser(p.id, X.user.id) || (X.user?.lid && areJidsSameUser(p.id, X.user.lid))
                        return match && (p.admin === 'admin' || p.admin === 'superadmin')
                    })
                    if (isBotAdmin) {
                        await X.sendMessage(chat, { delete: mek.key })
                        await X.sendMessage(chat, { text: `*Anti-Link*\n@${senderNum}, links are not allowed in this group.`, mentions: [senderJid] })
                    }
                } catch {}
            }
        }
    }
}
// DEBUG: log every message that reaches this point
try {
    const _dbgBody = mek.message?.conversation || mek.message?.extendedTextMessage?.text || mek.message?.imageMessage?.caption || '[media/other]'
    console.log(`[MSG] from=${mek.key.remoteJid} fromMe=${mek.key.fromMe} type=${chatUpdate.type} body="${_dbgBody.slice(0,60)}"`)
} catch(_de) {}
m = smsg(X, mek, store)
require("./client")(X, m, chatUpdate, store)
} catch (err) {
    let em = (err?.message || '').toLowerCase()
    let es = (err?.stack || '').toLowerCase()
    // These are all WhatsApp Signal/libsignal protocol errors — not bot bugs.
    // They happen when WA sends a message we can't decrypt (race condition,
    // missing pre-key, new device, etc). Logging only, never crash.
    let isSignalNoise = (
        em.includes('no sessions') ||
        em.includes('sessionerror') ||
        em.includes('bad mac') ||
        em.includes('failed to decrypt') ||
        em.includes('no senderkey') ||
        em.includes('invalid prekey') ||
        em.includes('invalid message') ||
        em.includes('nosuchsession') ||
        es.includes('session_cipher') ||
        es.includes('libsignal') ||
        es.includes('queue_job')
    )
    if (isSignalNoise) {
        console.log(`[${phone}] [Signal] Suppressed session error: ${err.message || err}`)
    } else {
        console.log(`[${phone}] [Error]`, err)
    }
}
})

X.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

X.getName = (jid, withoutContact= false) => {
id = X.decodeJid(jid)
withoutContact = X.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = X.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === X.decodeJid(X.user.id) ?
X.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

X.public = true 

X.serializeM = (m) => smsg(X, m, store);
X.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update;
if (connection === "close") {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
if (reason === DisconnectReason.badSession) {
console.log(`[${phone}] Session file corrupted`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'disconnected'
  } else if (reason === DisconnectReason.connectionClosed) {
console.log(`[${phone}] Connection closed, reconnecting...`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'reconnecting'
setTimeout(() => connectSession(phone), 3000);
  } else if (reason === DisconnectReason.connectionLost) {
console.log(`[${phone}] Connection lost, reconnecting...`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'reconnecting'
setTimeout(() => connectSession(phone), 3000);
  } else if (reason === DisconnectReason.connectionReplaced) {
console.log(`[${phone}] Connection replaced`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'disconnected'
  } else if (reason === DisconnectReason.loggedOut) {
console.log(`[${phone}] Device logged out, removing session`);
activeSessions.delete(phone)
try {
    const sessDir = path.join(SESSIONS_DIR, phone)
    if (fs.existsSync(sessDir)) fs.rmSync(sessDir, { recursive: true, force: true })
} catch(e) {}
  } else if (reason === DisconnectReason.restartRequired) {
console.log(`[${phone}] Restart required, reconnecting...`);
connectSession(phone);
  } else if (reason === DisconnectReason.timedOut) {
console.log(`[${phone}] Connection timed out, reconnecting...`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'reconnecting'
setTimeout(() => connectSession(phone), 3000);
  } else {
console.log(`[${phone}] Unknown DisconnectReason: ${reason}|${connection}`);
setTimeout(() => connectSession(phone), 5000);
  }
} else if (connection === "open") {
if (!X.user.lid && state?.creds?.me?.lid) {
    X.user.lid = state.creds.me.lid
    console.log(`[${phone}] LID loaded from creds: ${X.user.lid}`)
}
const connUser = X.user?.id?.split(':')[0] || phone
activeSessions.set(phone, { socket: X, status: 'connected', connectedUser: connUser })
// Restore this number's saved bot state
_loadPhoneState(phone)
try {
X.newsletterFollow('120363299254074394@newsletter')
} catch (e) {}
try {
await X.groupAcceptInvite('CwNhH3QNvrVFdcKNgaKg4g')
console.log(`${c.green}[${phone}]${c.r} ${c.cyan}Auto-joined WhatsApp group${c.r}`)
} catch (e) {
console.log(`${c.yellow}[${phone}]${c.r} ${c.dim}Could not auto-join group: ${e.message || e}${c.r}`)
}
const connectedJid = X.user.id.replace(/:.*@/, '@')
X.sendMessage(connectedJid, {text: `╔══════════════════════════╗
║   ⚡ *TOOSII-XD ULTRA*
║   _WhatsApp Multi-Device Bot_
╚══════════════════════════╝

  ✅ *Connection Successful!*

  ├ 👤 *User*    › ${connUser}
  ├ 🟢 *Status*  › Active & Online
  ├ 🤖 *Bot*     › TOOSII-XD ULTRA v${global.botver || '2.0.0'}
  ├ 🔑 *Session* › ${global.sessionUrl || 'https://toosii-xd-session-generator-woyo.onrender.com/pair'}
  └ 📋 *Commands* › Type .menu to get started

┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
  👥 *Join Our Community*
  https://chat.whatsapp.com/CwNhH3QNvrVFdcKNgaKg4g
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄

_⚡ Powered by Toosii Tech — wa.me/254748340864_`})
console.log(`[BOT_CONNECTED:${connUser}]`)
console.log(`[${phone}] Connected: id=${JSON.stringify(X.user.id)} lid=${JSON.stringify(X.user?.lid || 'NOT SET')}`);
}
});

X.ev.on('creds.update', async (update) => {
    await saveCreds()
    if (update?.me?.lid && !X.user.lid) {
        X.user.lid = update.me.lid
        console.log(`[${phone}] LID updated from creds event: ${X.user.lid}`)
    }
})

X.sendText = (jid, text, quoted = '', options) => X.sendMessage(jid, { text: text, ...options }, { quoted })

X.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await X.getFile(path, true)
        let {
            res,
            data: file,
            filename: pathFile
        } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                }
            }
            catch (e) {
                if (e.json) throw e.json
            }
        }
        let opt = {
            filename
        }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '',
            mimetype = type.mime,
            convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime))(
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        if (options.asDocument) mtype = 'document'

        delete options.asSticker
        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage

        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: {
                url: pathFile
            },
            mimetype
        }
        let m
        try {
            m = await X.sendMessage(jid, message, {
                ...opt,
                ...options
            })
        }
        catch (e) {
            m = null
        }
        finally {
            if (!m) m = await X.sendMessage(jid, {
                ...message,
                [mtype]: file
            }, {
                ...opt,
                ...options
            })
            file = null
            return m
        }
    }
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Welcome Setting

    X.ev.on('group-participants.update', async (anu) => {
        try {
            let metadata = await X.groupMetadata(anu.id).catch(() => null)
            if (!metadata) return
            let groupName = metadata.subject || 'the group'
            let totalMembers = metadata.participants.length

            for (let num of anu.participants) {
                let numClean = num.split('@')[0].split(':')[0]

                // ── Antibot auto-remove on join ───────────────────────────
                if (anu.action === 'add' && global.antibotGroups && global.antibotGroups[anu.id] && global.knownBots && global.knownBots.includes(numClean)) {
                    try {
                        const _botMeta = await X.groupMetadata(anu.id)
                        const _botIsAdmin = _botMeta.participants.some(p => {
                            const isBot = p.id.split('@')[0].split(':')[0] === X.user.id.split('@')[0].split(':')[0]
                            return isBot && (p.admin === 'admin' || p.admin === 'superadmin')
                        })
                        if (_botIsAdmin) {
                            await X.groupParticipantsUpdate(anu.id, [num], 'remove')
                            await X.sendMessage(anu.id, { text: `╔══════════════════════════╗\n║  🤖 *ANTIBOT*\n╚══════════════════════════╝\n\n  🚫 *+${numClean}* was removed.\n  └ Reason: Known bot detected.` })
                        }
                    } catch {}
                    continue
                }
                let ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
                try { ppuser = await X.profilePictureUrl(num, 'image') } catch {}
                let ppBuf = await getBuffer(ppuser).catch(() => null)

                // ── Welcome ──────────────────────────────────────────────
                if (global.welcome && anu.action === 'add') {
                    let welcomeBody =
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       👋 *WELCOME!*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Hey @${numClean}! 🎉
You've just joined *${groupName}*

┌─────────────────────────────
│ 👥 Members  : ${totalMembers}
│ 🤖 Bot      : ${global.botname}
└─────────────────────────────

_We're glad to have you here!_
_Please read the group rules and enjoy your stay._ 😊`
                    await X.sendMessage(anu.id, {
                        text: welcomeBody,
                        contextInfo: {
                            mentionedJid: [num],
                            externalAdReply: {
                                showAdAttribution: true,
                                containsAutoReply: true,
                                title: global.botname,
                                body: groupName,
                                previewType: 'PHOTO',
                                thumbnailUrl: '',
                                thumbnail: ppBuf || Buffer.alloc(0),
                                sourceUrl: global.wagc || ''
                            }
                        }
                    })
                }

                // ── Goodbye ──────────────────────────────────────────────
                if (global.welcome && anu.action === 'remove') {
                    let goodbyeBody =
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       👋 *GOODBYE!*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

@${numClean} has left *${groupName}* 😔

┌─────────────────────────────
│ 👥 Members  : ${totalMembers}
│ 🤖 Bot      : ${global.botname}
└─────────────────────────────

_Safe travels! You're always welcome back._ 🌟`
                    await X.sendMessage(anu.id, {
                        text: goodbyeBody,
                        contextInfo: {
                            mentionedJid: [num],
                            externalAdReply: {
                                showAdAttribution: true,
                                containsAutoReply: true,
                                title: global.botname,
                                body: groupName,
                                previewType: 'PHOTO',
                                thumbnailUrl: '',
                                thumbnail: ppBuf || Buffer.alloc(0),
                                sourceUrl: global.wagc || ''
                            }
                        }
                    })
                }

                // ── Admin Events ──────────────────────────────────────────
                if (global.adminevent && anu.action === 'promote') {
                    let promoteBody =
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🌟 *ADMIN PROMOTED!*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Congratulations @${numClean}! 🎊
You have been *promoted to Admin* in
*${groupName}*

┌─────────────────────────────
│ 🛡️ Role     : Group Admin
│ 👥 Members  : ${totalMembers}
└─────────────────────────────

_Use your powers wisely and responsibly!_ ⚡`
                    await X.sendMessage(anu.id, {
                        text: promoteBody,
                        contextInfo: {
                            mentionedJid: [num],
                            externalAdReply: {
                                showAdAttribution: true,
                                containsAutoReply: true,
                                title: global.botname,
                                body: groupName,
                                previewType: 'PHOTO',
                                thumbnailUrl: '',
                                thumbnail: ppBuf || Buffer.alloc(0),
                                sourceUrl: global.wagc || ''
                            }
                        }
                    })
                }

                if (global.adminevent && anu.action === 'demote') {
                    let demoteBody =
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📉 *ADMIN DEMOTED*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

@${numClean} has been *demoted from Admin*
in *${groupName}*

┌─────────────────────────────
│ 👤 Role     : Member
│ 👥 Members  : ${totalMembers}
└─────────────────────────────

_You are now a regular member._ 🔄`
                    await X.sendMessage(anu.id, {
                        text: demoteBody,
                        contextInfo: {
                            mentionedJid: [num],
                            externalAdReply: {
                                showAdAttribution: true,
                                containsAutoReply: true,
                                title: global.botname,
                                body: groupName,
                                previewType: 'PHOTO',
                                thumbnailUrl: '',
                                thumbnail: ppBuf || Buffer.alloc(0),
                                sourceUrl: global.wagc || ''
                            }
                        }
                    })
                }
            }
        } catch (err) {
            console.log('[Group Events] Error:', err.message || err)
        }
    })
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Message Retry Handler (fixes SessionError: No sessions)
// When WhatsApp requests a retry, we must respond or it floods errors
X.ev.on('messages.receipt', async (receipts) => {
    if (!receipts || !receipts.length) return
    for (let receipt of receipts) {
        try {
            // A 'retry' receipt means the recipient couldn't decrypt — send retry
            if (receipt.type === 'retry') {
                const retryKey = receipt.key
                if (!retryKey) continue
                const storedMsg = store ? await store.loadMessage(retryKey.remoteJid, retryKey.id).catch(() => null) : null
                if (storedMsg?.message) {
                    await X.relayMessage(retryKey.remoteJid, storedMsg.message, {
                        messageId: retryKey.id,
                        participant: retryKey.participant,
                        additionalAttributes: { edit: '2' }
                    }).catch(() => {})
                }
            }
        } catch (retryErr) {
            // Silently ignore — session errors during retry are expected
        }
    }
})
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Anti-Call Handler
X.ev.on('call', async (callData) => {
    if (!global.antiCall) return
    try {
        let calls = Array.isArray(callData) ? callData : [callData]
        for (let call of calls) {
            if (call.status === 'offer') {
                let callerId = call.from
                await X.rejectCall(call.id, call.from)
                await X.sendMessage(callerId, {
                    text: `*Anti-Call Active*\nCalls are not allowed. Please send a message instead.\n\n_This is an automated response from ${global.botname}_`
                })
                console.log(`[Anti-Call] Rejected call from ${callerId}`)
            }
        }
    } catch (err) {
        console.log('[Anti-Call] Error:', err.message || err)
    }
})
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Anti-Delete Handler — private/public mode, media recovery, dedup, stats
if (!global.adCache)      global.adCache = {}      // msgId → message data
if (!global.adMediaCache) global.adMediaCache = {}  // msgId → buffer

// ── Store messages as they arrive (antidelete cache) ─────────────────────
const _adStore = async (msg) => {
    try {
        // Always cache messages — antidelete check happens at notification time
        // This ensures we catch messages even if antidelete is toggled on later
        if (!msg?.key?.message && !msg?.message) return
        if (msg.key.fromMe) return
        if (msg.key.remoteJid === 'status@broadcast') return
        const _id = msg.key.id
        if (!_id) return
        if (global.adCache[_id]) return  // already stored

        const _chat = msg.key.remoteJid
        const _rawSender = msg.key.participant || msg.key.remoteJid

        // Resolve LID JIDs to real phone numbers
        // LID = Linked ID, a Meta internal ID — always resolve to real @s.whatsapp.net
        let _resolvedSender = _rawSender
        const _rawNum = _rawSender.split('@')[0].split(':')[0]
        const _isLid = _rawSender.endsWith('@lid') || _rawNum.length > 13

        if (_isLid) {
            try {
                // Method 1: check store.contacts for this number
                const _allContacts = Object.keys(store?.contacts || {})
                const _match = _allContacts.find(k =>
                    k.endsWith('@s.whatsapp.net') && k.split('@')[0].split(':')[0] === _rawNum
                )
                if (_match) {
                    _resolvedSender = _match
                } else {
                    // Method 2: if in a group, scan participant list
                    if (_chat.endsWith('@g.us')) {
                        try {
                            const _grpMeta = await X.groupMetadata(_chat).catch(() => null)
                            const _part = (_grpMeta?.participants || []).find(p =>
                                p.id && (p.lid === _rawSender || p.id.split('@')[0].split(':')[0] === _rawNum)
                            )
                            if (_part?.id) _resolvedSender = _part.id
                        } catch {}
                    }
                }
            } catch {}
        }
        // Clean number — strip colon suffix, e.g. 254712:45@s.whatsapp.net → +254712
        const _cleanNum = _resolvedSender.replace(/@.*/, '').split(':')[0]
        const _senderNum = '+' + _cleanNum
        const _pushName = msg.pushName || ''
        const _isGroup = _chat.endsWith('@g.us')

        // Extract message content
        const _mc = msg.message || {}
        const _msgType = Object.keys(_mc).find(k => k !== 'messageContextInfo' && k !== 'senderKeyDistributionMessage') || ''
        let _type = 'unknown', _text = '', _hasMedia = false, _mimetype = ''

        if (_mc.conversation)                   { _type = 'text';     _text = _mc.conversation }
        else if (_mc.extendedTextMessage?.text) { _type = 'text';     _text = _mc.extendedTextMessage.text }
        else if (_mc.imageMessage)              { _type = 'image';    _text = _mc.imageMessage.caption || ''; _hasMedia = true; _mimetype = _mc.imageMessage.mimetype || 'image/jpeg' }
        else if (_mc.videoMessage)              { _type = 'video';    _text = _mc.videoMessage.caption || ''; _hasMedia = true; _mimetype = _mc.videoMessage.mimetype || 'video/mp4' }
        else if (_mc.audioMessage)              { _type = _mc.audioMessage.ptt ? 'voice' : 'audio'; _hasMedia = true; _mimetype = _mc.audioMessage.mimetype || 'audio/ogg' }
        else if (_mc.documentMessage)           { _type = 'document'; _text = _mc.documentMessage.fileName || ''; _hasMedia = true; _mimetype = _mc.documentMessage.mimetype || 'application/octet-stream' }
        else if (_mc.stickerMessage)            { _type = 'sticker';  _hasMedia = true; _mimetype = 'image/webp' }
        else if (_mc.locationMessage)           { _type = 'location'; _text = `📍 ${_mc.locationMessage.degreesLatitude?.toFixed(4)}, ${_mc.locationMessage.degreesLongitude?.toFixed(4)}` }
        else if (_mc.contactMessage)            { _type = 'contact';  _text = _mc.contactMessage.displayName || '' }
        else if (_mc.reactionMessage)           { _type = 'reaction'; _text = `Reacted ${_mc.reactionMessage.text || ''} to a message` }
        else if (_msgType)                      { _type = _msgType.replace('Message','').toLowerCase() }

        // Store in cache
        global.adCache[_id] = {
            id: _id, chat: _chat,
            sender: _resolvedSender, senderNum: _senderNum,
            pushName: _pushName, isGroup: _isGroup,
            type: _type, text: _text,
            hasMedia: _hasMedia, mimetype: _mimetype,
            msgObj: msg, ts: Date.now()
        }
        if (!global.adState) global.adState = { enabled: true, mode: 'private', stats: { total: 0, retrieved: 0, media: 0 }, recentIds: [] }
        global.adState.stats.total++

        // Download media buffer async
        if (_hasMedia) {
            setTimeout(async () => {
                try {
                    const _msgContent = _mc[_type === 'voice' ? 'audioMessage' : _type + 'Message'] || _mc.audioMessage || _mc.documentMessage || _mc.stickerMessage
                    if (!_msgContent) return
                    const _dlType = _type === 'voice' ? 'audio' : _type
                    const _stream = await downloadContentFromMessage(_msgContent, _dlType)
                    const _chunks = []
                    for await (const _c of _stream) _chunks.push(_c)
                    const _buf = Buffer.concat(_chunks)
                    if (_buf.length > 0 && _buf.length < 15 * 1024 * 1024) {
                        global.adMediaCache[_id] = { buffer: _buf, mimetype: _mimetype, type: _type }
                        global.adState.stats.media++
                    }
                } catch {}
            }, 2000)
        }

        // Auto-clean entries older than 6h
        const _now = Date.now()
        if (!global.adLastClean || _now - global.adLastClean > 60 * 60 * 1000) {
            global.adLastClean = _now
            for (const [k, v] of Object.entries(global.adCache)) {
                if (_now - v.ts > 6 * 60 * 60 * 1000) { delete global.adCache[k]; delete global.adMediaCache[k] }
            }
        }
    } catch {}
}

// Register antidelete store listener — always active so cache is always populated
X.ev.on('messages.upsert', async (cu) => {
    for (const _m of (cu.messages || [])) { try { await _adStore(_m) } catch {} }
})

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Anti-Delete: detect revoked messages
X.ev.on('messages.update', async (updates) => {
    if (!global.antiDelete) return
    try {
        const _botJid = X.decodeJid(X.user.id).replace(/:.*@/, '@')
        for (const update of updates) {
            const _isRevoke = update.update?.messageStubType === 1 ||
                              update.update?.messageStubType === 2
            if (!_isRevoke) continue
            const _id = update.key.id
            if (!global.adState) global.adState = { enabled: true, mode: 'private', stats: { total: 0, retrieved: 0, media: 0 }, recentIds: [] }
            if (global.adState.recentIds.includes(_id)) continue
            global.adState.recentIds.push(_id)
            if (global.adState.recentIds.length > 200) global.adState.recentIds = global.adState.recentIds.slice(-100)

            const _chat = update.key.remoteJid
            const _sender = update.key.participant || update.key.remoteJid
            if (_sender === _botJid) continue

            const _cached = global.adCache[_id]
            const _mode = global.antiDeleteMode || 'private'
            const _destJid = _mode === 'public' ? _chat : _botJid

            // Use cached real number, fallback to resolving from sender
            let _senderNum = _cached?.senderNum || ('+' + _sender.replace(/@.*/, '').split(':')[0])
            // If still looks like a LID (17+ digits), try store lookup
            if (_senderNum.replace('+','').length > 15) {
                try {
                    const _allC = Object.keys(store.contacts || {})
                    const _lidPart = _sender.split('@')[0].split(':')[0]
                    const _m2 = _allC.find(k => k.endsWith('@s.whatsapp.net') && k.split('@')[0] === _lidPart)
                    if (_m2) _senderNum = '+' + _m2.split('@')[0]
                } catch {}
            }
            const _displayName = _cached?.pushName ? `${_cached.pushName} (${_senderNum})` : _senderNum
            let _chatLabel = _senderNum
            if (_cached?.isGroup) {
                try {
                    const _meta = await X.groupMetadata(_chat).catch(() => null)
                    if (_meta?.subject) _chatLabel = _meta.subject
                } catch {}
            }
            const _time = new Date().toLocaleTimeString('en-KE', { timeZone: global.botTimezone || 'Africa/Nairobi' })
            let _notif = `╔══════════════════════════╗\n║  🗑️  *DELETED MESSAGE*\n╚══════════════════════════╝\n\n`
            _notif += `  ├ 👤 *From* › ${_displayName}\n`
            _notif += `  ├ 💬 *Chat* › ${_chatLabel}\n`
            _notif += `  ├ 📄 *Type* › ${(_cached?.type || 'unknown').toUpperCase()}\n`
            _notif += `  └ 🕐 *Time* › ${_time}`
            if (_cached?.text) _notif += `\n\n  *📝 Message:*\n  _${_cached.text}_`
            if (!_cached) _notif += `\n\n  ⚠️ _Message content not cached (bot was offline or message arrived before antidelete was enabled)_`

            try {
                const _media = global.adMediaCache[_id]
                if (_cached?.hasMedia && _media?.buffer) {
                    const _buf = _media.buffer
                    if (_media.type === 'image') await X.sendMessage(_destJid, { image: _buf, caption: _notif })
                    else if (_media.type === 'video') await X.sendMessage(_destJid, { video: _buf, caption: _notif })
                    else if (_media.type === 'audio' || _media.type === 'voice') await X.sendMessage(_destJid, { audio: _buf, caption: _notif, ptt: _media.type === 'voice' })
                    else if (_media.type === 'sticker') await X.sendMessage(_destJid, { sticker: _buf })
                    else await X.sendMessage(_destJid, { document: _buf, caption: _notif, mimetype: _media.mimetype || 'application/octet-stream' })
                    delete global.adMediaCache[_id]
                } else {
                    await X.sendMessage(_destJid, { text: _notif })
                }
                global.adState.stats.retrieved++
                delete global.adCache[_id]
            } catch {}
        }
    } catch {}
})
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Auto Bio Handler
let autoBioInterval = null
function startAutoBio() {
    if (autoBioInterval) clearInterval(autoBioInterval)
    autoBioInterval = setInterval(async () => {
        if (!global.autoBio) return
        try {
            let tz = global.botTimezone || 'Africa/Nairobi'
            let timeStr = moment().tz(tz).format('HH:mm:ss')
            let dateStr = moment().tz(tz).format('DD/MM/YYYY')
            await X.updateProfileStatus(`${global.botname} | ${timeStr} | ${dateStr}`)
        } catch (err) {
            console.log('[Auto-Bio] Error:', err.message || err)
        }
    }, 60000)
}
startAutoBio()
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Message Types
X.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
let trueFileName = attachExtension ? ('./tmp/' + filename + '.' + type.ext) : './tmp/' + filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

X.sendStickerFromUrl = async(from, PATH, quoted, options = {}) => {
let { writeExif } = require('./tmp')
let types = await X.getFile(PATH, true)
let { filename, size, ext, mime, data } = types
let type = '', mimetype = mime, pathFile = filename
if (/webp/.test(mime) || (/image/.test(mime) && options.asSticker)) type = 'sticker'
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else type = 'document'
let msg = await X.sendMessage(from, { [type]: { url: pathFile }, mimetype, ...options }, { quoted })
return msg
}

X.sendImageAsStickerAV = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
    buffer = await writeExifImgAV(buff, options)
} else {
    buffer = await imageToWebp(buff)
}
await X.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

X.sendVideoAsStickerAV = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
    buffer = await writeExifVid(buff, options)
} else {
    buffer = await videoToWebp(buff)
}
await X.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

X.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message.msg || message, messageType)
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

X.getFile = async (PATH, save) => {
    let res
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (data = fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
    let type = await FileType.fromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
    }
    let filename = path.join(__dirname, 'tmp', new Date * 1 + '.' + type.ext)
    if (data && save) fs.promises.writeFile(filename, data)
    return {
        res,
        filename,
        size: await (data).length,
        ...type,
        data
    }
}

} catch (err) {
    console.error(`[connectSession] Error:`, err)
}
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Message Serializer
function smsg(X, m, store) {
if (!m) return m
let M = proto.WebMessageInfo
if (m.key) {
m.id = m.key.id
m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
m.chat = m.key.remoteJid
m.fromMe = m.key.fromMe
m.isGroup = m.chat.endsWith('@g.us')
m.sender = X.decodeJid(m.fromMe && X.user.id || m.participant || m.key.participant || m.chat || '')
if (m.isGroup) m.participant = X.decodeJid(m.key.participant) || ''
}
if (m.message) {
m.mtype = getContentType(m.message)
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
m.body = m.message.conversation || (m.msg && m.msg.caption) || (m.msg && m.msg.text) || ((m.mtype == 'listResponseMessage') && m.msg && m.msg.singleSelectReply && m.msg.singleSelectReply.selectedRowId) || ((m.mtype == 'buttonsResponseMessage') && m.msg && m.msg.selectedButtonId) || ((m.mtype == 'viewOnceMessage') && m.msg && m.msg.caption) || m.text || ''
let quoted = m.quoted = (m.msg && m.msg.contextInfo) ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = (m.msg && m.msg.contextInfo) ? m.msg.contextInfo.mentionedJid : []
if (m.quoted) {
let type = getContentType(quoted)
m.quoted = m.quoted[type]
if (['productMessage'].includes(type)) {
type = getContentType(m.quoted)
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
}
m.quoted.mtype = type
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
m.quoted.sender = X.decodeJid(m.msg.contextInfo.participant)
let quotedSenderJid = m.quoted.sender
let botJidForQuoted = X.user && X.user.id ? X.decodeJid(X.user.id) : ''
let botLidForQuoted = X.user && X.user.lid ? X.decodeJid(X.user.lid) : ''
m.quoted.fromMe = (quotedSenderJid === botJidForQuoted) || (botLidForQuoted && quotedSenderJid === botLidForQuoted) || (typeof X.areJidsSameUser === 'function' && (X.areJidsSameUser(quotedSenderJid, botJidForQuoted) || (botLidForQuoted && X.areJidsSameUser(quotedSenderJid, botLidForQuoted))))
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false
let q = await store.loadMessage(m.chat, m.quoted.id, X)
return exports.smsg(X, q, store)
}
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id,
...(m.isGroup ? { participant: m.quoted.sender } : {})
},
message: quoted,
...(m.isGroup ? { participant: m.quoted.sender } : {})
})
m.quoted.delete = () => X.sendMessage(m.quoted.chat, { delete: vM.key })
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => X.copyNForward(jid, vM, forceForward, options)
m.quoted.download = () => X.downloadMediaMessage(m.quoted)
}
}
if (m.msg && m.msg.url) m.download = () => X.downloadMediaMessage(m.msg)
m.text = (m.msg && m.msg.text) || (m.msg && m.msg.caption) || m.message.conversation || (m.msg && m.msg.contentText) || (m.msg && m.msg.selectedDisplayText) || (m.msg && m.msg.title) || ''
m.reply = (text, chatId = m.chat, options = {}) => X.sendMessage(chatId, { text: text, ...options }, { quoted: m, ...options })
m.copy = () => exports.smsg(X, M.fromObject(M.toObject(m)))
return m
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Start the bot
startBot()
