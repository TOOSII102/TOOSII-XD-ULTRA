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
const { default: makeWASocket, DisconnectReason, jidDecode, proto, getContentType, useMultiFileAuthState, downloadContentFromMessage } = require("gifted-baileys")
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
    console.error('Uncaught Exception (handled):', err.message || err)
})
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection (handled):', err.message || err)
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
browser: ["Ubuntu", "Chrome", "20.0.04"],
msgRetryCounterCache: msgRetryCache,
getMessage: async (key) => {
    if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id)
        return msg?.message || undefined
    }
    return { conversation: '' }
},
});

activeSessions.set(phone, { socket: X, status: 'connecting', connectedUser: phone })

if (X.ws) {
    X.ws.on('error', (err) => {
        console.log(`[${phone}] WebSocket error (handled):`, err.message || err)
    })
}
X.ev.on('CB:error', () => {})

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
            if (global.autoViewStatus) {
                await X.readMessages([mek.key])
                console.log(`[${phone}] Auto-viewed status from ${mek.key.participant || mek.key.remoteJid}`)
            }
            if (global.autoLikeStatus && global.autoLikeEmoji) {
                await X.sendMessage('status@broadcast', {
                    react: { text: global.autoLikeEmoji, key: mek.key }
                }, { statusJidList: [mek.key.participant || mek.key.remoteJid] })
                console.log(`[${phone}] Auto-liked status from ${mek.key.participant || mek.key.remoteJid} with ${global.autoLikeEmoji}`)
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
                    let mentionedJids = []
                    let ct = Object.keys(msgContent2)[0]
                    if (msgContent2[ct] && msgContent2[ct].contextInfo && msgContent2[ct].contextInfo.mentionedJid) {
                        mentionedJids = msgContent2[ct].contextInfo.mentionedJid
                    }
                    let botJid = X.decodeJid(X.user.id)
                    let mentioner = (mek.key.participant || mek.key.remoteJid).split('@')[0]
                    let ownerJid2 = global.owner[0] + '@s.whatsapp.net'
                    let statusText = ''
                    if (msgContent2[ct]) {
                        statusText = msgContent2[ct].text || msgContent2[ct].caption || ''
                    }
                    if (mentionedJids.includes(botJid)) {
                        await X.sendMessage(ownerJid2, { text: `*Status Mention Alert*\n\n+${mentioner} mentioned you in their status.` })
                        console.log(`[${phone}] Status mention detected from ${mentioner}`)
                    }
                    let groupMentioned = mentionedJids.filter(jid => jid.endsWith('@g.us'))
                    let mentionerJid = mentioner + '@s.whatsapp.net'
                    let asmAction = global.antiStatusMentionAction || 'warn'
                    if (groupMentioned.length > 0) {
                        for (let gJid of groupMentioned) {
                            let groupName = gJid
                            try {
                                let gMeta = await X.groupMetadata(gJid)
                                groupName = gMeta.subject || gJid
                                let isMember = gMeta.participants.some(p => p.id.includes(mentioner))
                                let botIsAdmin2 = gMeta.participants.some(p => {
                                    let pNum = p.id.split('@')[0]
                                    let botNum2 = (X.user.id || '').split(':')[0].split('@')[0]
                                    return (pNum === botNum2 || p.id === X.user.id) && (p.admin === 'admin' || p.admin === 'superadmin')
                                })
                                let isOwnerMention = global.owner.includes(mentioner)
                                if (isMember && botIsAdmin2 && !isOwnerMention) {
                                    if (asmAction === 'kick') {
                                        await X.groupParticipantsUpdate(gJid, [mentionerJid], 'remove')
                                        await X.sendMessage(gJid, { text: `*@${mentioner} has been removed for mentioning this group in their status.*`, mentions: [mentionerJid] })
                                        await X.sendMessage(ownerJid2, { text: `*Anti-Status Action: KICKED*\n+${mentioner} was removed from "${groupName}" for mentioning the group in their status.` })
                                    } else if (asmAction === 'delete') {
                                        await X.sendMessage(gJid, { text: `*Warning: @${mentioner} mentioned this group in their status.*\nTheir messages will be monitored.`, mentions: [mentionerJid] })
                                        await X.sendMessage(ownerJid2, { text: `*Anti-Status Action: ALERT*\n+${mentioner} mentioned "${groupName}" in their status. Warning sent to group.` })
                                    } else {
                                        const warnDbPath2 = path.join(__dirname, 'database', 'warnings.json')
                                        let warnDb2 = {}
                                        try { warnDb2 = JSON.parse(fs.readFileSync(warnDbPath2, 'utf-8')) } catch { warnDb2 = {} }
                                        let gWarns = warnDb2[gJid] || {}
                                        let uWarns = gWarns[mentionerJid] || []
                                        uWarns.push({ reason: 'Mentioned group in WhatsApp status', time: new Date().toISOString(), by: 'bot-auto' })
                                        gWarns[mentionerJid] = uWarns
                                        warnDb2[gJid] = gWarns
                                        fs.writeFileSync(warnDbPath2, JSON.stringify(warnDb2, null, 2))
                                        let wCount = uWarns.length
                                        let maxW = 3
                                        if (wCount >= maxW) {
                                            await X.groupParticipantsUpdate(gJid, [mentionerJid], 'remove')
                                            gWarns[mentionerJid] = []
                                            warnDb2[gJid] = gWarns
                                            fs.writeFileSync(warnDbPath2, JSON.stringify(warnDb2, null, 2))
                                            await X.sendMessage(gJid, { text: `*@${mentioner} reached ${maxW}/${maxW} warnings and has been removed.*\nReason: Mentioning group in status.`, mentions: [mentionerJid] })
                                            await X.sendMessage(ownerJid2, { text: `*Anti-Status Action: WARNED & KICKED*\n+${mentioner} reached max warnings in "${groupName}" and was removed.` })
                                        } else {
                                            await X.sendMessage(gJid, { text: `*Warning ${wCount}/${maxW} for @${mentioner}*\nReason: Mentioning this group in WhatsApp status.\n_${maxW - wCount} more warning(s) before removal._`, mentions: [mentionerJid] })
                                            await X.sendMessage(ownerJid2, { text: `*Anti-Status Action: WARNED*\n+${mentioner} warned (${wCount}/${maxW}) in "${groupName}" for mentioning the group in their status.` })
                                        }
                                    }
                                } else {
                                    await X.sendMessage(ownerJid2, { text: `*Group Mention in Status*\n\n+${mentioner} mentioned "${groupName}" in their status.${!botIsAdmin2 ? '\n_Bot is not admin in this group, no action taken._' : ''}${isOwnerMention ? '\n_Owner is protected, no action taken._' : ''}` })
                                }
                            } catch (gErr) {
                                await X.sendMessage(ownerJid2, { text: `*Group Mention in Status*\n+${mentioner} mentioned a group in their status.\nGroup: ${gJid}` })
                            }
                        }
                        console.log(`[${phone}] Group mention in status from ${mentioner} - action: ${asmAction}`)
                    }
                    let linkMatch2 = statusText.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/g)
                    if (linkMatch2 && linkMatch2.length > 0) {
                        await X.sendMessage(ownerJid2, { text: `*Group Link in Status*\n\n+${mentioner} shared a group link in their status:\n${linkMatch2.map(l => '• https://' + l).join('\n')}` })
                        console.log(`[${phone}] Group link in status from ${mentioner}`)
                    }
                } catch (smErr) {
                    console.log(`[${phone}] Anti-status-mention error:`, smErr.message || smErr)
                }
            }
            if (global.statusToGroup) {
                let statusSender = mek.key.participant || mek.key.remoteJid
                let senderName = statusSender.split('@')[0]
                let msgContent = mek.message
                let contentType = Object.keys(msgContent)[0]
                let targetGroup = global.statusToGroup
                try {
                    if (contentType === 'imageMessage' && msgContent.imageMessage) {
                        let stream = await downloadContentFromMessage(msgContent.imageMessage, 'image')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                        let caption = msgContent.imageMessage.caption || ''
                        await X.sendMessage(targetGroup, { image: buffer, caption: `*Status from +${senderName}*\n${caption}` })
                    } else if (contentType === 'videoMessage' && msgContent.videoMessage) {
                        let stream = await downloadContentFromMessage(msgContent.videoMessage, 'video')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                        let caption = msgContent.videoMessage.caption || ''
                        await X.sendMessage(targetGroup, { video: buffer, caption: `*Status from +${senderName}*\n${caption}` })
                    } else if (contentType === 'extendedTextMessage' && msgContent.extendedTextMessage) {
                        let statusText = msgContent.extendedTextMessage.text || ''
                        await X.sendMessage(targetGroup, { text: `*Status from +${senderName}*\n\n${statusText}` })
                    } else if (contentType === 'conversation') {
                        await X.sendMessage(targetGroup, { text: `*Status from +${senderName}*\n\n${msgContent.conversation}` })
                    }
                    console.log(`[${phone}] Forwarded status from ${senderName} to group`)
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
                    let botId = X.decodeJid(X.user.id)
                    let isBotAdmin = groupMeta.participants.some(p => X.decodeJid(p.id) === botId && (p.admin === 'admin' || p.admin === 'superadmin'))
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
console.log(err)
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
console.log(`[${phone}] Connected: ${JSON.stringify(X.user.id)}`);
}
});

X.ev.on('creds.update', saveCreds)

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
        if (global.welcome){
console.log(anu)
try {
let metadata = await X.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await X.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await X.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
memb = metadata.participants.length
groupwelcome = await getBuffer(ppuser)
groupleft = await getBuffer(ppuser)
                if (anu.action == 'add') {
                const Xbuffer = await getBuffer(ppuser)
                let XName = num
                    const members = metadata.participants.length
                Xbody = `
┏──────────────────────⏣ 
@${XName.split("@")[0]}
┣──────────────────────⏣
┣⛩️•   𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 
┣${metadata.subject}
┣⛩️•   𝗠𝗲𝗺𝗯𝗲𝗿 : 
┣${members}th
└───────────────┈ ⳹`
X.sendMessage(anu.id,
 { text: Xbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": groupwelcome,
"sourceUrl": `${wagc}`}}})
                } else if (anu.action == 'remove') {
                        const Xbuffer = await getBuffer(ppuser)
                        let XName = num
                    const Xmembers = metadata.participants.length
                    Xbody = `
┏──────────────────────⏣ 
┣@${XName.split("@")[0]}
┣──────────────────────⏣
┣⛩️•   𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 
┣${metadata.subject}
┣⛩️•   𝗠𝗲𝗺𝗯𝗲𝗿 : 
┣${members}th
└───────────────┈ ⳹`
X.sendMessage(anu.id,
 { text: Xbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": groupleft,
"sourceUrl": `${wagc}`}}})
}
}
} catch (err) {
console.log(err)
}
}
})
//━━━━━━━━━━━━━━━━━━━━━━━━//
    X.ev.on('group-participants.update', async (anu) => {
        if (global.adminevent){
console.log(anu)
try {
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await X.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await X.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
 if (anu.action == 'promote') {
let XName = num
Xbody = ` 
━━━━━━━━━━━━━━━━━━━━━
         *[ PROMOTE ]*
@${XName.split("@")[0]}, Congratulations! You are now an *Admin*
━━━━━━━━━━━━━━━━━━━━━`
   X.sendMessage(anu.id,
 { text: Xbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": groupwelcome,
"sourceUrl": `${wagc}`}}})
} else if (anu.action == 'demote') {
let XName = num
Xbody = `
━━━━━━━━━━━━━━━━━━━━━
         *[ DEMOTE ]*
@${XName.split("@")[0]}, You have been *demoted* from admin
━━━━━━━━━━━━━━━━━━━━━`
X.sendMessage(anu.id,
 { text: Xbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": groupleft,
"sourceUrl": `${wagc}`}}})
}
}
} catch (err) {
console.log(err)
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
        for (let update of updates) {
            if (update.update && (update.update.messageStubType === proto.WebMessageInfo.StubType.REVOKE || update.update.messageStubType === 1)) {
                let chat = update.key.remoteJid
                let senderJid = update.key.participant || update.key.remoteJid
                let senderNum = senderJid.replace('@s.whatsapp.net', '').replace('@lid', '').split(':')[0]
                let ownerJid = global.owner[0] + '@s.whatsapp.net'
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
                            let notifText = `*Anti-Delete Detected*\n\nFrom: @${senderNum}\nChat: ${chat}\nType: ${delType}\n${delBody ? 'Content: ' + delBody : ''}`
                            await X.sendMessage(ownerJid, { text: notifText, mentions: [senderJid] })
                            if (deletedMsg.message.imageMessage || deletedMsg.message.videoMessage || deletedMsg.message.audioMessage || deletedMsg.message.documentMessage) {
                                try {
                                    await X.sendMessage(ownerJid, { forward: deletedMsg })
                                } catch {}
                            }
                        } else {
                            await X.sendMessage(ownerJid, { text: `*Anti-Delete*\n@${senderNum} deleted a message in ${chat}`, mentions: [senderJid] })
                        }
                    } else {
                        await X.sendMessage(ownerJid, { text: `*Anti-Delete*\n@${senderNum} deleted a message in ${chat}`, mentions: [senderJid] })
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
m.quoted.fromMe = m.quoted.sender === (X.user && X.user.id)
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
id: m.quoted.id
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
