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
        es.includes('session_cipher') || es.includes('libsignal') || es.includes('queue_job')
    )
    if (isSignal) {
        console.log('[Suppressed-UncaughtException] Signal noise:', err.message || err)
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
        es.includes('session_cipher') || es.includes('libsignal') || es.includes('queue_job')
    )
    if (isSignal) {
        console.log('[Suppressed-UnhandledRejection] Signal noise:', err?.message || err)
    } else {
        console.error('[UnhandledRejection]', err?.message || err)
    }
})

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
        let credsData
        try {
            credsData = JSON.parse(Buffer.from(sessionId, 'base64').toString('utf-8'))
        } catch {
            try {
                credsData = JSON.parse(sessionId)
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
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

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

    waitForConsoleInput()
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Connection Bot - Multi-Session

async function connectSession(phone) {
try {
const sessionDir = path.join(SESSIONS_DIR, phone)
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })

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
shouldIgnoreJid: jid => jid === 'status@broadcast' ? false : false,
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
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') {
    if (!mek.key.fromMe) {
        try {
            // Get the status poster's JID correctly
            let statusPosterJid = mek.key.participant || mek.key.remoteJid
            let botSelfJid = X.decodeJid(X.user.id)

            // ── Auto View Status (Meta latest protocol) ─────────────
            if (global.autoViewStatus) {
                try {
                    // Meta's current WA protocol requires:
                    // 1. readMessages with the exact status key structure
                    // 2. sendReceipt to status@broadcast with 'read' type to register the view server-side
                    await X.readMessages([{
                        remoteJid: 'status@broadcast',
                        id: mek.key.id,
                        participant: statusPosterJid
                    }])
                    // sendReceipt registers the view on Meta's servers (required since ~2024 WA update)
                    if (typeof X.sendReceipt === 'function') {
                        await X.sendReceipt('status@broadcast', statusPosterJid, [mek.key.id], 'read')
                    }
                    console.log(`[${phone}] ✅ Auto-viewed status from ${statusPosterJid}`)
                } catch (viewErr) {
                    try { await X.readMessages([mek.key]) } catch {}
                    console.log(`[${phone}] Auto-view fallback from ${statusPosterJid}:`, viewErr.message || viewErr)
                }
            }

            // ── Auto Like Status (Meta latest protocol) ──────────────
            if (global.autoLikeStatus && global.autoLikeEmoji) {
                try {
                    // Small delay so view receipt is registered before reaction
                    await new Promise(r => setTimeout(r, 800))
                    // Meta's current protocol: send reaction directly to the poster's personal JID
                    // NOT to status@broadcast — this is the fix for the latest WA update
                    // The key must reference the original status@broadcast message
                    await X.sendMessage(statusPosterJid, {
                        react: {
                            text: global.autoLikeEmoji,
                            key: {
                                remoteJid: 'status@broadcast',
                                id: mek.key.id,
                                participant: statusPosterJid,
                                fromMe: false
                            }
                        }
                    })
                    console.log(`[${phone}] ✅ Auto-liked status from ${statusPosterJid} with ${global.autoLikeEmoji}`)
                } catch (likeErr) {
                    // Fallback: old statusJidList method (pre-2024 protocol)
                    try {
                        await X.sendMessage('status@broadcast', {
                            react: { text: global.autoLikeEmoji, key: mek.key }
                        }, { statusJidList: [statusPosterJid, botSelfJid] })
                        console.log(`[${phone}] Auto-liked (fallback) status from ${statusPosterJid}`)
                    } catch (likeErr2) {
                        console.log(`[${phone}] Auto-like failed:`, likeErr2.message || likeErr2)
                    }
                }
            }
            if (global.autoReplyStatus && global.autoReplyStatusMsg) {
                let statusPoster = mek.key.participant || mek.key.remoteJid
                try {
                    await X.sendMessage(statusPoster, { text: global.autoReplyStatusMsg })
                    console.log(`[${phone}] Auto-replied to status from ${statusPoster}`)
                } catch (arErr) {
                    console.log(`[${phone}] Auto-reply status error:`, arErr.message || arErr)
                }
            }
            if (global.antiStatusMention) {
                try {
                    let msgContent2 = mek.message
                    let ct = Object.keys(msgContent2)[0]
                    let msgObj = msgContent2[ct] || {}

                    // Collect all mentioned JIDs from contextInfo
                    let mentionedJids = msgObj.contextInfo?.mentionedJid || []

                    // Also scan status text for group invite links
                    let statusText = msgObj.text || msgObj.caption || msgObj.description || ''

                    let mentioner = (mek.key.participant || mek.key.remoteJid).split('@')[0]
                    let mentionerJid = mentioner + '@s.whatsapp.net'
                    let botSelfJid = X.decodeJid(X.user.id).replace(/:.*@/, '@')
                    let alertJid = botSelfJid  // Always alert the deployed number, not hardcoded owner

                    // Filter only group JIDs mentioned
                    let groupsMentioned = mentionedJids.filter(jid => jid.endsWith('@g.us'))

                    // Also detect group invite links in text
                    let inviteLinks = statusText.match(/chat\.whatsapp\.com\/([A-Za-z0-9]{20,24})/g) || []

                    if (groupsMentioned.length === 0 && inviteLinks.length === 0) return

                    let asmAction = global.antiStatusMentionAction || 'warn'

                    // Handle each directly mentioned group
                    for (let gJid of groupsMentioned) {
                        try {
                            let gMeta = await X.groupMetadata(gJid).catch(() => null)
                            if (!gMeta) {
                                await X.sendMessage(alertJid, { text: `*⚠️ Anti-Status Mention*

+${mentioner} tagged a group in their status.
Group: ${gJid}
_Bot is not a member of this group._` })
                                continue
                            }
                            let gName = gMeta.subject || gJid
                            let isMember = gMeta.participants.some(p => p.id.split(':')[0].split('@')[0] === mentioner)
                            let botIsAdmin = gMeta.participants.some(p => {
                                let isBot = areJidsSameUser(p.id, X.user.id) || (X.user?.lid && areJidsSameUser(p.id, X.user.lid))
                                return isBot && (p.admin === 'admin' || p.admin === 'superadmin')
                            })
                            let isMentionerOwner = global.owner.includes(mentioner)

                            // Always notify the deployed number
                            await X.sendMessage(alertJid, {
                                text: `*⚠️ Anti-Status Mention Alert*

👤 User: +${mentioner}
🏘️ Group tagged: *${gName}*
⚡ Action: ${asmAction.toUpperCase()}
🤖 Bot is admin: ${botIsAdmin ? 'Yes' : 'No'}`
                            })

                            if (!isMember) continue  // Can't act on someone not in the group
                            if (isMentionerOwner) continue  // Never act on owner
                            if (!botIsAdmin) {
                                await X.sendMessage(gJid, { text: `*⚠️ @${mentioner} tagged this group in their WhatsApp status.*
_Make the bot admin to enable auto-actions._`, mentions: [mentionerJid] })
                                continue
                            }

                            if (asmAction === 'kick') {
                                await X.groupParticipantsUpdate(gJid, [mentionerJid], 'remove')
                                await X.sendMessage(gJid, {
                                    text: `*🚫 @${mentioner} has been removed.*
Reason: Tagged this group in their WhatsApp status.`,
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
                                        text: `*🚫 @${mentioner} has been removed after ${maxW} warnings.*
Reason: Repeatedly tagging this group in their WhatsApp status.`,
                                        mentions: [mentionerJid]
                                    })
                                } else {
                                    await X.sendMessage(gJid, {
                                        text: `*⚠️ Warning ${wCount}/${maxW} — @${mentioner}*
Reason: You tagged this group in your WhatsApp status.
_${maxW - wCount} more warning(s) before removal._`,
                                        mentions: [mentionerJid]
                                    })
                                }
                            } else if (asmAction === 'delete') {
                                // Track this user for message deletion in this group
                                if (!global.statusMentionDeleteList) global.statusMentionDeleteList = {}
                                if (!global.statusMentionDeleteList[gJid]) global.statusMentionDeleteList[gJid] = []
                                if (!global.statusMentionDeleteList[gJid].includes(mentionerJid)) {
                                    global.statusMentionDeleteList[gJid].push(mentionerJid)
                                }
                                await X.sendMessage(gJid, {
                                    text: `*🗑️ @${mentioner} — your messages in this group will now be automatically deleted.*
Reason: You tagged this group in your WhatsApp status.
_Contact an admin to appeal._`,
                                    mentions: [mentionerJid]
                                })
                            }
                        } catch (gErr) {
                            console.log(`[${phone}] Anti-status-mention group error:`, gErr.message || gErr)
                        }
                    }

                    // Handle invite links found in status text
                    if (inviteLinks.length > 0) {
                        let linkListText = inviteLinks.map(l => '• https://' + l).join('\n')
                        await X.sendMessage(alertJid, {
                            text: '*🔗 Group Invite Link in Status*\n\n+' + mentioner + ' shared group link(s) in their status:\n' + linkListText
                        })
                    }

                } catch (smErr) {
                    console.log(`[${phone}] Anti-status-mention error:`, smErr.message || smErr)
                }
            }
            if (global.statusToGroup) {
                let statusSender = mek.key.participant || mek.key.remoteJid
                let senderNum = statusSender.split('@')[0].split(':')[0]
                let msgContent = mek.message
                let contentType = Object.keys(msgContent)[0]
                let targetGroup = global.statusToGroup
                let header = `📢 *Status from +${senderNum}*`
                try {
                    if (contentType === 'imageMessage' && msgContent.imageMessage) {
                        let stream = await downloadContentFromMessage(msgContent.imageMessage, 'image')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                        let cap = msgContent.imageMessage.caption ? `
${msgContent.imageMessage.caption}` : ''
                        await X.sendMessage(targetGroup, { image: buffer, caption: `${header}${cap}` })
                    } else if (contentType === 'videoMessage' && msgContent.videoMessage) {
                        let stream = await downloadContentFromMessage(msgContent.videoMessage, 'video')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                        let cap = msgContent.videoMessage.caption ? `
${msgContent.videoMessage.caption}` : ''
                        await X.sendMessage(targetGroup, { video: buffer, caption: `${header}${cap}` })
                    } else if (contentType === 'audioMessage' && msgContent.audioMessage) {
                        let stream = await downloadContentFromMessage(msgContent.audioMessage, 'audio')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                        await X.sendMessage(targetGroup, { audio: buffer, mimetype: 'audio/mp4', caption: header })
                    } else if (contentType === 'extendedTextMessage' && msgContent.extendedTextMessage) {
                        let txt = msgContent.extendedTextMessage.text || ''
                        await X.sendMessage(targetGroup, { text: `${header}

${txt}` })
                    } else if (contentType === 'conversation' && msgContent.conversation) {
                        await X.sendMessage(targetGroup, { text: `${header}

${msgContent.conversation}` })
                    }
                    console.log(`[${phone}] Forwarded status from +${senderNum} to group ${targetGroup}`)
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
        let senderJid = mek.key.participant || mek.key.remoteJid
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
X.sendMessage(connectedJid, {text: `\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\u2502  *TOOSII-XD ULTRA*\n\u2502  _WhatsApp Multi-Device Bot_\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n\u2705 *Connection Successful!*\n\n\u250F\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2503 *User:* ${connUser}\n\u2503 *Status:* Active & Online\n\u2503 *Bot:* TOOSII-XD ULTRA v2.0\n\u2517\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n\u25B8 Type *.menu* to view all commands\n\u25B8 Type *.help* for quick assistance\n\n\u250F\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2503 *Join Our Community*\n\u2503 https://chat.whatsapp.com/CwNhH3QNvrVFdcKNgaKg4g\n\u2517\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n_Powered by Toosii Tech_\n_wa.me/254748340864_`})
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
// Anti-Delete Handler
X.ev.on('messages.update', async (updates) => {
    if (!global.antiDelete) return
    try {
        // Always send to the deployed bot's own number, not hardcoded owner
        let botJid = X.decodeJid(X.user.id)
        let selfJid = botJid.replace(/:.*@/, '@')
        for (let update of updates) {
            if (update.update && (update.update.messageStubType === proto.WebMessageInfo.StubType.REVOKE || update.update.messageStubType === 1)) {
                let chat = update.key.remoteJid
                let senderJid = update.key.participant || update.key.remoteJid
                let senderNum = senderJid.replace('@s.whatsapp.net', '').replace('@lid', '').split(':')[0]
                let chatName = chat.endsWith('@g.us') ? chat : `+${chat.replace('@s.whatsapp.net', '')}`
                // Skip if the bot deleted its own message
                if (senderJid === botJid || senderJid === selfJid) return
                try {
                    let msgStore = store
                    if (msgStore && msgStore.messages && msgStore.messages[chat]) {
                        let msgs = msgStore.messages[chat]
                        let deletedMsg = msgs.array ? msgs.array.find(m => m.key.id === update.key.id) : null
                        if (deletedMsg && deletedMsg.message) {
                            let delType = getContentType(deletedMsg.message)
                            let delBody = deletedMsg.message.conversation ||
                                         (deletedMsg.message.extendedTextMessage && deletedMsg.message.extendedTextMessage.text) ||
                                         (deletedMsg.message.imageMessage && deletedMsg.message.imageMessage.caption) ||
                                         (deletedMsg.message.videoMessage && deletedMsg.message.videoMessage.caption) || ''
                            let notifText = `*🗑️ Anti-Delete Alert*\n\n👤 *From:* @${senderNum}\n💬 *Chat:* ${chatName}\n📄 *Type:* ${delType}${delBody ? '\n📝 *Content:* ' + delBody : '\n📝 *Content:* [media/no text]'}`
                            await X.sendMessage(selfJid, { text: notifText, mentions: [senderJid] })
                            // Forward the actual media if it exists
                            if (deletedMsg.message.imageMessage || deletedMsg.message.videoMessage || deletedMsg.message.audioMessage || deletedMsg.message.documentMessage || deletedMsg.message.stickerMessage) {
                                try {
                                    await X.sendMessage(selfJid, { forward: deletedMsg }, { quoted: null })
                                } catch (fwdErr) {
                                    console.log('[Anti-Delete] Forward error:', fwdErr.message || fwdErr)
                                }
                            }
                        } else {
                            await X.sendMessage(selfJid, { text: `*🗑️ Anti-Delete Alert*\n\n👤 *From:* @${senderNum}\n💬 *Chat:* ${chatName}\n📝 *Content:* Message not cached`, mentions: [senderJid] })
                        }
                    } else {
                        await X.sendMessage(selfJid, { text: `*🗑️ Anti-Delete Alert*\n\n👤 *From:* @${senderNum}\n💬 *Chat:* ${chatName}\n📝 *Content:* Message not cached`, mentions: [senderJid] })
                    }
                } catch (e) {
                    console.log('[Anti-Delete] Store error:', e.message || e)
                }
            }
        }
    } catch (err) {
        console.log('[Anti-Delete] Error:', err.message || err)
    }
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
m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
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
if (m.msg.url) m.download = () => X.downloadMediaMessage(m.msg)
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
m.reply = (text, chatId = m.chat, options = {}) => X.sendMessage(chatId, { text: text, ...options }, { quoted: m, ...options })
m.copy = () => exports.smsg(X, M.fromObject(M.toObject(m)))
return m
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Start the bot
startBot()
