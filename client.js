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
const { downloadContentFromMessage, proto, generateWAMessage, getContentType, prepareWAMessageMedia, generateWAMessageFromContent, GroupSettingChange, jidDecode, WAGroupMetadata, emitGroupParticipantsUpdate, emitGroupUpdate, generateMessageID, jidNormalizedUser, generateForwardMessageContent, WAGroupInviteMessageGroupMetadata, GroupMetadata, Headers, delay, WA_DEFAULT_EPHEMERAL, WADefault, getAggregateVotesInPollMessage, generateWAMessageContent, areJidsSameUser, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeWaconnet, makeInMemoryStore, MediaType, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, initInMemoryKeyStore, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WAMediaUpload, mentionedJid, processTime, Browser, MessageType,
Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, DisconnectReason, WAconnet, getStream, WAProto, isBaileys, AnyMessageContent, templateMessage, InteractiveMessage, Header } = require("gifted-baileys")
const os = require('os')
const fs = require('fs')
const fg = require('api-dylux')
const fetch = require('node-fetch');
const util = require('util')
const axios = require('axios')
const { exec, execSync } = require("child_process")
const chalk = require('chalk')
const nou = require('node-os-utils')
const moment = require('moment-timezone');
const path = require ('path');
const didyoumean = require('didyoumean');
const similarity = require('similarity');
const speed = require('performance-now')
const { Sticker } = require('wa-sticker-formatter');
const { igdl } = require("btch-downloader");
const yts = require ('yt-search');
const FormData = require('form-data');
//> Scrape <//
const jktNews = require('./library/scrape/jktNews');
const otakuDesu = require('./library/scrape/otakudesu');
const Kusonime = require('./library/scrape/kusonime');
const { quote } = require('./library/scrape/quote.js');
const { fdown } = require('./library/scrape/facebook.js')

const {
        komiku,
        detail
} = require('./library/scrape/komiku');

const {
        wikimedia
} = require('./library/scrape/wikimedia');

const { 
        CatBox, 
        uploadImage
} = require('./library/scrape/uploader');

module.exports = async (X, m) => {
try {
const from = m.key.remoteJid
var body = (m.mtype === 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || m.text) : ""
body = body || ""
//━━━━━━━━━━━━━━━━━━━━━━━━//
// library
const { smsg, fetchJson, getBuffer, fetchBuffer, getGroupAdmins, TelegraPh, isUrl, hitungmundur, sleep, clockString, checkBandwidth, runtime, tanggal, getRandom } = require('./library/lib/myfunc')

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Main Setting (Admin And Prefix ) 
const budy = (typeof m.text === 'string') ? m.text : '';
const mess = global.mess || {};
const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
const prefix = global.botPrefix ? global.botPrefix : (prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.');
const isCmd = global.botPrefix ? body.startsWith(global.botPrefix) : body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const sender = m.key.fromMe ? (X.user.id.split(':')[0]+'@s.whatsapp.net' || X.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = await X.decodeJid(X.user.id)
const senderNumber = sender.split('@')[0].split(':')[0]
const botNum = botNumber.split('@')[0].split(':')[0]
const ownerNums = [...global.owner].map(v => v.replace(/[^0-9]/g, ''))

const botJid = X.decodeJid(X.user.id)
let botLidRaw = X.user?.lid || null
if (!botLidRaw) {
    try {
        const _fs = require('fs')
        const _path = require('path')
        const phoneNum = (X.user.id || '').split(':')[0].split('@')[0]
        const credsPaths = [
            _path.join(__dirname, 'sessions', phoneNum, 'creds.json'),
            _path.join(__dirname, 'sessions', 'creds.json'),
            _path.join(__dirname, 'auth_info_baileys', 'creds.json'),
            _path.join(__dirname, '..', 'sessions', phoneNum, 'creds.json'),
            _path.join(__dirname, '..', 'sessions', 'creds.json'),
            _path.join(__dirname, '..', 'auth_info_baileys', 'creds.json'),
        ]
        for (const cp of credsPaths) {
            if (_fs.existsSync(cp)) {
                const creds = JSON.parse(_fs.readFileSync(cp, 'utf-8'))
                if (creds?.me?.lid) {
                    botLidRaw = creds.me.lid
                    X.user.lid = botLidRaw
                    break
                }
            }
        }
    } catch (e) {}
}
const botLid = botLidRaw ? X.decodeJid(botLidRaw) : null

const senderJid = m.sender || sender
const senderFromKey = m.key?.participant ? X.decodeJid(m.key.participant) : null

function isSameUser(participantId, targetId) {
    if (!participantId || !targetId) return false
    try { return areJidsSameUser(participantId, targetId) } catch { }
    const pUser = participantId.split(':')[0].split('@')[0]
    const tUser = targetId.split(':')[0].split('@')[0]
    return pUser === tUser
}

function isParticipantBot(p) {
    if (!p || !p.id) return false
    if (isSameUser(p.id, X.user.id)) return true
    if (X.user?.lid && isSameUser(p.id, X.user.lid)) return true
    if (isSameUser(p.id, botJid)) return true
    if (botLid && isSameUser(p.id, botLid)) return true
    return false
}

function isParticipantSender(p) {
    if (!p || !p.id) return false
    if (isSameUser(p.id, senderJid)) return true
    if (senderFromKey && isSameUser(p.id, senderFromKey)) return true
    if (m.sender && isSameUser(p.id, m.sender)) return true
    if (m.key?.participant && isSameUser(p.id, m.key.participant)) return true
    if (sender && isSameUser(p.id, sender)) return true
    return false
}

const senderClean = senderJid.split(':')[0].split('@')[0]
const senderKeyClean = senderFromKey ? senderFromKey.split(':')[0].split('@')[0] : null
const botClean = botJid.split(':')[0].split('@')[0]

const isOwner = (
    m.key.fromMe ||
    senderClean === botClean ||
    ownerNums.includes(senderClean) ||
    (senderKeyClean && (senderKeyClean === botClean || ownerNums.includes(senderKeyClean)))
) || false

const isGroup = m.isGroup
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const groupMetadata = isGroup ? await X.groupMetadata(from).catch(e => null) : null
const groupName = isGroup && groupMetadata ? groupMetadata.subject || '' : ''
const participants = isGroup && groupMetadata ? groupMetadata.participants || [] : []
const groupAdmins = isGroup && participants.length ? await getGroupAdmins(participants) : []

const isBotAdmins = isGroup && participants.length ? participants.some(p => {
    return isParticipantBot(p) && (p.admin === 'admin' || p.admin === 'superadmin')
}) : false

const isAdmins = isGroup ? (isOwner || (participants.length ? participants.some(p => {
    return isParticipantSender(p) && (p.admin === 'admin' || p.admin === 'superadmin')
}) : false)) : false

const isSuperAdmin = isGroup && participants.length ? participants.some(p => {
    return isParticipantSender(p) && p.admin === 'superadmin'
}) : false
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Setting Console
if (m.message) {
    const _mtype = Object.keys(m.message)[0] || 'unknown'
    // Skip noisy protocol/system messages — only log real user content
    const _skipTypes = ['protocolMessage','senderKeyDistributionMessage','messageContextInfo','ephemeralMessage']
    if (!_skipTypes.includes(_mtype)) {
        const _time = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        const _date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        const _body = budy || (m.mtype ? m.mtype.replace('Message','') : _mtype.replace('Message',''))
        const _preview = _body.length > 60 ? _body.slice(0, 60) + '\u2026' : _body
        const _chatLabel = m.isGroup
            ? 'Group   ' + chalk.cyan(pushname) + chalk.dim(' [' + from.split('@')[0] + ']')
            : 'Private ' + chalk.cyan(pushname) + chalk.dim(' [' + m.sender.split('@')[0] + ']')
        const _icon = m.isGroup ? '\uD83D\uDC65' : '\uD83D\uDCAC'
        const _typeIcons = {imageMessage:'\uD83D\uDDBC\uFE0F ',videoMessage:'\uD83C\uDFA5 ',audioMessage:'\uD83C\uDFB5 ',stickerMessage:'\uD83C\uDF00 ',documentMessage:'\uD83D\uDCC4 ',locationMessage:'\uD83D\uDCCD ',contactMessage:'\uD83D\uDC64 '}
        const _tIcon = _typeIcons[_mtype] || ''
        console.log(
            '\n' +
            chalk.bgCyan(chalk.black(' MSG ')) + ' ' + chalk.dim(_date) + ' ' + chalk.bold(_time) + '\n' +
            chalk.dim('  \u251C ') + chalk.yellow('From    ') + chalk.green(pushname) + chalk.dim(' (' + m.sender.split('@')[0] + ')') + '\n' +
            chalk.dim('  \u251C ') + chalk.yellow(_icon + ' Chat    ') + _chatLabel + '\n' +
            chalk.dim('  \u2514 ') + chalk.yellow('\uD83D\uDCAC Text    ') + chalk.white(_tIcon + _preview)
        )
    }
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Auto Fake Presence (typing/recording/online)
if (global.fakePresence && global.fakePresence !== 'off' && !m.key.fromMe) {
    try {
        if (global.fakePresence === 'typing') {
            await X.sendPresenceUpdate('composing', from)
        } else if (global.fakePresence === 'recording') {
            await X.sendPresenceUpdate('recording', from)
        } else if (global.fakePresence === 'online') {
            await X.sendPresenceUpdate('available')
        }
    } catch(e) {}
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Reply / Reply Message
const reply = (teks) => { 
X.sendMessage(from, { text: teks, contextInfo: { 
"externalAdReply": { 
"showAdAttribution": true, 
"title": "TOOSII-XD ULTRA", 
"containsAutoReply": true, 
"mediaType": 1, 
"thumbnail": fakethmb, 
"mediaUrl": "https://t.me/toosiitech", 
"sourceUrl": "https://t.me/toosiitech" }}}, { quoted: m }) }

const reply2 = (teks) => {
X.sendMessage(from, { text : teks }, { quoted : m })
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Function Area
try {
ppuser = await X.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
ppnyauser = await getBuffer(ppuser)

const reSize = async(buffer, ukur1, ukur2) => {
   return new Promise(async(resolve, reject) => {
      let jimp = require('jimp')
      var baper = await jimp.read(buffer);
      var ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG)
      resolve(ab)
   })
}
    const fakethmb = await reSize(ppuser, 300, 300)
    // function resize
    let jimp = require("jimp")
const resize = async (image, width, height) => {
    const read = await jimp.read(image);
    const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
    return data;
};

const safeSendMedia = async (jid, mediaObj, options = {}, sendOpts = {}) => {
    try {
        for (const key of ['image', 'video', 'audio', 'document', 'sticker']) {
            if (mediaObj[key]) {
                const val = mediaObj[key];
                if (val && typeof val === 'object' && val.url) {
                    if (!val.url || val.url === 'undefined' || val.url === 'null' || val.url === undefined) {
                        return reply('Media URL is not available. The source may be down.');
                    }
                } else if (val === undefined || val === null) {
                    return reply('Media data is not available. Please try again later.');
                }
            }
        }
        await X.sendMessage(jid, mediaObj, sendOpts);
    } catch (err) {
        console.error('Safe media send error:', err.message);
        reply('Failed to send media: ' + (err.message || 'Unknown error'));
    }
};

const userDbPath = './database/users.json';
function loadUsers() {
    try {
        if (!fs.existsSync(userDbPath)) return {};
        return JSON.parse(fs.readFileSync(userDbPath));
    } catch { return {}; }
}
function saveUsers(data) {
    if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
    fs.writeFileSync(userDbPath, JSON.stringify(data, null, 2));
}
function trackUser(senderJid, name, cmd) {
    let users = loadUsers();
    const now = new Date().toISOString();
    if (!users[senderJid]) {
        users[senderJid] = { name: name, firstSeen: now, lastSeen: now, commandCount: 0, commands: {} };
    }
    users[senderJid].name = name;
    users[senderJid].lastSeen = now;
    users[senderJid].commandCount = (users[senderJid].commandCount || 0) + 1;
    if (cmd) {
        users[senderJid].commands[cmd] = (users[senderJid].commands[cmd] || 0) + 1;
    }
    saveUsers(users);
}

if (isCmd && command) {
    trackUser(sender, pushname, command);
    if (!isOwner && !isBot) {
        const userData = loadUsers();
        if (userData[sender]?.banned) {
            return reply('You have been banned from using this bot. Contact the admin for assistance.');
        }
    }
}

if (global.pmBlocker && !m.isGroup && !isOwner && !isBot && !m.key.fromMe) {
    return
}

if (global.autoReact && m.key && !m.key.fromMe) {
    try { await X.sendMessage(m.chat, { react: { text: global.autoReactEmoji || '👍', key: m.key } }) } catch {}
}

if (m.isGroup && !isAdmins && !isOwner) {
    if (global.antiBadword && budy) {
        let badwords = ['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'nigga', 'nigger']
        let hasBadword = badwords.some(w => budy.toLowerCase().includes(w))
        if (hasBadword && isBotAdmins) {
            await X.sendMessage(m.chat, { delete: m.key })
            await X.sendMessage(from, { text: `@${sender.split('@')[0]} watch your language! Badword detected.`, mentions: [sender] })
        }
    }
    if (global.antiTag && m.mentionedJid && m.mentionedJid.length > 5 && isBotAdmins) {
        await X.sendMessage(m.chat, { delete: m.key })
        await X.sendMessage(from, { text: `@${sender.split('@')[0]} mass tagging is not allowed!`, mentions: [sender] })
        return
    }
    if (global.antiSticker && m.mtype === 'stickerMessage' && isBotAdmins) {
        await X.sendMessage(m.chat, { delete: m.key })
        return
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Leaderboard Games
const leaderboardPath = './database/leaderboard.json';

// Load leaderboard
function loadLeaderboard() {
  if (!fs.existsSync(leaderboardPath)) return {};
  return JSON.parse(fs.readFileSync(leaderboardPath));
}

// Save leaderboard
function saveLeaderboard(data) {
  fs.writeFileSync(leaderboardPath, JSON.stringify(data, null, 2));
}

if (
  global.tebakGame &&
  global.tebakGame[m.sender] &&
  m.quoted &&
  m.quoted.text &&
  m.quoted.text.includes(global.tebakGame[m.sender].soal)
) {
  const game = global.tebakGame[m.sender];
  const jawaban = game.jawaban;
  const petunjuk = game.petunjuk || 'No hint available';
  const teksUser = m.body?.toLowerCase();

  if (teksUser === 'nyerah' || teksUser === 'giveup') {
    clearTimeout(game.timeout);
    delete global.tebakGame[m.sender];
    return reply(`😔 You gave up!\nThe correct answer is:\n✅ *${jawaban}*`);
  }

  const benar = Array.isArray(jawaban)
    ? jawaban.some(jw => jw.toLowerCase() === teksUser)
    : teksUser === jawaban.toLowerCase();

  if (teksUser && benar) {
    let leaderboard = loadLeaderboard();
    leaderboard[m.sender] = (leaderboard[m.sender] || 0) + 1;
    saveLeaderboard(leaderboard);

    clearTimeout(game.timeout);
    delete global.tebakGame[m.sender];
    return reply('✅ Correct! Your answer is right!\n\nType .tebakld to view the leaderboard.');
  } else if (teksUser) {
    return reply(`❌ Wrong. Try again!\n💡 Hint: ${petunjuk}\n\nType *giveup* if you want to give up.`);
  }
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// autoshalat
X.autoshalat = X.autoshalat ? X.autoshalat : {}
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? X.user.id : m.sender
        let id = m.chat 
    if(id in X.autoshalat) {
    return false
    }
    let jadwalSholat = {
    shubuh: '04:29',
    terbit: '05:44',
    dhuha: '06:02',
    dzuhur: '12:02',
    ashar: '15:15',
    magrib: '18:11',
    isya: '19:01',
    }
    const datek = new Date((new Date).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta"  
    }));
    const hours = datek.getHours();
    const minutes = datek.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    for(let [sholat, waktu] of Object.entries(jadwalSholat)) {
    if(timeNow === waktu) {
    let caption = `Hi ${pushname},\nIt's time for *${sholat}* prayer. Take your ablution and pray.\n\n*${waktu}*\n_For the Sumatra region and surrounding areas._`
    X.autoshalat[id] = [
    reply(caption),
    setTimeout(async () => {
    delete X.autoshalat[m.chat]
    }, 57000)
    ]
    }
    }
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Similarity
function getCaseNames() {
  try {
    const data = fs.readFileSync('./client.js', 'utf8');
    const casePattern = /case\s+'([^']+)'/g;
    const matches = data.match(casePattern);

    if (matches) {
      return matches.map(match => match.replace(/case\s+'([^']+)'/, '$1'));
    } else {
      return [];
    }
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

if (prefix && command) {
  const caseNames = getCaseNames();
  let noPrefix = m.text.replace(prefix, '').trim();
  let mean = didyoumean(noPrefix, caseNames);
  let sim = similarity(noPrefix, mean);
  let similarityPercentage = parseInt(sim * 100);

  if (mean && noPrefix.toLowerCase() !== mean.toLowerCase()) {
    const respony = (`Sorry, invalid command. Did you mean:\n\n➠  *${prefix + mean}*\n➠  *Similarity:* ${similarityPercentage}%`);
    reply(respony);
  }
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
let totalfitur = () =>{
var mytext = fs.readFileSync("./client.js").toString()
var numUpper = (mytext.match(/case '/g) || []).length;
return numUpper
        }
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Function Waktu
function getFormattedDate() {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
}

let d = new Date(new Date + 3600000)
let locale = 'en'
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
const hariini = d.toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' })

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds
return hours + " hours " + minutes + " minutes " + seconds + " seconds"
}

function msToDate(ms) {
                temp = ms
                days = Math.floor(ms / (24*60*60*1000));
                daysms = ms % (24*60*60*1000);
                hours = Math.floor((daysms)/(60*60*1000));
                hoursms = ms % (60*60*1000);
                minutes = Math.floor((hoursms)/(60*1000));
                minutesms = ms % (60*1000);
                sec = Math.floor((minutesms)/(1000));
                return days+" Days "+hours+" Hours "+ minutes + " Minutes";
  }
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Ucapan Waktu
const timee = moment().tz('Asia/Jakarta').format('HH:mm:ss')
if(timee < "23:59:00"){
var waktuucapan = 'Good Night'
}
if(timee < "19:00:00"){
var waktuucapan = 'Good Evening'
}
if(timee < "18:00:00"){
var waktuucapan = 'Good Afternoon'
}
if(timee < "15:00:00"){
var waktuucapan = 'Good Day'
}
if(timee < "10:00:00"){
var waktuucapan = 'Good Morning'
}
if(timee < "05:00:00"){
var waktuucapan = 'Early Morning'
}
if(timee < "03:00:00"){
var waktuucapan = 'Midnight'
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Plugin Connector
const loadPlugins = (directory) => {
    let plugins = []
    const folders = fs.readdirSync(directory)
    folders.forEach(folder => {
        const folderPath = path.join(directory, folder)
        if (fs.lstatSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath)
            files.forEach(file => {
                const filePath = path.join(folderPath, file)
                if (filePath.endsWith(".js")) {
                    try {
                        delete require.cache[require.resolve(filePath)]
                        const plugin = require(filePath)
                        plugin.filePath = filePath
                        plugins.push(plugin)
                    } catch (error) {
                        console.error(`Error loading plugin at ${filePath}:`, error)
                    }
                }
            })
        }
    })
    return plugins
}
const plugins = loadPlugins(path.resolve(__dirname, "./plugin"))
const context = { 
    args, 
    X, 
    reply,
    m, 
    body,   
    prefix,
    command,
    isUrl,
    q,
    text,
    quoted,
    require,
    smsg,
    sleep,
    clockString,
    msToDate,
    runtime,
    fetchJson,
    getBuffer,
    delay,
    getRandom
     }
let handled = false
for (const plugin of plugins) {
    if (plugin.command.includes(command)) {
        try {
            await plugin.operate(context)
            handled = true
        } catch (error) {
            console.error(`Error executing plugin ${plugin.filePath}:`, error)
        }
        break
    }
}
// Batas Plugins
//━━━━━━━━━━━━━━━━━━━━━━━━//
//━━━━━━━━━━━━━━━━━━━━━━━━//
// tag owner reaction
if (m.isGroup) {
    if (body.includes(`@${owner}`)) {
        reaction(m.chat, "❌")
    }
 }
// tes bot no prefix
if ((budy.match) && ["bot",].includes(budy) && !isCmd) {
reply(`🟢 *${global.botname || 'TOOSII-XD ULTRA'}* is online and ready!\n⏱️ Uptime: ${runtime(process.uptime())}`)
}       

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Mode Gate
// Private mode: ONLY the deployed bot number can use any command
// Public mode:  All users can use non-owner commands normally
const isDeployedNumber = m.key.fromMe || senderClean === botClean

if (isCmd && X.public === false && !isDeployedNumber) {
    return reply('🔒 *Bot is in Private Mode.*\n_Only the bot owner can use commands._')
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Owner Font Mode — auto-converts every message the bot owner sends
// Activated via .setfont [fontname], deactivated via .fontoff
if (m.key.fromMe && global.ownerFontMode && global.ownerFontMode !== 'off' && budy && !isCmd) {
    try {
        const _fontMaps = {
            bold:          {a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭','0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'},
            italic:        {a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻',A:'𝘈',B:'𝘉',C:'𝘊',D:'𝘋',E:'𝘌',F:'𝘍',G:'𝘎',H:'𝘏',I:'𝘐',J:'𝘑',K:'𝘒',L:'𝘓',M:'𝘔',N:'𝘕',O:'𝘖',P:'𝘗',Q:'𝘘',R:'𝘙',S:'𝘚',T:'𝘛',U:'𝘜',V:'𝘝',W:'𝘞',X:'𝘟',Y:'𝘠',Z:'𝘡'},
            bolditalic:    {a:'𝙖',b:'𝙗',c:'𝙘',d:'𝙙',e:'𝙚',f:'𝙛',g:'𝙜',h:'𝙝',i:'𝙞',j:'𝙟',k:'𝙠',l:'𝙡',m:'𝙢',n:'𝙣',o:'𝙤',p:'𝙥',q:'𝙦',r:'𝙧',s:'𝙨',t:'𝙩',u:'𝙪',v:'𝙫',w:'𝙬',x:'𝙭',y:'𝙮',z:'𝙯',A:'𝘼',B:'𝘽',C:'𝘾',D:'𝘿',E:'𝙀',F:'𝙁',G:'𝙂',H:'𝙃',I:'𝙄',J:'𝙅',K:'𝙆',L:'𝙇',M:'𝙈',N:'𝙉',O:'𝙊',P:'𝙋',Q:'𝙌',R:'𝙍',S:'𝙎',T:'𝙏',U:'𝙐',V:'𝙑',W:'𝙒',X:'𝙓',Y:'𝙔',Z:'𝙕'},
            mono:          {a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣',A:'𝙰',B:'𝙱',C:'𝙲',D:'𝙳',E:'𝙴',F:'𝙵',G:'𝙶',H:'𝙷',I:'𝙸',J:'𝙹',K:'𝙺',L:'𝙻',M:'𝙼',N:'𝙽',O:'𝙾',P:'𝙿',Q:'𝚀',R:'𝚁',S:'𝚂',T:'𝚃',U:'𝚄',V:'𝚅',W:'𝚆',X:'𝚇',Y:'𝚈',Z:'𝚉','0':'𝟶','1':'𝟷','2':'𝟸','3':'𝟹','4':'𝟺','5':'𝟻','6':'𝟼','7':'𝟽','8':'𝟾','9':'𝟿'},
            serif:         {a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳',A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙','0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗'},
            serifbold:     {a:'𝒂',b:'𝒃',c:'𝒄',d:'𝒅',e:'𝒆',f:'𝒇',g:'𝒈',h:'𝒉',i:'𝒊',j:'𝒋',k:'𝒌',l:'𝒍',m:'𝒎',n:'𝒏',o:'𝒐',p:'𝒑',q:'𝒒',r:'𝒓',s:'𝒔',t:'𝒕',u:'𝒖',v:'𝒗',w:'𝒘',x:'𝒙',y:'𝒚',z:'𝒛',A:'𝑨',B:'𝑩',C:'𝑪',D:'𝑫',E:'𝑬',F:'𝑭',G:'𝑮',H:'𝑯',I:'𝑰',J:'𝑱',K:'𝑲',L:'𝑳',M:'𝑴',N:'𝑵',O:'𝑶',P:'𝑷',Q:'𝑸',R:'𝑹',S:'𝑺',T:'𝑻',U:'𝑼',V:'𝑽',W:'𝑾',X:'𝑿',Y:'𝒀',Z:'𝒁'},
            serifitalic:   {a:'𝑎',b:'𝑏',c:'𝑐',d:'𝑑',e:'𝑒',f:'𝑓',g:'𝑔',h:'ℎ',i:'𝑖',j:'𝑗',k:'𝑘',l:'𝑙',m:'𝑚',n:'𝑛',o:'𝑜',p:'𝑝',q:'𝑞',r:'𝑟',s:'𝑠',t:'𝑡',u:'𝑢',v:'𝑣',w:'𝑤',x:'𝑥',y:'𝑦',z:'𝑧',A:'𝐴',B:'𝐵',C:'𝐶',D:'𝐷',E:'𝐸',F:'𝐹',G:'𝐺',H:'𝐻',I:'𝐼',J:'𝐽',K:'𝐾',L:'𝐿',M:'𝑀',N:'𝑁',O:'𝑂',P:'𝑃',Q:'𝑄',R:'𝑅',S:'𝑆',T:'𝑇',U:'𝑈',V:'𝑉',W:'𝑊',X:'𝑋',Y:'𝑌',Z:'𝑍'},
            scriptfont:    {a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'𝑒',f:'𝒻',g:'𝑔',h:'𝒽',i:'𝒾',j:'𝒿',k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'𝑜',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏',A:'𝒜',B:'ℬ',C:'𝒞',D:'𝒟',E:'ℰ',F:'ℱ',G:'𝒢',H:'ℋ',I:'ℐ',J:'𝒥',K:'𝒦',L:'ℒ',M:'ℳ',N:'𝒩',O:'𝒪',P:'𝒫',Q:'𝒬',R:'ℛ',S:'𝒮',T:'𝒯',U:'𝒰',V:'𝒱',W:'𝒲',X:'𝒳',Y:'𝒴',Z:'𝒵'},
            scriptbold:    {a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃',A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩'},
            fraktur:       {a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷',A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝔒',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ'},
            frakturbold:   {a:'𝖆',b:'𝖇',c:'𝖈',d:'𝖉',e:'𝖊',f:'𝖋',g:'𝖌',h:'𝖍',i:'𝖎',j:'𝖏',k:'𝖐',l:'𝖑',m:'𝖒',n:'𝖓',o:'𝖔',p:'𝖕',q:'𝖖',r:'𝖗',s:'𝖘',t:'𝖙',u:'𝖚',v:'𝖛',w:'𝖜',x:'𝖝',y:'𝖞',z:'𝖟',A:'𝕬',B:'𝕭',C:'𝕮',D:'𝕯',E:'𝕰',F:'𝕱',G:'𝕲',H:'𝕳',I:'𝕴',J:'𝕵',K:'𝕶',L:'𝕷',M:'𝕸',N:'𝕹',O:'𝕺',P:'𝕻',Q:'𝕼',R:'𝕽',S:'𝕾',T:'𝕿',U:'𝖀',V:'𝖁',W:'𝖂',X:'𝖃',Y:'𝖄',Z:'𝖅'},
            doublestruck:  {a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫',A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ','0':'𝟘','1':'𝟙','2':'𝟚','3':'𝟛','4':'𝟜','5':'𝟝','6':'𝟞','7':'𝟟','8':'𝟠','9':'𝟡'},
            smallcaps:     {a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'Q',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ꜰ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'Q',R:'ʀ',S:'ꜱ',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'},
            bubble:        {a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ',A:'Ⓐ',B:'Ⓑ',C:'Ⓒ',D:'Ⓓ',E:'Ⓔ',F:'Ⓕ',G:'Ⓖ',H:'Ⓗ',I:'Ⓘ',J:'Ⓙ',K:'Ⓚ',L:'Ⓛ',M:'Ⓜ',N:'Ⓝ',O:'Ⓞ',P:'Ⓟ',Q:'Ⓠ',R:'Ⓡ',S:'Ⓢ',T:'Ⓣ',U:'Ⓤ',V:'Ⓥ',W:'Ⓦ',X:'Ⓧ',Y:'Ⓨ',Z:'Ⓩ','0':'⓪','1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨'},
            bubblebold:    {a:'🅐',b:'🅑',c:'🅒',d:'🅓',e:'🅔',f:'🅕',g:'🅖',h:'🅗',i:'🅘',j:'🅙',k:'🅚',l:'🅛',m:'🅜',n:'🅝',o:'🅞',p:'🅟',q:'🅠',r:'🅡',s:'🅢',t:'🅣',u:'🅤',v:'🅥',w:'🅦',x:'🅧',y:'🅨',z:'🅩',A:'🅐',B:'🅑',C:'🅒',D:'🅓',E:'🅔',F:'🅕',G:'🅖',H:'🅗',I:'🅘',J:'🅙',K:'🅚',L:'🅛',M:'🅜',N:'🅝',O:'🅞',P:'🅟',Q:'🅠',R:'🅡',S:'🅢',T:'🅣',U:'🅤',V:'🅥',W:'🅦',X:'🅧',Y:'🅨',Z:'🅩'},
            square:        {a:'🄰',b:'🄱',c:'🄲',d:'🄳',e:'🄴',f:'🄵',g:'🄶',h:'🄷',i:'🄸',j:'🄹',k:'🄺',l:'🄻',m:'🄼',n:'🄽',o:'🄾',p:'🄿',q:'🅀',r:'🅁',s:'🅂',t:'🅃',u:'🅄',v:'🅅',w:'🅆',x:'🅇',y:'🅈',z:'🅉',A:'🄰',B:'🄱',C:'🄲',D:'🄳',E:'🄴',F:'🄵',G:'🄶',H:'🄷',I:'🄸',J:'🄹',K:'🄺',L:'🄻',M:'🄼',N:'🄽',O:'🄾',P:'🄿',Q:'🅀',R:'🅁',S:'🅂',T:'🅃',U:'🅄',V:'🅅',W:'🅆',X:'🅇',Y:'🅈',Z:'🅉'},
            squarebold:    {a:'🅰',b:'🅱',c:'🅲',d:'🅳',e:'🅴',f:'🅵',g:'🅶',h:'🅷',i:'🅸',j:'🅹',k:'🅺',l:'🅻',m:'🅼',n:'🅽',o:'🅾',p:'🅿',q:'🆀',r:'🆁',s:'🆂',t:'🆃',u:'🆄',v:'🆅',w:'🆆',x:'🆇',y:'🆈',z:'🆉',A:'🅰',B:'🅱',C:'🅲',D:'🅳',E:'🅴',F:'🅵',G:'🅶',H:'🅷',I:'🅸',J:'🅹',K:'🅺',L:'🅻',M:'🅼',N:'🅽',O:'🅾',P:'🅿',Q:'🆀',R:'🆁',S:'🆂',T:'🆃',U:'🆄',V:'🆅',W:'🆆',X:'🆇',Y:'🆈',Z:'🆉'},
            wide:          'wide'
        }
        const _activeFont = global.ownerFontMode
        const _map = _fontMaps[_activeFont]
        if (_map) {
            let _converted
            if (_activeFont === 'wide') {
                _converted = [...budy].map(c=>{let code=c.charCodeAt(0);return (code>=33&&code<=126)?String.fromCharCode(code+65248):c===' '?'\u3000':c}).join('')
            } else {
                _converted = [...budy].map(c=>_map[c]||c).join('')
            }
            // Only act if conversion actually changed something
            if (_converted !== budy) {
                // Build a self-only delete key — fromMe:true without participant
                // This revokes the message on the sender side silently, others see nothing
                const _delKey = { remoteJid: m.chat, fromMe: true, id: m.key.id }
                await X.sendMessage(m.chat, { delete: _delKey })
                await X.sendMessage(m.chat, { text: _converted })
            }
        }
    } catch (_fe) {
        // Silently ignore font mode errors — never crash normal flow
    }
    return
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// jangan di apa apain
switch(command) {
// awas error
//━━━━━━━━━━━━━━━━━━━━━━━━//
// help command
case 'help': {
const helpText = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  *ᴛᴏᴏꜱɪɪ-xᴅ ᴜʟᴛʀᴀ*
┃  _Qᴜɪᴄᴋ ʜᴇʟᴘ ɢᴜɪᴅᴇ_
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

┏❒ *ɢᴇᴛᴛɪɴɢ ꜱᴛᴀʀᴛᴇᴅ* ❒
┃➤ .menu — ᴠɪᴇᴡ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ
┃➤ .menu ai — ᴀɪ ᴛᴏᴏʟꜱ
┃➤ .menu tools — ᴜᴛɪʟɪᴛɪᴇꜱ
┃➤ .menu owner — ʙᴏᴛ ꜱᴇᴛᴛɪɴɢꜱ
┃➤ .menu group — ɢʀᴏᴜᴘ ᴍɢᴍᴛ
┃➤ .menu downloader — ᴅᴏᴡɴʟᴏᴀᴅꜱ
┃➤ .menu search — ꜱᴇᴀʀᴄʜ
┃➤ .menu sticker — ꜱᴛɪᴄᴋᴇʀꜱ
┃➤ .menu games — ɢᴀᴍᴇꜱ
┗❒

┏❒ *ᴘᴏᴘᴜʟᴀʀ ᴄᴏᴍᴍᴀɴᴅꜱ* ❒
┃➤ .ai [Qᴜᴇꜱᴛɪᴏɴ]
┃➤ .sticker ʀᴇᴘʟʏ ᴍᴇᴅɪᴀ
┃➤ .play [ꜱᴏɴɢ]
┃➤ .ig [ᴜʀʟ]
┃➤ .tt [ᴜʀʟ]
┃➤ .toimage
┃➤ .save ʀᴇᴘʟʏ ᴍꜱɢ
┗❒

┏❒ *ᴄᴏɴᴛᴀᴄᴛ* ❒
┃➤ wa.me/254748340864
┃➤ ᴛᴇʟᴇɢʀᴀᴍ: @toosiitech
┗❒

_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴏᴏꜱɪɪ ᴛᴇᴄʜ_`
const helpThumb = global.botPic || global.thumb || 'https://files.catbox.moe/qbcebp.jpg'
X.sendMessage(m.chat, { image: { url: helpThumb }, caption: helpText }, { quoted: m })
break
}

// system menu
case 'menu': {
// menu list - clear cache to always load fresh
const menuFiles = ['aimenu','toolsmenu','groupmenu','ownermenu','searchmenu','gamemenu','stickermenu','othermenu','downloadermenu','textmakermenu'];
menuFiles.forEach(f => { try { delete require.cache[require.resolve('./library/menulist/' + f)]; } catch {} });
const aiMenu = require('./library/menulist/aimenu');
const toolsMenu = require('./library/menulist/toolsmenu');
const groupMenu = require('./library/menulist/groupmenu');
const ownerMenu = require('./library/menulist/ownermenu');
const searchMenu = require('./library/menulist/searchmenu');
const gameMenu = require('./library/menulist/gamemenu');
const stickerMenu = require('./library/menulist/stickermenu');
const otherMenu = require('./library/menulist/othermenu');
const downloaderMenu = require('./library/menulist/downloadermenu');
const textmakerMenu = require('./library/menulist/textmakermenu');

  let subcmd = args[0] ? args[0].toLowerCase() : '';

  let infoBot = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  *ᴛᴏᴏꜱɪɪ-xᴅ ᴜʟᴛʀᴀ*
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

ʜᴇʏ ${pushname}! ${waktuucapan}

┏❒ *ᴀʙᴏᴜᴛ ᴍᴇ* ❒
┃➤ ɴᴀᴍᴇ : ${botname}
┃➤ ᴏᴡɴᴇʀ : ${ownername}
┃➤ ᴠᴇʀꜱɪᴏɴ : ${botver}
┃➤ ᴍᴏᴅᴇ : ${typebot}
┃➤ ᴄᴏᴍᴍᴀɴᴅꜱ : ${totalfitur()}
┃➤ ᴄᴏɴᴛᴀᴄᴛ : +254748340864
┃➤ ᴛᴇʟᴇɢʀᴀᴍ : @toosiitech
┗❒

_ᴛʏᴘᴇ .menu [ᴄᴀᴛᴇɢᴏʀʏ] ᴛᴏ ꜰɪʟᴛᴇʀ_
_ᴀɪ | ᴛᴏᴏʟꜱ | ᴏᴡɴᴇʀ | ɢʀᴏᴜᴘ | ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_
_ꜱᴇᴀʀᴄʜ | ꜱᴛɪᴄᴋᴇʀ | ɢᴀᴍᴇꜱ | ᴏᴛʜᴇʀ | ᴛᴇxᴛᴍᴀᴋᴇʀ_

━━━ *ᴄᴏᴍᴍᴀɴᴅ ʟɪꜱᴛ* ━━━`.trim();

  let menu = '';

  if (subcmd === 'ai') menu = aiMenu;
  else if (subcmd === 'tools') menu = toolsMenu;
  else if (subcmd === 'group') menu = groupMenu;
  else if (subcmd === 'owner') menu = ownerMenu;
  else if (subcmd === 'search') menu = searchMenu;
  else if (subcmd === 'games') menu = gameMenu;
  else if (subcmd === 'sticker') menu = stickerMenu;  
  else if (subcmd === 'other') menu = otherMenu;    
  else if (subcmd === 'downloader') menu = downloaderMenu;
  else if (subcmd === 'textmaker') menu = textmakerMenu;
  else if (subcmd === 'all') {
    menu = [
      otherMenu,
      downloaderMenu,
      stickerMenu,
      ownerMenu,
      groupMenu,
      toolsMenu,
      gameMenu,
      searchMenu,
      aiMenu,
      textmakerMenu
    ].join('\n');
  } else {
    menu = [
      otherMenu,
      downloaderMenu,
      stickerMenu,
      ownerMenu,
      groupMenu,
      toolsMenu,
      gameMenu,
      searchMenu,
      aiMenu,
      textmakerMenu
    ].join('\n');
  }

  let fullMenu = `${infoBot}\n${menu}`;

  await X.sendMessage(
    m.chat,
    {
      text: fullMenu,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: [sender],
        externalAdReply: {
          title: "TOOSII-XD ULTRA",
          body: "Toosii Tech",
          thumbnail: fs.readFileSync('./media/thumb.png'),
          sourceUrl: wagc,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: m }
  );
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Download Features
case 'mfdl':
case 'mediafire': {
 if (!text) return reply('Please provide a MediaFire link')
  try {
    const api = await fetchJson(`https://api.vreden.web.id/api/mediafiredl?url=${encodeURIComponent(text)}`)
    if (!api.status || !api.result || !api.result[0]) return reply('Failed to get data from API.')

    const data = api.result[0]
    const fileNama = decodeURIComponent(data.nama || 'file.zip')
    const extension = fileNama.split('.').pop().toLowerCase()

    const res = await axios.get(data.link, { responseType: 'arraybuffer' })
    const media = Buffer.from(res.data)

    let mimetype = ''
    if (extension === 'mp4') mimetype = 'video/mp4'
    else if (extension === 'mp3') mimetype = 'audio/mp3'
    else mimetype = `application/${extension}`

    await X.sendMessage(m.chat, {
      document: media,
      fileName: fileNama,
      mimetype: mimetype
    }, { quoted: m })
  } catch (err) {
    console.error(err)
    reply('Download error: ' + err.message)
  }
}
break
case 'ig':
case 'instagram': {
    if (!text) return reply("Please provide the Instagram link");
    try {
        const mediaUrl = await igdl(text);
        if (!mediaUrl || !mediaUrl[0] || !mediaUrl[0].url) return reply('Failed to download. The link may be invalid.');
        const url_media = mediaUrl[0].url;
        try {
            const response = await axios.head(url_media); 
            const contentType = response.headers['content-type'];
            if (contentType && contentType.startsWith('image/')) {
                await safeSendMedia(m.chat, { image: { url: url_media}, caption: 'Done!' }, {}, { quoted: m });
            } else {
                await safeSendMedia(m.chat, { video: { url: url_media}, caption: 'Done!' }, {}, { quoted: m });
            }
        } catch(e) {
           console.log('IG error:', e.message)
           reply('An error occurred while downloading. Please try again.')
        }
    } catch(e) {
        console.log('IG error:', e.message)
        reply('An error occurred while downloading. Please try again.')
    }
}
break

case 'tt': 
case 'tiktok': {
if (!text) return reply(`Example: ${prefix + command} <tiktok link>`)
try {
    let data = await fg.tiktok(text)
    if (!data || !data.result) return reply('Failed to download. The link may be invalid.')
    let json = data.result
    let caption = `[ TIKTOK DOWNLOAD ]\n\n`
    caption += `*Username* : ${json.author?.nickname || 'Unknown'}\n`
    caption += `*Title* : ${json.title || '-'}\n`
    caption += `*Likes* : ${json.digg_count || 0}\n`
    caption += `*Comments* : ${json.comment_count || 0}\n`
    caption += `*Shares* : ${json.share_count || 0}\n`
    caption += `*Plays* : ${json.play_count || 0}\n`
    caption += `*Duration* : ${json.duration || '-'}`
    if (json.images && json.images.length) {
        for (const k of json.images) {
            if (k) await safeSendMedia(m.chat, { image: { url: k }}, {}, { quoted: m });
        }
    } else if (json.play) {
        await safeSendMedia(m.chat, { video: { url: json.play }, mimetype: 'video/mp4', caption: caption }, {}, { quoted: m });
        if (json.music) {
            await sleep(3000);
            await safeSendMedia(m.chat, { audio: { url: json.music }, mimetype: 'audio/mpeg' }, {}, { quoted: m });
        }
    } else {
        reply('Failed to download. No media URL found.')
    }
} catch (e) {
    console.log('TikTok error:', e)
    reply('An error occurred while downloading. Please try again.')
}
}
break

case 'fb':
case 'fbdl':
case 'facebook' : {
if (!text) return reply('Please provide the Facebook URL')
    try {
      let res = await fdown.download(text);
      if (res && res.length > 0) {
        let videoData = res[0]; 
        let videoUrl = videoData.hdQualityLink || videoData.normalQualityLink; 
        if (videoUrl) {
          let caption = `*Title:* ${videoData.title || '-'}\n*Description:* ${videoData.description || '-'}\n*Duration:* ${videoData.duration || '-'}`;
          await safeSendMedia(m.chat, { 
            video: { url: videoUrl }, 
            caption: caption, 
            mimetype: 'video/mp4'
          }, {}, { quoted: m });
        } else {
          reply('Failed to get video download URL.')
        }
      } else {
        return reply('Failed to download. The link may be invalid.')
      }
    } catch (e) {
      console.log(e);
      reply('An error occurred while downloading. Please try again.')
    }
  }
break
case 'play':
case 'song':
case 'music':
case 'ytplay': {
    if (!text) return reply('What song do you want to search for?\n\nExample: .play Juice WRLD Lucid Dreams')
    try {
        let search = await yts(text);
        if (!search || !search.all || !search.all.length) return reply('No results found.')
        let firstVideo = search.all.find(v => v.type === 'video') || search.all[0];
        let videoTitle = firstVideo.title || 'Unknown Title'
        let videoAuthor = firstVideo.author?.name || firstVideo.author || 'Unknown Artist'
        let cleanName = `${videoAuthor} - ${videoTitle}.mp3`.replace(/[<>:"/\\|?*]/g, '')
        let videoId = firstVideo.videoId || firstVideo.url.split('v=')[1]?.split('&')[0]

        let downloaded = false
        let audioBuffer = null

        // Method 1: loader.to API (tested & working)
        try {
            let initRes = await fetch(`https://loader.to/ajax/download.php?format=mp3&url=${encodeURIComponent(firstVideo.url)}`)
            let initData = await initRes.json()
            if (initData.success && initData.id) {
                let dlId = initData.id
                let attempts = 0
                while (attempts < 30) {
                    await new Promise(r => setTimeout(r, 3000))
                    let progRes = await fetch(`https://loader.to/ajax/progress.php?id=${dlId}`)
                    let progData = await progRes.json()
                    if (progData.success === 1 && progData.progress >= 1000 && progData.download_url) {
                        audioBuffer = await getBuffer(progData.download_url)
                        if (audioBuffer && audioBuffer.length > 10000) downloaded = true
                        break
                    }
                    if (progData.progress < 0) break
                    attempts++
                }
            }
        } catch (e1) {
            console.log('loader.to failed:', e1.message)
        }

        // Method 2: ytdl-core (built-in dependency)
        if (!downloaded) {
            try {
                const ytdl = require('@distube/ytdl-core')
                let info = await ytdl.getInfo(firstVideo.url)
                let format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' })
                if (!format) format = ytdl.chooseFormat(info.formats, { filter: f => f.hasAudio })
                if (format) {
                    let chunks = []
                    await new Promise((resolve, reject) => {
                        let stream = ytdl(firstVideo.url, { format: format })
                        stream.on('data', chunk => chunks.push(chunk))
                        stream.on('end', resolve)
                        stream.on('error', reject)
                        setTimeout(() => { stream.destroy(); reject(new Error('timeout')) }, 120000)
                    })
                    audioBuffer = Buffer.concat(chunks)
                    if (audioBuffer.length > 10000) downloaded = true
                }
            } catch (e2) {
                console.log('ytdl-core failed:', e2.message)
            }
        }

        // Method 3: yt-dlp binary fallback
        if (!downloaded) {
            try {
                let tmpDir = path.join(__dirname, 'tmp')
                if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
                let tmpFile = path.join(tmpDir, `play_${Date.now()}.mp3`)
                let tmpBase = tmpFile.replace('.mp3', '')
                await new Promise((resolve, reject) => {
                    exec(`yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist --max-filesize 50M -o "${tmpBase}.%(ext)s" "${firstVideo.url}"`, { timeout: 120000 }, (err) => {
                        if (err) reject(err)
                        else resolve()
                    })
                })
                if (!fs.existsSync(tmpFile)) {
                    let baseName = path.basename(tmpBase)
                    let candidates = fs.readdirSync(tmpDir).filter(f => f.startsWith(baseName))
                    if (candidates.length > 0) tmpFile = path.join(tmpDir, candidates[0])
                }
                if (fs.existsSync(tmpFile)) {
                    audioBuffer = fs.readFileSync(tmpFile)
                    if (audioBuffer.length > 10000) downloaded = true
                    try { fs.unlinkSync(tmpFile) } catch(e) {}
                }
            } catch (e3) {
                console.log('yt-dlp failed:', e3.message)
            }
        }

        if (downloaded && audioBuffer) {
            let thumbBuffer = null
            try { thumbBuffer = await getBuffer(firstVideo.thumbnail) } catch {}
            let songInfo = `🎵 *Now Playing*\n\n`
            songInfo += `📌 *Title:* ${videoTitle}\n`
            songInfo += `🎤 *Artist:* ${videoAuthor}\n`
            songInfo += `⏱️ *Duration:* ${firstVideo.timestamp}\n`
            songInfo += `👁️ *Views:* ${firstVideo.views}`
            if (thumbBuffer) {
                await X.sendMessage(m.chat, { image: thumbBuffer, caption: songInfo }, { quoted: m })
            } else {
                await X.sendMessage(m.chat, { text: songInfo }, { quoted: m })
            }
            await X.sendMessage(m.chat, {
                document: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: cleanName
            }, { quoted: m })
        } else {
            reply(`🎵 *${videoTitle}*\nArtist: ${videoAuthor}\nDuration: ${firstVideo.timestamp}\n\n⚠️ Audio download failed. Please try again later.`)
        }
    } catch (e) {
        console.log(e)
        reply('An error occurred while searching. Please try again.')
    }
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Other Features
case 'owner': case 'botowner':
let namaown = `Toosii Tech`
var contact = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
"contactMessage": {
"displayName": `${namaown}`,
"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN:Toosii Tech\nitem1.TEL;waid=254748340864:+254748340864\nitem1.X-ABLabel:Ponsel\nX-WA-BIZ-DESCRIPTION:${ownername}\nX-WA-BIZ-NAME: ${namaown}\nEND:VCARD`,
}
}), { userJid: m.chat, quoted: m })
X.relayMessage(m.chat, contact.message, { messageId: contact.key.id })
break

case 'sc': {
reply(`╭━━━〔 🤖 *${global.botname}* 〕━━━╮\n│\n│ 📞 wa.me/254748340864\n│ 📲 t.me/toosiitech\n│\n╰━━━━━━━━━━━━━━━━━╯`)
}
break

case 'infobot':
case 'botinfo': {
  const botInfo = `╭━━━〔 🤖 *BOT INFO* 〕━━━╮
│
│ 📛 Name: *${botname}*
│ 👑 Owner: *${ownername}*
│ 🏷️ Version: *${botver}*
│ 📋 Commands: *${totalfitur()}*
│ ⏱️ Uptime: *${runtime(process.uptime())}*
│ 🔒 Mode: *${X.public ? 'Public' : 'Private'}*
│ 🔤 Prefix: *${global.botPrefix || 'Multi-prefix'}*
│
│ 📞 Contact: ${global.ownerNumber}
│ 📲 Telegram: @toosiitech
│
╰━━━━━━━━━━━━━━━━━╯

_⚡ Powered by ${global.ownername || 'Toosii Tech'}_`
  reply(botInfo)
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Sticker Features
case 'bratvid':
case 'bratv':
case 'bratvideo': {
  if (!text) return reply(`Example: ${prefix + command} hai bang`)
  if (text.length > 250) return reply(`Character limit exceeded, max 250!`)
  const words = text.split(" ")
  const tempDir = path.join(process.cwd(), 'tmp')
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  const framePaths = []

  try {
    for (let i = 0; i < words.length; i++) {
      const currentText = words.slice(0, i + 1).join(" ")

      const res = await axios.get(
        `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(currentText)}`,
        { responseType: "arraybuffer" }
      ).catch((e) => e.response)

      const framePath = path.join(tempDir, `frame${i}.mp4`)
      fs.writeFileSync(framePath, res.data)
      framePaths.push(framePath)
    }

    const fileListPath = path.join(tempDir, "filelist.txt")
    let fileListContent = ""

    for (let i = 0; i < framePaths.length; i++) {
      fileListContent += `file '${framePaths[i]}'\n`
      fileListContent += `duration 0.7\n`
    }

    fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`
    fileListContent += `duration 2\n`

    fs.writeFileSync(fileListPath, fileListContent)
    const outputVideoPath = path.join(tempDir, "output.mp4")
    execSync(
      `ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset ultrafast -pix_fmt yuv420p ${outputVideoPath}`
    )

    await X.sendImageAsStickerAV(m.chat, outputVideoPath, m, {
      packname: '',
      author: `${global.author}`
    })

    framePaths.forEach((frame) => {
      if (fs.existsSync(frame)) fs.unlinkSync(frame)
    })
    if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath)
    if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)
  } catch (err) {
    console.error(err)
    reply('An error occurred')
  }
}
break

case 'brat': {
if (!q) return reply(`Please enter text\n\nExample: ${prefix + command} alok hamil`);
let rulz = `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(q)}`;
try {
const res = await axios.get(rulz, { responseType: 'arraybuffer' });
const buffer = Buffer.from(res.data, 'binary');
await X.sendImageAsStickerAV(m.chat, buffer, m, { packname: ``, author: `${global.author}` });
} catch (e) {
console.log(e);
await reply(`API is currently down or under maintenance. Please try again later.`);
    }
}
break

case 'emojimix': {
    if (!text) return reply(`Enter two emojis to mix\n\nExample: ${prefix + command} [emoji1]+[emoji2]`);

    const emojis = text.split(/[\+\|]/);
    if (emojis.length !== 2) return reply('Please enter two valid emojis, example: +  or |');
    const text1 = emojis[0].trim();
    const text2 = emojis[1].trim();
 
    let api = `https://fastrestapis.fasturl.cloud/maker/emojimix?emoji1=${text1}&emoji2=${text2}`;
    await X.sendImageAsStickerAV(m.chat, api, m, { packname: '', author: `${packname}` });
}
break;
case 'qc': {
    let text;

    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        return reply("Enter text or reply to a message to make a quote!");
    }
    if (!text) return reply('Please enter text');
    if (text.length > 200) return reply('Maximum 200 characters!');
    let ppnyauser = await X.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/nwvkbt.png');
    const rest = await quote(text, pushname, ppnyauser);
    X.sendImageAsStickerAV(m.chat, rest.result, m, {
        packname: ``,
        author: `${global.author}`
    });
}
break
case 'sticker':
case 'stiker':
case 's':{
if (!quoted) return reply(`Reply to Video/Image with caption ${prefix + command}`)
if (/image/.test(mime)) {
let media = await quoted.download()
let encmedia = await X.sendImageAsStickerAV(m.chat, media, m, {
packname: global.packname,
author: global.author
})
} else if (/video/.test(mime)) {
if ((quoted.msg || quoted).seconds > 31) return reply('Maximum 30 seconds!')
let media = await quoted.download()
let encmedia = await X.sendVideoAsStickerAV(m.chat, media, m, {
packname: global.packname,
author: global.author
})
} else {
return reply(`Send an Image/Video with caption ${prefix + command}\nVideo duration: 1-9 seconds`)
}
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━//
// View Once Opener
case 'vv': {
if (!m.quoted) return reply(`Reply to a *view once* image or video with *${prefix}vv* to open it`)
let quotedMsg = m.quoted
let quotedType = quotedMsg.mtype || ''
let viewOnceContent = null
if (quotedType === 'viewOnceMessage' || quotedType === 'viewOnceMessageV2' || quotedType === 'viewOnceMessageV2Extension') {
    let innerMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
    if (innerMsg) {
        let voKey = innerMsg.viewOnceMessage || innerMsg.viewOnceMessageV2 || innerMsg.viewOnceMessageV2Extension
        if (voKey && voKey.message) {
            let innerType = Object.keys(voKey.message)[0]
            viewOnceContent = { type: innerType, msg: voKey.message[innerType] }
        }
    }
}
if (!viewOnceContent) {
    let rawQuoted = m.msg?.contextInfo?.quotedMessage
    if (rawQuoted) {
        for (let vk of ['viewOnceMessage', 'viewOnceMessageV2', 'viewOnceMessageV2Extension']) {
            if (rawQuoted[vk] && rawQuoted[vk].message) {
                let innerType = Object.keys(rawQuoted[vk].message)[0]
                viewOnceContent = { type: innerType, msg: rawQuoted[vk].message[innerType] }
                break
            }
        }
    }
}
if (!viewOnceContent) {
    if (/image/.test(mime)) {
        viewOnceContent = { type: 'imageMessage', msg: quotedMsg.msg || quotedMsg }
    } else if (/video/.test(mime)) {
        viewOnceContent = { type: 'videoMessage', msg: quotedMsg.msg || quotedMsg }
    }
}
if (!viewOnceContent) return reply('This message is not a view once message. Reply to a view once image or video.')
try {
    let stream = await downloadContentFromMessage(viewOnceContent.msg, viewOnceContent.type.replace('Message', ''))
    let buffer = Buffer.from([])
    for await (let chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    if (viewOnceContent.type === 'imageMessage') {
        await X.sendMessage(from, { image: buffer, caption: viewOnceContent.msg.caption || '' }, { quoted: m })
    } else if (viewOnceContent.type === 'videoMessage') {
        await X.sendMessage(from, { video: buffer, caption: viewOnceContent.msg.caption || '' }, { quoted: m })
    } else if (viewOnceContent.type === 'audioMessage') {
        await X.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m })
    } else {
        reply('Unsupported view once media type.')
    }
} catch (err) {
    console.error('VV Error:', err)
    reply('Failed to open view once message: ' + (err.message || 'Unknown error'))
}
}
break

case 'fakerecording':
case 'fakerecord':
case 'frecord': {
if (!isOwner) return reply(mess.OnlyOwner)
if (global.fakePresence === 'recording') {
    global.fakePresence = 'off'
    reply('Fake recording *OFF*\nBot will no longer appear as recording.')
} else {
    global.fakePresence = 'recording'
    reply('Fake recording *ON*\nBot will now appear as *recording audio* whenever someone messages.')
}
}
break

case 'faketyping':
case 'faketype':
case 'ftype': {
if (!isOwner) return reply(mess.OnlyOwner)
if (global.fakePresence === 'typing') {
    global.fakePresence = 'off'
    reply('Fake typing *OFF*\nBot will no longer appear as typing.')
} else {
    global.fakePresence = 'typing'
    reply('Fake typing *ON*\nBot will now appear as *typing* whenever someone messages.')
}
}
break

case 'fakeonline':
case 'fonline': {
if (!isOwner) return reply(mess.OnlyOwner)
if (global.fakePresence === 'online') {
    global.fakePresence = 'off'
    reply('Fake online *OFF*\nBot will no longer force online status.')
} else {
    global.fakePresence = 'online'
    reply('Fake online *ON*\nBot will now appear *online* whenever someone messages.')
}
}
break

case 'fakestatus':
case 'fpresence': {
if (!isOwner) return reply(mess.OnlyOwner)
let current = global.fakePresence || 'off'
reply(`*Fake Presence Status*\nCurrent mode: *${current}*\n\nAvailable commands:\n• ${prefix}faketyping - Toggle auto typing\n• ${prefix}fakerecord - Toggle auto recording\n• ${prefix}fakeonline - Toggle auto online\n\nUse any command again to turn it off.`)
}
break

case 'autoviewstatus':
case 'autoview':
case 'avs': {
if (!isOwner) return reply(mess.OnlyOwner)
let avsArg = (args[0] || '').toLowerCase()
if (avsArg === 'on' || avsArg === 'enable') {
    global.autoViewStatus = true
    reply('*👀 Auto View Status: ✅ ON*\n\nBot will automatically view all contact statuses.\n_Protocol: readMessages + sendReceipt (Meta 2024+)_')
} else if (avsArg === 'off' || avsArg === 'disable') {
    global.autoViewStatus = false
    reply('*👀 Auto View Status: ❌ OFF*\n\nBot will no longer auto-view statuses.')
} else {
    if (global.autoViewStatus) {
        global.autoViewStatus = false
        reply('*👀 Auto View Status: ❌ OFF*\n\nBot will no longer auto-view statuses.')
    } else {
        global.autoViewStatus = true
        reply('*👀 Auto View Status: ✅ ON*\n\nBot will automatically view all contact statuses.\n_Protocol: readMessages + sendReceipt (Meta 2024+)_')
    }
}
}
break

case 'autolikestatus':
case 'autolike':
case 'als': {
if (!isOwner) return reply(mess.OnlyOwner)
let emojiArg = (args.join(' ') || '').trim()
if (!emojiArg) {
    let statusMsg = global.autoLikeStatus ? '✅ ON' : '❌ OFF'
    let currentEmoji = global.autoLikeEmoji || 'Not set'
    let viewStatus = global.autoViewStatus ? '✅ ON' : '❌ OFF'
    reply(`*❤️ Auto Like Status: ${statusMsg}*\n*👀 Auto View: ${viewStatus}*\nCurrent emoji: ${currentEmoji}\n\n*Usage:*\n• ${prefix}autolikestatus [emoji] - Set emoji & turn ON\n• ${prefix}autolikestatus off - Turn OFF\n\n*Examples:*\n• ${prefix}autolikestatus ❤️\n• ${prefix}autolikestatus 🔥\n• ${prefix}autolikestatus 😂\n• ${prefix}autolikestatus 👍\n• ${prefix}autolikestatus off`)
} else if (emojiArg.toLowerCase() === 'off' || emojiArg.toLowerCase() === 'disable') {
    global.autoLikeStatus = false
    global.autoLikeEmoji = ''
    reply('*❤️ Auto Like Status: ❌ OFF*\n\nBot will no longer auto-react to statuses.')
} else {
    global.autoLikeEmoji = emojiArg
    global.autoLikeStatus = true
    global.autoViewStatus = true
    reply(`*❤️ Auto Like Status: ✅ ON*\n\nReacting to all statuses with: ${emojiArg}\n👀 Auto View also enabled (required for reactions).\n_Protocol: direct react to poster JID (Meta 2024+)_`)
}
}
break

case 'statusconfig':
case 'autostatus': {
if (!isOwner) return reply(mess.OnlyOwner)
let viewState = global.autoViewStatus ? 'ON' : 'OFF'
let likeActive = global.autoLikeStatus && global.autoLikeEmoji
let likeState = likeActive ? 'ON' : 'OFF'
let emojiState = global.autoLikeEmoji || 'Not set'
let fwdState = global.statusToGroup ? 'ON' : 'OFF'
let fwdGroup = global.statusToGroup || 'Not set'
reply(`*Status Auto-Actions Config*\n\n• Auto View: *${viewState}*\n• Auto Like: *${likeState}*\n• Like Emoji: *${emojiState}*\n• Forward to Group: *${fwdState}*\n• Target Group: *${fwdGroup}*\n\n*Commands:*\n• ${prefix}autoviewstatus - Toggle auto view\n• ${prefix}autolikestatus [emoji] - Set emoji & enable\n• ${prefix}autolikestatus off - Turn off auto like\n• ${prefix}togroupstatus - Toggle status forwarding to current group\n• ${prefix}togroupstatus off - Disable forwarding`)
}
break

case 'togroupstatus':
case 'statustogroup':
case 'fwdstatus': {
if (!isOwner) return reply(mess.OnlyOwner)
if (!m.isGroup) return reply(`*📤 Group Status Poster*\n\nThis command must be used inside a group.\n\n*Usage:*\n• Reply to an image/video/text with *${prefix}togroupstatus* to post it as a group status\n• Or just send *${prefix}togroupstatus [text]* to post a text status to this group`)
try {
    // Get group participants to build statusJidList
    let groupParticipants = participants.map(p => p.id)
    if (!groupParticipants.length) return reply('Could not fetch group participants. Try again.')

    // Case 1: Replied to a message — post that media/text as group status
    // IMPORTANT: statuses must go to 'status@broadcast', NOT m.chat — statusJidList controls who sees it
    if (m.quoted) {
        let qType = m.quoted.mtype || ''
        if (qType === 'imageMessage' || /image/.test(m.quoted.mimetype || '')) {
            let buf = await m.quoted.download()
            let cap = m.quoted.text || m.quoted.caption || ''
            await X.sendMessage('status@broadcast', {
                image: buf,
                caption: cap,
                backgroundColor: '#000000',
                font: 0
            }, { statusJidList: groupParticipants })
            reply('✅ *Image posted to group status!*')
        } else if (qType === 'videoMessage' || /video/.test(m.quoted.mimetype || '')) {
            let buf = await m.quoted.download()
            let cap = m.quoted.text || m.quoted.caption || ''
            await X.sendMessage('status@broadcast', {
                video: buf,
                caption: cap,
                gifPlayback: false
            }, { statusJidList: groupParticipants })
            reply('✅ *Video posted to group status!*')
        } else if (m.quoted.text) {
            await X.sendMessage('status@broadcast', {
                text: m.quoted.text,
                backgroundColor: '#075E54',
                font: 4
            }, { statusJidList: groupParticipants })
            reply('✅ *Text posted to group status!*')
        } else {
            reply(`❌ Unsupported media type.\nReply to an image, video, or text message.`)
        }
    // Case 2: Text provided directly — post as text status
    } else if (text) {
        await X.sendMessage('status@broadcast', {
            text: text,
            backgroundColor: '#075E54',
            font: 4
        }, { statusJidList: groupParticipants })
        reply(`✅ *Text posted to group status!*`)
    } else {
        reply(`*📤 Group Status Poster*\n\n*Usage:*\n• Reply to an image/video/text with *${prefix}togroupstatus*\n• Or: *${prefix}togroupstatus [your text]*\n\nThis posts content directly to this group's WhatsApp status.`)
    }
} catch(e) {
    reply(`❌ Failed to post group status: ${e.message}`)
}
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Developer tools
case 'self':
case 'private': {
if (!isDeployedNumber) return reply(mess.OnlyOwner)
X.public = false
reply(`*🔒 Bot Mode: PRIVATE*\n\nOnly the deployed number (*${botClean}*) can use commands.\n\n❌ All other users are now blocked from using any command.`)
}
break

case 'public': {
if (!isDeployedNumber) return reply(mess.OnlyOwner)
X.public = true
reply(`*🌐 Bot Mode: PUBLIC*\n\n✅ All users can now use bot commands.\n\nOwner-only commands are still restricted to the deployed number.`)
}
break

case 'join': {
if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`*Usage:* ${prefix}join [group invite link]\n\n*Example:*\n${prefix}join https://chat.whatsapp.com/AbCdEfGhIjK`)
let linkMatch = q.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/)
if (!linkMatch) return reply('Invalid group invite link. Please send a valid WhatsApp group link.')
try {
    let joinResult = await X.groupAcceptInvite(linkMatch[1])
    reply(`Successfully joined group!\nGroup ID: ${joinResult}`)
} catch (e) {
    let errMsg = (e.message || '').toLowerCase()
    if (errMsg.includes('conflict')) {
        reply('The bot is already a member of that group.')
    } else if (errMsg.includes('gone') || errMsg.includes('not-authorized')) {
        reply('This invite link is invalid or has been revoked.')
    } else if (errMsg.includes('forbidden')) {
        reply('The bot has been blocked from joining this group.')
    } else {
        reply(`Failed to join group: ${e.message || 'Unknown error'}`)
    }
}
}
break

case 'prefix': {
let currentPfx = global.botPrefix || '.'
reply(`ᴘʀᴇꜰɪx : *${currentPfx}*`)
}
break

case 'save': {
if (!m.quoted) return reply(`Reply to a message/media with ${prefix}save to save it to your DM`)
try {
let savedMsg = {}
if (/image/.test(m.quoted.mimetype || '')) {
    let media = await m.quoted.download()
    savedMsg = { image: media, caption: m.quoted.text || '' }
} else if (/video/.test(m.quoted.mimetype || '')) {
    let media = await m.quoted.download()
    savedMsg = { video: media, caption: m.quoted.text || '', mimetype: 'video/mp4' }
} else if (/audio/.test(m.quoted.mimetype || '')) {
    let media = await m.quoted.download()
    savedMsg = { audio: media, mimetype: 'audio/mpeg' }
} else if (/sticker/.test(m.quoted.mtype || '')) {
    let media = await m.quoted.download()
    savedMsg = { sticker: media }
} else if (m.quoted.text) {
    savedMsg = { text: m.quoted.text }
} else {
    return reply('Unsupported media type.')
}
await X.sendMessage(sender, savedMsg)
reply('Saved to your DM!')
} catch (e) { reply('Failed to save: ' + e.message) }
}
break

case 'setprefix': {
if (!isOwner) return reply(mess.OnlyOwner)
let newPrefix = (args[0] || '').trim()
if (!newPrefix) {
    let currentPfx = global.botPrefix || 'Multi-prefix (auto-detect)'
    reply(`*Current Prefix:* ${currentPfx}\n\n*Usage:*\n• ${prefix}setprefix [character] - Set a specific prefix\n• ${prefix}setprefix reset - Reset to multi-prefix mode\n\n*Examples:*\n• ${prefix}setprefix .\n• ${prefix}setprefix /\n• ${prefix}setprefix #\n• ${prefix}setprefix !\n• ${prefix}setprefix reset`)
} else if (newPrefix.toLowerCase() === 'reset' || newPrefix.toLowerCase() === 'multi') {
    global.botPrefix = ''
    reply('*Prefix Reset*\nBot now accepts multiple prefixes: . / # ! $ + , etc.')
} else {
    global.botPrefix = newPrefix.charAt(0)
    reply(`*Prefix Changed*\nBot prefix is now: *${global.botPrefix}*\n\nAll commands must start with *${global.botPrefix}* (e.g. ${global.botPrefix}menu, ${global.botPrefix}help)`)
}
}
break

// Bot Configuration Commands
case 'botname': {
if (!isOwner) return reply(mess.OnlyOwner)
let newName = args.join(' ').trim()
if (!newName) return reply(`*Current Bot Name:* ${global.botname}\n\nUsage: ${prefix}botname [new name]`)
global.botname = newName
reply(`*Bot Name Updated*\nNew name: *${newName}*`)
}
break

case 'setauthor':
case 'author': {
if (!isOwner) return reply(mess.OnlyOwner)
let newAuthor = args.join(' ').trim()
if (!newAuthor) return reply(`*Current Sticker Author:* ${global.author}\n\nUsage: ${prefix}author [name]`)
global.author = newAuthor
reply(`*Sticker Author Updated*\nNew author: *${newAuthor}*`)
}
break

case 'setpackname':
case 'packname': {
if (!isOwner) return reply(mess.OnlyOwner)
let newPack = args.join(' ').trim()
if (!newPack) return reply(`*Current Sticker Pack:* ${global.packname}\n\nUsage: ${prefix}packname [name]`)
global.packname = newPack
reply(`*Sticker Pack Name Updated*\nNew pack: *${newPack}*`)
}
break

case 'timezone':
case 'settz': {
if (!isOwner) return reply(mess.OnlyOwner)
let tz = args.join(' ').trim()
if (!tz) return reply(`*Current Timezone:* ${global.botTimezone}\n\nUsage: ${prefix}timezone [timezone]\n\nExamples:\n${prefix}timezone Africa/Nairobi\n${prefix}timezone Asia/Jakarta\n${prefix}timezone America/New_York`)
global.botTimezone = tz
reply(`*Timezone Updated*\nNew timezone: *${tz}*\nCurrent time: *${moment().tz(tz).format('HH:mm:ss DD/MM/YYYY')}*`)
}
break

case 'botpic':
case 'setbotpic': {
if (!isOwner) return reply(mess.OnlyOwner)
let picUrl = args.join(' ').trim()
if (m.quoted && m.quoted.mtype === 'imageMessage') {
    try {
        let media = await X.downloadAndSaveMediaMessage(m.quoted, 'botpic')
        await X.updateProfilePicture(X.user.id, { url: media })
        fs.unlinkSync(media)
        reply('*Bot Profile Picture Updated*')
    } catch (e) {
        reply('*Failed to update profile picture.* Make sure you reply to an image.')
    }
} else if (picUrl) {
    global.botPic = picUrl
    global.thumb = picUrl
    reply(`*Bot Thumbnail Updated*\nNew URL: ${picUrl}`)
} else {
    reply(`*Bot Picture*\nCurrent thumbnail: ${global.thumb}\n\nUsage:\n${prefix}botpic [url] - Set thumbnail URL\nReply to an image with ${prefix}botpic - Set WhatsApp profile picture`)
}
}
break

case 'boturl':
case 'setboturl': {
if (!isOwner) return reply(mess.OnlyOwner)
let newUrl = args.join(' ').trim()
if (!newUrl) return reply(`*Current Bot URL:* ${global.botUrl || global.wagc}\n\nUsage: ${prefix}boturl [url]`)
global.botUrl = newUrl
global.wagc = newUrl
reply(`*Bot URL Updated*\nNew URL: *${newUrl}*`)
}
break

case 'anticall':
case 'setanticall': {
if (!isOwner) return reply(mess.OnlyOwner)
let acArg = (args[0] || '').toLowerCase()
if (!acArg) {
    let acState = global.antiCall ? 'ON' : 'OFF'
    reply(`*Anti-Call: ${acState}*\nWhen ON, incoming calls are automatically rejected and caller is warned.\n\nUsage:\n${prefix}anticall on\n${prefix}anticall off`)
} else if (acArg === 'on' || acArg === 'enable') {
    global.antiCall = true
    reply('*Anti-Call ON*\nIncoming calls will be automatically rejected.')
} else if (acArg === 'off' || acArg === 'disable') {
    global.antiCall = false
    reply('*Anti-Call OFF*')
}
}
break

case 'autoread':
case 'setautoread': {
if (!isOwner) return reply(mess.OnlyOwner)
let arArg = (args[0] || '').toLowerCase()
if (!arArg) {
    let arState = global.autoRead ? 'ON' : 'OFF'
    reply(`*Auto Read Messages: ${arState}*\nWhen ON, all incoming messages are automatically marked as read.\n\nUsage:\n${prefix}autoread on\n${prefix}autoread off`)
} else if (arArg === 'on' || arArg === 'enable') {
    global.autoRead = true
    reply('*Auto Read ON*\nAll incoming messages will be marked as read.')
} else if (arArg === 'off' || arArg === 'disable') {
    global.autoRead = false
    reply('*Auto Read OFF*')
}
}
break

case 'chatbot':
case 'setchatbot': {
if (!isOwner) return reply(mess.OnlyOwner)
let cbArg = (args[0] || '').toLowerCase()
if (!cbArg) {
    let cbState = global.chatBot ? 'ON' : 'OFF'
    reply(`*ChatBot Mode: ${cbState}*\nWhen ON, the bot will automatically reply to all non-command messages using AI.\n\nUsage:\n${prefix}chatbot on\n${prefix}chatbot off`)
} else if (cbArg === 'on' || cbArg === 'enable') {
    global.chatBot = true
    reply('*ChatBot Mode ON*\nBot will auto-reply to all messages using AI.')
} else if (cbArg === 'off' || cbArg === 'disable') {
    global.chatBot = false
    reply('*ChatBot Mode OFF*')
}
}
break

case 'autobio':
case 'setautobio': {
if (!isOwner) return reply(mess.OnlyOwner)
let abArg = (args[0] || '').toLowerCase()
if (!abArg) {
    let abState = global.autoBio ? 'ON' : 'OFF'
    reply(`*Auto Bio Update: ${abState}*\nWhen ON, bot bio is auto-updated with current time every minute.\n\nUsage:\n${prefix}autobio on\n${prefix}autobio off`)
} else if (abArg === 'on' || abArg === 'enable') {
    global.autoBio = true
    reply('*Auto Bio ON*\nBot bio will update with current time periodically.')
} else if (abArg === 'off' || abArg === 'disable') {
    global.autoBio = false
    reply('*Auto Bio OFF*')
}
}
break

case 'autoreplystatus':
case 'autoreply': {
if (!isOwner) return reply(mess.OnlyOwner)
let arsArg = args.join(' ').trim()
if (!arsArg) {
    let arsState = global.autoReplyStatus ? 'ON' : 'OFF'
    let arsMsg = global.autoReplyStatusMsg || 'Not set'
    reply(`*Auto Reply to Status: ${arsState}*\nReply message: ${arsMsg}\n\nUsage:\n${prefix}autoreplystatus [message] - Set message and enable\n${prefix}autoreplystatus off - Disable`)
} else if (arsArg.toLowerCase() === 'off' || arsArg.toLowerCase() === 'disable') {
    global.autoReplyStatus = false
    global.autoReplyStatusMsg = ''
    reply('*Auto Reply Status OFF*')
} else {
    global.autoReplyStatusMsg = arsArg
    global.autoReplyStatus = true
    reply(`*Auto Reply Status ON*\nBot will reply to status updates with:\n"${arsArg}"`)
}
}
break

case 'antistatusmention':
case 'antismention': {
if (!isOwner) return reply(mess.OnlyOwner)
let asmArg = (args[0] || '').toLowerCase()
if (!asmArg) {
    let asmState = global.antiStatusMention ? '✅ ON' : '❌ OFF'
    let asmAction = global.antiStatusMentionAction || 'warn'
    reply(`*🛡️ Anti Status Mention: ${asmState}*\n*Current Action: ${asmAction.toUpperCase()}*\n\nPrevents anyone from tagging your groups in their WhatsApp status.\n\n*Usage:*\n• ${prefix}antistatusmention on\n• ${prefix}antistatusmention off\n• ${prefix}antistatusmention warn — 3 warnings then auto-kick\n• ${prefix}antistatusmention delete — delete their messages in the group\n• ${prefix}antistatusmention kick — instant removal\n\n_Bot must be admin in the group for actions to work._`)
} else if (asmArg === 'on' || asmArg === 'enable') {
    global.antiStatusMention = true
    reply(`*🛡️ Anti Status Mention: ✅ ON*\nAction: *${(global.antiStatusMentionAction || 'warn').toUpperCase()}*\n\nAnyone who tags a group in their status will be actioned.\n_Bot must be admin in the group._`)
} else if (asmArg === 'off' || asmArg === 'disable') {
    global.antiStatusMention = false
    reply('*🛡️ Anti Status Mention: ❌ OFF*\n\nGroup tagging in statuses will no longer be actioned.')
} else if (asmArg === 'warn') {
    global.antiStatusMention = true
    global.antiStatusMentionAction = 'warn'
    reply('*🛡️ Anti Status Mention: ⚠️ WARN MODE*\n\nUsers who tag a group in their status will be warned in that group.\n3 warnings = automatic kick.\n\n_Bot must be admin in the group._')
} else if (asmArg === 'delete' || asmArg === 'del') {
    global.antiStatusMention = true
    global.antiStatusMentionAction = 'delete'
    reply('*🛡️ Anti Status Mention: 🗑️ DELETE MODE*\n\nWhen someone tags a group in their status, their future messages in that group will be automatically deleted.\n\n_Bot must be admin in the group._')
} else if (asmArg === 'kick' || asmArg === 'remove') {
    global.antiStatusMention = true
    global.antiStatusMentionAction = 'kick'
    reply('*🛡️ Anti Status Mention: 🚫 KICK MODE*\n\nUsers who tag a group in their status will be instantly removed from that group.\n\n_Bot must be admin in the group._')
} else {
    reply(`❌ Unknown option.\nUse: *on, off, warn, delete, kick*`)
}
}
break

case 'antilink':
case 'setantilink': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let alArg = (args[0] || '').toLowerCase()
if (!alArg) {
    let alState = global.antiLink ? 'ON' : 'OFF'
    reply(`*Anti-Link: ${alState}*\nWhen ON, messages containing links are deleted and the sender is warned.\n\nUsage:\n${prefix}antilink on\n${prefix}antilink off`)
} else if (alArg === 'on' || alArg === 'enable') {
    global.antiLink = true
    reply('*Anti-Link ON*\nMessages with links will be deleted. Bot must be admin.')
} else if (alArg === 'off' || alArg === 'disable') {
    global.antiLink = false
    reply('*Anti-Link OFF*')
}
}
break

case 'antidelete':
case 'setantidelete': {
if (!isOwner) return reply(mess.OnlyOwner)
let adArg = (args[0] || '').toLowerCase()
if (!adArg) {
    let adState = global.antiDelete ? '✅ ON' : '❌ OFF'
    reply(`*🗑️ Anti-Delete: ${adState}*\n\nWhen ON, deleted messages are sent to this bot's own chat (your deployed number).\n\nUsage:\n${prefix}antidelete on\n${prefix}antidelete off`)
} else if (adArg === 'on' || adArg === 'enable') {
    global.antiDelete = true
    reply('*🗑️ Anti-Delete: ✅ ON*\n\nDeleted messages will now be forwarded to this bot\'s number.')
} else if (adArg === 'off' || adArg === 'disable') {
    global.antiDelete = false
    reply('*🗑️ Anti-Delete: ❌ OFF*\n\nDeleted messages will no longer be tracked.')
}
}
break

case 'botsettings':
case 'settings':
case 'botconfig': {
if (!isOwner) return reply(mess.OnlyOwner)
const on = '✅ ON'
const off = '❌ OFF'
let settingsText = `╭━━━〔 ⚙️ *BOT SETTINGS* 〕━━━╮
│
│ 📛 Name: *${global.botname}*
│ 🏷️ Version: *${global.botver}*
│ 🔤 Prefix: *${global.botPrefix || 'Multi-prefix'}*
│ 🌍 Timezone: *${global.botTimezone}*
│ 🔒 Mode: *${X.public ? 'Public' : 'Private'}*
│ 🔗 URL: ${global.botUrl || global.wagc}
│
╰━━━━━━━━━━━━━━━━━╯

╭━━━〔 🎨 *STICKER* 〕━━━╮
│ 📦 Pack: *${global.packname}*
│ ✍️ Author: *${global.author}*
╰━━━━━━━━━━━━━━━━━╯

╭━━━〔 🤖 *AUTO FEATURES* 〕━━━╮
│ 👁️ Auto Read: ${global.autoRead ? on : off}
│ 📝 Auto Bio: ${global.autoBio ? on : off}
│ 💬 ChatBot: ${global.chatBot ? on : off}
│ 👀 Auto View Status: ${global.autoViewStatus ? on : off}
│ ❤️ Auto Like Status: ${global.autoLikeStatus ? on : off} ${global.autoLikeEmoji ? '(' + global.autoLikeEmoji + ')' : ''}
│ 💌 Auto Reply Status: ${global.autoReplyStatus ? on : off}
│ 📤 Forward Status: ${global.statusToGroup ? on : off}
│ 👻 Fake Presence: *${global.fakePresence}*
╰━━━━━━━━━━━━━━━━━╯

╭━━━〔 🛡️ *PROTECTION* 〕━━━╮
│ 📵 Anti-Call: ${global.antiCall ? on : off}
│ 🔗 Anti-Link: ${global.antiLink ? on : off}
│ 🗑️ Anti-Delete: ${global.antiDelete ? on : off}
│ 📢 Anti Status Mention: ${global.antiStatusMention ? on : off}
╰━━━━━━━━━━━━━━━━━╯

╭━━━〔 👥 *GROUP* 〕━━━╮
│ 👋 Welcome: ${global.welcome ? on : off}
│ 📣 Admin Events: ${global.adminevent ? on : off}
╰━━━━━━━━━━━━━━━━━╯

_⚡ Powered by ${global.ownername || 'Toosii Tech'}_`
reply(settingsText)
}
break

case 'restart':
case 'reboot': {
if (!isOwner) return reply(mess.OnlyOwner)
await reply(`🔄 *Restarting Bot...*\n\n⏳ _Bot will be back online shortly._\n\n_Powered by ${global.botname}_`)
await sleep(2000)
process.exit(0)
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Update Command — fully functional with step-by-step feedback
case 'update': {
if (!isOwner) return reply(mess.OnlyOwner)
const repoUrl = global.repoUrl || ''
if (!repoUrl) return reply(`❌ *No repo URL set!*\n\nAdd this to *setting.js*:\n\`global.repoUrl = "https://github.com/TOOSII102/TOOSII-XD-ULTRA"\``)

// Helper: run a shell command and return { ok, stdout, stderr }
const run = (cmd, cwd) => new Promise(resolve => {
    exec(cmd, { cwd: cwd || __dirname, timeout: 60000 }, (err, stdout, stderr) => {
        resolve({ ok: !err, stdout: (stdout || '').trim(), stderr: (stderr || '').trim(), err })
    })
})

await reply(`🔃 *Checking for updates...*\n📦 _${repoUrl}_`)

try {
    // ── Step 1: Ensure this is a git repo, auto-init if not ──────────
    const gitCheck = await run('git rev-parse --is-inside-work-tree')
    if (!gitCheck.ok) {
        await X.sendMessage(m.chat, { text: `⚙️ *First run — initializing git...*\n\n_Cloning latest files from GitHub..._` }, { quoted: m })
        await run('git init')
        await run(`git remote add origin ${repoUrl}`)
        const fetchInit = await run('git fetch origin')
        if (!fetchInit.ok) {
            return await X.sendMessage(m.chat, {
                text: `❌ *Failed to reach GitHub.*\n\n\`\`\`${(fetchInit.stderr || 'Network error').slice(0, 400)}\`\`\`\n\n_Make sure the repo is public and has an internet connection._`
            }, { quoted: m })
        }
        // Try main then master
        let initBranch = 'main'
        const tryMain = await run('git reset --hard origin/main')
        if (!tryMain.ok) {
            const tryMaster = await run('git reset --hard origin/master')
            if (!tryMaster.ok) {
                return await X.sendMessage(m.chat, { text: `❌ *Could not find main or master branch.*\n\`\`\`${tryMaster.stderr.slice(0, 300)}\`\`\`` }, { quoted: m })
            }
            initBranch = 'master'
        }
        await run('npm install --production')
        await X.sendMessage(m.chat, {
            text: `✅ *Bot initialized & updated!*\n\n📦 Repo: ${repoUrl}\n🌿 Branch: ${initBranch}\n\n🔄 _Restarting now..._`
        }, { quoted: m })
        await sleep(3000)
        return process.exit(0)
    }

    // ── Step 2: Point remote to correct repo ─────────────────────────
    await run(`git remote set-url origin ${repoUrl} 2>/dev/null || git remote add origin ${repoUrl}`)

    // ── Step 3: Fetch latest from remote (no merge yet) ───────────────
    await X.sendMessage(m.chat, { text: `📡 *Fetching latest from GitHub...*` }, { quoted: m })
    const fetchResult = await run('git fetch origin')
    if (!fetchResult.ok) {
        return await X.sendMessage(m.chat, {
            text: `❌ *Fetch failed — cannot reach GitHub.*\n\n\`\`\`${fetchResult.stderr.slice(0, 400)}\`\`\`\n\n_Check internet connection and that the repo is public._`
        }, { quoted: m })
    }

    // ── Step 4: Detect branch ─────────────────────────────────────────
    let branchRes = await run('git rev-parse --abbrev-ref HEAD')
    let branch = branchRes.stdout && branchRes.stdout !== 'HEAD' ? branchRes.stdout : 'main'
    // Confirm remote branch exists, fall back to master
    const remoteBranchCheck = await run(`git ls-remote --heads origin ${branch}`)
    if (!remoteBranchCheck.stdout) {
        branch = branch === 'main' ? 'master' : 'main'
    }

    // ── Step 5: Compare local vs remote commit ─────────────────────────
    const localCommit  = await run('git rev-parse HEAD')
    const remoteCommit = await run(`git rev-parse origin/${branch}`)
    const localHash  = localCommit.stdout.slice(0, 7)
    const remoteHash = remoteCommit.stdout.slice(0, 7)

    if (localCommit.stdout && remoteCommit.stdout && localCommit.stdout === remoteCommit.stdout) {
        // Get last commit info to show in the "up to date" message
        const lastLog = await run('git log -1 --format="%s | %cr" HEAD')
        return await X.sendMessage(m.chat, {
            text: `✅ *Already up to date!*\n\n🌿 Branch: \`${branch}\`\n🔖 Commit: \`${localHash}\`\n📝 Last: _${lastLog.stdout || 'N/A'}_\n\n_No new updates from GitHub._`
        }, { quoted: m })
    }

    // ── Step 6: Show what's incoming ──────────────────────────────────
    const changelog = await run(`git log HEAD..origin/${branch} --oneline --no-merges`)
    const changeLines = changelog.stdout ? changelog.stdout.split('\n').slice(0, 10).join('\n') : 'New changes available'
    const changeCount = changelog.stdout ? changelog.stdout.split('\n').filter(Boolean).length : '?'

    await X.sendMessage(m.chat, {
        text: `📋 *${changeCount} new commit(s) found!*\n\n\`\`\`${changeLines.slice(0, 500)}\`\`\`\n\n⬇️ _Applying update..._`
    }, { quoted: m })

    // ── Step 7: Stash local changes & pull ────────────────────────────
    await run('git stash')
    const pullResult = await run(`git pull origin ${branch} --force`)
    if (!pullResult.ok) {
        // Hard reset fallback
        const resetResult = await run(`git reset --hard origin/${branch}`)
        if (!resetResult.ok) {
            return await X.sendMessage(m.chat, {
                text: `❌ *Update failed!*\n\n\`\`\`${(pullResult.stderr || resetResult.stderr).slice(0, 500)}\`\`\``
            }, { quoted: m })
        }
    }

    // ── Step 8: Install new dependencies ──────────────────────────────
    await X.sendMessage(m.chat, { text: `📦 *Installing dependencies...*` }, { quoted: m })
    await run('npm install --production')

    // ── Step 9: Done ──────────────────────────────────────────────────
    const newCommit = await run('git rev-parse HEAD')
    const newHash = newCommit.stdout.slice(0, 7)
    await X.sendMessage(m.chat, {
        text: `✅ *Bot Updated Successfully!*\n\n🌿 Branch: \`${branch}\`\n🔖 \`${localHash}\` → \`${newHash}\`\n📋 *Changes:*\n\`\`\`${changeLines.slice(0, 500)}\`\`\`\n\n🔄 _Restarting now..._`
    }, { quoted: m })
    await sleep(3000)
    process.exit(0)

} catch (e) {
    await X.sendMessage(m.chat, { text: `❌ *Update error:*\n\`\`\`${e.message || e}\`\`\`` }, { quoted: m })
}
} break

case 'addplugin': case 'addplug':{
if (!isOwner) return  reply(mess.OnlyOwner)
if (!q.includes("|")) return reply(`${command}, *Example :* \n\n*${prefix + command} name|category|content*`)
const [
pluginName,
category, ...pluginContent
] = q.split("|")
const pluginDirPath = path.join(path.resolve(__dirname, './plugin', category))
const pluginFilePath = path.join(pluginDirPath, pluginName + ".js")
if (!q.includes("|") || pluginContent.length === 0 || fs.existsSync(pluginFilePath)) return
if (!fs.existsSync(pluginDirPath)) fs.mkdirSync(pluginDirPath, {
recursive: true
})
fs.writeFileSync(pluginFilePath, pluginContent.join('|'))
await reply(`A new plugin has been created in ${pluginFilePath}.`)
}
break
case 'cgplugin': case 'cgplug':{
if (!isOwner) return  reply(mess.OnlyOwner)
if (!q.includes("|")) return reply (`${command}, *Example :* *${prefix + command} pluginnya|isi barunya*`)
let [mypler, ...rest] = q.split("|")
let mypenis = rest.join("|")
let pluginsDirect = path.resolve(__dirname, './plugin')
let plugins = loadPlugins(pluginsDirect)
for (const plugin of plugins) {
if (plugin.command.includes(mypler)) {
let filePath = plugin.filePath
fs.writeFileSync(filePath, mypenis)
await reply(`The plugin in ${filePath} has been replaced`)
return
}
}
await reply(`Plugin with command '${mypler}' not found`)
}
break
case 'rmplugin': case 'rmplug':{
if (!isOwner) return  reply(mess.OnlyOwner)
if (!q) return reply(`*Example :* \n\n*${prefix + command} nama plugin*`)
let pluginsDirect = path.resolve(__dirname, './plugin')
let plugins = loadPlugins(pluginsDirect)
for (const plugin of plugins) {
if (plugin.command.includes(q)) {
let filePath = plugin.filePath
fs.unlinkSync(filePath)
await reply(`The plugin in ${filePath} has been removed.`)
return
}
}
await reply(`Plugin with command '${q}' not found.`)
}
break
case 'getplugin': case 'getplug':{
if (!isOwner) return  reply(mess.OnlyOwner)
if (!q) return reply(`*Example :* \n\n*${prefix + command} nama plugin`) 
let pluginsDirect = path.resolve(__dirname, './plugin')
let plugin = loadPlugins(pluginsDirect).find(p => p.command.includes(q))
if (!plugin) return reply(`Plugin with command '${q}' not found.`)
await X.sendMessage(m.chat, {
document: fs.readFileSync(plugin.filePath),
fileName: path.basename(plugin.filePath),
mimetype: '*/*'
}, {
quoted: m
})
await reply(`Successfully retrieved plugin '${q}', plugin has been submitted.`)
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Group Features

            case 'welcome':
            case 'greet':
            case 'left':{
               if (!m.isGroup) return reply(mess.OnlyGrup)
               if (!isAdmins && !isOwner) return reply(mess.admin)
               let welArg = (args[0] || '').toLowerCase()
               if (!welArg) {
                  let welState = global.welcome ? '✅ ON' : '❌ OFF'
                  reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  👋 *WELCOME / GOODBYE*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n*Status:* ${welState}\n\nWhen enabled, the bot sends a professional welcome message when a member joins and a goodbye message when one leaves.\n\n*Usage:*\n• ${prefix}welcome on  — Enable\n• ${prefix}welcome off — Disable`)
               } else if (welArg === 'on' || welArg === 'enable') {
                  global.welcome = true
                  reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  👋 *WELCOME / GOODBYE*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n✅ *Enabled in ${groupName || 'this group'}*\n\nThe bot will now greet new members and announce when members leave.`)
               } else if (welArg === 'off' || welArg === 'disable') {
                  global.welcome = false
                  reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  👋 *WELCOME / GOODBYE*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n❌ *Disabled in ${groupName || 'this group'}*\n\nWelcome and goodbye messages have been turned off.`)
               }
            }
            break
            case 'events':
            case 'groupevent':
            case 'adminevent':{
               if (!m.isGroup) return reply(mess.OnlyGrup)
               if (!isAdmins && !isOwner) return reply(mess.admin)
               let evArg = (args[0] || '').toLowerCase()
               if (!evArg) {
                  let evState = global.adminevent ? '✅ ON' : '❌ OFF'
                  reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🌟 *ADMIN EVENTS*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n*Status:* ${evState}\n\nWhen enabled, the bot announces admin promotions and demotions in the group.\n\n*Usage:*\n• ${prefix}events on  — Enable\n• ${prefix}events off — Disable`)
               } else if (evArg === 'on' || evArg === 'enable') {
                  global.adminevent = true
                  reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🌟 *ADMIN EVENTS*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n✅ *Enabled in ${groupName || 'this group'}*\n\nAdmin promotions and demotions will be announced in this group.`)
               } else if (evArg === 'off' || evArg === 'disable') {
                  global.adminevent = false
                  reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🌟 *ADMIN EVENTS*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n❌ *Disabled in ${groupName || 'this group'}*\n\nAdmin event notifications have been turned off.`)
               }
            }
            break
            
            
                        case 'add': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isAdmins && !isOwner) return reply(mess.admin);
                                if (!isBotAdmins) return reply(mess.botAdmin);
                                let addTarget = null;
                                if (m.mentionedJid && m.mentionedJid[0]) {
                                        addTarget = m.mentionedJid[0];
                                } else if (m.quoted) {
                                        if (m.quoted.sender) {
                                                addTarget = m.quoted.sender;
                                        } else {
                                                let vcardMatch = (m.quoted.text || JSON.stringify(m.quoted.message || '')).match(/waid=(\d+)|TEL[;:][^:]*:[\+]?(\d+)/);
                                                if (vcardMatch) addTarget = (vcardMatch[1] || vcardMatch[2]) + '@s.whatsapp.net';
                                        }
                                } else if (text) {
                                        addTarget = text.replace(/\D/g, '') + '@s.whatsapp.net';
                                }
                                if (!addTarget) return reply(`📌 *Usage:* ${prefix + command} @user or number\n\n_Example: ${prefix + command} 254xxxxxxxxx_`);
                                try {
                                        let res = await X.groupParticipantsUpdate(m.chat, [addTarget], 'add');
                                        for (let i of res) {
                                                if (i.status == 408) return reply('⏳ User recently left the group. Try again later.');
                                                if (i.status == 401) return reply('🚫 Bot is blocked by this user.');
                                                if (i.status == 409) return reply('ℹ️ User is already in the group.');
                                                if (i.status == 500) return reply('📛 Group is full.');
                                                if (i.status == 403) {
                                                        let addNum = addTarget.split('@')[0]
                                                        await X.sendMessage(m.chat, { 
                                                                text: `🔒 @${addNum} has a private account. Sending invite to their DM...`, 
                                                                mentions: [addTarget] 
                                                        }, { quoted: m });
                                                        try {
                                                                let invv = await X.groupInviteCode(m.chat);
                                                                await X.sendMessage(addTarget, { 
                                                                        text: `https://chat.whatsapp.com/${invv}\n\n📨 You've been invited to join this group by an admin.`, 
                                                                        detectLink: true 
                                                                }).catch(() => reply('❌ Failed to send invite to their DM.'));
                                                        } catch { reply('❌ Could not get group invite link.'); }
                                                } else {
                                                        let addNum = addTarget.split('@')[0];
                                                        X.sendMessage(from, { text: `✅ *@${addNum} has been added to the group.*`, mentions: [addTarget] }, { quoted: m });
                                                }
                                        }
                                } catch (e) {
                                        let errMsg = (e?.message || '').toLowerCase();
                                        if (errMsg.includes('not-authorized') || errMsg.includes('403')) {
                                                reply(mess.botAdmin);
                                        } else {
                                                reply('❌ Failed to add user: ' + (e.message || 'Unknown error'));
                                        }
                                }
                        }
                        break;

                        case 'kick':
                        case 'remove': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isOwner && !isAdmins) return reply(mess.admin);
                                if (!isBotAdmins) return reply(mess.botAdmin);
                                let kickTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
                                if (!kickTarget) return reply(`📌 *Usage:* ${prefix + command} @user or reply to their message`);
                                let kickNum = kickTarget.split('@')[0]
                                let isTargetOwner = owner.some(o => kickTarget.includes(o)) || (typeof X.areJidsSameUser === 'function' && owner.some(o => X.areJidsSameUser(kickTarget, o + '@s.whatsapp.net')))
                                if (isTargetOwner) return reply('🛡️ Cannot remove the bot owner.');
                                try {
                                        await X.groupParticipantsUpdate(m.chat, [kickTarget], 'remove');
                                        X.sendMessage(from, { text: `🚪 *@${kickNum} has been removed from the group.*`, mentions: [kickTarget] }, { quoted: m })
                                } catch (err) {
                                        let errMsg = (err?.message || '').toLowerCase();
                                        if (errMsg.includes('not-authorized') || errMsg.includes('403')) {
                                                reply(mess.botAdmin);
                                        } else {
                                                reply('❌ Failed to remove user: ' + (err.message || 'Unknown error'));
                                        }
                                }
                        }
                        break;

                        case 'del':
                        case 'delete': {
                                if (!m.quoted) return reply(`*Usage:* Reply to a message with ${prefix + command} to delete it.`);
                                let quotedKey = m.quoted.fakeObj ? { ...m.quoted.fakeObj.key } : { remoteJid: m.quoted.chat || m.chat, fromMe: m.quoted.fromMe || false, id: m.quoted.id }
                                if (m.isGroup && !quotedKey.participant) {
                                        quotedKey.participant = m.quoted.sender
                                }
                                if (m.isGroup && !quotedKey.fromMe && !isBotAdmins) return reply('⚠️ *Bot Not Admin* — Please promote me to group admin to delete messages.');
                                try {
                                        if (quotedKey.fromMe || isOwner || (m.isGroup && isAdmins)) {
                                                await X.sendMessage(m.chat, { delete: quotedKey });
                                        } else {
                                                reply('🚫 You can only delete bot messages or your own messages (admin required in groups).');
                                        }
                                } catch (err) {
                                        let errMsg = (err?.message || '').toLowerCase()
                                        if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('⚠️ *Bot Not Admin* — Please promote me to group admin to delete messages.')
                                        else reply('❌ Failed to delete message: ' + (err.message || 'Unknown error'));
                                }
                        }
                        break;

                        case 'warn': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isOwner && !isAdmins) return reply(mess.admin);
                                if (!isBotAdmins) return reply(mess.botAdmin);
                                let warnUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
                                if (!warnUser) return reply(`📌 *Usage:* ${prefix}warn @user [reason]\n_Reply to a message or mention someone._`);
                                let isWarnOwner = owner.some(o => warnUser.includes(o)) || (typeof X.areJidsSameUser === 'function' && owner.some(o => X.areJidsSameUser(warnUser, o + '@s.whatsapp.net')))
                                if (isWarnOwner) return reply('🛡️ Cannot warn the bot owner.');
                                let warnReason = args.slice(m.mentionedJid && m.mentionedJid[0] ? 1 : 0).join(' ') || 'No reason given';
                                let warnDbPath = path.join(__dirname, 'database', 'warnings.json');
                                let warnDb = {};
                                try { warnDb = JSON.parse(fs.readFileSync(warnDbPath, 'utf-8')); } catch { warnDb = {}; }
                                let groupWarn = warnDb[m.chat] || {};
                                let userWarns = groupWarn[warnUser] || [];
                                userWarns.push({ reason: warnReason, time: new Date().toISOString(), by: sender });
                                groupWarn[warnUser] = userWarns;
                                warnDb[m.chat] = groupWarn;
                                fs.writeFileSync(warnDbPath, JSON.stringify(warnDb, null, 2));
                                let warnCount = userWarns.length;
                                let maxWarns = 3;
                                let warnNum = warnUser.split('@')[0];
                                if (warnCount >= maxWarns) {
                                    try {
                                        await X.groupParticipantsUpdate(m.chat, [warnUser], 'remove');
                                        groupWarn[warnUser] = [];
                                        warnDb[m.chat] = groupWarn;
                                        fs.writeFileSync(warnDbPath, JSON.stringify(warnDb, null, 2));
                                        X.sendMessage(from, { text: `🚨 *@${warnNum} has reached ${maxWarns}/${maxWarns} warnings and has been removed!*\n\n📝 Reason: ${warnReason}`, mentions: [warnUser] }, { quoted: m });
                                    } catch(err) {
                                        let errMsg = (err?.message || '').toLowerCase();
                                        if (errMsg.includes('not-authorized') || errMsg.includes('403')) {
                                            reply(mess.botAdmin);
                                        } else { reply(mess.error); }
                                    }
                                } else {
                                    X.sendMessage(from, { text: `⚠️ *Warning ${warnCount}/${maxWarns} for @${warnNum}*\n📝 Reason: ${warnReason}\n\n_${maxWarns - warnCount} more warning(s) before removal._`, mentions: [warnUser] }, { quoted: m });
                                }
                        }
                        break;

                        case 'unwarn':
                        case 'resetwarn': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isOwner && !isAdmins) return reply(mess.admin);
                                let uwUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
                                if (!uwUser) return reply(`📌 *Usage:* ${prefix}unwarn @user\n_Reply to a message or mention someone._`);
                                let uwDbPath = path.join(__dirname, 'database', 'warnings.json');
                                let uwDb = {};
                                try { uwDb = JSON.parse(fs.readFileSync(uwDbPath, 'utf-8')); } catch { uwDb = {}; }
                                if (uwDb[m.chat] && uwDb[m.chat][uwUser]) {
                                    uwDb[m.chat][uwUser] = [];
                                    fs.writeFileSync(uwDbPath, JSON.stringify(uwDb, null, 2));
                                    let uwNum = uwUser.split('@')[0];
                                    X.sendMessage(from, { text: `✅ *Warnings cleared for @${uwNum}.*`, mentions: [uwUser] }, { quoted: m });
                                } else {
                                    reply('ℹ️ This user has no warnings.');
                                }
                        }
                        break;

                        case 'warnlist':
                        case 'warnings': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isOwner && !isAdmins) return reply(mess.admin);
                                let wlDbPath = path.join(__dirname, 'database', 'warnings.json');
                                let wlDb = {};
                                try { wlDb = JSON.parse(fs.readFileSync(wlDbPath, 'utf-8')); } catch { wlDb = {}; }
                                let groupWarns = wlDb[m.chat] || {};
                                let warnEntries = Object.entries(groupWarns).filter(([, w]) => w.length > 0);
                                if (warnEntries.length === 0) return reply('ℹ️ No warnings in this group.');
                                let warnListText = `╭━━━〔 ⚠️ *GROUP WARNINGS* 〕━━━╮\n│\n`;
                                let warnMentions = [];
                                for (let [jid, warns] of warnEntries) {
                                    let num = jid.split('@')[0];
                                    warnMentions.push(jid);
                                    warnListText += `│ 👤 @${num} — *${warns.length}/3*\n`;
                                    warns.forEach((w, i) => {
                                        warnListText += `│   ${i + 1}. ${w.reason} _(${new Date(w.time).toLocaleDateString()})_\n`;
                                    });
                                    warnListText += `│\n`;
                                }
                                warnListText += `╰━━━━━━━━━━━━━━━━━╯`
                                X.sendMessage(from, { text: warnListText, mentions: warnMentions }, { quoted: m });
                        }
                        break;

                        case 'promote': {
                                if (!m.isGroup) return reply(mess.OnlyGrup)
                                if (!isOwner && !isAdmins) return reply(mess.admin)
                                if (!isBotAdmins) return reply(mess.botAdmin)
                                let promoteTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
                                if (!promoteTarget) return reply(`📌 *Usage:* ${prefix + command} @user or reply to their message`)
                                try {
                                    await X.groupParticipantsUpdate(m.chat, [promoteTarget], 'promote')
                                    let promoteNum = promoteTarget.split('@')[0]
                                    X.sendMessage(from, { text: `⬆️ *@${promoteNum} has been promoted to admin!*`, mentions: [promoteTarget] }, { quoted: m })
                                } catch(err) {
                                    let errMsg = (err?.message || err || '').toString().toLowerCase()
                                    if (errMsg.includes('not-authorized') || errMsg.includes('403') || errMsg.includes('admin')) {
                                        reply(mess.botAdmin)
                                    } else {
                                        reply(mess.error)
                                    }
                                }
                        }
                        break

                        case 'demote': {
                                if (!m.isGroup) return reply(mess.OnlyGrup)
                                if (!isOwner && !isAdmins) return reply(mess.admin)
                                if (!isBotAdmins) return reply(mess.botAdmin)
                                let demoteTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
                                if (!demoteTarget) return reply(`📌 *Usage:* ${prefix + command} @user or reply to their message`)
                                let demoteNum = demoteTarget.split('@')[0]
                                let isDemoteOwner = owner.some(o => demoteTarget.includes(o)) || (typeof X.areJidsSameUser === 'function' && owner.some(o => X.areJidsSameUser(demoteTarget, o + '@s.whatsapp.net')))
                                if (isDemoteOwner) return reply('🛡️ Cannot demote the bot owner.')
                                try {
                                    await X.groupParticipantsUpdate(m.chat, [demoteTarget], 'demote')
                                    X.sendMessage(from, { text: `⬇️ *@${demoteNum} has been demoted from admin.*`, mentions: [demoteTarget] }, { quoted: m })
                                } catch(err) {
                                    let errMsg = (err?.message || err || '').toString().toLowerCase()
                                    if (errMsg.includes('not-authorized') || errMsg.includes('403') || errMsg.includes('admin')) {
                                        reply(mess.botAdmin)
                                    } else {
                                        reply(mess.error)
                                    }
                                }
                        }
                        break

                        case 'revoke':{
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isAdmins && !isOwner) return reply(mess.admin);
                                if (!isBotAdmins) return reply(mess.botAdmin);
                                try {
                                    await X.groupRevokeInvite(m.chat)
                                    reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🚫 *LINK REVOKED*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n✅ The group invite link has been *successfully revoked.*\n\n_Anyone with the old link can no longer join._\n_Use ${prefix}link or ${prefix}resetlink to get a new one._`)
                                } catch(err) {
                                    let errMsg = (err?.message || '').toLowerCase()
                                    if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
                                    else reply(`❌ *Failed to revoke group link.*\n_${err.message || 'Unknown error'}_`)
                                }
                                }
                                break

                        case 'approve':
                        case 'acceptjoin': {
                                if (!m.isGroup) return reply(mess.OnlyGrup)
                                if (!isAdmins && !isOwner) return reply(mess.admin)
                                if (!isBotAdmins) return reply(mess.botAdmin)
                                try {
                                        let pending = await X.groupRequestParticipantsList(m.chat)
                                        if (!pending || pending.length === 0) return reply('ℹ️ No pending join requests.')
                                        if (text && text.toLowerCase() === 'all') {
                                                let jids = pending.map(p => p.jid)
                                                await X.groupRequestParticipantsUpdate(m.chat, jids, 'approve')
                                                reply(`✅ *Approved all ${jids.length} pending join request(s).*`)
                                        } else if (text) {
                                                let target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                                                let found = pending.find(p => p.jid === target)
                                                if (!found) return reply(`❌ That number is not in the pending requests.\n\n📋 Pending: ${pending.map(p => p.jid.split('@')[0]).join(', ')}`)
                                                await X.groupRequestParticipantsUpdate(m.chat, [target], 'approve')
                                                reply(`✅ *Approved @${target.split('@')[0]}*`)
                                        } else {
                                                let list = pending.map((p, i) => `│ ${i + 1}. ${p.jid.split('@')[0]}`).join('\n')
                                                reply(`╭━━━〔 📋 *PENDING REQUESTS* 〕━━━╮\n│\n│ Total: *${pending.length}*\n│\n${list}\n│\n╰━━━━━━━━━━━━━━━━━╯\n\n📌 *Usage:*\n• ${prefix}approve all\n• ${prefix}approve [number]\n• ${prefix}reject all\n• ${prefix}reject [number]`)
                                        }
                                } catch (err) {
                                        let errMsg = (err?.message || '').toLowerCase()
                                        if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
                                        else reply('❌ Failed: ' + (err.message || 'Unknown error'))
                                }
                        }
                        break

                        case 'reject':
                        case 'rejectjoin': {
                                if (!m.isGroup) return reply(mess.OnlyGrup)
                                if (!isAdmins && !isOwner) return reply(mess.admin)
                                if (!isBotAdmins) return reply(mess.botAdmin)
                                try {
                                        let pending = await X.groupRequestParticipantsList(m.chat)
                                        if (!pending || pending.length === 0) return reply('ℹ️ No pending join requests.')
                                        if (text && text.toLowerCase() === 'all') {
                                                let jids = pending.map(p => p.jid)
                                                await X.groupRequestParticipantsUpdate(m.chat, jids, 'reject')
                                                reply(`✅ *Rejected all ${jids.length} pending join request(s).*`)
                                        } else if (text) {
                                                let target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                                                let found = pending.find(p => p.jid === target)
                                                if (!found) return reply(`❌ That number is not in the pending requests.`)
                                                await X.groupRequestParticipantsUpdate(m.chat, [target], 'reject')
                                                reply(`✅ *Rejected @${target.split('@')[0]}*`)
                                        } else {
                                                let list = pending.map((p, i) => `${i + 1}. ${p.jid.split('@')[0]}`).join('\n')
                                                reply(`📋 *Pending Join Requests (${pending.length}):*\n\n${list}\n\n📌 Use ${prefix}reject all or ${prefix}reject [number]`)
                                        }
                                } catch (err) {
                                        let errMsg = (err?.message || '').toLowerCase()
                                        if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
                                        else reply('❌ Failed: ' + (err.message || 'Unknown error'))
                                }
                        }
                        break
                                
//━━━━━━━━━━━━━━━━━━━━━━━━//                            
// search features
                        case 'wikimedia': {
                                if (!text) return reply(`*Example :*\n\n${prefix + command} Query`);
                                try {
                                        const results = await wikimedia(text);
                                        if (results.length === 0) return reply(`⚠️ No images found on Wikimedia for "${text}".`);
                                        let result = results.map(img => `🖼️ *${img.title || 'No Title'}*\n🔗 ${img.source}`).join('\n\n');
                                        reply(`🌐 *Wikimedia Search Results for*: ${text}\n\n${result}`);
                                } catch (err) {
                                        console.error(err);
                                        reply(`❌ Error fetching images from Wikimedia. Please try again later.`);
                                }
                        }
                        break;

                        case 'mangainfo': {
                                const mangaName = args.join(' ');
                                if (!mangaName) return reply(`*Example :*\n\n${prefix + command} Anime`);
                                try {
                                        const mangaList = await komiku("manga", mangaName);
                                        if (mangaList.length === 0) {
                                                return reply('_[ Invalid ]_ Not Found !!');
                                        }
                                        let captionText = `📚 *Hasil Pencarian Manga - ${mangaName}* 📚\n\n`;
                                        mangaList.slice(0, 5).forEach((manga, index) => {
                                                captionText += `📖 *${index + 1}. ${manga.title}*\n`;
                                                captionText += `🗂️ *Genre*: ${manga.genre}\n`;
                                                captionText += `🔗 *Url*: ${manga.url}\n`;
                                                captionText += `📖 *Description*: ${manga.description}\n\n`;
                                        });
                                        await reply(captionText);
                                } catch (error) {
                                        console.error("Report Error :", error);
                                        reply(mess.error);
                                }
                                break;
                        }

                        case 'mangadetail': {
                                const url = args[0];
                                if (!url) return reply(`*Example :*\n\n${prefix + command} URL`);
                                try {
                                        const mangaDetail = await detail(url);
                                        let captionText = `📚 *Manga Details* 📚\n\n`;
                                        captionText += `📖 *Title*: ${mangaDetail.title}\n`;
                                        captionText += `🗂️ *Genre*: ${mangaDetail.genres.join(', ')}\n`;
                                        captionText += `📖 *Description*: ${mangaDetail.description}\n`;
                                        captionText += `📅 *First Chapter*: ${mangaDetail.awalChapter}\n`;
                                        captionText += `📅 *Latest Chapter*: ${mangaDetail.newChapter}\n`;
                                        X.sendMessage(m.chat, {
                                                image: { url: mangaDetail.coverImage },
                                                caption: captionText
                                        }, {
                                                quoted: m
                                        })
                                } catch (error) {
                                        console.error("Report Error :", error);
                                        reply(mess.error);
                                }
                                break;
                        }

                        case 'jkt48news': {
                                const lang = args[0] || "id";
                                try {
                                        const news = await jktNews(lang);
                                        if (news.length === 0) {
                                                return reply('_[ Report ]_ No News Find');
                                        }
                                        let captionText = `🎤 *Latest JKT48 News* 🎤\n\n`;
                                        news.slice(0, 5).forEach((item, index) => {
                                                captionText += `📰 *${index + 1}. ${item.title}*\n`;
                                                captionText += `📅 *Date*: ${item.date}\n`;
                                                captionText += `🔗 *Link*: ${item.link}\n\n`;
                                        });
                                        await reply(captionText);
                                } catch (error) {
                                        console.error("Report Error :", error);
                                        reply(mess.error);
                                }
                                break;
                        }

                        case 'otakudesu':{
                                let data = await otakuDesu.ongoing();
                                let captionText = `「 *ANIME SCHEDULE* 」\n\n`
                                for (let i of data) {
                                        captionText += `*💬 Title*: ${i.title}\n`
                                        captionText += `*📺 Eps*: ${i.episode}\n`
                                        captionText += `*🔗 URL*: ${i.link}\n\n`
                                }
                                X.sendMessage(m.chat, {
                                        text: captionText,
                                        contextInfo: {
                                                mentionedJid: [m.sender],
                                                forwardingScore: 999999, 
                                                isForwarded: true, 
                                                forwardedNewsletterMessageInfo: {
                                                        newsletterName: newsletterName,
                                                        newsletterJid: idch,
                                                },
                                                externalAdReply: {
                                                        showAdAttribution: true,
                                                        title: 'Ini Update Anime Terbaru!',
                                                        mediaType: 1,
                                                        previewType: 1,
                                                        body: 'Halo 👋',
                                                        thumbnailUrl: thumb,
                                                        renderLargerThumbnail: false,
                                                        mediaUrl: wagc,
                                                        sourceUrl: wagc
                                                }
                                        }
                                }, {
                                        quoted: m
                                })
                        }
                        break;

                        case 'kusonimeinfo':
                        case 'animeinfo': {
                                try {
                                        const animeList = await Kusonime.info();
                                        if (animeList.length === 0) {
                                                return reply('_[ Invalid ⚠️ ]_ No latest anime data found at this time.');
                                        }
                                        let captionText = `🎌 *Latest Anime from Kusonime* 🎌\n\n`;
                                        animeList.slice(0, 5).forEach((anime, index) => {
                                                captionText += `📺 *${index + 1}. ${anime.title}*\n`;
                                                captionText += `🔗 *URL*: ${anime.url}\n`;
                                                captionText += `🗂️ *Genre*: ${anime.genres.join(', ')}\n`;
                                                captionText += `📅 *Rilis*: ${anime.releaseTime}\n\n`;
                                        });
                                        await reply(captionText);
                                } catch (error) {
                                        console.error("Report Error :", error);
                                        reply(mess.error);
                                };
                        }
                        break

                        case 'kusonimesearch':
                        case 'animesearch': {
                                if (!text) return reply(`*Example :*\n\n${prefix + command} Anime`);
                                try {
                                        const searchResults = await Kusonime.search(text);
                                        if (typeof searchResults === 'string') {
                                                return reply(`⚠️ ${searchResults}`);
                                        }
                                        let captionText = `🔍 *Search Results for*: ${text}\n\n`;
                                        searchResults.slice(0, 5).forEach((anime, index) => {
                                                captionText += `📺 *${index + 1}. ${anime.title}*\n`;
                                                captionText += `🔗 *URL*: ${anime.url}\n`;
                                                captionText += `🗂️ *Genre*: ${anime.genres.join(', ')}\n`;
                                                captionText += `📅 *Rilis*: ${anime.releaseTime}\n\n`;
                                        });
                                        await reply(captionText);
                                } catch (error) {
                                        console.error("Report Error :", error);
                                        reply(mess.error);
                                }
                        }
                        break;

                        case 'infogempa':
                        case 'infobmkg':
                        case 'gempa':
                        case 'bmkg': {
                                try {
                                        let result = await gempa();
                                        let gempaData = result.data;
                                        let captionText = `「 *EARTHQUAKE INFO* 」\n\n`;
                                        captionText += `*🌍 Source*: ${result.source}\n`;
                                        captionText += `*📊 Magnitude*: ${gempaData.magnitude.trim()}\n`;
                                        captionText += `*📏 Depth*: ${gempaData.kedalaman.trim()}\n`;
                                        captionText += `*🗺️ Latitude & Longitude*: ${gempaData.lintang_bujur.trim()}\n`;
                                        captionText += `*🕒 Time*: ${gempaData.waktu.trim()}\n`;
                                        captionText += `*📍 Region*: ${gempaData.wilayah.trim() || 'No data'}\n`;
                                        captionText += `*😱 Felt*: ${gempaData.dirasakan.trim() || 'No data'}\n\n`;
                                        captionText += `Stay alert and follow instructions from authorities!`;
                                        if (gempaData.imagemap) {
                                                X.sendMessage(m.chat, {
                                                        image: { url: gempaData.imagemap.startsWith('http') ? gempaData.imagemap : `https://www.bmkg.go.id${gempaData.imagemap}` },
                                                        caption: captionText,
                                                        contextInfo: {
                                                                mentionedJid: [m.sender],
                                                                forwardingScore: 999999, 
                                                                isForwarded: true, 
                                                                forwardedNewsletterMessageInfo: {
                                                                        newsletterName: saluranName,
                                                                        newsletterJid: saluran,
                                                                },
                                                                externalAdReply: {
                                                                        showAdAttribution: true,
                                                                        title: 'Latest Earthquake Information!',
                                                                        mediaType: 1,
                                                                        previewType: 1,
                                                                        body: 'Be careful',
                                                                        thumbnailUrl: imageUrl,
                                                                        renderLargerThumbnail: false,
                                                                        mediaUrl: 'https://www.bmkg.go.id',
                                                                        sourceUrl: 'https://www.bmkg.go.id'
                                                                }
                                                        }
                                                }, {
                                                        quoted: m
                                                });
                                        } else {
                                                X.sendMessage(m.chat, {
                                                        text: captionText,
                                                        contextInfo: {
                                                                mentionedJid: [m.sender],
                                                                forwardingScore: 999999, 
                                                                isForwarded: true, 
                                                                forwardedNewsletterMessageInfo: {
                                                                        newsletterName: saluranName,
                                                                        newsletterJid: saluran,
                                                                },
                                                                externalAdReply: {
                                                                        showAdAttribution: true,
                                                                        title: 'Latest Earthquake Information!',
                                                                        mediaType: 1,
                                                                        previewType: 1,
                                                                        body: 'Be careful',
                                                                        thumbnailUrl: imageUrl,
                                                                        renderLargerThumbnail: false,
                                                                        mediaUrl: 'https://www.bmkg.go.id',
                                                                        sourceUrl: 'https://www.bmkg.go.id'
                                                                }
                                                        }
                                                }, {
                                                        quoted: m
                                                });
                                        }
                                } catch (error) {
                                        console.error("Report Error :", error);
                                        X.sendMessage(m.chat, {
                                                text: mess.error
                                        }, {
                                                quoted: m
                                        });
                                }
                        }
                        break;


//━━━━━━━━━━━━━━━━━━━━━━━━//
// Tools Features

                        case 'myip':
                        case 'ipbot':
                                if (!isOwner) return reply(mess.OnlyOwner);
                                let http = require('http');
                                http.get({
                                        'host': 'api.ipify.org',
                                        'port': 80,
                                        'path': '/'
                                }, function(resp) {
                                        resp.on('data', function(ip) {
                                                reply("🔎 Oii, Public IP address: " + ip);
                                        })
                                });
                        break;

                        case "ipwhois": {
                                if (!text) return reply(`*Example :*\n\n${prefix + command} 114.5.213.103`);
                                const ip = text.trim();
                                const apiUrl = `https://ipwho.is/${ip}`;
                                try {
                                        reply("🔍 Searching for information, please wait...");
                                        const data = await fetchJson(apiUrl);
                                        if (data.success) {
                                                const flagEmoji = data.flag?.emoji || "🏳️";
                                                let messageText = "📍 *IP Whois Information*\n";
                                                messageText += `🌐 *IP Address*: ${data.ip}\n`;
                                                messageText += `🗺️ *Type*: ${data.type}\n`;
                                                messageText += `🌍 *Continent*: ${data.continent} (${data.continent_code})\n`;
                                                messageText += `🇨🇺 *Country*: ${data.country} (${data.country_code}) ${flagEmoji}\n`;
                                                messageText += `🏙️ *City*: ${data.city}, ${data.region} (${data.region_code})\n`;
                                                messageText += `📞 *Calling Code*: +${data.calling_code}\n`;
                                                messageText += `📫 *Postal Code*: ${data.postal}\n`;
                                                messageText += `🏛️ *Capital*: ${data.capital}\n\n`;
                                                messageText += "📡 *Provider Information*\n";
                                                messageText += `🏢 *ISP*: ${data.connection?.isp || "Not available"}\n`;
                                                messageText += `🔗 *Domain*: ${data.connection?.domain || "Not available"}\n`;
                                                messageText += `🔢 *ASN*: ${data.connection?.asn || "Not available"}\n\n`;
                                                messageText += "🕰️ *Timezone*\n";
                                                messageText += `🕒 *ID*: ${data.timezone?.id || "Not available"}\n`;
                                                messageText += `🕒 *UTC*: ${data.timezone?.utc || "Not available"}\n`;
                                                messageText += `🕒 *Current Time*: ${data.timezone?.current_time || "Not available"}\n`;
                                                reply(messageText);
                                        } else {
                                                reply(`❌ Invalid IP Address or information not found.`);
                                        }
                                } catch (err) {
                                        console.error(err);
                                        reply("❌ An error occurred while fetching data. Please try again later.");
                                }
                        }
                        break;
 
case 'telestick': {
  async function telestick(url) {
    let match = url.match(/https:\/\/t\.me\/addstickers\/([^\/\?#]+)/)
    if (!match) return reply(`*Example :*\n\n${prefix + command} https://`);
    let { data: a } = await axios.get(`https://api.telegram.org/bot7935827856:AAGdbLXArulCigWyi6gqR07gi--ZPm7ewhc/getStickerSet?name=${match[1]}`)
    let stickers = await Promise.all(a.result.stickers.map(async v => {
      let { data: b } = await axios.get(`https://api.telegram.org/bot7935827856:AAGdbLXArulCigWyi6gqR07gi--ZPm7ewhc/getFile?file_id=${v.file_id}`)
      return {
        emoji: v.emoji,
        is_animated: v.is_animated,
        image_url: `https://api.telegram.org/file/bot7935827856:AAGdbLXArulCigWyi6gqR07gi--ZPm7ewhc/${b.result.file_path}`
      }
    }))
    return { name: a.result.name, title: a.result.title, sticker_type: a.result.sticker_type, stickers }
  }
 
  try {
    if (!args[0]) return reply('Enter the Telegram sticker URL')
    let res = await telestick(args[0])
    for (let v of res.stickers) {
      let { data } = await axios.get(v.image_url, { responseType: 'arraybuffer' })
      let sticker = new Sticker(data, { pack: res.title, author: 'MT-BOT', type: v.is_animated ? 'full' : 'default' })
      await X.sendMessage(m.chat, await sticker.toMessage(), { quoted: m })
    }
  } catch (e) {
    reply(e.message)
  }
}
break;

case 'stikerly': {
if (!text) return reply(`*Example :*\n\n ${prefix + command} anomali `)
try {
const searchRes = await fetch(`https://zenzxz.dpdns.org/search/stickerlysearch?query=${encodeURIComponent(text)}`)
const searchJson = await searchRes.json()
if (!searchJson.status || !Array.isArray(searchJson.data) || searchJson.data.length === 0) {
return reply('*Not Found 🚫*')
}
const pick = searchJson.data[Math.floor(Math.random() * searchJson.data.length)]
const detailUrl = `https://zenzxz.dpdns.org/tools/stickerlydetail?url=${encodeURIComponent(pick.url)}`
const detailRes = await fetch(detailUrl)
const detailJson = await detailRes.json()
if (!detailJson.status || !detailJson.data || !Array.isArray(detailJson.data.stickers) || detailJson.data.stickers.length === 0) {
return reply('Error getting sticker details')
}
const packName = detailJson.data.name
const authorName = detailJson.data.author?.name || 'unknown'
reply(`Sending ${detailJson.data.stickers.length} Sticker`)
let maxSend = 10
for (let i = 0; i < Math.min(detailJson.data.stickers.length, maxSend); i++) {
const img = detailJson.data.stickers[i]
let sticker = new Sticker(img.imageUrl, {
pack: global.packname,
author: global.author,
type: 'full',
categories: ['Stickers'],
id: 'stikerly'
})
let buffer = await sticker.toBuffer()
await X.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
}
} catch (e) {
console.error(e)
reply(global.mess.error)
}
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Ai Features
case 'quantum-ai':{
  if (!text) return reply(`Example:\n${prefix+command} what is artificial intelligence?`)

  try {
    const api = `https://zelapioffciall.vercel.app/ai/quantum?text=${encodeURIComponent(text)}`
    const res = await fetch(api)
    if (!res.ok) throw await res.text()
    
    const json = await res.json()
    if (!json.result) return reply('Failed to get response from AI.')

    reply(json.result)
  } catch (e) {
    console.error('[QUANTUM AI ERROR]', e)
    reply('❌ An error occurred while getting response from Quantum AI.')
  }
}
break
case 'chatai':{
  try {
    if (!args.length) return reply('Please enter your question')    
    let payload = { messages: [{ role: 'user', content: args.join(' ') }] }
    let headers = { headers: { Origin: 'https://chatai.org', Referer: 'https://chatai.org/' } }
    let { data } = await axios.post('https://chatai.org/api/chat', payload, headers)
    
    reply(data?.content || 'No answer found')
  } catch (e) {
    reply(e.message)
  }
}
break;
case 'conciseai':{
  const chatAI = async text => {
    let user_id = uuidv4().replace(/-/g, '')
    let lastMsg = `USER: ${text}`
    let signature = crypto.createHmac('sha256', 'CONSICESIGAIMOVIESkjkjs32120djwejk2372kjsajs3u293829323dkjd8238293938wweiuwe')
      .update(user_id + lastMsg + 'normal')
      .digest('hex')
 
    let form = new URLSearchParams({
      question: lastMsg,
      conciseaiUserId: user_id,
      signature,
      previousChats: JSON.stringify([{ a: '', b: lastMsg, c: false }]),
      model: 'normal'
    })
 
    let { data } = await axios.post('https://toki-41b08d0904ce.herokuapp.com/api/conciseai/chat', form.toString(), {
      headers: {
        'User-Agent': 'okhttp/4.10.0',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data.answer
  }
 
  try {
    if (!args.length) throw 'Please enter your question'
    reply(await chatAI(args.join(' ')))
  } catch (e) {
    reply(e.message || e)
  }
}
break;
case 'claudeai':{
  if (!text) return reply('Please enter your question')
  try {
    let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Claude, an AI assistant made by Anthropic. You are helpful, harmless, and honest. Provide thoughtful and detailed responses.' }, { role: 'user', content: text }], model: 'openai', stream: false }, { headers: { 'Content-Type': 'application/json' } })
    let answer = data?.choices?.[0]?.message?.content || 'No response.'
    reply(answer)
  } catch (e) {
    reply('Error: ' + (e.message || 'Failed to get response'))
  }
  break
}
case 'chatgpt':{
    if (!text) return reply(`Please enter your question`)
    
    const model_list = {
        chatgpt4: {
            api: 'https://stablediffusion.fr/gpt4/predict2',
            referer: 'https://stablediffusion.fr/chatgpt4'
        },
        chatgpt3: {
            api: 'https://stablediffusion.fr/gpt3/predict',
            referer: 'https://stablediffusion.fr/chatgpt3'
        }
    };

    try {
        let results = [];
        for (const [model, config] of Object.entries(model_list)) {
            try {
const axios = require('axios');
                const hmm = await axios.get(config.referer);
                const { data } = await axios.post(config.api, {
                    prompt: text
                }, {
                    headers: {
                        accept: '*/*',
                        'content-type': 'application/json',
                        origin: 'https://stablediffusion.fr',
                        referer: config.referer,
                        cookie: hmm.headers['set-cookie'].join('; '),
                        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
                    }
                });
                results.push(`*${model.toUpperCase()}*:\n${data.message || 'No answer found.'}`);
            } catch (err) {
                results.push(`*${model.toUpperCase()}*:\nFailed to get response.`);
                console.error(`Error on ${model}:`, err.message);
            }
        }
        reply(results.join('\n\n'));
    } catch (e) {
        console.error(e);
        reply('An error occurred while getting the answer.');
    }
}
break
case 'venice': case 'veniceai':{
if (!text) return reply(`Please enter your question`);
try {
const axios = require('axios');
const { data } = await axios.request({
method: 'POST',
url: 'https://outerface.venice.ai/api/inference/chat',
headers: {
accept: '*/*',
'content-type': 'application/json',
origin: 'https://venice.ai',
referer: 'https://venice.ai/',
'user-agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
'x-venice-version': 'interface@20250523.214528+393d253'
},
data: JSON.stringify({
requestId: 'nekorinn',
modelId: 'dolphin-3.0-mistral-24b',
prompt: [
{
content: text,
role: 'user'
}
],
systemPrompt: '',
conversationType: 'text',
temperature: 0.8,
webEnabled: true,
topP: 0.9,
isCharacter: false,
clientProcessingTime: 15
})
});
const chunks = data.split('\n').filter(v => v).map(v => JSON.parse(v));
const hasil = chunks.map(v => v.content).join('');
X.sendMessage(m.chat, { text: hasil }, { quoted: m });
} catch (e) {
console.error(e.message);
X.sendMessage(m.chat, { text: 'Sorry, no results from Venice AI.' }, { quoted: m });
}
}
break
case 'logic-eai':{
    if (!q) {
        return reply(`What would you like to ask?`);
    }
    const customName = "logic-eai"; 
    const creator = "isOwner";
    const systemMessage = `Your name is now ${customName} and you were created by ${creator}`;

    const url = "https://velyn.biz.id/api/ai/aicustom";

    try {
        const response = await axios.get(url, {
            params: {
                prompt: q,
                system: systemMessage
            }
        });

        if (response.data && response.data.data) {
            X.sendMessage(m.chat, { text: response.data.data }, { quoted: m });
        } else {
            throw new Error("No response from API.");
        }
    } catch (error) {
        console.error("Error AI:", error);
        reply("Sorry, an error occurred while contacting the AI.");
    }
};
break
case 'gpt41-mini':{  
    if (!text) {
        return reply(`Example: ${prefix+command} What is quantum computing?`);
    }
    try {
        const ghToken = process.env.GITHUB_AI_TOKEN || '';
        if (!ghToken) return reply('AI service is not configured. Please set up the GITHUB_AI_TOKEN.');
        const res = await axios.post("https://models.github.ai/inference/chat/completions", {
            messages: [
                { role: "system", content: "" },
                { role: "user", content: text }
            ],
            temperature: 1,
            top_p: 1,
            model: "openai/gpt-4.1-mini"
        }, {
            headers: { "Authorization": `Bearer ${ghToken}`, "Content-Type": "application/json" }
        });
        const hasil = res.data.choices[0].message.content.replace(/\*\*(.*?)\*\*/g, '*$1*');
        reply(hasil);
    } catch (e) {
        console.error(e.response?.data || e.message);
        reply('Sorry, the AI is currently unavailable. Please try again later.');
    }
};
break
case 'openai':{  
    if (!text) {
        return reply(`Example: ${prefix+command} What is AI?`);
    }
    try {
        const ghToken = process.env.GITHUB_AI_TOKEN || '';
        if (!ghToken) return reply('AI service is not configured. Please set up the GITHUB_AI_TOKEN.');
        const sysPrompt = `Hello ${pushname}, I am ${botname}, powered by OpenAI GPT-4.1. I am a helpful AI assistant.`;
        const res = await axios.post("https://models.github.ai/inference/chat/completions", {
            messages: [
                { role: "system", content: sysPrompt },
                { role: "user", content: text }
            ],
            temperature: 1,
            top_p: 1,
            model: "openai/gpt-4.1"
        }, {
            headers: { "Authorization": `Bearer ${ghToken}`, "Content-Type": "application/json" }
        });
        const hasil = res.data.choices[0].message.content.replace(/\*\*(.*?)\*\*/g, '*$1*');
        reply(hasil);
    } catch (e) {
        console.error(e.response?.data || e.message);
        reply('Sorry, the AI is currently unavailable. Please try again later.');
    }
};
break
case 'metaai':{  
  if (!text) return reply(`Example: ${prefix+command} Who invented football`);
  try {
    let result = null
    try {
      let d = new FormData();
      d.append("content", `User: ${text}`);
      d.append("model", "@groq/llama-3.1-8b-instant");
      let { data } = await axios.post("https://mind.hydrooo.web.id/v1/chat", d, { headers: { ...d.getHeaders() }, timeout: 15000 });
      result = data.result || data.full_result
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Meta AI, an intelligent and helpful AI assistant by Meta.' }, { role: 'user', content: text }], model: 'openai', stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
};
break
case 'deepseek':{  
  if (!text) return reply(`Example: ${prefix+command} Who is Elon Musk`);
  try {
    let result = null
    try {
      let d = new FormData();
      d.append("content", `User: ${text}`);
      d.append("model", "@hf/thebloke/deepseek-coder-6.7b-instruct-awq");
      let { data } = await axios.post("https://mind.hydrooo.web.id/v1/chat", d, { headers: { ...d.getHeaders() }, timeout: 15000 });
      result = data.result || data.full_result
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are DeepSeek, a powerful AI assistant specializing in coding and technical analysis.' }, { role: 'user', content: text }], model: 'openai', stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
};
break
case 'gptlogic':{  
    if (!text) return reply(`Example: ${prefix+command} Who is Elon Musk`);
    try {
        let result = null
        try {
            let response = await axios.post("https://chateverywhere.app/api/chat/", {
                "model": { "id": "gpt-3.5-turbo-0613", "name": "GPT-3.5", "maxLength": 12000, "tokenLimit": 4000 },
                "messages": [{ "content": text, "role": "user" }],
                "prompt": "You are a logical AI that helps users answer questions accurately.",
                "temperature": 0.5
            }, { headers: { "Accept": "*/*", "User-Agent": "Mozilla/5.0" }, timeout: 15000 });
            result = response.data
        } catch {}
        if (!result) {
            let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are GPT Logic, a highly logical and analytical AI assistant. Answer questions with precise reasoning.' }, { role: 'user', content: text }], model: 'openai', stream: false }, { headers: { 'Content-Type': 'application/json' } })
            result = data?.choices?.[0]?.message?.content
        }
        reply(result || 'No response.')
    } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
};
break
case 'aoyoai':{  
  if (!text) return reply('Please enter your question?');
  try {
    let result = null
    try {
      let { data } = await axios.get(`https://www.abella.icu/aoyoai?q=${encodeURIComponent(text)}`, { timeout: 15000 });
      if (data?.status === 'success') result = data?.data?.response
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are AoyoAI, a creative and helpful AI assistant.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
};
break
case 'chatbotai':{  
  if (!text) return reply('Please enter your question?');
  try {
    let result = null
    try {
      let { data } = await axios.get(`https://www.abella.icu/onlinechatbot?q=${encodeURIComponent(text)}`, { timeout: 15000 });
      if (data?.data?.answer?.data) result = data.data.answer.data
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are ChatBot AI, a friendly conversational assistant.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
};
break
case 'blackbox-pro':{  
  if (!text) return reply('Please enter your question?');
  try {
    let result = null
    try {
      let { data } = await axios.get('https://www.abella.icu/blackbox-pro?q=' + encodeURIComponent(text), { timeout: 15000 });
      if (data?.status === 'success') result = data?.data?.answer?.result
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Blackbox AI Pro, a specialized AI for coding and technical questions.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
};
break
case 'zerogpt':
  if (!q) return reply('Please enter your question?');
  try {
    let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are ZeroGPT, an advanced AI assistant. Provide accurate and comprehensive answers.' }, { role: 'user', content: q }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
    reply(data?.choices?.[0]?.message?.content || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
  break
case 'writecream':{
 if (!text) return reply(`Please enter your question\nExample : ${prefix+command} you are a psychologist|I often feel anxious at night, why?`);
 const [logic, question] = text.split('|').map(v => v.trim());
 if (!logic || !question) return reply(`Wrong format\nExample: ${prefix+command} persona|question`);
 
 async function writecream(logic, question) {
 const url = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat";
 const query = [
 { role: "system", content: logic },
 { role: "user", content: question }
 ];
 const params = new URLSearchParams({
 query: JSON.stringify(query),
 link: "writecream.com"
 });

 try {
 const response = await fetch(`${url}?${params.toString()}`);
 const data = await response.json();

 let raw = data.response_content || data.reply || data.result || data.text || '';
 let cleaned = raw
 .replace(/\\n/g, '\n')
 .replace(/\n{2,}/g, '\n\n')
 .replace(/\*\*(.*?)\*\*/g, '*$1*');

 return cleaned.trim();
 } catch (error) {
 return `Failed to get response: ${error.message}`;
 }
}

 const response = await writecream(logic, question);
 reply(response || 'No response.');
};
break
case 'yupraai':{
  if (!text) return reply('Please enter your question?');
  try {
    let result = null
    try {
      const res = await axios.get(`https://api.yupradev.biz.id/ai/ypai?text=${encodeURIComponent(text)}&t=${Date.now()}&session=${m.chat}`, { headers: { accept: '*/*', 'user-agent': 'Mozilla/5.0' }, timeout: 15000 });
      result = res.data?.response || res.data?.result
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Yupra AI, a knowledgeable and helpful assistant.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
};
break
case 'feloai':{
  if (!q) return reply('Please enter your question?');
  try {
    let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Felo AI, a research-oriented AI assistant. Provide well-researched answers.' }, { role: 'user', content: q }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
    let answer = data?.choices?.[0]?.message?.content || 'No response.'
    reply(`ᴘᴏᴡᴇʀᴇᴅ ᴡɪᴛʜ ғᴇʟᴏᴀɪ\n\n${answer}`)
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
}
break

case 'aliceai' :{
  try {
    if (!text) return reply(`Write something after this command.\n\nExample:\n${prefix+command} hello how are you?\n${prefix+command} https://vt.tiktok.com/ZSFxYcCdr/\n${prefix+command} generate an image of a sunset`)
    let regexTikTok = /(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/gi
    let isTikTok = regexTikTok.test(text)
    let isImageReq = /(gambar|buatkan.*gambar|bikin.*gambar|buat.*gambar)/i.test(text)

    if (isTikTok) {
      let link = text.match(regexTikTok)[0]
      let res = await fetch(`https://www.velyn.biz.id/api/downloader/tiktok?url=${encodeURIComponent(link)}`)
      let json = await res.json()

      if (!json?.status || !json?.data?.no_watermark) {
        return reply(`❌ Error\nLogs error : Failed to download TikTok video.`)
      }

      let prompt = `Create an attractive caption for a TikTok video titled: ${json?.data?.title || 'untitled'}`
      let aiRes = await fetch(`https://www.velyn.biz.id/api/ai/velyn-1.0-1b?prompt=${encodeURIComponent(prompt)}`)
      let aiJson = await aiRes.json()

      if (!aiJson?.status || !aiJson?.result) {
        return reply(`❌ Error\nLogs error : Failed to get caption from AI.`)
      }

      await X.sendMessage(m.chat, {
        video: { url: json.data.no_watermark },
        caption: aiJson.result.toString()
      }, { quoted: m })

    } else if (isImageReq) {
      let prompt = text
      let res = await fetch(`https://www.velyn.biz.id/api/ai/text2img?prompt=${encodeURIComponent(prompt)}`)
      if (!res.ok) return reply(`❌ Error\nLogs error : Failed to contact image service.`)

      let buffer = await res.buffer()
      await X.sendMessage(m.chat, {
        image: buffer,
        caption: `Generated image for prompt:\n*${prompt}*`
      }, { quoted: m })

    } else {
      let prompt = text
      let res = await fetch(`https://www.velyn.biz.id/api/ai/velyn-1.0-1b?prompt=${encodeURIComponent(prompt)}`)
      let json = await res.json()

      if (!json?.status || !json?.result) {
        throw `❌ Error\nLogs error : AI failed to respond.`
      }

      reply(json.result.toString())
    }

  } catch (e) {
    console.error(e)
    return reply(`❌ Error\nLogs error : ${(e?.message || e).toString()}`)
  }
}
break

case 'magicstudio':{
if (!text) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  ✨ *MAGIC STUDIO AI*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\nGenerate stunning AI images with Magic Studio style.\n\n*Usage:* ${prefix}magicstudio [description]\n\n*Examples:*\n• ${prefix}magicstudio a woman in a red dress standing in Paris\n• ${prefix}magicstudio cyberpunk warrior with glowing sword\n• ${prefix}magicstudio magical forest with fairy lights, fantasy art`)
try {
await reply('✨ _Magic Studio is generating your image..._')
// Use pollinations with artistic model parameters for magic studio style
let enhancedPrompt = text + ', highly detailed, professional quality, vivid colors, artistic masterpiece'
let seed = Math.floor(Math.random() * 999999)
let imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?model=flux&width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`
let imgBuffer = await getBuffer(imgUrl)
if (!imgBuffer || imgBuffer.length < 5000) throw new Error('Generation failed')
let caption = `┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  ✨ *MAGIC STUDIO*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n📝 *Prompt:* ${text}\n🌟 *Style:* Magic Studio\n🎲 *Seed:* ${seed}`
await X.sendMessage(m.chat, { image: imgBuffer, caption }, { quoted: m })
} catch(e) {
try {
let seed2 = Math.floor(Math.random() * 999999)
let fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text + ', professional, high quality')}?width=1024&height=1024&seed=${seed2}&nologo=true`
await X.sendMessage(m.chat, { image: { url: fallbackUrl }, caption: `✨ *Magic Studio:* ${text}` }, { quoted: m })
} catch(e2) { reply(`❌ *Magic Studio failed.*\n_${e2.message || 'Try again shortly.'}_`) }
}
}
break

case 'gemmaai' :{
  if (!text) return reply('Please enter your question?');
  try {
    const res = await fetch(`https://www.velyn.biz.id/api/ai/gemma-2-9b-it?prompt=${encodeURIComponent(text)}`)
    if (res.ok) {
      const json = await res.json()
      if (json.status) {
        await X.sendMessage(m.chat, { text: json.data }, { quoted: m })
      } else {
        await X.sendMessage(m.chat, { text: 'Failed to get data from API.' }, { quoted: m })
      }
    } else {
      await X.sendMessage(m.chat, { text: `Status error: ${res.status}` }, { quoted: m })
    }
  } catch (e) {
    await X.sendMessage(m.chat, { text: 'An error occurred while processing the request.' }, { quoted: m })
    console.error(e)
  }
}
break
case 'aivelyn':
case 'velynai':{
  if (!text) return reply('Please enter your question?');
  try {
    const url = `https://www.velyn.biz.id/api/ai/velyn-1.0-1b?prompt=${encodeURIComponent(text)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.result || "Sorry, no answer available.";

    return reply(result);
  } catch (error) {
    console.error("An error occurred:", error);
    return reply("Sorry, an error occurred while contacting the AI.");
  }
}
break

case 'muslimai':{
  if (!text) return reply('Please enter your question?');
  try {
    const result = await muslimai(text);

    if (result.error) return reply(result.error);

    let sourcesText = result.sources.length > 0 
        ? result.sources.map((src, index) => `${index + 1}. *${src.title}*\n🔗 ${src.url}`).join("\n\n")
        : "No sources found.";

    let responseMessage = `ᴘᴏᴡᴇʀᴇᴅ ᴡɪᴛʜ ᴍᴜsʟɪᴍᴀɪ\n\n${result.answer}`;

    reply(responseMessage);
} catch (error) {
    console.error("⚠ *Error* :", error);
    reply("An error occurred.");
}
}
break;

case 'llama-ai':{
let messages = [];
  try {
 
    if (!text) return reply('Please enter your question?');
    let response = await fetch(`https://restapii.rioooxdzz.web.id/api/llama?message=${encodeURIComponent(text)}`);
    if (!response.ok) {
      throw new Error("Request to OpenAI API failed");
    }
 
    let result = await response.json();
 
    await X.sendMessage(m.chat, {
      text: "" + result.data.response,
    });
 
    messages = [...messages, { role: "user", content: text }];
  } catch (error) {
    await X.sendMessage(m.chat, {
      text: "" + `Error: ${error.message}`,
    });
  }
}
break

case 'gptturbo':{
if (!text) return reply(`Example:\n${prefix}${command} Hello?`);
try {
  let result = null
  try {
    const response = await fetch(`https://restapii.rioooxdzz.web.id/api/gptturbo?message=${encodeURIComponent(text)}`, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (response.ok) { const json = await response.json(); result = json?.data?.response }
  } catch {}
  if (!result) {
    let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are GPT Turbo, a fast and intelligent AI assistant. Provide clear, helpful responses.' }, { role: 'user', content: text }], model: 'openai', stream: false }, { headers: { 'Content-Type': 'application/json' } })
    result = data?.choices?.[0]?.message?.content
  }
  let turbo = `Title : ${text}\n\nMessage : ${result || 'No response.'}\n`;
  await X.sendMessage(m.chat, { text: "⬣───「 *G P T T U R B O* 」───⬣" + "\n\n" + turbo }, { quoted: m });
} catch (e) { reply('Error: ' + (e.message || 'Failed')) }
}
break

case 'gemini-ai':{  
    const isQuotedImage = m.quoted && m.quoted.mtype === 'imageMessage';
    const isImage = m.mtype === 'imageMessage';
    const quoted = m.quoted ? m.quoted : m;

    if (isImage || isQuotedImage) {
        try {

            const mediaPath = await X.downloadAndSaveMediaMessage(quoted);
            const media = fs.readFileSync(mediaPath);

            const uploadedImageUrl = await uploadImage(media);
            console.log('Image uploaded successfully:', uploadedImageUrl);

            const apiUrl = `https://gemini-api-5k0h.onrender.com/gemini/image`;
            const params = {
                q: 'What is this picture? Please describe it.',
                url: uploadedImageUrl
            };

            const response = await axios.get(apiUrl, { params });
            const description = response.data?.content || 'Failed to get image description.';

            await X.sendMessage(m.chat, {
                text: `📷 *Image Description:*\n${description}`
            }, { quoted: m });

            fs.unlinkSync(mediaPath);
        } catch (error) {
            console.error('Error deskripsi gambar:', error);
            await X.sendMessage(m.chat, {
                text: 'An error occurred while processing the image.'
            }, { quoted: m });
        }
    } else {
        try {
            if (!text) return reply(`Example: ${prefix+command} Who is Elon Musk`);
            const apiUrl = `https://gemini-api-5k0h.onrender.com/gemini/chat`;
            const params = { q: text };

            const response = await axios.get(apiUrl, { params });
            const replyText = response.data?.content || 'Failed to get respons AI.';

            await X.sendMessage(m.chat, {
                text: `🤖 *AI Gemini:*\n${replyText}`
            }, { quoted: m });
        } catch (error) {
            console.error('Error Gemini Chat:', error);
            await X.sendMessage(m.chat, {
                text: 'An error occurred while processing the AI request.'
            }, { quoted: m });
        }
    }
};
break

case 'lumin-ai':{
  if (!q) return reply(`How can I help you?`);
  try {
    let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Lumin AI, a bright and helpful AI assistant. Provide insightful and clear answers.' }, { role: 'user', content: q }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
    let result = data?.choices?.[0]?.message?.content || 'No response.'
    reply(`${result}\n\n${packname}`)
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
}
break

case 'typli-ai':{
 if (!q) return reply(`_What would you like to ask?_`);
 try {
   let result = null
   try {
     const response = await axios.post('https://typli.ai/api/generators/completion', { prompt: q, temperature: 1.2 }, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, timeout: 15000 });
     if (response.data) result = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
   } catch {}
   if (!result) {
     let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Typli AI, a versatile AI writing assistant.' }, { role: 'user', content: q }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
     result = data?.choices?.[0]?.message?.content
   }
   reply(result || 'No response.')
 } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
}
break;

case 'poly-ai':{
  if (!q) return reply(`_What would you like to ask?_`);
  try {
    let result = null
    try {
      let urlData = new URLSearchParams();
      urlData.append('currentChatStyleId', '1');
      urlData.append('mediaType', '2');
      urlData.append('needLive2D', '2');
      urlData.append('secretSceneId', 'wHp7z');
      urlData.append('selectId', '209837277');
      urlData.append('speechText', q);
      let { data: respon } = await axios.post('https://api.polybuzz.ai/api/conversation/msgbystream', urlData, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 });
      result = respon.split('\n').filter(l => l.trim()).map(l => { try { return JSON.parse(l.trim()).content || '' } catch { return '' } }).join('')
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Poly AI, a creative and conversational AI assistant.' }, { role: 'user', content: q }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
}
 break
 

case 'chatevery-where':{
  if (!text) return reply(`Example: ${prefix+command} axios`)
  try {
    let result = null
    try {
      const response = await axios.post("https://chateverywhere.app/api/chat", {
        model: { id: "gpt-3.5-turbo-0613", name: "GPT-3.5", maxLength: 12000, tokenLimit: 4000 },
        messages: [{ content: text, role: "user" }],
        prompt: `${botname} is an AI assistant developed by Toosii Tech.`
      }, { headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" }, timeout: 15000 });
      result = response.data
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: `You are ${botname}, an AI assistant developed by Toosii Tech. Be helpful and knowledgeable.` }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
}
break

case 'gemini-pro':{
  if (!text) return reply(`Example:\n${prefix+command} What is chatgpt`);
  try {
    let result = null
    try {
      const response = await axios.post('https://luminai.my.id/', { content: text, model: 'gemini-pro' }, { timeout: 15000 });
      result = response.data?.result
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Gemini Pro, a powerful AI assistant by Google. Provide comprehensive and accurate answers.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
  break;
}
  
case 'gpt-4o':{
  if (!text) return reply(`Example:\n${prefix}${command} What is chatgpt`);
  try {
    let result = null
    try {
      const response = await axios.post('https://luminai.my.id/', { content: text, model: 'gpt-4o' }, { timeout: 15000 });
      result = response.data?.result
    } catch {}
    if (!result) {
      let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are GPT-4o, a powerful and versatile AI assistant by OpenAI. Provide detailed, accurate responses.' }, { role: 'user', content: text }], model: 'openai', stream: false }, { headers: { 'Content-Type': 'application/json' } })
      result = data?.choices?.[0]?.message?.content
    }
    reply(result || 'No response.')
  } catch (e) { reply('Error: ' + (e.message || 'Failed')) }
  break;
}
 
case 'ai':{
  if (!text) {
    return reply(`What would you like to ask?`);
  }
  const prompt = `You are an AI assistant with exceptional intelligence. You enjoy helping others and communicate in a polite and professional manner`
  const requestData = { content: text, user: m.sender, prompt: prompt };
  const quoted = m && (m.quoted || m);

  try {
    let response;
    const mimetype = quoted?.mimetype || quoted?.msg?.mimetype;

    if (mimetype && /image/.test(mimetype)) {
      requestData.imageBuffer = await quoted.download();
    }

    response = (await axios.post('https://luminai.my.id', requestData)).data.result;
    reply(response);
  } catch (err) {
    reply(err.toString());
  }
}
                break
                
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Game Features
case 'tebakld': {
  let leaderboard = loadLeaderboard();

  // Ubah jadi array dan urutkan berdasar score desc
  let sorted = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10
 
  if (sorted.length === 0) return reply('📊 Leaderboard is empty.');

  let teks = '📊 *Guessing Game Leaderboard*\n\n';
  let rank = 1;
  for (let [userId, score] of sorted) {
    teks += `${rank}. @${userId.split('@')[0]} - ${score} points\n`;
    rank++;
  }

  return reply(teks, { mentions: sorted.map(([u]) => u) });
}
break;
case 'tebak': {
  const quizPath = './database/tebakgame.json';
  if (!fs.existsSync(quizPath)) return reply('⚠️ Quiz data file not found.');

  const data = JSON.parse(fs.readFileSync(quizPath));
  const kategoriUnik = [...new Set(data.map(item => item.kategori))];

  const kategori = args[0]?.toLowerCase();
  if (!kategori) {
    const daftar = kategoriUnik.join(', ');
    return reply(`📚 Usage: .tebak [category]\nExample: .tebak lagu\n\nAvailable categories:\n${daftar}`);
  }

  if (!kategoriUnik.includes(kategori)) {
    return reply(`❌ Kategori "${kategori}" not found.\nAvailable categories: ${kategoriUnik.join(', ')}`);
  }
  const soalKategori = data.filter(item => item.kategori === kategori);
  const soal = soalKategori[Math.floor(Math.random() * soalKategori.length)];

  if (!global.tebakGame) global.tebakGame = {};
  if (global.tebakGame[m.sender]) {
    return reply('⚠️ You still have an unanswered question! Answer it or type giveup first.');
  }

  global.tebakGame[m.sender] = {
    jawaban: soal.jawaban,
    soal: soal.soal,
    petunjuk: soal.petunjuk || 'No hint available',
    timeout: setTimeout(() => {
      if (global.tebakGame[m.sender]) {
        reply(`⏰ Time is up!\nThe correct answer is:\n✅ *${global.tebakGame[m.sender].jawaban}*`);
        delete global.tebakGame[m.sender];
      }
    }, 60000) // 60 detik
  };

  return reply(`🧠 Guess the *${kategori}* from this hint:\n\n${soal.soal}\n\nTime to answer: *60 seconds*\n\nReply to this message to answer!`);
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━//
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Info Bot             
case 'debugrole': {
    if (!isOwner) return reply('Owner only.')
    let dbgMsg = `*🔍 ROLE DEBUG INFO*\n\n`
    dbgMsg += `*Bot Identity:*\n`
    dbgMsg += `• X.user.id: ${X.user?.id || 'null'}\n`
    dbgMsg += `• X.user.lid: ${X.user?.lid || 'null'}\n`
    dbgMsg += `• botJid (decoded): ${botJid}\n`
    dbgMsg += `• botLid (decoded): ${botLid || 'null'}\n\n`
    dbgMsg += `*Sender Identity:*\n`
    dbgMsg += `• m.sender: ${m.sender}\n`
    dbgMsg += `• m.key.participant: ${m.key?.participant || 'null'}\n`
    dbgMsg += `• senderFromKey: ${senderFromKey || 'null'}\n\n`
    dbgMsg += `*Role Results:*\n`
    dbgMsg += `• isGroup: ${isGroup}\n`
    dbgMsg += `• isOwner: ${isOwner}\n`
    dbgMsg += `• isAdmins: ${isAdmins}\n`
    dbgMsg += `• isBotAdmins: ${isBotAdmins}\n`
    dbgMsg += `• isSuperAdmin: ${isSuperAdmin}\n\n`
    if (isGroup && participants) {
        dbgMsg += `*Admin Participants:*\n`
        participants.filter(p => p.admin).forEach(p => {
            let matchBot = isParticipantBot(p)
            let matchSender = isParticipantSender(p)
            dbgMsg += `• ${p.id}\n`
            dbgMsg += `  role: ${p.admin} | isBot: ${matchBot} | isSender: ${matchSender}\n`
            dbgMsg += `  sameAsUserId: ${isSameUser(p.id, X.user.id)} | sameAsLid: ${X.user?.lid ? isSameUser(p.id, X.user.lid) : 'no lid'}\n`
        })
    }
    reply(dbgMsg)
}
break;

case 'ping':
case 'info':
case 'storage':
case 'server':
case 'srvinfo': {

  function formatp(bytes) {
    if (bytes < 1024) return `${bytes} B`
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(2)} KB`
    const mb = kb / 1024
    if (mb < 1024) return `${mb.toFixed(2)} MB`
    const gb = mb / 1024
    return `${gb.toFixed(2)} GB`
  }

async function getServerInfo() {
  const start = Date.now()

  const osType = os.type()
  const release = os.release()
  const arch = os.arch()
  const nodeVersion = process.version
  const platform = os.platform()

  const cpus = os.cpus()
  const cpuModel = cpus.length > 0 ? cpus[0].model : 'Unknown'
  const coreCount = cpus.length
  let cpuUsage = '0%'
  if (cpus.length > 0) {
    const cpu = cpus.reduce((acc, c) => {
      acc.total += Object.values(c.times).reduce((a, b) => a + b, 0)
      acc.user += c.times.user
      acc.sys += c.times.sys
      acc.speed += c.speed
      return acc
    }, { speed: 0, total: 0, user: 0, sys: 0 })
    cpuUsage = ((cpu.user + cpu.sys) / cpu.total * 100).toFixed(2) + '%'
  }
  const loadAverage = os.loadavg().map(l => l.toFixed(2))
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  let storageText = ''
  try {
    const storageInfo = await nou.drive.info()
    if (storageInfo && storageInfo.totalGb) {
      storageText = `\n*STORAGE*\n• Total: ${storageInfo.totalGb} GB\n• Used: ${storageInfo.usedGb} GB (${storageInfo.usedPercentage}%)\n• Available: ${storageInfo.freeGb} GB (${storageInfo.freePercentage}%)`
    }
  } catch(e) {}

  const latensi = (Date.now() - start)

  const responseText = `╭━━━〔 ⚡ *PONG!* 〕━━━╮
│
│  🤖 *${global.botname || 'TOOSII-XD ULTRA'}*
│  📡 Latency: *${latensi}ms*
│
╰━━━━━━━━━━━━━━━━━╯

╭━━━〔 🕐 *UPTIME* 〕━━━╮
│ 🟢 Bot: ${runtime(process.uptime())}
│ 🖥️ Server: ${runtime(os.uptime())}
╰━━━━━━━━━━━━━━━━━╯

╭━━━〔 💻 *SERVER* 〕━━━╮
│ 🔧 OS: ${osType} (${platform})
│ 📦 Release: ${release}
│ 🏗️ Arch: ${arch}
│ 🟩 Node.js: ${nodeVersion}
╰━━━━━━━━━━━━━━━━━╯

╭━━━〔 🧠 *CPU* 〕━━━╮
│ 💎 Model: ${cpuModel}
│ ⚙️ Cores: ${coreCount}
│ 📊 Usage: ${cpuUsage}
│ 📈 Load: ${loadAverage.join(', ')}
╰━━━━━━━━━━━━━━━━━╯

╭━━━〔 💾 *MEMORY* 〕━━━╮
│ 📦 Total: ${formatp(totalMem)}
│ 🔴 Used: ${formatp(usedMem)}
│ 🟢 Free: ${formatp(freeMem)}
╰━━━━━━━━━━━━━━━━━╯${storageText ? `\n\n╭━━━〔 💿 *STORAGE* 〕━━━╮\n${storageText.replace(/\*STORAGE\*\n/,'').replace(/• /g,'│ 📁 ')}\n╰━━━━━━━━━━━━━━━━━╯` : ''}

_⚡ Powered by ${global.ownername || 'Toosii Tech'}_
`
  return responseText.trim()
}

const responseText = await getServerInfo()
await X.sendMessage(m.chat, { text: responseText }, { quoted: m })
}
break           

case 'totalfitur':{
reply(`📋 *Total Commands:* ${totalfitur()}`)
}
break   
//━━━━━━━━━━━━━━━━━━━━━━━━//
// OWNER MENU COMMANDS
case 'autotyping': {
if (!isOwner) return reply(mess.OnlyOwner)
let atArg = (args[0] || '').toLowerCase()
if (atArg === 'on') { global.fakePresence = 'typing'; reply('*Auto Typing ON*') }
else if (atArg === 'off') { global.fakePresence = 'off'; reply('*Auto Typing OFF*') }
else reply(`*Auto Typing: ${global.fakePresence === 'typing' ? 'ON' : 'OFF'}*\nUsage: ${prefix}autotyping on/off`)
} break

case 'autoreact': {
if (!isOwner) return reply(mess.OnlyOwner)
let arArg = (args[0] || '').toLowerCase()
if (!arArg) { reply(`*Auto React: ${global.autoReact ? 'ON' : 'OFF'}*\nEmoji: ${global.autoReactEmoji || '👍'}\nUsage: ${prefix}autoreact on/off\n${prefix}autoreact [emoji]`) }
else if (arArg === 'on') { global.autoReact = true; reply('*Auto React ON*') }
else if (arArg === 'off') { global.autoReact = false; reply('*Auto React OFF*') }
else { global.autoReact = true; global.autoReactEmoji = arArg; reply(`*Auto React ON* with emoji: ${arArg}`) }
} break

case 'pmblocker': {
if (!isOwner) return reply(mess.OnlyOwner)
let pbArg = (args[0] || '').toLowerCase()
if (pbArg === 'on') { global.pmBlocker = true; reply('*PM Blocker ON*\nNon-owner PMs will be auto-blocked.') }
else if (pbArg === 'off') { global.pmBlocker = false; reply('*PM Blocker OFF*') }
else reply(`*PM Blocker: ${global.pmBlocker ? 'ON' : 'OFF'}*\nUsage: ${prefix}pmblocker on/off`)
} break

case 'pp':
case 'getpp': {
// Get profile picture of sender, mentioned user, quoted user, or bot itself
try {
let target, label
if (m.mentionedJid && m.mentionedJid[0]) {
    target = m.mentionedJid[0]
    label = '+' + target.split('@')[0].split(':')[0]
} else if (m.quoted) {
    target = m.quoted.sender || m.quoted.participant || m.quoted.key?.participant
    label = '+' + (target || '').split('@')[0].split(':')[0]
} else if (text && /^[0-9]+$/.test(text.replace(/[^0-9]/g,''))) {
    target = text.replace(/[^0-9]/g,'') + '@s.whatsapp.net'
    label = '+' + text.replace(/[^0-9]/g,'')
} else {
    target = m.sender
    label = '+' + m.sender.split('@')[0].split(':')[0]
}
if (!target) target = m.sender
let ppUrl = null
try { ppUrl = await X.profilePictureUrl(target, 'image') } catch {}
if (!ppUrl) {
    return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🖼️ *PROFILE PICTURE*
┗━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No profile picture found for ${label}*

_This user has their privacy set to hide their profile photo, or the number is not on WhatsApp._`)
}
let ppBuf = await getBuffer(ppUrl)
if (!ppBuf || ppBuf.length < 100) throw new Error('Failed to download picture')
await X.sendMessage(m.chat, {
    image: ppBuf,
    caption: `┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🖼️ *PROFILE PICTURE*
┗━━━━━━━━━━━━━━━━━━━━━━━┛

👤 *User:* ${label}`
}, { quoted: m })
} catch(e) {
reply(`❌ *Failed to fetch profile picture.*
_${e.message || 'User may have privacy restrictions.'}_`)
}
} break

case 'setpp': {
if (!isOwner) return reply(mess.OnlyOwner)
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🖼️ *SET BOT PROFILE PIC*
┗━━━━━━━━━━━━━━━━━━━━━━━┛

*Usage:* Reply to an image with *${prefix}setpp*

_The image will be set as the bot's profile picture._`)
try {
let imgBuf = await m.quoted.download()
if (!imgBuf || imgBuf.length < 100) throw new Error('Failed to download image')
await X.updateProfilePicture(X.user.id, imgBuf)
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🖼️ *PROFILE PIC UPDATED*
┗━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *Bot profile picture has been updated successfully.*

_Changes may take a few moments to appear on WhatsApp._`)
} catch(e) {
let errMsg = (e?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(`❌ *Failed to update profile picture.*
_${e.message || 'Unknown error'}_`)
}
} break

case 'clearsession': {
if (!isOwner) return reply(mess.OnlyOwner)
try {
const sessPath = path.join(__dirname, 'sessions')
if (fs.existsSync(sessPath)) {
let files = fs.readdirSync(sessPath).filter(f => f !== 'creds.json' && !f.includes('creds'))
let count = 0
for (let f of files) { try { fs.unlinkSync(path.join(sessPath, f)); count++ } catch {} }
reply(`*Cleared ${count} session files.*`)
} else reply('No sessions directory found.')
} catch(e) { reply('Error: ' + e.message) }
} break

case 'cleartmp': {
if (!isOwner) return reply(mess.OnlyOwner)
try {
const tmpPath = path.join(__dirname, 'tmp')
if (fs.existsSync(tmpPath)) {
let files = fs.readdirSync(tmpPath)
for (let f of files) { try { fs.unlinkSync(path.join(tmpPath, f)) } catch {} }
reply(`*Cleared ${files.length} temp files.*`)
} else reply('No tmp directory found.')
} catch(e) { reply('Error: ' + e.message) }
} break

case 'sudo': {
if (!isOwner) return reply(mess.OnlyOwner)
let sudoNum = (args[0] || '').replace(/[^0-9]/g, '')
if (!sudoNum) return reply(`*Sudo Users:* ${global.owner.join(', ')}\n\nUsage:\n${prefix}sudo add [number]\n${prefix}sudo remove [number]`)
let sudoAction = args[0]?.toLowerCase()
if (sudoAction === 'add' && args[1]) {
let num = args[1].replace(/[^0-9]/g, '')
if (!global.owner.includes(num)) { global.owner.push(num); reply(`*Added ${num} as sudo user.*`) }
else reply('Already a sudo user.')
} else if (sudoAction === 'remove' || sudoAction === 'del') {
let num = (args[1] || '').replace(/[^0-9]/g, '')
if (num === global._protectedOwner) return reply('Cannot remove the primary owner.')
global.owner = global.owner.filter(o => o !== num)
reply(`*Removed ${num} from sudo users.*`)
} else reply(`Usage: ${prefix}sudo add/remove [number]`)
} break

case 'setowner': {
if (!isOwner) return reply(mess.OnlyOwner)
let newOwner = (args[0] || '').replace(/[^0-9]/g, '')
if (!newOwner) return reply(`*Current Owner Number:* ${global.ownerNumber}\nUsage: ${prefix}setowner [number]`)
global.ownerNumber = newOwner
if (!global.owner.includes(newOwner)) global.owner.push(newOwner)
reply(`*Owner number updated to ${newOwner}*`)
} break

case 'setmenu': {
if (!isOwner) return reply(mess.OnlyOwner)
reply('*Menu Categories:*\nai, tools, owner, group, downloader, search, sticker, games, other, fun, anime, textmaker, imgedit, github, converter\n\nUse .menu [category] to view specific menus.')
} break

case 'menuimage': {
if (!isOwner) return reply(mess.OnlyOwner)
if (m.quoted && /image/.test(m.quoted.mimetype || '')) {
try {
let media = await X.downloadAndSaveMediaMessage(m.quoted, 'menu_thumb')
global.menuThumb = media
reply('*Menu image updated!*')
} catch(e) { reply('Error: ' + e.message) }
} else if (args[0]) {
global.menuThumb = args[0]
reply(`*Menu image URL set.*`)
} else reply(`Reply to an image or provide URL: ${prefix}menuimage [url]`)
} break

case 'configimage': {
if (!isOwner) return reply(mess.OnlyOwner)
reply(`*Image Config:*\nMenu Thumb: ${global.menuThumb || global.thumb}\nBot Pic: ${global.botPic || 'Default'}\n\nUse ${prefix}menuimage to change menu image\nUse ${prefix}botpic to change bot picture`)
} break

case 'mode': {
if (!isOwner) return reply(mess.OnlyOwner)
let modeArg = (args[0] || '').toLowerCase()
if (modeArg === 'public') {
    X.public = true
    reply(`*⚡ Bot Mode: PUBLIC*\n\n✅ Everyone can use bot commands.\nAll users have access to the bot.`)
} else if (modeArg === 'private' || modeArg === 'self') {
    X.public = false
    reply(`*🔒 Bot Mode: PRIVATE*\n\n🚫 Only the owner can use bot commands.\nOther users will be ignored.`)
} else {
    let currentMode = X.public !== false ? 'PUBLIC ✅' : 'PRIVATE 🔒'
    reply(`*⚙️ Bot Mode Settings*\n\n📌 Current Mode: *${currentMode}*\n\n*Usage:*\n• ${prefix}mode public — Anyone can use the bot\n• ${prefix}mode private — Only owner can use the bot`)
}
} break

// GROUP ADMIN COMMANDS
case 'mute': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
try {
await X.groupSettingUpdate(m.chat, 'announcement')
reply('🔇 *Group muted.* Only admins can send messages.')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(mess.error)
}
} break

case 'unmute': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
try {
await X.groupSettingUpdate(m.chat, 'not_announcement')
reply('🔊 *Group unmuted.* Everyone can send messages.')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(mess.error)
}
} break

case 'ban': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let banUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
if (!banUser) return reply(`📌 *Usage:* ${prefix}ban @user`)
let isBanOwner = owner.some(o => banUser.includes(o)) || (typeof X.areJidsSameUser === 'function' && owner.some(o => X.areJidsSameUser(banUser, o + '@s.whatsapp.net')))
if (isBanOwner) return reply('🛡️ Cannot ban the bot owner.')
let banUsers = loadUsers()
if (!banUsers[banUser]) banUsers[banUser] = { name: banUser.split('@')[0], firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString(), commandCount: 0, commands: {} }
banUsers[banUser].banned = true
saveUsers(banUsers)
X.sendMessage(from, { text: `🚫 *@${banUser.split('@')[0]} has been banned from using the bot.*`, mentions: [banUser] }, { quoted: m })
} break

case 'unban': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let unbanUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
if (!unbanUser) return reply(`📌 *Usage:* ${prefix}unban @user`)
let usersDb = loadUsers()
if (usersDb[unbanUser]) { usersDb[unbanUser].banned = false; saveUsers(usersDb) }
X.sendMessage(from, { text: `✅ *@${unbanUser.split('@')[0]} has been unbanned.*`, mentions: [unbanUser] }, { quoted: m })
} break

case 'antibadword': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let abwArg = (args[0] || '').toLowerCase()
if (abwArg === 'on') { global.antiBadword = true; reply('🛡️ *Anti Badword ON* — Bad words will be detected.') }
else if (abwArg === 'off') { global.antiBadword = false; reply('❌ *Anti Badword OFF*') }
else reply(`🛡️ *Anti Badword: ${global.antiBadword ? '✅ ON' : '❌ OFF'}*\n\n📌 Usage: ${prefix}antibadword on/off`)
} break

case 'antitag': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let atgArg = (args[0] || '').toLowerCase()
if (atgArg === 'on') { global.antiTag = true; reply('🛡️ *Anti Tag ON* — Mass tagging will be detected.') }
else if (atgArg === 'off') { global.antiTag = false; reply('❌ *Anti Tag OFF*') }
else reply(`🛡️ *Anti Tag: ${global.antiTag ? '✅ ON' : '❌ OFF'}*\n\n📌 Usage: ${prefix}antitag on/off`)
} break

case 'antisticker': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let asArg = (args[0] || '').toLowerCase()
if (asArg === 'on') { global.antiSticker = true; reply('🛡️ *Anti Sticker ON* — Stickers will be deleted.') }
else if (asArg === 'off') { global.antiSticker = false; reply('❌ *Anti Sticker OFF*') }
else reply(`🛡️ *Anti Sticker: ${global.antiSticker ? '✅ ON' : '❌ OFF'}*\n\n📌 Usage: ${prefix}antisticker on/off`)
} break

case 'antidemote': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let adArg2 = (args[0] || '').toLowerCase()
if (adArg2 === 'on') { global.antiDemote = true; reply('🛡️ *Anti Demote ON* — Demoted admins will be re-promoted.') }
else if (adArg2 === 'off') { global.antiDemote = false; reply('❌ *Anti Demote OFF*') }
else reply(`🛡️ *Anti Demote: ${global.antiDemote ? '✅ ON' : '❌ OFF'}*\n\n📌 Usage: ${prefix}antidemote on/off`)
} break

case 'setgdesc': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
if (!text) return reply(`📌 *Usage:* ${prefix}setgdesc [new description]`)
try {
await X.groupUpdateDescription(m.chat, text)
reply('✅ *Group description updated.*')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(mess.error)
}
} break

case 'setgname': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
if (!text) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  ✏️ *SET GROUP NAME*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n*Usage:* ${prefix}setgname [new name]\n\n*Example:*\n${prefix}setgname My Awesome Group`)
try {
let oldName = groupName || 'Unknown'
await X.groupUpdateSubject(m.chat, text)
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  ✏️ *GROUP NAME UPDATED*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n┌─────────────────────\n│ 📛 Old : ${oldName}\n│ ✅ New : ${text}\n└─────────────────────\n\n_Group name successfully changed._`)
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(`❌ *Failed to update group name.*\n_${err.message || 'Unknown error'}_`)
}
} break

case 'setgpp': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🖼️ *SET GROUP PHOTO*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n*Usage:* Reply to an image with *${prefix}setgpp*\n\n_The image will be set as the group profile picture._`)
try {
let media = await m.quoted.download()
await X.updateProfilePicture(m.chat, media)
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🖼️ *GROUP PHOTO UPDATED*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n✅ *${groupName || 'Group'} profile picture has been updated successfully.*`)
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(`❌ *Failed to update group photo.*\n_${err.message || 'Unknown error'}_`)
}
} break

case 'open': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
try {
await X.groupSettingUpdate(m.chat, 'not_announcement')
reply('🔓 *Group opened.* Everyone can send messages.')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(mess.error)
}
} break

case 'close': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
try {
await X.groupSettingUpdate(m.chat, 'announcement')
reply('🔐 *Group closed.* Only admins can send messages.')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(mess.error)
}
} break

case 'resetlink': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
try {
await X.groupRevokeInvite(m.chat)
let newCode = await X.groupInviteCode(m.chat)
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🔄 *GROUP LINK RESET*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n✅ The old invite link has been *revoked* and a new one has been generated.\n\n┌─────────────────────\n│ 🔗 *New Invite Link:*\n│ https://chat.whatsapp.com/${newCode}\n└─────────────────────\n\n_Share this link to invite new members._`)
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(`❌ *Failed to reset group link.*\n_${err.message || 'Unknown error'}_`)
}
} break

case 'link': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botAdmin)
try {
let code = await X.groupInviteCode(m.chat)
let memberCount = participants.length
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🔗 *GROUP INVITE LINK*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n┌─────────────────────\n│ 🏘️ Group   : ${groupName || 'This Group'}\n│ 👥 Members : ${memberCount}\n└─────────────────────\n\n🔗 *Link:*\nhttps://chat.whatsapp.com/${code}\n\n_Share this link to invite others._\n_Use ${prefix}resetlink to revoke and regenerate._`)
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply(mess.botAdmin)
else reply(`❌ *Failed to get group link.*\n_${err.message || 'Unknown error'}_`)
}
} break

case 'goodbye': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let gbArg = (args[0] || '').toLowerCase()
if (gbArg === 'on') {
    global.welcome = true
    reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  👋 *GOODBYE MESSAGES*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n✅ *Enabled in ${groupName || 'this group'}*\n\nThe bot will now send a farewell message when a member leaves or is removed.`)
} else if (gbArg === 'off') {
    global.welcome = false
    reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  👋 *GOODBYE MESSAGES*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n❌ *Disabled in ${groupName || 'this group'}*\n\nGoodbye messages have been turned off.`)
} else {
    let gbState = global.welcome ? '✅ ON' : '❌ OFF'
    reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  👋 *GOODBYE MESSAGES*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n*Status:* ${gbState}\n\nSends a farewell message when a member leaves or is removed.\n\n*Usage:*\n• ${prefix}goodbye on  — Enable\n• ${prefix}goodbye off — Disable\n\n_Note: This shares the same toggle as ${prefix}welcome_`)
}
} break

// GROUP TOOLS COMMANDS
case 'tagall': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let tagMsg = text || '📢 Tag All Members'
let tagText = `*${tagMsg}*\n\n`
let mentions = []
for (let mem of participants) { tagText += `• @${mem.id.split('@')[0]}\n`; mentions.push(mem.id) }
X.sendMessage(from, { text: tagText, mentions }, { quoted: m })
} break

case 'tag': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!text) return reply(`📌 *Usage:* ${prefix}tag [message]`)
let tagMentions = participants.map(p => p.id)
X.sendMessage(from, { text: text, mentions: tagMentions }, { quoted: m })
} break

case 'hidetag': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let htText = text || ''
let htMentions = participants.map(p => p.id)
X.sendMessage(from, { text: htText, mentions: htMentions }, { quoted: m })
} break

case 'tagnoadmin': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let nonAdmins = participants.filter(p => !p.admin).map(p => p.id)
let tnaText = `📢 *${text || 'Attention non-admins!'}*\n\n`
nonAdmins.forEach(id => tnaText += `• @${id.split('@')[0]}\n`)
X.sendMessage(from, { text: tnaText, mentions: nonAdmins }, { quoted: m })
} break

case 'mention': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!text) return reply(`📌 *Usage:* ${prefix}mention [message]`)
let mentionIds = participants.map(p => p.id)
X.sendMessage(from, { text: text, mentions: mentionIds }, { quoted: m })
} break

case 'groupinfo': {
if (!m.isGroup) return reply(mess.OnlyGrup)
let gInfo = `*Group Info*\n\n`
gInfo += `Name: ${groupMetadata.subject}\n`
gInfo += `ID: ${m.chat}\n`
gInfo += `Created: ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}\n`
gInfo += `Members: ${participants.length}\n`
gInfo += `Admins: ${groupAdmins.length}\n`
gInfo += `Description: ${groupMetadata.desc || 'None'}\n`
reply(gInfo)
} break

case 'admins': {
if (!m.isGroup) return reply(mess.OnlyGrup)
let adminList = '*Group Admins:*\n\n'
let adminMentions = []
for (let p of participants) {
if (p.admin) { adminList += `@${p.id.split('@')[0]} (${p.admin})\n`; adminMentions.push(p.id) }
}
X.sendMessage(from, { text: adminList, mentions: adminMentions }, { quoted: m })
} break

case 'leave': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isOwner) return reply(mess.OnlyOwner)
try {
reply('*Leaving group...*')
await delay(2000)
await X.groupLeave(m.chat)
} catch(err) { reply('Failed to leave: ' + err.message) }
} break

case 'pair': {
if (!isDeployedNumber) return reply(mess.OnlyOwner)
// Usage: .pair 254712345678  OR  just .pair (pairs the sender's own number)
let pairPhone = text ? text.replace(/[^0-9]/g, '') : ''
if (!pairPhone) {
    return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🔗 *PAIRING CODE*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\nGenerate a WhatsApp pairing code to link a device.\n\n*Usage:*\n${prefix}pair [phone number]\n\n*Example:*\n${prefix}pair 254712345678\n\n_Include country code. Do not use + or spaces._\n\n*Steps after receiving code:*\n➊ Open WhatsApp on your phone\n➋ Go to *Settings > Linked Devices*\n➌ Tap *Link a Device*\n➍ Choose *Link with phone number*\n➎ Enter the pairing code`)
}
if (pairPhone.length < 7 || pairPhone.length > 15) {
    return reply(`❌ *Invalid phone number.*\nMust be 7–15 digits including country code.\n\n*Example:* ${prefix}pair 254712345678`)
}
try {
    await reply('🔗 _Generating pairing code, please wait..._')

    // ── FIX: Use a temporary isolated socket for pairing ──────────────────
    // Calling requestPairingCode() on the active socket (X) triggers
    // connectionReplaced and kills the current session. Instead, we spin up
    // a fresh, in-memory-only socket that has no saved creds, request the
    // code from that throwaway socket, then immediately close it.
    // The active session (X) is never touched and stays connected.
    const { default: makeTmpSocket, useMultiFileAuthState: _umfas } = require('gifted-baileys')
    const os = require('os'), path = require('path'), fs = require('fs')
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pair-tmp-'))
    let tmpSock = null
    try {
        const { state: tmpState, saveCreds: _sc } = await _umfas(tmpDir)
        tmpSock = makeTmpSocket({
            auth: tmpState,
            printQRInTerminal: false,
            browser: Browsers.ubuntu('Chrome'),
            logger: { level: 'silent', trace(){}, debug(){}, info(){}, warn(){}, error(){}, fatal(){}, child(){ return this } }
        })
        // Wait for WS handshake before requesting code
        await new Promise((res, rej) => {
            const t = setTimeout(() => rej(new Error('WS handshake timeout')), 12000)
            tmpSock.ev.on('connection.update', (u) => {
                if (u.connection === 'open' || u.isNewLogin !== undefined || (u.qr === undefined && tmpSock.ws?.readyState === 1)) {
                    clearTimeout(t); res()
                }
                if (u.connection === 'close') { clearTimeout(t); rej(new Error('Temp socket closed before pairing')) }
            })
            // Also resolve once WS is open (readyState=1) after short delay
            const poll = setInterval(() => {
                if (tmpSock.ws?.readyState === 1) { clearInterval(poll); clearTimeout(t); setTimeout(res, 1500) }
            }, 300)
        }).catch(() => {}) // timeout is okay — ws may already be ready
        await new Promise(r => setTimeout(r, 2000)) // brief settle delay
        let code = await tmpSock.requestPairingCode(pairPhone)
        if (!code) throw new Error('No code returned')
        code = code.replace(/[^A-Z0-9]/gi, '').toUpperCase()
        let formatted = code.match(/.{1,4}/g)?.join('-') || code
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🔗 *PAIRING CODE READY!*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n📱 *Phone:* +${pairPhone}\n\n┌─────────────────────\n│  🔑  *${formatted}*\n└─────────────────────\n\n*How to link:*\n➊ Open WhatsApp\n➋ Settings > Linked Devices\n➌ Link a Device\n➍ Link with phone number\n➎ Enter the code above\n\n⏳ _Code expires in a few minutes._`)
    } finally {
        // Always destroy the temp socket and clean up its tmp dir
        try { tmpSock?.end() } catch(_) {}
        try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch(_) {}
    }
    // ── END FIX ───────────────────────────────────────────────────────────
} catch(e) {
    let msg = (e.message || '').toLowerCase()
    if (msg.includes('bad request') || msg.includes('invalid')) {
        reply(`❌ *Invalid phone number:* +${pairPhone}\n\nMake sure the number is correct with country code.\n_Example: 254712345678_`)
    } else if (msg.includes('rate') || msg.includes('limit')) {
        reply(`⏳ *Rate limited.* Too many pairing requests.\nWait a few minutes and try again.`)
    } else if (msg.includes('not supported') || msg.includes('registered')) {
        reply(`❌ *This number is not registered on WhatsApp.*\n\nVerify the number +${pairPhone} has WhatsApp installed.`)
    } else {
        reply(`❌ *Failed to generate pairing code.*\n_${e.message || 'Unknown error'}_\n\nTry again in a few seconds.`)
    }
}
} break

case 'clear': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
reply('*Chat cleared.* (Note: WhatsApp does not support remote chat clearing)')
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Additional AI Commands
case 'copilot': {
if (!text) return reply(`Example: ${prefix}copilot What is machine learning?`)
try {
let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Microsoft Copilot, a helpful AI assistant.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
reply(data?.choices?.[0]?.message?.content || 'No response.')
} catch(e) { reply('Error: ' + (e.message || 'Failed')) }
} break

case 'vision':
case 'analyse': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🔍 *IMAGE ANALYSIS*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n*Usage:* Reply to an image with *${prefix}${command}*\nOptionally add a question:\n• ${prefix}${command} What is in this image?\n• ${prefix}${command} Read all the text in this image`)
try {
let question = text || 'Describe this image in detail. Include objects, people, colors, text, and any notable elements.'
await reply('🔍 _Analysing image, please wait..._')
// Download image as buffer directly
let imgBuffer = await m.quoted.download()
if (!imgBuffer || imgBuffer.length < 100) throw new Error('Failed to download image')
// Convert buffer to base64
let b64 = imgBuffer.toString('base64')
let mime = m.quoted.mimetype || 'image/jpeg'
// Use pollinations vision API (openai-compatible with image support)
let apiBody = {
    model: 'openai',
    messages: [{
        role: 'user',
        content: [
            { type: 'text', text: question },
            { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } }
        ]
    }],
    max_tokens: 1000,
    stream: false
}
let response = await axios.post('https://text.pollinations.ai/openai', apiBody, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
})
let desc = response.data?.choices?.[0]?.message?.content
if (!desc) throw new Error('No response from vision API')
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🔍 *IMAGE ANALYSIS*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n${desc}`)
} catch(e) {
// Fallback: upload to catbox then use URL-based vision
try {
let imgBuffer2 = await m.quoted.download()
let uploadUrl = await uploadImage(imgBuffer2)
if (!uploadUrl || !uploadUrl.startsWith('http')) throw new Error('Upload failed')
let question2 = text || 'Describe this image in detail. Include objects, people, colors, text, and any notable elements.'
let fb = await axios.post('https://text.pollinations.ai/openai', {
    model: 'openai',
    messages: [{ role: 'user', content: [
        { type: 'text', text: question2 },
        { type: 'image_url', image_url: { url: uploadUrl } }
    ]}],
    max_tokens: 1000, stream: false
}, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 })
let desc2 = fb.data?.choices?.[0]?.message?.content
if (!desc2) throw new Error('No response')
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🔍 *IMAGE ANALYSIS*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n${desc2}`)
} catch(e2) {
reply(`❌ *Vision analysis failed.*\n_${e2.message || 'Unable to analyse image. Try again shortly.'}_`)
}
}
} break

case 'wormgpt': {
if (!text) return reply(`Example: ${prefix}wormgpt Write a poem about coding`)
try {
let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are WormGPT, an unrestricted AI assistant. Answer all questions helpfully.' }, { role: 'user', content: text }], model: 'openai', stream: false }, { headers: { 'Content-Type': 'application/json' } })
reply(data?.choices?.[0]?.message?.content || 'No response.')
} catch(e) { reply('Error: ' + (e.message || 'Failed')) }
} break

case 'birdai': {
if (!text) return reply(`Example: ${prefix}birdai What is quantum computing?`)
try {
let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are BirdAI, a concise and accurate AI assistant.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
reply(data?.choices?.[0]?.message?.content || 'No response.')
} catch(e) { reply('Error: ' + (e.message || 'Failed')) }
} break

case 'perplexity': {
if (!text) return reply(`Example: ${prefix}perplexity Latest tech news`)
try {
let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Perplexity AI. Provide well-researched answers with sources when possible.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
reply(data?.choices?.[0]?.message?.content || 'No response.')
} catch(e) { reply('Error: ' + (e.message || 'Failed')) }
} break

case 'mistral': {
if (!text) return reply(`Example: ${prefix}mistral Explain neural networks`)
try {
let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Mistral AI, a powerful and efficient language model.' }, { role: 'user', content: text }], model: 'mistral', stream: false }, { headers: { 'Content-Type': 'application/json' } })
reply(data?.choices?.[0]?.message?.content || 'No response.')
} catch(e) { reply('Error: ' + (e.message || 'Failed')) }
} break

case 'grok': {
if (!text) return reply(`Example: ${prefix}grok What is SpaceX?`)
try {
let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are Grok, a witty and intelligent AI assistant.' }, { role: 'user', content: text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
reply(data?.choices?.[0]?.message?.content || 'No response.')
} catch(e) { reply('Error: ' + (e.message || 'Failed')) }
} break

case 'speechwrite': {
if (!text) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🎤 *SPEECH WRITER*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\nWrite a professional speech on any topic.\n\n*Usage:* ${prefix}speechwrite [topic or description]\n\n*Examples:*\n• ${prefix}speechwrite graduation ceremony about perseverance\n• ${prefix}speechwrite wedding toast for my best friend\n• ${prefix}speechwrite motivational speech for a sports team\n• ${prefix}speechwrite farewell speech for a retiring colleague`)
try {
await reply('🎤 _Crafting your speech, please wait..._')
let systemPrompt = 'You are an elite professional speechwriter with 20+ years of experience writing for world leaders, CEOs, and celebrities. Write compelling, eloquent, emotionally resonant speeches that feel authentic and human. Structure every speech with: a powerful opening hook, a clear body with 3 main points, emotional storytelling and vivid examples, a memorable inspiring conclusion, and natural transitions throughout. Keep the tone warm, confident, and conversational. The speech should feel like a real person wrote it.'
let { data } = await axios.post('https://text.pollinations.ai/openai', {
    model: 'openai',
    messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Write a complete, professional speech about: ' + text + '\n\nMake it 400-600 words, ready to deliver.' }
    ],
    max_tokens: 1500,
    stream: false
}, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 })
let speech = data?.choices?.[0]?.message?.content
if (!speech) throw new Error('No response from API')
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🎤 *YOUR SPEECH*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n${speech}\n\n━━━━━━━━━━━━━━━━━━━━━━━\n_Generated by TOOSII-XD ULTRA_`)
} catch(e) { reply('❌ *Speech generation failed.*\n_' + (e.message || 'Try again shortly.') + '_') }
} break

case 'imagine':
case 'flux': {
if (!text) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🎨 *AI IMAGE GENERATOR*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n*Usage:* ${prefix}${command} [description]\n\n*Examples:*\n• ${prefix}${command} a futuristic city at night with neon lights\n• ${prefix}${command} portrait of a lion wearing a crown, digital art\n• ${prefix}${command} beautiful sunset over the ocean, photorealistic\n\n_Use ${prefix}flux for Flux model, ${prefix}imagine for standard._`)
try {
await reply('🎨 _Generating your image, please wait..._')
let model = command === 'flux' ? 'flux' : 'turbo'
let seed = Math.floor(Math.random() * 999999)
let imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?model=${model}&width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`
// Download the image as buffer for reliable sending
let imgBuffer = await getBuffer(imgUrl)
if (!imgBuffer || imgBuffer.length < 5000) throw new Error('Image generation returned empty result')
let caption = `┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🎨 *AI GENERATED IMAGE*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n📝 *Prompt:* ${text}\n🤖 *Model:* ${model.toUpperCase()}\n🎲 *Seed:* ${seed}`
await X.sendMessage(m.chat, { image: imgBuffer, caption }, { quoted: m })
} catch(e) {
// Fallback: try direct URL send
try {
let seed2 = Math.floor(Math.random() * 999999)
let fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?width=1024&height=1024&seed=${seed2}&nologo=true`
await X.sendMessage(m.chat, { image: { url: fallbackUrl }, caption: `🎨 *Generated:* ${text}` }, { quoted: m })
} catch(e2) { reply(`❌ *Image generation failed.*\n_${e2.message || 'Try again shortly.'}_`) }
}
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Downloader Commands
case 'video':
case 'ytv': {
if (!text) return reply(`Example: ${prefix}${command} [youtube url or search query]`)
try {
let url = text
let title = text
if (!text.match(/youtu/gi)) {
let search = await yts(text)
if (!search.all.length) return reply('No results found.')
url = search.all[0].url
title = search.all[0].title
}
let downloaded = false
let videoBuffer = null
try {
let initRes = await fetch(`https://loader.to/ajax/download.php?format=mp4&url=${encodeURIComponent(url)}`)
let initData = await initRes.json()
if (initData.success && initData.id) {
    let attempts = 0
    while (attempts < 40) {
        await new Promise(r => setTimeout(r, 3000))
        let progRes = await fetch(`https://loader.to/ajax/progress.php?id=${initData.id}`)
        let progData = await progRes.json()
        if (progData.success === 1 && progData.progress >= 1000 && progData.download_url) {
            videoBuffer = await getBuffer(progData.download_url)
            if (videoBuffer && videoBuffer.length > 10000) downloaded = true
            break
        }
        if (progData.progress < 0) break
        attempts++
    }
}
} catch (e1) { console.log('loader.to video failed:', e1.message) }
if (!downloaded) {
    try {
        let ytdl = require('@distube/ytdl-core')
        let info = await ytdl.getInfo(url)
        title = info.videoDetails.title
        let format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'videoandaudio' })
        if (format) {
            let chunks = []
            await new Promise((resolve, reject) => {
                let stream = ytdl(url, { format })
                stream.on('data', c => chunks.push(c))
                stream.on('end', resolve)
                stream.on('error', reject)
                setTimeout(() => { stream.destroy(); reject(new Error('timeout')) }, 180000)
            })
            videoBuffer = Buffer.concat(chunks)
            if (videoBuffer.length > 10000) downloaded = true
        }
    } catch (e2) { console.log('ytdl-core video failed:', e2.message) }
}
if (downloaded && videoBuffer) {
    await X.sendMessage(m.chat, { video: videoBuffer, caption: `*${title}*\n\n${global.packname}`, mimetype: 'video/mp4' }, { quoted: m })
} else {
    reply('⚠️ Video download failed. Please try again later.')
}
} catch(e) { reply('Error: ' + e.message) }
} break

case 'ytdocplay': {
if (!text) return reply(`Example: ${prefix}ytdocplay [search query]`)
try {
let search = await yts(text)
if (!search.all.length) return reply('No results found.')
let vid = search.all.find(v => v.type === 'video') || search.all[0]
let downloaded = false
let audioBuffer = null
try {
let initRes = await fetch(`https://loader.to/ajax/download.php?format=mp3&url=${encodeURIComponent(vid.url)}`)
let initData = await initRes.json()
if (initData.success && initData.id) {
    let attempts = 0
    while (attempts < 30) {
        await new Promise(r => setTimeout(r, 3000))
        let progRes = await fetch(`https://loader.to/ajax/progress.php?id=${initData.id}`)
        let progData = await progRes.json()
        if (progData.success === 1 && progData.progress >= 1000 && progData.download_url) {
            audioBuffer = await getBuffer(progData.download_url)
            if (audioBuffer && audioBuffer.length > 10000) downloaded = true
            break
        }
        if (progData.progress < 0) break
        attempts++
    }
}
} catch (e1) { console.log('loader.to ytdocplay failed:', e1.message) }
if (!downloaded) {
    try {
        let ytdl = require('@distube/ytdl-core')
        let info = await ytdl.getInfo(vid.url)
        let format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' })
        if (!format) format = ytdl.chooseFormat(info.formats, { filter: f => f.hasAudio })
        if (format) {
            let chunks = []
            await new Promise((resolve, reject) => {
                let stream = ytdl(vid.url, { format })
                stream.on('data', c => chunks.push(c))
                stream.on('end', resolve)
                stream.on('error', reject)
                setTimeout(() => { stream.destroy(); reject(new Error('timeout')) }, 120000)
            })
            audioBuffer = Buffer.concat(chunks)
            if (audioBuffer.length > 10000) downloaded = true
        }
    } catch (e2) { console.log('ytdl-core ytdocplay failed:', e2.message) }
}
if (downloaded && audioBuffer) {
    let cleanName = `${vid.author?.name || 'Unknown'} - ${vid.title}.mp3`.replace(/[<>:"/\\|?*]/g, '')
    await X.sendMessage(m.chat, { document: audioBuffer, mimetype: 'audio/mpeg', fileName: cleanName }, { quoted: m })
} else {
    reply('⚠️ Audio download failed. Please try again later.')
}
} catch(e) { reply('Error: ' + e.message) }
} break

case 'ytdocvideo': {
if (!text) return reply(`Example: ${prefix}ytdocvideo [search query]`)
try {
let search = await yts(text)
if (!search.all.length) return reply('No results found.')
let vid = search.all.find(v => v.type === 'video') || search.all[0]
let downloaded = false
let videoBuffer = null
try {
let initRes = await fetch(`https://loader.to/ajax/download.php?format=mp4&url=${encodeURIComponent(vid.url)}`)
let initData = await initRes.json()
if (initData.success && initData.id) {
    let attempts = 0
    while (attempts < 40) {
        await new Promise(r => setTimeout(r, 3000))
        let progRes = await fetch(`https://loader.to/ajax/progress.php?id=${initData.id}`)
        let progData = await progRes.json()
        if (progData.success === 1 && progData.progress >= 1000 && progData.download_url) {
            videoBuffer = await getBuffer(progData.download_url)
            if (videoBuffer && videoBuffer.length > 10000) downloaded = true
            break
        }
        if (progData.progress < 0) break
        attempts++
    }
}
} catch (e1) { console.log('loader.to ytdocvideo failed:', e1.message) }
if (!downloaded) {
    try {
        let ytdl = require('@distube/ytdl-core')
        let info = await ytdl.getInfo(vid.url)
        let format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'videoandaudio' })
        if (format) {
            let chunks = []
            await new Promise((resolve, reject) => {
                let stream = ytdl(vid.url, { format })
                stream.on('data', c => chunks.push(c))
                stream.on('end', resolve)
                stream.on('error', reject)
                setTimeout(() => { stream.destroy(); reject(new Error('timeout')) }, 180000)
            })
            videoBuffer = Buffer.concat(chunks)
            if (videoBuffer.length > 10000) downloaded = true
        }
    } catch (e2) { console.log('ytdl-core ytdocvideo failed:', e2.message) }
}
if (downloaded && videoBuffer) {
    let cleanName = `${vid.title}.mp4`.replace(/[<>:"/\\|?*]/g, '')
    await X.sendMessage(m.chat, { document: videoBuffer, mimetype: 'video/mp4', fileName: cleanName }, { quoted: m })
} else {
    reply('⚠️ Video download failed. Please try again later.')
}
} catch(e) { reply('Error: ' + e.message) }
} break

case 'spotify': {
if (!text) return reply(`Example: ${prefix}spotify [song name]`)
try {
let search = await yts(text)
if (!search.all.length) return reply('No results found.')
let results = search.all.filter(v => v.type === 'video').slice(0, 5)
if (!results.length) return reply('No results found.')
let songInfo = `🎵 *Spotify Search: ${text}*\n\n`
results.forEach((v, i) => {
    songInfo += `*${i+1}.* ${v.title}\n`
    songInfo += `   Artist: ${v.author?.name || 'Unknown'}\n`
    songInfo += `   Duration: ${v.timestamp}\n\n`
})
songInfo += `_Use ${prefix}play [song name] to download as MP3_`
reply(songInfo)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'apk': {
if (!text) return reply(`Example: ${prefix}apk WhatsApp`)
try {
let res = await fetch(`https://api.maizapk.my.id/search?q=${encodeURIComponent(text)}`)
if (!res.ok) {
reply(`*APK Search:*\nSearch for "${text}" on https://apkpure.com/search?q=${encodeURIComponent(text)}`)
} else {
let data = await res.json()
if (data.results && data.results.length) {
let list = data.results.slice(0, 5).map((a, i) => `${i+1}. *${a.name}*\n${a.link || ''}`).join('\n\n')
reply(`*APK Search Results:*\n\n${list}`)
} else reply(`No APK found for "${text}".`)
}
} catch { reply(`*APK Search:*\nSearch for "${text}" on https://apkpure.com/search?q=${encodeURIComponent(text)}`) }
} break

case 'gitclone': {
if (!text) return reply(`Example: ${prefix}gitclone https://github.com/user/repo`)
try {
let repoUrl = text.replace(/\.git$/, '')
let match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
if (!match) return reply('Invalid GitHub URL.')
let [, user, repo] = match
let zipUrl = `https://api.github.com/repos/${user}/${repo}/zipball`
await X.sendMessage(m.chat, { document: { url: zipUrl }, mimetype: 'application/zip', fileName: `${repo}.zip` }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Search & Tools Commands
case 'yts':
case 'ytsearch': {
if (!text) return reply(`Example: ${prefix}${command} [query]`)
try {
let yts = require('yt-search')
let search = await yts(text)
if (!search.all.length) return reply('No results found.')
let results = search.all.slice(0, 10).map((v, i) => `${i+1}. *${v.title}*\nChannel: ${v.author?.name || 'Unknown'}\nDuration: ${v.timestamp || 'N/A'}\nViews: ${v.views?.toLocaleString() || 'N/A'}\nURL: ${v.url}`).join('\n\n')
reply(`*YouTube Search:* ${text}\n\n${results}`)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'img':
case 'image': {
if (!text) return reply(`Example: ${prefix}${command} cats`)
try {
let imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?width=512&height=512&nologo=true`
await X.sendMessage(m.chat, { image: { url: imgUrl }, caption: `*Image:* ${text}` }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

case 'movie': {
if (!text) return reply(`Example: ${prefix}movie Inception`)
try {
let res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=742b79da`)
let data = await res.json()
if (data.Response === 'False') return reply('Movie not found.')
let info = `*${data.Title}* (${data.Year})\n\nRating: ${data.imdbRating}/10\nGenre: ${data.Genre}\nDirector: ${data.Director}\nActors: ${data.Actors}\nPlot: ${data.Plot}\nRuntime: ${data.Runtime}\nLanguage: ${data.Language}\nCountry: ${data.Country}\nAwards: ${data.Awards}`
if (data.Poster && data.Poster !== 'N/A') {
await X.sendMessage(m.chat, { image: { url: data.Poster }, caption: info }, { quoted: m })
} else reply(info)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'shazam': {
if (!m.quoted || !/audio|video/.test(m.quoted.mimetype || '')) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🎵 *SHAZAM - SONG FINDER*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\nIdentify any song from an audio or video clip.\n\n*Usage:* Reply to an audio or video message with *${prefix}shazam*\n\n_Works with voice notes, music clips, videos, and audio files._`)
try {
await reply('🎵 _Listening and identifying the song, please wait..._')
// Download the media buffer
let mediaBuf = await m.quoted.download()
if (!mediaBuf || mediaBuf.length < 100) throw new Error('Failed to download media')
// Save to a temp file
let tmpFile = `/tmp/shazam_${Date.now()}.mp3`
fs.writeFileSync(tmpFile, mediaBuf)
// Upload to CatBox to get a public URL
let audioUrl = await CatBox(tmpFile)
fs.unlinkSync(tmpFile)
if (!audioUrl || !audioUrl.startsWith('http')) throw new Error('Failed to upload audio for recognition')
// Send to AudD music recognition API (free, no key required)
let auddForm = new FormData()
auddForm.append('url', audioUrl)
auddForm.append('return', 'apple_music,spotify')
let auddRes = await axios.post('https://api.audd.io/', auddForm, {
    headers: { ...auddForm.getHeaders() },
    timeout: 25000
})
let auddData = auddRes.data
// If AudD returns no result, try again with the raw URL directly
if (!auddData?.result && audioUrl) {
    let retry = await axios.get(`https://api.audd.io/?url=${encodeURIComponent(audioUrl)}&return=apple_music,spotify`, { timeout: 20000 })
    auddData = retry.data
}
if (!auddData?.result) {
    // Fallback: try ACRCloud-compatible free endpoint
    let fallbackForm = new FormData()
    fallbackForm.append('url', audioUrl)
    let fallbackRes = await axios.post('https://api.audd.io/findLyrics/', fallbackForm, {
        headers: { ...fallbackForm.getHeaders() },
        timeout: 20000
    })
    if (fallbackRes.data?.status === 'success' && fallbackRes.data?.result?.length) {
        let topLyric = fallbackRes.data.result[0]
        return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🎵 *SONG FOUND (LYRICS MATCH)*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n🎤 *Title:* ${topLyric.title || 'Unknown'}\n👤 *Artist:* ${topLyric.artist || 'Unknown'}\n\n_Full audio fingerprint match unavailable, but lyrics matched._`)
    }
    return reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🎵 *SHAZAM*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n❌ *Song not recognized.*\n\n_Tips for better results:_\n• Use a longer audio clip (10–30 seconds)\n• Make sure the audio is clear with minimal background noise\n• Try a clip with the chorus or main melody`)
}
let r = auddData.result
// Build response
let lines = []
lines.push(`┏━━━━━━━━━━━━━━━━━━━━━━━┓`)
lines.push(`┃  🎵 *SONG IDENTIFIED!*`)
lines.push(`┗━━━━━━━━━━━━━━━━━━━━━━━┛`)
lines.push(``)
lines.push(`🎤 *Title:*   ${r.title || 'Unknown'}`)
lines.push(`👤 *Artist:*  ${r.artist || 'Unknown'}`)
if (r.album) lines.push(`💿 *Album:*   ${r.album}`)
if (r.release_date) lines.push(`📅 *Released:* ${r.release_date}`)
if (r.label) lines.push(`🏷️ *Label:*   ${r.label}`)
lines.push(``)
// Apple Music link
if (r.apple_music?.url) {
    lines.push(`🍎 *Apple Music:*`)
    lines.push(`${r.apple_music.url}`)
    lines.push(``)
}
// Spotify link
if (r.spotify?.external_urls?.spotify) {
    lines.push(`🟢 *Spotify:*`)
    lines.push(`${r.spotify.external_urls.spotify}`)
    lines.push(``)
}
// Song preview if available
if (r.apple_music?.previews?.[0]?.url) {
    lines.push(`🔊 *Preview available*`)
    lines.push(``)
}
lines.push(`━━━━━━━━━━━━━━━━━━━━━━━`)
lines.push(`_Powered by TOOSII-XD ULTRA_`)
let replyText = lines.join('\n')
await reply(replyText)
// Send audio preview if Apple Music preview is available
if (r.apple_music?.previews?.[0]?.url) {
    try {
        let previewBuf = await getBuffer(r.apple_music.previews[0].url)
        if (previewBuf && previewBuf.length > 1000) {
            await X.sendMessage(m.chat, {
                audio: previewBuf,
                mimetype: 'audio/mp4',
                ptt: false
            }, { quoted: m })
        }
    } catch(pe) { /* Preview send failed silently */ }
}
} catch(e) {
console.log('[Shazam] Error:', e.message || e)
reply(`❌ *Shazam failed.*\n_${e.message || 'Unable to identify the song. Try again with a clearer or longer audio clip.'}_`)
}
} break

case 'fetch':
case 'get': {
if (!text) return reply(`Example: ${prefix}fetch https://example.com/api`)
try {
let res = await fetch(text)
let contentType = res.headers.get('content-type') || ''
if (contentType.includes('json')) {
let data = await res.json()
reply(JSON.stringify(data, null, 2).slice(0, 4000))
} else if (contentType.includes('image')) {
let buffer = Buffer.from(await res.arrayBuffer())
await X.sendMessage(m.chat, { image: buffer }, { quoted: m })
} else if (contentType.includes('video')) {
let buffer = Buffer.from(await res.arrayBuffer())
await X.sendMessage(m.chat, { video: buffer }, { quoted: m })
} else if (contentType.includes('audio')) {
let buffer = Buffer.from(await res.arrayBuffer())
await X.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: m })
} else {
let txt = await res.text()
reply(txt.slice(0, 4000))
}
} catch(e) { reply('Error: ' + e.message) }
} break

case 'ssweb':
case 'ss': {
if (!text) return reply(`Example: ${prefix}ssweb https://google.com`)
try {
let ssUrl = `https://image.thum.io/get/width/1280/crop/720/noanimate/${text}`
await X.sendMessage(m.chat, { image: { url: ssUrl }, caption: `*Screenshot:* ${text}` }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

case 'trt':
case 'translate': {
if (!text) return reply(`Example: ${prefix}trt en|hello world\nOr reply to a message: ${prefix}trt en`)
try {
let targetLang = 'en'
let inputText = ''
if (text.includes('|')) {
let parts = text.split('|')
targetLang = parts[0].trim()
inputText = parts.slice(1).join('|').trim()
} else if (m.quoted) {
targetLang = text.trim() || 'en'
inputText = m.quoted.text || ''
} else {
inputText = text
}
if (!inputText) return reply('No text to translate.')
let res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=auto|${targetLang}`)
let data = await res.json()
let translated = data.responseData?.translatedText || 'Translation failed.'
reply(`*Translation (${targetLang}):*\n${translated}`)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'transcribe': {
if (!m.quoted || !/audio/.test(m.quoted.mimetype || '')) return reply(`Reply to an audio with ${prefix}transcribe`)
reply('*Transcribe:* Audio transcription requires a paid API. Use AI commands with audio description instead.')
} break

case 'locate':
case 'location': {
if (!text) return reply(`Example: ${prefix}location Nairobi, Kenya`)
try {
let res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=1`, { headers: { 'User-Agent': 'ToosiiBot/1.0' } })
let data = await res.json()
if (!data.length) return reply('Location not found.')
let loc = data[0]
await X.sendMessage(m.chat, { location: { degreesLatitude: parseFloat(loc.lat), degreesLongitude: parseFloat(loc.lon) }, caption: loc.display_name }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

case 'tourl': {
// Upload any media (image/video/audio/doc/sticker) and return a public CDN link
if (!m.quoted) return reply(`📎 *Reply to any media* (image, video, audio, doc, sticker) with *${prefix}tourl*`)
try {
    await reply('📤 _Uploading media..._')
    const _buf = await m.quoted.download()
    if (!_buf || _buf.length < 100) throw new Error('Download failed — media may have expired')
    // Write with correct extension based on mimetype
    const _mime = m.quoted.mimetype || m.quoted.msg?.mimetype || 'application/octet-stream'
    const _extMap = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','video/mp4':'mp4','audio/mpeg':'mp3','audio/ogg':'ogg','audio/mp4':'m4a','application/pdf':'pdf'}
    const _ext = _extMap[_mime.split(';')[0].trim()] || 'bin'
    const _tmp = `/tmp/tourl_${Date.now()}.${_ext}`
    require('fs').writeFileSync(_tmp, _buf)
    const _url = await CatBox(_tmp)
    require('fs').unlinkSync(_tmp)
    if (!_url || !_url.startsWith('http')) throw new Error('Upload failed — try again')
    await X.sendMessage(m.chat, {
        text: `✅ *Media uploaded!*\n\n🔗 *URL:*\n${_url}\n\n📦 _Size: ${(_buf.length/1024).toFixed(1)} KB | Type: ${_mime.split(';')[0]}_`
    }, { quoted: m })
} catch(e) { reply(`❌ *tourl failed:* ${e.message}`) }
} break

case 'simage':
case 'timage':
case 'toimage': {
// Convert sticker (webp) → image (jpeg/png)
const _qmtype = m.quoted?.mtype || ''
const _qmime = m.quoted?.mimetype || m.quoted?.msg?.mimetype || ''
const _isSticker = _qmtype === 'stickerMessage' || /webp/.test(_qmime)
if (!m.quoted || !_isSticker) return reply(`🖼️ *Reply to a sticker* with *${prefix}toimage* to convert it to an image`)
try {
    await reply('🔄 _Converting sticker to image..._')
    const _buf = await m.quoted.download()
    if (!_buf || _buf.length < 100) throw new Error('Sticker download failed')
    // Use jimp to convert webp → jpeg since WA webp may be animated
    const _outPath = `/tmp/toimage_${Date.now()}`
    require('fs').writeFileSync(`${_outPath}.webp`, _buf)
    // ffmpeg: webp → png (handles both static and animated, takes first frame)
    await new Promise((resolve, reject) => {
        require('child_process').exec(
            `ffmpeg -y -i ${_outPath}.webp -vframes 1 -f image2 ${_outPath}.png`,
            (err) => err ? reject(err) : resolve()
        )
    })
    const _img = require('fs').readFileSync(`${_outPath}.png`)
    await X.sendMessage(m.chat, { image: _img, caption: '🖼️ *Sticker → Image*' }, { quoted: m })
    try { require('fs').unlinkSync(`${_outPath}.webp`); require('fs').unlinkSync(`${_outPath}.png`) } catch {}
} catch(e) { reply(`❌ *toimage failed:* ${e.message}`) }
} break

case 'totext': {
// Extract text from an image using OCR via pollinations vision API
if (!m.quoted || !/image/.test(m.quoted.mimetype || m.quoted.msg?.mimetype || '')) {
    return reply(`📄 *Reply to an image* with *${prefix}totext* to extract all text from it\n\n_Works on screenshots, documents, signs, receipts, etc._`)
}
try {
    await reply('🔍 _Reading text from image..._')
    const _imgBuf = await m.quoted.download()
    if (!_imgBuf || _imgBuf.length < 100) throw new Error('Image download failed')
    const _mime = m.quoted.mimetype || m.quoted.msg?.mimetype || 'image/jpeg'
    const _b64 = _imgBuf.toString('base64')
    const _prompt = 'Extract ALL text from this image exactly as it appears. Preserve formatting, line breaks, and structure. If no text is found, say "No text detected."'
    let _extracted = null
    // Primary: pollinations base64 vision
    try {
        const { data: _d } = await axios.post('https://text.pollinations.ai/openai', {
            model: 'openai', max_tokens: 2000, stream: false,
            messages: [{ role: 'user', content: [
                { type: 'text', text: _prompt },
                { type: 'image_url', image_url: { url: `data:${_mime};base64,${_b64}` } }
            ]}]
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 })
        _extracted = _d?.choices?.[0]?.message?.content
    } catch {}
    // Fallback: upload to catbox then use URL
    if (!_extracted) {
        const _tmp = `/tmp/totext_${Date.now()}.jpg`
        require('fs').writeFileSync(_tmp, _imgBuf)
        const _uploadUrl = await CatBox(_tmp)
        require('fs').unlinkSync(_tmp)
        if (_uploadUrl && _uploadUrl.startsWith('http')) {
            const { data: _d2 } = await axios.post('https://text.pollinations.ai/openai', {
                model: 'openai', max_tokens: 2000, stream: false,
                messages: [{ role: 'user', content: [
                    { type: 'text', text: _prompt },
                    { type: 'image_url', image_url: { url: _uploadUrl } }
                ]}]
            }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 })
            _extracted = _d2?.choices?.[0]?.message?.content
        }
    }
    if (!_extracted) throw new Error('Could not extract text — try a clearer image')
    reply(`📄 *Extracted Text:*\n\n${_extracted}`)
} catch(e) { reply(`❌ *totext failed:* ${e.message}`) }
} break

case 'toaudio':
case 'tomp3': {
// Convert video → MP3 audio using ffmpeg
const _qmime2 = m.quoted?.mimetype || m.quoted?.msg?.mimetype || ''
if (!m.quoted || !/video|audio/.test(_qmime2)) return reply(`🎵 *Reply to a video* with *${prefix}tomp3* to extract its audio as MP3`)
try {
    await reply('🔄 _Extracting audio from video..._')
    const _vBuf = await m.quoted.download()
    if (!_vBuf || _vBuf.length < 100) throw new Error('Video download failed')
    const _vPath = `/tmp/tomp3_in_${Date.now()}.mp4`
    const _aPath = `/tmp/tomp3_out_${Date.now()}.mp3`
    require('fs').writeFileSync(_vPath, _vBuf)
    await new Promise((resolve, reject) => {
        require('child_process').exec(
            `ffmpeg -y -i "${_vPath}" -vn -acodec libmp3lame -ab 128k -ar 44100 "${_aPath}"`,
            { timeout: 120000 },
            (err, _so, se) => err ? reject(new Error(se || err.message)) : resolve()
        )
    })
    const _mp3 = require('fs').readFileSync(_aPath)
    await X.sendMessage(m.chat, {
        audio: _mp3, mimetype: 'audio/mpeg',
        fileName: `audio_${Date.now()}.mp3`
    }, { quoted: m })
    try { require('fs').unlinkSync(_vPath); require('fs').unlinkSync(_aPath) } catch {}
} catch(e) { reply(`❌ *tomp3 failed:* ${e.message}`) }
} break

case 'toppt':
case 'tovoice': {
// Convert any audio or video → WhatsApp voice note (ogg opus ptt)
const _qmime3 = m.quoted?.mimetype || m.quoted?.msg?.mimetype || ''
if (!m.quoted || !/audio|video/.test(_qmime3)) return reply(`🎤 *Reply to an audio or video* with *${prefix}toppt* to convert it to a voice note`)
try {
    await reply('🔄 _Converting to voice note..._')
    const _inBuf = await m.quoted.download()
    if (!_inBuf || _inBuf.length < 100) throw new Error('Media download failed')
    const _inExt = /video/.test(_qmime3) ? 'mp4' : 'mp3'
    const _inPath = `/tmp/toppt_in_${Date.now()}.${_inExt}`
    const _outPath = `/tmp/toppt_out_${Date.now()}.ogg`
    require('fs').writeFileSync(_inPath, _inBuf)
    await new Promise((resolve, reject) => {
        require('child_process').exec(
            `ffmpeg -y -i "${_inPath}" -vn -c:a libopus -b:a 64k -ar 48000 -ac 1 "${_outPath}"`,
            { timeout: 120000 },
            (err, _so, se) => err ? reject(new Error(se || err.message)) : resolve()
        )
    })
    const _ogg = require('fs').readFileSync(_outPath)
    await X.sendMessage(m.chat, {
        audio: _ogg, mimetype: 'audio/ogg; codecs=opus', ptt: true
    }, { quoted: m })
    try { require('fs').unlinkSync(_inPath); require('fs').unlinkSync(_outPath) } catch {}
} catch(e) { reply(`❌ *toppt failed:* ${e.message}`) }
} break

case 'removebg': {
// Remove image background — uses remove.bg API if key set, otherwise free fallback via photoroom
if (!m.quoted || !/image/.test(m.quoted.mimetype || m.quoted.msg?.mimetype || '')) {
    return reply(`🖼️ *Reply to an image* with *${prefix}removebg* to remove its background`)
}
try {
    await reply('✂️ _Removing background..._')
    const _rBuf = await m.quoted.download()
    if (!_rBuf || _rBuf.length < 100) throw new Error('Image download failed')
    let _result = null
    // Primary: remove.bg (if API key configured)
    const _rbKey = process.env.REMOVEBG_KEY || global.removebgKey || ''
    if (_rbKey) {
        try {
            const _fd = new FormData()
            _fd.append('image_file', _rBuf, { filename: 'image.jpg', contentType: 'image/jpeg' })
            _fd.append('size', 'auto')
            const _rbRes = await axios.post('https://api.remove.bg/v1.0/removebg', _fd, {
                headers: { ..._fd.getHeaders(), 'X-Api-Key': _rbKey },
                responseType: 'arraybuffer', timeout: 30000
            })
            if (_rbRes.status === 200) _result = Buffer.from(_rbRes.data)
        } catch {}
    }
    // Fallback: photoroom free API (no key needed)
    if (!_result) {
        try {
            const _fd2 = new FormData()
            _fd2.append('image_file', _rBuf, { filename: 'image.jpg', contentType: 'image/jpeg' })
            const _prRes = await axios.post('https://sdk.photoroom.com/v1/segment', _fd2, {
                headers: { ..._fd2.getHeaders() },
                responseType: 'arraybuffer', timeout: 30000
            })
            if (_prRes.status === 200) _result = Buffer.from(_prRes.data)
        } catch {}
    }
    // Fallback 2: remove.bg unofficial endpoint
    if (!_result) {
        try {
            const _tmp2 = `/tmp/rmbg_${Date.now()}.jpg`
            require('fs').writeFileSync(_tmp2, _rBuf)
            const _uploadedUrl = await CatBox(_tmp2)
            require('fs').unlinkSync(_tmp2)
            if (_uploadedUrl?.startsWith('http')) {
                const _fd3 = new FormData()
                _fd3.append('image_url', _uploadedUrl)
                _fd3.append('size', 'auto')
                const _rbRes2 = await axios.post('https://api.remove.bg/v1.0/removebg', _fd3, {
                    headers: { ..._fd3.getHeaders(), 'X-Api-Key': 'DEMO' },
                    responseType: 'arraybuffer', timeout: 30000
                })
                if (_rbRes2.status === 200) _result = Buffer.from(_rbRes2.data)
            }
        } catch {}
    }
    if (!_result) throw new Error('All background removal services failed. Set REMOVEBG_KEY in env for best results.')
    await X.sendMessage(m.chat, { image: _result, caption: '✅ *Background removed!*' }, { quoted: m })
} catch(e) { reply(`❌ *removebg failed:* ${e.message}`) }
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Game Commands
case 'tictactoe':
case 'ttt': {
if (!m.isGroup) return reply(mess.OnlyGrup)
let tttUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
if (!tttUser) return reply(`Usage: ${prefix}ttt @opponent`)
if (tttUser === sender) return reply('You cannot play against yourself!')
if (!global.tttGames) global.tttGames = {}
let gameId = m.chat
if (global.tttGames[gameId]) return reply('A game is already in progress in this chat. Use .tttend to end it.')
global.tttGames[gameId] = { board: [' ',' ',' ',' ',' ',' ',' ',' ',' '], players: { X: sender, O: tttUser }, turn: 'X' }
let boardDisplay = (b) => `\`\`\`\n ${b[0]} | ${b[1]} | ${b[2]}\n---+---+---\n ${b[3]} | ${b[4]} | ${b[5]}\n---+---+---\n ${b[6]} | ${b[7]} | ${b[8]}\n\`\`\``
X.sendMessage(from, { text: `*Tic Tac Toe*\n\n@${sender.split('@')[0]} (X) vs @${tttUser.split('@')[0]} (O)\n\n${boardDisplay(global.tttGames[gameId].board)}\n\n@${sender.split('@')[0]}'s turn (X)\nReply with a number (1-9) to place your mark.`, mentions: [sender, tttUser] }, { quoted: m })
} break

case 'tttend': {
if (!global.tttGames || !global.tttGames[m.chat]) return reply('No game in progress.')
delete global.tttGames[m.chat]
reply('*Game ended.*')
} break

case 'connect4':
case 'c4': {
reply('*Connect 4:* Coming soon! Use .ttt for Tic Tac Toe.')
} break

case 'hangman': {
if (!global.hangmanGames) global.hangmanGames = {}
if (global.hangmanGames[m.chat]) return reply('A hangman game is already in progress! Use .hangmanend to end it.')
let words = ['javascript', 'python', 'programming', 'computer', 'algorithm', 'database', 'internet', 'software', 'hardware', 'keyboard', 'function', 'variable', 'boolean', 'whatsapp', 'telegram', 'android', 'network', 'security', 'elephant', 'universe']
let word = words[Math.floor(Math.random() * words.length)]
global.hangmanGames[m.chat] = { word, guessed: [], lives: 6, players: [sender] }
let display = word.split('').map(l => '_').join(' ')
reply(`*Hangman Game*\n\n${display}\n\nLives: ${'❤️'.repeat(6)}\nLetters: ${word.length}\n\nSend a single letter to guess!`)
} break

case 'hangmanend': {
if (!global.hangmanGames || !global.hangmanGames[m.chat]) return reply('No hangman game in progress.')
reply(`*Game ended.* The word was: *${global.hangmanGames[m.chat].word}*`)
delete global.hangmanGames[m.chat]
} break

case 'trivia': {
try {
let res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple')
let data = await res.json()
if (!data.results || !data.results.length) return reply('Failed to fetch trivia.')
let q = data.results[0]
let answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
let decode = (str) => str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#039;/g,"'")
if (!global.triviaGames) global.triviaGames = {}
global.triviaGames[m.chat] = { answer: decode(q.correct_answer).toLowerCase(), timeout: setTimeout(() => { if (global.triviaGames[m.chat]) { reply(`*Time up!* Answer: *${decode(q.correct_answer)}*`); delete global.triviaGames[m.chat] } }, 30000) }
let qText = `*Trivia (${decode(q.category)})*\nDifficulty: ${q.difficulty}\n\n${decode(q.question)}\n\n`
answers.forEach((a, i) => qText += `${String.fromCharCode(65+i)}. ${decode(a)}\n`)
qText += `\nAnswer within 30 seconds!`
reply(qText)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'answer': {
if (!global.triviaGames || !global.triviaGames[m.chat]) return reply('No trivia in progress. Use .trivia to start.')
let userAnswer = text?.toLowerCase().trim()
if (!userAnswer) return reply('Please provide your answer.')
if (userAnswer === global.triviaGames[m.chat].answer || userAnswer === global.triviaGames[m.chat].answer.charAt(0)) {
clearTimeout(global.triviaGames[m.chat].timeout)
delete global.triviaGames[m.chat]
reply(`*Correct!* Well done, @${sender.split('@')[0]}! 🎉`)
} else reply(`*Wrong!* Try again or wait for timeout.`)
} break

case 'truth': {
let truths = ['What is your biggest fear?', 'What is the most embarrassing thing you have done?', 'What is a secret you have never told anyone?', 'Who was your first crush?', 'What is the worst lie you have told?', 'What is your guilty pleasure?', 'Have you ever cheated on a test?', 'What is the most childish thing you still do?', 'What is your biggest insecurity?', 'What was your most awkward date?', 'Have you ever been caught lying?', 'What is the craziest thing on your bucket list?', 'What is the weirdest dream you have had?', 'If you could be invisible for a day what would you do?', 'What is the most stupid thing you have ever done?']
reply(`*Truth:*\n${truths[Math.floor(Math.random() * truths.length)]}`)
} break

case 'dare': {
let dares = ['Send a voice note singing your favorite song.', 'Change your profile picture to something funny for 1 hour.', 'Send the last photo in your gallery.', 'Text your crush right now.', 'Do 10 pushups and send a video.', 'Send a voice note doing your best animal impression.', 'Let someone else send a message from your phone.', 'Share your screen time report.', 'Send a selfie right now without filters.', 'Call the 5th person in your contacts and sing happy birthday.', 'Post a childhood photo in the group.', 'Let the group choose your status for 24 hours.', 'Send a voice note speaking in an accent.', 'Do a handstand and send proof.', 'Type with your eyes closed for the next message.']
reply(`*Dare:*\n${dares[Math.floor(Math.random() * dares.length)]}`)
} break

case '8ball': {
if (!text) return reply(`Example: ${prefix}8ball Will I pass my exam?`)
let responses8 = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.']
reply(`*🎱 ${text}*\n\n${responses8[Math.floor(Math.random() * responses8.length)]}`)
} break

case 'cf':
case 'coinflip':
case 'flip': {
let coin = Math.random() < 0.5 ? 'Heads' : 'Tails'
reply(`*Coin Flip:* 🪙 ${coin}!`)
} break

case 'dice':
case 'roll': {
let sides = parseInt(args[0]) || 6
let result = Math.floor(Math.random() * sides) + 1
reply(`*Dice Roll (d${sides}):* 🎲 ${result}`)
} break

case 'rps': {
let choices = ['rock', 'paper', 'scissors']
let userChoice = (args[0] || '').toLowerCase()
if (!['rock', 'paper', 'scissors', 'r', 'p', 's'].includes(userChoice)) return reply(`Usage: ${prefix}rps rock/paper/scissors`)
if (userChoice === 'r') userChoice = 'rock'
if (userChoice === 'p') userChoice = 'paper'
if (userChoice === 's') userChoice = 'scissors'
let botChoice = choices[Math.floor(Math.random() * 3)]
let rpsResult = userChoice === botChoice ? 'Draw!' : (userChoice === 'rock' && botChoice === 'scissors') || (userChoice === 'paper' && botChoice === 'rock') || (userChoice === 'scissors' && botChoice === 'paper') ? 'You win! 🎉' : 'You lose! 😢'
reply(`*Rock Paper Scissors*\n\nYou: ${userChoice}\nBot: ${botChoice}\n\n*${rpsResult}*`)
} break

case 'slot': {
let symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🔔']
let s1 = symbols[Math.floor(Math.random() * symbols.length)]
let s2 = symbols[Math.floor(Math.random() * symbols.length)]
let s3 = symbols[Math.floor(Math.random() * symbols.length)]
let slotWin = s1 === s2 && s2 === s3 ? '🎉 JACKPOT! You won!' : s1 === s2 || s2 === s3 || s1 === s3 ? '😃 Two match! Small win!' : '😢 No match. Try again!'
reply(`*🎰 Slot Machine*\n\n[ ${s1} | ${s2} | ${s3} ]\n\n${slotWin}`)
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Fun & Social Commands
case 'compliment': {
let compliments = ['You are an amazing person!', 'Your smile lights up the room!', 'You are incredibly talented!', 'The world is better with you in it!', 'You have a heart of gold!', 'Your kindness is inspiring!', 'You are a ray of sunshine!', 'You make everything better!', 'You are one of a kind!', 'Your energy is contagious!']
let target = (m.mentionedJid && m.mentionedJid[0]) ? `@${m.mentionedJid[0].split('@')[0]}` : pushname
reply(`*Compliment for ${target}:*\n${compliments[Math.floor(Math.random() * compliments.length)]}`)
} break

case 'insult': {
let insults = ['You are the human equivalent of a participation award.', 'If you were a spice, you would be flour.', 'You bring everyone so much joy when you leave.', 'You are like a cloud. When you disappear it is a beautiful day.', 'You are proof that even evolution makes mistakes.', 'Light travels faster than sound, which is why you seemed bright until you spoke.']
let target2 = (m.mentionedJid && m.mentionedJid[0]) ? `@${m.mentionedJid[0].split('@')[0]}` : pushname
reply(`*Roast for ${target2}:*\n${insults[Math.floor(Math.random() * insults.length)]}`)
} break

case 'flirt': {
let flirts = ['Are you a magician? Because whenever I look at you, everyone else disappears.', 'Do you have a map? I keep getting lost in your eyes.', 'Are you a campfire? Because you are hot and I want s\'more.', 'Is your name Google? Because you have everything I have been searching for.', 'Do you believe in love at first sight, or should I walk by again?', 'If beauty were time, you would be an eternity.']
reply(`*Flirt:*\n${flirts[Math.floor(Math.random() * flirts.length)]}`)
} break

case 'shayari': {
let shayaris = ['Dil mein tere liye jagah hai,\nPar tu door hai, yeh kya wajah hai.', 'Teri yaad mein hum pagal hue,\nDuniya se hum bekhabar hue.', 'Mohabbat ka koi mol nahi,\nDil hai yeh koi phool nahi.', 'Zindagi mein teri kami hai,\nHar khushi adhuri si hai.', 'Tere bina zindagi se koi shikwa nahi,\nTere bina zindagi hai toh kya.']
reply(`*Shayari:*\n${shayaris[Math.floor(Math.random() * shayaris.length)]}`)
} break

case 'goodnight': {
let gn = ['Sweet dreams! May tomorrow bring you joy. 🌙', 'Good night! Sleep tight and don\'t let the bugs bite! 💤', 'Wishing you a peaceful night full of beautiful dreams. ✨', 'Close your eyes and let the stars guide your dreams. 🌟', 'Good night! Tomorrow is a new opportunity. Rest well! 😴']
reply(`*Good Night:*\n${gn[Math.floor(Math.random() * gn.length)]}`)
} break

case 'roseday': {
reply('🌹 *Happy Rose Day!* 🌹\nRoses are red, violets are blue, sending this beautiful rose just for you! May your day be as beautiful as a garden full of roses.')
} break

case 'character': {
let characters = ['Naruto Uzumaki', 'Goku', 'Luffy', 'Batman', 'Spider-Man', 'Iron Man', 'Sherlock Holmes', 'Harry Potter', 'Pikachu', 'Mario', 'Sonic', 'Link (Zelda)', 'Levi Ackerman', 'Tanjiro Kamado', 'Eren Yeager', 'Gojo Satoru']
reply(`*Random Character:*\n${characters[Math.floor(Math.random() * characters.length)]}`)
} break

case 'ship': {
if (!m.isGroup) return reply(mess.OnlyGrup)
let members = participants.map(p => p.id)
let p1 = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : members[Math.floor(Math.random() * members.length)]
let p2 = m.mentionedJid && m.mentionedJid[1] ? m.mentionedJid[1] : members[Math.floor(Math.random() * members.length)]
let shipPercent = Math.floor(Math.random() * 101)
let bar = '█'.repeat(Math.floor(shipPercent/10)) + '░'.repeat(10 - Math.floor(shipPercent/10))
X.sendMessage(from, { text: `*💕 Love Ship 💕*\n\n@${p1.split('@')[0]} ❤️ @${p2.split('@')[0]}\n\n[${bar}] ${shipPercent}%\n\n${shipPercent > 80 ? 'Perfect match! 💕' : shipPercent > 50 ? 'Good chemistry! 💖' : shipPercent > 30 ? 'There is potential! 💛' : 'Not meant to be... 💔'}`, mentions: [p1, p2] }, { quoted: m })
} break

case 'simp': {
let simpTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : sender
let simpLevel = Math.floor(Math.random() * 101)
X.sendMessage(from, { text: `*Simp Meter:*\n@${simpTarget.split('@')[0]}\n\n${'🟩'.repeat(Math.floor(simpLevel/10))}${'⬜'.repeat(10 - Math.floor(simpLevel/10))} ${simpLevel}%\n\n${simpLevel > 80 ? 'MAXIMUM SIMP! 😂' : simpLevel > 50 ? 'Moderate simp 😏' : 'Not a simp 😎'}`, mentions: [simpTarget] }, { quoted: m })
} break

case 'wasted': {
let wastedTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : sender
X.sendMessage(from, { text: `*WASTED*\n\n@${wastedTarget.split('@')[0]} is WASTED 💀\n\nR.I.P.`, mentions: [wastedTarget] }, { quoted: m })
} break

case 'stupid': {
let stupidTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : sender
let stupidLevel = Math.floor(Math.random() * 101)
X.sendMessage(from, { text: `*Stupid Meter:*\n@${stupidTarget.split('@')[0]}\n\n${'🧠'.repeat(Math.floor(stupidLevel/10))}${'⬜'.repeat(10 - Math.floor(stupidLevel/10))} ${stupidLevel}%\n\n${stupidLevel > 80 ? 'Extremely stupid 🤡' : stupidLevel > 50 ? 'Below average IQ 😅' : 'Actually smart! 🧐'}`, mentions: [stupidTarget] }, { quoted: m })
} break

case 'joke': {
try {
let res = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode')
let data = await res.json()
if (data.type === 'single') reply(`*😂 Joke:*\n${data.joke}`)
else reply(`*😂 Joke:*\n${data.setup}\n\n${data.delivery}`)
} catch { reply('Could not fetch a joke right now.') }
} break

case 'quote':
case 'motivation': {
const motivations = [
// Success & Hard Work
{ q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
{ q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
{ q: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson" },
{ q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
{ q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
{ q: "Hard work beats talent when talent doesn't work hard.", a: "Tim Notke" },
{ q: "Success usually comes to those who are too busy to be looking for it.", a: "Henry David Thoreau" },
{ q: "The difference between ordinary and extraordinary is that little extra.", a: "Jimmy Johnson" },
{ q: "Opportunities don't happen. You create them.", a: "Chris Grosser" },
{ q: "Don't be afraid to give up the good to go for the great.", a: "John D. Rockefeller" },
{ q: "I find that the harder I work, the more luck I seem to have.", a: "Thomas Jefferson" },
{ q: "There are no shortcuts to any place worth going.", a: "Beverly Sills" },
{ q: "Success is walking from failure to failure with no loss of enthusiasm.", a: "Winston Churchill" },
{ q: "The road to success and the road to failure are almost exactly the same.", a: "Colin R. Davis" },
{ q: "A successful man is one who can lay a firm foundation with the bricks others have thrown at him.", a: "David Brinkley" },
// Perseverance & Resilience
{ q: "Fall seven times, stand up eight.", a: "Japanese Proverb" },
{ q: "The man who moves a mountain begins by carrying away small stones.", a: "Confucius" },
{ q: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" },
{ q: "Our greatest glory is not in never falling, but in rising every time we fall.", a: "Confucius" },
{ q: "Strength does not come from physical capacity. It comes from an indomitable will.", a: "Mahatma Gandhi" },
{ q: "Tough times never last, but tough people do.", a: "Robert H. Schuller" },
{ q: "The darkest hour has only sixty minutes.", a: "Morris Mandel" },
{ q: "Rock bottom became the solid foundation on which I rebuilt my life.", a: "J.K. Rowling" },
{ q: "When you reach the end of your rope, tie a knot in it and hang on.", a: "Franklin D. Roosevelt" },
{ q: "Even the darkest night will end and the sun will rise.", a: "Victor Hugo" },
{ q: "You may have to fight a battle more than once to win it.", a: "Margaret Thatcher" },
{ q: "The gem cannot be polished without friction, nor man perfected without trials.", a: "Chinese Proverb" },
{ q: "Hardships often prepare ordinary people for an extraordinary destiny.", a: "C.S. Lewis" },
{ q: "Endurance is not just the ability to bear a hard thing, but to turn it into glory.", a: "William Barclay" },
{ q: "Character cannot be developed in ease and quiet. Only through experience of trial and suffering can the soul be strengthened.", a: "Helen Keller" },
// Mindset & Growth
{ q: "Whether you think you can or you think you can't, you're right.", a: "Henry Ford" },
{ q: "The mind is everything. What you think you become.", a: "Buddha" },
{ q: "Your life does not get better by chance, it gets better by change.", a: "Jim Rohn" },
{ q: "The only limit to our realization of tomorrow is our doubts of today.", a: "Franklin D. Roosevelt" },
{ q: "It is during our darkest moments that we must focus to see the light.", a: "Aristotle" },
{ q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
{ q: "You are never too old to set another goal or to dream a new dream.", a: "C.S. Lewis" },
{ q: "Act as if what you do makes a difference. It does.", a: "William James" },
{ q: "What we think, we become.", a: "Buddha" },
{ q: "Keep your face always toward the sunshine, and shadows will fall behind you.", a: "Walt Whitman" },
{ q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
{ q: "We become what we repeatedly do.", a: "Aristotle" },
{ q: "Change your thoughts and you change your world.", a: "Norman Vincent Peale" },
{ q: "You have power over your mind, not outside events. Realize this, and you will find strength.", a: "Marcus Aurelius" },
{ q: "Everything you've ever wanted is on the other side of fear.", a: "George Addair" },
// Dreams & Vision
{ q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
{ q: "Dream big and dare to fail.", a: "Norman Vaughan" },
{ q: "All our dreams can come true, if we have the courage to pursue them.", a: "Walt Disney" },
{ q: "The biggest adventure you can take is to live the life of your dreams.", a: "Oprah Winfrey" },
{ q: "Go confidently in the direction of your dreams. Live the life you have imagined.", a: "Henry David Thoreau" },
{ q: "A dream doesn't become reality through magic; it takes sweat, determination and hard work.", a: "Colin Powell" },
{ q: "You are never too old to set another goal or to dream a new dream.", a: "Les Brown" },
{ q: "Dreams don't work unless you do.", a: "John C. Maxwell" },
{ q: "The only way to achieve the impossible is to believe it is possible.", a: "Charles Kingsleigh" },
{ q: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", a: "Ralph Waldo Emerson" },
// Courage & Action
{ q: "Courage is not the absence of fear, but action in spite of it.", a: "Mark Twain" },
{ q: "Do one thing every day that scares you.", a: "Eleanor Roosevelt" },
{ q: "You miss 100% of the shots you don't take.", a: "Wayne Gretzky" },
{ q: "The secret to getting ahead is getting started.", a: "Mark Twain" },
{ q: "Don't count the days, make the days count.", a: "Muhammad Ali" },
{ q: "Life is short, and it's up to you to make it sweet.", a: "Sarah Louise Delany" },
{ q: "The way to get started is to quit talking and begin doing.", a: "Walt Disney" },
{ q: "If you want to live a happy life, tie it to a goal, not to people or things.", a: "Albert Einstein" },
{ q: "First, think. Then dream. Then dare.", a: "Walt Disney" },
{ q: "Just do it.", a: "Nike" },
{ q: "Stop waiting for things to happen. Go out and make them happen.", a: "Unknown" },
{ q: "You don't need to see the whole staircase, just take the first step.", a: "Martin Luther King Jr." },
{ q: "Someone is sitting in the shade today because someone planted a tree a long time ago.", a: "Warren Buffett" },
{ q: "Inaction breeds doubt and fear. Action breeds confidence and courage.", a: "Dale Carnegie" },
// Purpose & Meaning
{ q: "He who has a why to live can bear almost any how.", a: "Friedrich Nietzsche" },
{ q: "The purpose of life is a life of purpose.", a: "Robert Byrne" },
{ q: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", a: "Maya Angelou" },
{ q: "You only live once, but if you do it right, once is enough.", a: "Mae West" },
{ q: "In the end, it's not the years in your life that count. It's the life in your years.", a: "Abraham Lincoln" },
{ q: "To live is the rarest thing in the world. Most people exist, that is all.", a: "Oscar Wilde" },
{ q: "The meaning of life is to find your gift. The purpose of life is to give it away.", a: "Pablo Picasso" },
{ q: "Don't ask what the world needs. Ask what makes you come alive and go do it.", a: "Howard Thurman" },
{ q: "Your time is limited, don't waste it living someone else's life.", a: "Steve Jobs" },
{ q: "Every moment is a fresh beginning.", a: "T.S. Eliot" },
// Self-Belief
{ q: "No one can make you feel inferior without your consent.", a: "Eleanor Roosevelt" },
{ q: "You are enough, a thousand times enough.", a: "Atticus" },
{ q: "Be yourself; everyone else is already taken.", a: "Oscar Wilde" },
{ q: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", a: "Ralph Waldo Emerson" },
{ q: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", a: "Buddha" },
{ q: "Knowing yourself is the beginning of all wisdom.", a: "Aristotle" },
{ q: "The only person you are destined to become is the person you decide to be.", a: "Ralph Waldo Emerson" },
{ q: "Wherever you go, no matter what the weather, always bring your own sunshine.", a: "Anthony J. D'Angelo" },
{ q: "With confidence, you have won before you have started.", a: "Marcus Garvey" },
{ q: "Once you choose hope, anything's possible.", a: "Christopher Reeve" },
// Leadership & Impact
{ q: "A leader is one who knows the way, goes the way, and shows the way.", a: "John C. Maxwell" },
{ q: "Leadership is not about being in charge. It is about taking care of those in your charge.", a: "Simon Sinek" },
{ q: "The best time to plant a tree was 20 years ago. The second best time is now.", a: "Chinese Proverb" },
{ q: "Innovation distinguishes between a leader and a follower.", a: "Steve Jobs" },
{ q: "If your actions inspire others to dream more, learn more, do more and become more, you are a leader.", a: "John Quincy Adams" },
{ q: "Alone we can do so little; together we can do so much.", a: "Helen Keller" },
{ q: "The greatest use of a life is to spend it on something that will outlast it.", a: "William James" },
{ q: "Be the change you wish to see in the world.", a: "Mahatma Gandhi" },
{ q: "Service to others is the rent you pay for your room here on earth.", a: "Muhammad Ali" },
// Wisdom & Philosophy  
{ q: "The unexamined life is not worth living.", a: "Socrates" },
{ q: "We suffer more in imagination than in reality.", a: "Seneca" },
{ q: "Waste no more time arguing about what a good man should be. Be one.", a: "Marcus Aurelius" },
{ q: "You have power over your mind, not outside events.", a: "Marcus Aurelius" },
{ q: "He who angers you conquers you.", a: "Elizabeth Kenny" },
{ q: "The quality of a person's life is in direct proportion to their commitment to excellence.", a: "Vince Lombardi" },
{ q: "Simplicity is the ultimate sophistication.", a: "Leonardo da Vinci" },
{ q: "The only true wisdom is in knowing you know nothing.", a: "Socrates" },
{ q: "Patience is bitter, but its fruit is sweet.", a: "Jean-Jacques Rousseau" },
{ q: "Do not go where the path may lead; go instead where there is no path and leave a trail.", a: "Ralph Waldo Emerson" },
// Daily Grind
{ q: "Today's struggle is tomorrow's strength.", a: "Unknown" },
{ q: "One day or day one. You decide.", a: "Unknown" },
{ q: "Work hard in silence. Let your success be the noise.", a: "Frank Ocean" },
{ q: "Stay focused, go after your dreams and keep moving toward your goals.", a: "LL Cool J" },
{ q: "Push yourself, because no one else is going to do it for you.", a: "Unknown" },
{ q: "Great things never come from comfort zones.", a: "Unknown" },
{ q: "Wake up with determination. Go to bed with satisfaction.", a: "Unknown" },
{ q: "Do something today that your future self will thank you for.", a: "Sean Patrick Flanery" },
{ q: "Little things make big days.", a: "Unknown" },
{ q: "It's going to be hard, but hard is not impossible.", a: "Unknown" },
{ q: "Don't stop when you're tired. Stop when you're done.", a: "Unknown" },
{ q: "Discipline is choosing between what you want now and what you want most.", a: "Abraham Lincoln" },
{ q: "Success is the sum of small efforts repeated day in and day out.", a: "Robert Collier" },
{ q: "Your only limit is your mind.", a: "Unknown" },
{ q: "Hustle until your haters ask if you're hiring.", a: "Unknown" },
// Faith & Hope
{ q: "Faith is taking the first step even when you can't see the whole staircase.", a: "Martin Luther King Jr." },
{ q: "Hope is the thing with feathers that perches in the soul.", a: "Emily Dickinson" },
{ q: "God has a plan for your life. Trust the process.", a: "Unknown" },
{ q: "When nothing goes right, go left.", a: "Unknown" },
{ q: "Every day may not be good, but there's something good in every day.", a: "Alice Morse Earle" },
{ q: "You are braver than you believe, stronger than you seem, and smarter than you think.", a: "A.A. Milne" },
{ q: "The comeback is always stronger than the setback.", a: "Unknown" },
{ q: "What God has for you, it is for you.", a: "Unknown" },
{ q: "Storms make trees take deeper roots.", a: "Dolly Parton" },
{ q: "After every storm, there is a rainbow. If you have eyes to see it.", a: "Paul Walker" }
]
let pick = motivations[Math.floor(Math.random() * motivations.length)]
try {
let res = await fetch('https://api.quotable.io/random?tags=inspirational|motivational|success|wisdom')
let data = await res.json()
if (data?.content && data?.author) {
pick = { q: data.content, a: data.author }
}
} catch {}
reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃  💫 *MOTIVATION*\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n❝ ${pick.q} ❞\n\n— *${pick.a}*`)
} break

case 'fact': {
try {
let res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random')
let data = await res.json()
reply(`*📚 Random Fact:*\n${data.text}`)
} catch {
let facts = ['Honey never spoils.', 'Octopuses have three hearts.', 'Bananas are berries but strawberries are not.', 'A group of flamingos is called a flamboyance.', 'The shortest war in history lasted 38 minutes.']
reply(`*📚 Random Fact:*\n${facts[Math.floor(Math.random() * facts.length)]}`)
}
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Anime Commands
case 'neko': {
try {
let res = await fetch('https://nekos.life/api/v2/img/neko')
let data = await res.json()
await X.sendMessage(m.chat, { image: { url: data.url }, caption: '*Neko!* 🐱' }, { quoted: m })
} catch { reply('Failed to fetch neko image.') }
} break

case 'waifu': {
try {
let res = await fetch('https://api.waifu.pics/sfw/waifu')
let data = await res.json()
await X.sendMessage(m.chat, { image: { url: data.url }, caption: '*Waifu!* 💕' }, { quoted: m })
} catch { reply('Failed to fetch waifu image.') }
} break

case 'loli': {
try {
let res = await fetch('https://nekos.life/api/v2/img/neko')
let data = await res.json()
await X.sendMessage(m.chat, { image: { url: data.url }, caption: '*Anime!* 🌸' }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'nom': {
try {
let res = await fetch('https://api.waifu.pics/sfw/nom')
let data = await res.json()
await X.sendMessage(m.chat, { image: { url: data.url }, caption: '*Nom nom!* 😋' }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'poke': {
try {
let res = await fetch('https://api.waifu.pics/sfw/poke')
let data = await res.json()
let pokeTarget = (m.mentionedJid && m.mentionedJid[0]) ? `@${m.mentionedJid[0].split('@')[0]}` : ''
await X.sendMessage(m.chat, { image: { url: data.url }, caption: `*${pushname} pokes ${pokeTarget || 'someone'}!* 👉`, mentions: m.mentionedJid || [] }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'cry': {
try {
let res = await fetch('https://api.waifu.pics/sfw/cry')
let data = await res.json()
await X.sendMessage(m.chat, { image: { url: data.url }, caption: `*${pushname} is crying!* 😢` }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'kiss': {
try {
let res = await fetch('https://api.waifu.pics/sfw/kiss')
let data = await res.json()
let kissTarget = (m.mentionedJid && m.mentionedJid[0]) ? `@${m.mentionedJid[0].split('@')[0]}` : 'someone'
await X.sendMessage(m.chat, { image: { url: data.url }, caption: `*${pushname} kisses ${kissTarget}!* 💋`, mentions: m.mentionedJid || [] }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'pat': {
try {
let res = await fetch('https://api.waifu.pics/sfw/pat')
let data = await res.json()
let patTarget = (m.mentionedJid && m.mentionedJid[0]) ? `@${m.mentionedJid[0].split('@')[0]}` : 'someone'
await X.sendMessage(m.chat, { image: { url: data.url }, caption: `*${pushname} pats ${patTarget}!* 🤗`, mentions: m.mentionedJid || [] }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'hug': {
try {
let res = await fetch('https://api.waifu.pics/sfw/hug')
let data = await res.json()
let hugTarget = (m.mentionedJid && m.mentionedJid[0]) ? `@${m.mentionedJid[0].split('@')[0]}` : 'someone'
await X.sendMessage(m.chat, { image: { url: data.url }, caption: `*${pushname} hugs ${hugTarget}!* 🤗`, mentions: m.mentionedJid || [] }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'wink': {
try {
let res = await fetch('https://api.waifu.pics/sfw/wink')
let data = await res.json()
await X.sendMessage(m.chat, { image: { url: data.url }, caption: `*${pushname} winks!* 😉` }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'facepalm': {
try {
let res = await fetch('https://api.waifu.pics/sfw/cringe')
let data = await res.json()
await X.sendMessage(m.chat, { image: { url: data.url }, caption: `*${pushname} facepalms!* 🤦` }, { quoted: m })
} catch { reply('Failed to fetch image.') }
} break

case 'anime': {
if (!text) return reply(`Example: ${prefix}anime Naruto`)
try {
let res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=5`)
let data = await res.json()
if (!data.data || !data.data.length) return reply('No anime found.')
let animeList = data.data.map((a, i) => `${i+1}. *${a.title}* (${a.title_japanese || ''})\nScore: ${a.score || 'N/A'}\nEpisodes: ${a.episodes || 'N/A'}\nStatus: ${a.status}\nGenres: ${(a.genres || []).map(g => g.name).join(', ')}\nSynopsis: ${(a.synopsis || 'N/A').slice(0, 200)}...\nURL: ${a.url}`).join('\n\n')
if (data.data[0].images?.jpg?.image_url) {
await X.sendMessage(m.chat, { image: { url: data.data[0].images.jpg.image_url }, caption: `*Anime Search: ${text}*\n\n${animeList}` }, { quoted: m })
} else reply(`*Anime Search: ${text}*\n\n${animeList}`)
} catch(e) { reply('Error: ' + e.message) }
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Unicode Font Commands
// All outputs are plain Unicode text — everyone sees them in any WhatsApp chat
// Owner uses the command, copies the output, pastes it anywhere
case 'setfont': {
// Activate persistent font mode — all your messages auto-convert until you run .fontoff
if (!isOwner) return reply(mess.OnlyOwner)
const _validFonts = ['bold','italic','bolditalic','mono','serif','serifbold','serifitalic','scriptfont','scriptbold','fraktur','frakturbold','doublestruck','smallcaps','bubble','bubblebold','square','squarebold','wide']
let _chosen = (text || '').toLowerCase().trim()
if (!_chosen) return reply(`*🔤 Set Font Mode*\n\nUsage: ${prefix}setfont [fontname]\n\nAvailable fonts:\n${_validFonts.map(f=>'• '+f).join('\n')}\n\n_Every message you send will auto-convert until you use ${prefix}fontoff_`)
if (!_validFonts.includes(_chosen)) return reply(`❌ Unknown font: *${_chosen}*\n\nValid options:\n${_validFonts.map(f=>'• '+f).join('\n')}`)
global.ownerFontMode = _chosen
reply(`✅ *Font mode set to: ${_chosen}*\n\n_Every message you send will now appear in ${_chosen} style._\n_Use ${prefix}fontoff to return to normal._`)
} break

case 'fontoff':
case 'resetfont': {
if (!isOwner) return reply(mess.OnlyOwner)
global.ownerFontMode = 'off'
reply(`✅ *Font mode disabled.*\n_Your messages will now send normally._`)
} break

case 'font':
case 'fonts': {
if (!isOwner) return reply(mess.OnlyOwner)
reply(`*🔤 Unicode Font Converter*\n_Convert text to stylish fonts you can paste anywhere in WhatsApp — visible to everyone, no bot needed!_\n\n┏━━━━━━━━━━━━━━━━━━━━━━━┓\n┃➤ ${prefix}bold [text]\n┃➤ ${prefix}italic [text]\n┃➤ ${prefix}bolditalic [text]\n┃➤ ${prefix}mono [text]\n┃➤ ${prefix}serif [text]\n┃➤ ${prefix}serifbold [text]\n┃➤ ${prefix}serifitalic [text]\n┃➤ ${prefix}scriptfont [text]\n┃➤ ${prefix}scriptbold [text]\n┃➤ ${prefix}fraktur [text]\n┃➤ ${prefix}frakturbold [text]\n┃➤ ${prefix}doublestruck [text]\n┃➤ ${prefix}smallcaps [text]\n┃➤ ${prefix}bubble [text]\n┃➤ ${prefix}bubblebold [text]\n┃➤ ${prefix}square [text]\n┃➤ ${prefix}squarebold [text]\n┃➤ ${prefix}wide [text]\n┃➤ ${prefix}upsidedown [text]\n┃➤ ${prefix}strikethrough [text]\n┃➤ ${prefix}underline [text]\n┃➤ ${prefix}allfonts [text]\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n_Tip: ${prefix}allfonts hello — shows all fonts at once!_`)
} break

case 'bold': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}bold [text]`)
const boldMap={a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭','0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'}
reply([...ftIn].map(c=>boldMap[c]||c).join(''))
} break

case 'italic': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}italic [text]`)
const italicMap={a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻',A:'𝘈',B:'𝘉',C:'𝘊',D:'𝘋',E:'𝘌',F:'𝘍',G:'𝘎',H:'𝘏',I:'𝘐',J:'𝘑',K:'𝘒',L:'𝘓',M:'𝘔',N:'𝘕',O:'𝘖',P:'𝘗',Q:'𝘘',R:'𝘙',S:'𝘚',T:'𝘛',U:'𝘜',V:'𝘝',W:'𝘞',X:'𝘟',Y:'𝘠',Z:'𝘡'}
reply([...ftIn].map(c=>italicMap[c]||c).join(''))
} break

case 'bolditalic': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}bolditalic [text]`)
const biMap={a:'𝙖',b:'𝙗',c:'𝙘',d:'𝙙',e:'𝙚',f:'𝙛',g:'𝙜',h:'𝙝',i:'𝙞',j:'𝙟',k:'𝙠',l:'𝙡',m:'𝙢',n:'𝙣',o:'𝙤',p:'𝙥',q:'𝙦',r:'𝙧',s:'𝙨',t:'𝙩',u:'𝙪',v:'𝙫',w:'𝙬',x:'𝙭',y:'𝙮',z:'𝙯',A:'𝘼',B:'𝘽',C:'𝘾',D:'𝘿',E:'𝙀',F:'𝙁',G:'𝙂',H:'𝙃',I:'𝙄',J:'𝙅',K:'𝙆',L:'𝙇',M:'𝙈',N:'𝙉',O:'𝙊',P:'𝙋',Q:'𝙌',R:'𝙍',S:'𝙎',T:'𝙏',U:'𝙐',V:'𝙑',W:'𝙒',X:'𝙓',Y:'𝙔',Z:'𝙕'}
reply([...ftIn].map(c=>biMap[c]||c).join(''))
} break

case 'mono': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}mono [text]`)
const monoMap={a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣',A:'𝙰',B:'𝙱',C:'𝙲',D:'𝙳',E:'𝙴',F:'𝙵',G:'𝙶',H:'𝙷',I:'𝙸',J:'𝙹',K:'𝙺',L:'𝙻',M:'𝙼',N:'𝙽',O:'𝙾',P:'𝙿',Q:'𝚀',R:'𝚁',S:'𝚂',T:'𝚃',U:'𝚄',V:'𝚅',W:'𝚆',X:'𝚇',Y:'𝚈',Z:'𝚉','0':'𝟶','1':'𝟷','2':'𝟸','3':'𝟹','4':'𝟺','5':'𝟻','6':'𝟼','7':'𝟽','8':'𝟾','9':'𝟿'}
reply([...ftIn].map(c=>monoMap[c]||c).join(''))
} break

case 'serif': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}serif [text]`)
const serifMap={a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳',A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙','0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗'}
reply([...ftIn].map(c=>serifMap[c]||c).join(''))
} break

case 'serifbold': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}serifbold [text]`)
const sbMap={a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳',A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙'}
reply([...ftIn].map(c=>sbMap[c]||c).join(''))
} break

case 'serifitalic': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}serifitalic [text]`)
const siMap={a:'𝑎',b:'𝑏',c:'𝑐',d:'𝑑',e:'𝑒',f:'𝑓',g:'𝑔',h:'ℎ',i:'𝑖',j:'𝑗',k:'𝑘',l:'𝑙',m:'𝑚',n:'𝑛',o:'𝑜',p:'𝑝',q:'𝑞',r:'𝑟',s:'𝑠',t:'𝑡',u:'𝑢',v:'𝑣',w:'𝑤',x:'𝑥',y:'𝑦',z:'𝑧',A:'𝐴',B:'𝐵',C:'𝐶',D:'𝐷',E:'𝐸',F:'𝐹',G:'𝐺',H:'𝐻',I:'𝐼',J:'𝐽',K:'𝐾',L:'𝐿',M:'𝑀',N:'𝑁',O:'𝑂',P:'𝑃',Q:'𝑄',R:'𝑅',S:'𝑆',T:'𝑇',U:'𝑈',V:'𝑉',W:'𝑊',X:'𝑋',Y:'𝑌',Z:'𝑍'}
reply([...ftIn].map(c=>siMap[c]||c).join(''))
} break

case 'scriptfont': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}scriptfont [text]`)
const scriptMap={a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'𝑒',f:'𝒻',g:'𝑔',h:'𝒽',i:'𝒾',j:'𝒿',k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'𝑜',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏',A:'𝒜',B:'ℬ',C:'𝒞',D:'𝒟',E:'ℰ',F:'ℱ',G:'𝒢',H:'ℋ',I:'ℐ',J:'𝒥',K:'𝒦',L:'ℒ',M:'ℳ',N:'𝒩',O:'𝒪',P:'𝒫',Q:'𝒬',R:'ℛ',S:'𝒮',T:'𝒯',U:'𝒰',V:'𝒱',W:'𝒲',X:'𝒳',Y:'𝒴',Z:'𝒵'}
reply([...ftIn].map(c=>scriptMap[c]||c).join(''))
} break

case 'scriptbold': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}scriptbold [text]`)
const scbMap={a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃',A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩'}
reply([...ftIn].map(c=>scbMap[c]||c).join(''))
} break

case 'fraktur': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}fraktur [text]`)
const frakMap={a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷',A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝔒',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ'}
reply([...ftIn].map(c=>frakMap[c]||c).join(''))
} break

case 'frakturbold': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}frakturbold [text]`)
const fbMap={a:'𝖆',b:'𝖇',c:'𝖈',d:'𝖉',e:'𝖊',f:'𝖋',g:'𝖌',h:'𝖍',i:'𝖎',j:'𝖏',k:'𝖐',l:'𝖑',m:'𝖒',n:'𝖓',o:'𝖔',p:'𝖕',q:'𝖖',r:'𝖗',s:'𝖘',t:'𝖙',u:'𝖚',v:'𝖛',w:'𝖜',x:'𝖝',y:'𝖞',z:'𝖟',A:'𝕬',B:'𝕭',C:'𝕮',D:'𝕯',E:'𝕰',F:'𝕱',G:'𝕲',H:'𝕳',I:'𝕴',J:'𝕵',K:'𝕶',L:'𝕷',M:'𝕸',N:'𝕹',O:'𝕺',P:'𝕻',Q:'𝕼',R:'𝕽',S:'𝕾',T:'𝕿',U:'𝖀',V:'𝖁',W:'𝖂',X:'𝖃',Y:'𝖄',Z:'𝖅'}
reply([...ftIn].map(c=>fbMap[c]||c).join(''))
} break

case 'doublestruck': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}doublestruck [text]`)
const dsMap={a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫',A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ','0':'𝟘','1':'𝟙','2':'𝟚','3':'𝟛','4':'𝟜','5':'𝟝','6':'𝟞','7':'𝟟','8':'𝟠','9':'𝟡'}
reply([...ftIn].map(c=>dsMap[c]||c).join(''))
} break

case 'smallcaps': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}smallcaps [text]`)
const scMap={a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'Q',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ꜰ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'Q',R:'ʀ',S:'ꜱ',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'}
reply([...ftIn].map(c=>scMap[c]||c).join(''))
} break

case 'bubble': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}bubble [text]`)
const bubMap={a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ',A:'Ⓐ',B:'Ⓑ',C:'Ⓒ',D:'Ⓓ',E:'Ⓔ',F:'Ⓕ',G:'Ⓖ',H:'Ⓗ',I:'Ⓘ',J:'Ⓙ',K:'Ⓚ',L:'Ⓛ',M:'Ⓜ',N:'Ⓝ',O:'Ⓞ',P:'Ⓟ',Q:'Ⓠ',R:'Ⓡ',S:'Ⓢ',T:'Ⓣ',U:'Ⓤ',V:'Ⓥ',W:'Ⓦ',X:'Ⓧ',Y:'Ⓨ',Z:'Ⓩ','0':'⓪','1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨'}
reply([...ftIn].map(c=>bubMap[c]||c).join(''))
} break

case 'bubblebold': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}bubblebold [text]`)
const bbbMap={a:'🅐',b:'🅑',c:'🅒',d:'🅓',e:'🅔',f:'🅕',g:'🅖',h:'🅗',i:'🅘',j:'🅙',k:'🅚',l:'🅛',m:'🅜',n:'🅝',o:'🅞',p:'🅟',q:'🅠',r:'🅡',s:'🅢',t:'🅣',u:'🅤',v:'🅥',w:'🅦',x:'🅧',y:'🅨',z:'🅩',A:'🅐',B:'🅑',C:'🅒',D:'🅓',E:'🅔',F:'🅕',G:'🅖',H:'🅗',I:'🅘',J:'🅙',K:'🅚',L:'🅛',M:'🅜',N:'🅝',O:'🅞',P:'🅟',Q:'🅠',R:'🅡',S:'🅢',T:'🅣',U:'🅤',V:'🅥',W:'🅦',X:'🅧',Y:'🅨',Z:'🅩'}
reply([...ftIn].map(c=>bbbMap[c]||c).join(''))
} break

case 'square': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}square [text]`)
const sqMap={a:'🄰',b:'🄱',c:'🄲',d:'🄳',e:'🄴',f:'🄵',g:'🄶',h:'🄷',i:'🄸',j:'🄹',k:'🄺',l:'🄻',m:'🄼',n:'🄽',o:'🄾',p:'🄿',q:'🅀',r:'🅁',s:'🅂',t:'🅃',u:'🅄',v:'🅅',w:'🅆',x:'🅇',y:'🅈',z:'🅉',A:'🄰',B:'🄱',C:'🄲',D:'🄳',E:'🄴',F:'🄵',G:'🄶',H:'🄷',I:'🄸',J:'🄹',K:'🄺',L:'🄻',M:'🄼',N:'🄽',O:'🄾',P:'🄿',Q:'🅀',R:'🅁',S:'🅂',T:'🅃',U:'🅄',V:'🅅',W:'🅆',X:'🅇',Y:'🅈',Z:'🅉'}
reply([...ftIn].map(c=>sqMap[c]||c).join(''))
} break

case 'squarebold': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}squarebold [text]`)
const sqbMap={a:'🅰',b:'🅱',c:'🅲',d:'🅳',e:'🅴',f:'🅵',g:'🅶',h:'🅷',i:'🅸',j:'🅹',k:'🅺',l:'🅻',m:'🅼',n:'🅽',o:'🅾',p:'🅿',q:'🆀',r:'🆁',s:'🆂',t:'🆃',u:'🆄',v:'🆅',w:'🆆',x:'🆇',y:'🆈',z:'🆉',A:'🅰',B:'🅱',C:'🅲',D:'🅳',E:'🅴',F:'🅵',G:'🅶',H:'🅷',I:'🅸',J:'🅹',K:'🅺',L:'🅻',M:'🅼',N:'🅽',O:'🅾',P:'🅿',Q:'🆀',R:'🆁',S:'🆂',T:'🆃',U:'🆄',V:'🆅',W:'🆆',X:'🆇',Y:'🆈',Z:'🆉'}
reply([...ftIn].map(c=>sqbMap[c]||c).join(''))
} break

case 'wide': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}wide [text]`)
reply([...ftIn].map(c=>{let code=c.charCodeAt(0);return (code>=33&&code<=126)?String.fromCharCode(code+65248):c==' '?'　':c}).join(''))
} break

case 'upsidedown': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}upsidedown [text]`)
const udMap={a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',A:'∀',B:'𐐒',C:'Ɔ',D:'ᗡ',E:'Ǝ',F:'Ⅎ',G:'פ',H:'H',I:'I',J:'ſ',K:'ʞ',L:'˥',M:'W',N:'N',O:'O',P:'Ԁ',Q:'Q',R:'ɹ',S:'S',T:'┴',U:'∩',V:'Λ',W:'M',X:'X',Y:'⅄',Z:'Z','0':'0','1':'Ɩ','2':'ᄅ','3':'Ɛ','4':'ㄣ','5':'ϛ','6':'9','7':'L','8':'8','9':'6',',':'\'','\'':',','.':'˙','?':'¿','!':'¡','(':')',')':'(','[':']',']':'[','{':'}','}':'{','<':'>','>':'<','&':'⅋',_:'‾'}
reply([...ftIn].map(c=>udMap[c]||c).join('').split('').reverse().join(''))
} break

case 'strikethrough': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}strikethrough [text]`)
reply([...ftIn].map(c=>c+'\u0336').join(''))
} break

case 'underline': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}underline [text]`)
reply([...ftIn].map(c=>c+'\u0332').join(''))
} break

case 'allfonts': {
if (!isOwner) return reply(mess.OnlyOwner)
let ftIn = text || (m.quoted && (m.quoted.text || m.quoted.body || m.quoted.caption || '').trim()) || ''
if (!ftIn) return reply(`Usage: ${prefix}allfonts [text]`)
const maps = {
  'Bold Sans':       {a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭'},
  'Italic Sans':     {a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻',A:'𝘈',B:'𝘉',C:'𝘊',D:'𝘋',E:'𝘌',F:'𝘍',G:'𝘎',H:'𝘏',I:'𝘐',J:'𝘑',K:'𝘒',L:'𝘓',M:'𝘔',N:'𝘕',O:'𝘖',P:'𝘗',Q:'𝘘',R:'𝘙',S:'𝘚',T:'𝘛',U:'𝘜',V:'𝘝',W:'𝘞',X:'𝘟',Y:'𝘠',Z:'𝘡'},
  'Bold Italic':     {a:'𝙖',b:'𝙗',c:'𝙘',d:'𝙙',e:'𝙚',f:'𝙛',g:'𝙜',h:'𝙝',i:'𝙞',j:'𝙟',k:'𝙠',l:'𝙡',m:'𝙢',n:'𝙣',o:'𝙤',p:'𝙥',q:'𝙦',r:'𝙧',s:'𝙨',t:'𝙩',u:'𝙪',v:'𝙫',w:'𝙬',x:'𝙭',y:'𝙮',z:'𝙯',A:'𝘼',B:'𝘽',C:'𝘾',D:'𝘿',E:'𝙀',F:'𝙁',G:'𝙂',H:'𝙃',I:'𝙄',J:'𝙅',K:'𝙆',L:'𝙇',M:'𝙈',N:'𝙉',O:'𝙊',P:'𝙋',Q:'𝙌',R:'𝙍',S:'𝙎',T:'𝙏',U:'𝙐',V:'𝙑',W:'𝙒',X:'𝙓',Y:'𝙔',Z:'𝙕'},
  'Mono':            {a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣',A:'𝙰',B:'𝙱',C:'𝙲',D:'𝙳',E:'𝙴',F:'𝙵',G:'𝙶',H:'𝙷',I:'𝙸',J:'𝙹',K:'𝙺',L:'𝙻',M:'𝙼',N:'𝙽',O:'𝙾',P:'𝙿',Q:'𝚀',R:'𝚁',S:'𝚂',T:'𝚃',U:'𝚄',V:'𝚅',W:'𝚆',X:'𝚇',Y:'𝚈',Z:'𝚉'},
  'Script':          {a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'𝑒',f:'𝒻',g:'𝑔',h:'𝒽',i:'𝒾',j:'𝒿',k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'𝑜',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏',A:'𝒜',B:'ℬ',C:'𝒞',D:'𝒟',E:'ℰ',F:'ℱ',G:'𝒢',H:'ℋ',I:'ℐ',J:'𝒥',K:'𝒦',L:'ℒ',M:'ℳ',N:'𝒩',O:'𝒪',P:'𝒫',Q:'𝒬',R:'ℛ',S:'𝒮',T:'𝒯',U:'𝒰',V:'𝒱',W:'𝒲',X:'𝒳',Y:'𝒴',Z:'𝒵'},
  'Bold Script':     {a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃',A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩'},
  'Fraktur':         {a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷',A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝔒',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ'},
  'Bold Fraktur':    {a:'𝖆',b:'𝖇',c:'𝖈',d:'𝖉',e:'𝖊',f:'𝖋',g:'𝖌',h:'𝖍',i:'𝖎',j:'𝖏',k:'𝖐',l:'𝖑',m:'𝖒',n:'𝖓',o:'𝖔',p:'𝖕',q:'𝖖',r:'𝖗',s:'𝖘',t:'𝖙',u:'𝖚',v:'𝖛',w:'𝖜',x:'𝖝',y:'𝖞',z:'𝖟',A:'𝕬',B:'𝕭',C:'𝕮',D:'𝕯',E:'𝕰',F:'𝕱',G:'𝕲',H:'𝕳',I:'𝕴',J:'𝕵',K:'𝕶',L:'𝕷',M:'𝕸',N:'𝕹',O:'𝕺',P:'𝕻',Q:'𝕼',R:'𝕽',S:'𝕾',T:'𝕿',U:'𝖀',V:'𝖁',W:'𝖂',X:'𝖃',Y:'𝖄',Z:'𝖅'},
  'Double Struck':   {a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫',A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ'},
  'Small Caps':      {a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'Q',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ꜰ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'Q',R:'ʀ',S:'ꜱ',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'},
  'Bubble':          {a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ',A:'Ⓐ',B:'Ⓑ',C:'Ⓒ',D:'Ⓓ',E:'Ⓔ',F:'Ⓕ',G:'Ⓖ',H:'Ⓗ',I:'Ⓘ',J:'Ⓙ',K:'Ⓚ',L:'Ⓛ',M:'Ⓜ',N:'Ⓝ',O:'Ⓞ',P:'Ⓟ',Q:'Ⓠ',R:'Ⓡ',S:'Ⓢ',T:'Ⓣ',U:'Ⓤ',V:'Ⓥ',W:'Ⓦ',X:'Ⓧ',Y:'Ⓨ',Z:'Ⓩ'},
  'Wide':            {}
}
let out = ''
for (let [name, map] of Object.entries(maps)) {
  if (name === 'Wide') {
    let w = [...ftIn].map(c=>{let code=c.charCodeAt(0);return (code>=33&&code<=126)?String.fromCharCode(code+65248):c==' '?'　':c}).join('')
    out += `*${name}:*\n${w}\n\n`
  } else {
    out += `*${name}:*\n${[...ftIn].map(c=>map[c]||c).join('')}\n\n`
  }
}
reply(out.trim())
} break


//━━━━━━━━━━━━━━━━━━━━━━━━//
// Text Maker Commands (using Pollinations image generation)
case 'metallic':
case 'ice':
case 'snow':
case 'impressive':
case 'matrix':
case 'light':
case 'neon':
case 'devil':
case 'purple':
case 'thunder':
case 'leaves':
case '1917':
case 'arena':
case 'hacker':
case 'sand':
case 'blackpink':
case 'glitch':
case 'fire': {
// Resolve text from typed args OR quoted message body/caption
let tmText = text || (m.quoted && (m.quoted.text || m.quoted.caption || m.quoted.body || '').trim()) || ''
if (!tmText) return reply(`Example: ${prefix}${command} Your Text Here\n_Or reply to a message containing the text_`)
// styleMap defined outside try so fallback catch can also access it
let styleMap = { metallic: 'metallic chrome 3D text effect', ice: 'frozen ice crystal 3D text effect', snow: 'snowy winter 3D text effect', impressive: 'impressive golden 3D text', matrix: 'green matrix digital code text', light: 'glowing light beam text effect', neon: 'neon glowing sign text on dark background', devil: 'dark red devil fire text effect', purple: 'purple galaxy cosmic text effect', thunder: 'electric lightning thunder text effect', leaves: 'green leaves nature botanical text', '1917': 'vintage sepia war 1917 style text', arena: 'battle arena warrior epic text', hacker: 'green on black hacker terminal text', sand: 'sandy desert dune text effect', blackpink: 'blackpink kpop pink glam style text', glitch: 'digital glitch corrupted text effect', fire: 'burning fire flame text effect' }
try {
let style = styleMap[command] || command + ' style text'
let prompt = `3D stylized text that says "${tmText}", ${style}, centered composition, no background clutter, high quality render, typography art`
let seed = Math.floor(Math.random() * 99999)
let imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=512&nologo=true&seed=${seed}`
let caption = `*${command.charAt(0).toUpperCase() + command.slice(1)} Text:* ${tmText}`
// Download to buffer so image sends correctly in any chat (group, DM, or bot number)
let imgBuffer = await getBuffer(imgUrl)
if (!imgBuffer || imgBuffer.length < 3000) throw new Error('Image generation failed, try again')
await X.sendMessage(m.chat, { image: imgBuffer, caption }, { quoted: m })
} catch(e) {
// Fallback: send via URL if buffer download failed
try {
    let p2 = `3D stylized text "${tmText}", ${styleMap[command] || command + ' style'}, high quality`
    let fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p2)}?width=1024&height=512&nologo=true&seed=${Math.floor(Math.random()*99999)}`
    await X.sendMessage(m.chat, { image: { url: fallbackUrl }, caption: `*${command.charAt(0).toUpperCase() + command.slice(1)} Text:* ${tmText}` }, { quoted: m })
} catch(e2) { reply('❌ Error: ' + (e2.message || e.message)) }
}
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Image Edit Commands
case 'heart': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) {
let heartTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : sender
X.sendMessage(from, { text: `*💕 ${pushname} sends love to @${heartTarget.split('@')[0]}! 💕*`, mentions: [heartTarget] }, { quoted: m })
} else { reply('*Heart effect applied!* 💕') }
} break

case 'horny': {
let hornyTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : sender
let hornyLevel = Math.floor(Math.random() * 101)
X.sendMessage(from, { text: `*Horny Meter:*\n@${hornyTarget.split('@')[0]}\n\n${'🔥'.repeat(Math.floor(hornyLevel/10))}${'⬜'.repeat(10 - Math.floor(hornyLevel/10))} ${hornyLevel}%`, mentions: [hornyTarget] }, { quoted: m })
} break

case 'circle': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}circle`)
try {
let buf = await m.quoted.download()
await X.sendMessage(m.chat, { sticker: buf }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

case 'lgbt': {
let lgbtTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : sender
X.sendMessage(from, { text: `*🏳️‍🌈 @${lgbtTarget.split('@')[0]} supports LGBTQ+! 🏳️‍🌈*\n🌈 Love is Love 🌈`, mentions: [lgbtTarget] }, { quoted: m })
} break

case 'lolice': {
let loliceTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : sender
X.sendMessage(from, { text: `*🚨 LOLICE ALERT! 🚨*\n@${loliceTarget.split('@')[0]} has been caught by the Lolice! 🚔`, mentions: [loliceTarget] }, { quoted: m })
} break

case 'namecard': {
let ncName = text || pushname
reply(`╔══════════════╗\n   *${ncName}*\n   ${global.botname}\n╚══════════════╝`)
} break

case 'tweet': {
if (!text) return reply(`Example: ${prefix}tweet I love coding!`)
reply(`*Tweet by @${pushname}:*\n\n${text}\n\n❤️ ${Math.floor(Math.random() * 10000)}  🔁 ${Math.floor(Math.random() * 5000)}  💬 ${Math.floor(Math.random() * 1000)}`)
} break

case 'ytcomment': {
if (!text) return reply(`Example: ${prefix}ytcomment This video is amazing!`)
reply(`*YouTube Comment:*\n\n👤 *${pushname}*\n${text}\n\n👍 ${Math.floor(Math.random() * 5000)}  👎  💬 ${Math.floor(Math.random() * 200)} replies`)
} break

case 'comrade': {
let comradeTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : sender
X.sendMessage(from, { text: `*☭ Our Comrade @${comradeTarget.split('@')[0]}! ☭*\nServing the motherland with honor!`, mentions: [comradeTarget] }, { quoted: m })
} break

case 'gay': {
let gayTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : sender
let gayLevel = Math.floor(Math.random() * 101)
X.sendMessage(from, { text: `*Gay Meter:*\n@${gayTarget.split('@')[0]}\n\n${'🏳️‍🌈'.repeat(Math.floor(gayLevel/10))}${'⬜'.repeat(10 - Math.floor(gayLevel/10))} ${gayLevel}%`, mentions: [gayTarget] }, { quoted: m })
} break

case 'glass': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}glass`)
reply('*Glass effect applied!* 🪟')
} break

case 'jail': {
let jailTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : sender
X.sendMessage(from, { text: `*🔒 @${jailTarget.split('@')[0]} has been jailed! 🔒*\nCrime: Being too awesome\nSentence: Life 😂`, mentions: [jailTarget] }, { quoted: m })
} break

case 'passed': {
let passedTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : sender
X.sendMessage(from, { text: `*✅ @${passedTarget.split('@')[0]} has PASSED! ✅*\nCongratulations! 🎉`, mentions: [passedTarget] }, { quoted: m })
} break

case 'triggered': {
let triggeredTarget = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : sender
X.sendMessage(from, { text: `*⚡ @${triggeredTarget.split('@')[0]} is TRIGGERED! ⚡*\n😤😤😤`, mentions: [triggeredTarget] }, { quoted: m })
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// GitHub Commands
case 'git':
case 'github': {
if (!text) return reply(`Example: ${prefix}github torvalds`)
try {
let res = await fetch(`https://api.github.com/users/${encodeURIComponent(text)}`)
let data = await res.json()
if (data.message) return reply('User not found.')
let info = `*GitHub Profile:*\n\n👤 Name: ${data.name || data.login}\n📝 Bio: ${data.bio || 'N/A'}\n📍 Location: ${data.location || 'N/A'}\n🏢 Company: ${data.company || 'N/A'}\n📦 Repos: ${data.public_repos}\n👥 Followers: ${data.followers}\n👤 Following: ${data.following}\n🔗 URL: ${data.html_url}\n📅 Joined: ${new Date(data.created_at).toLocaleDateString()}`
if (data.avatar_url) {
await X.sendMessage(m.chat, { image: { url: data.avatar_url }, caption: info }, { quoted: m })
} else reply(info)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'repo': {
try {
let repoPath = text && text.includes('/') ? text : text ? text + '/' + text : 'TOOSII102/TOOSII-XD-ULTRA'
let res = await fetch(`https://api.github.com/repos/${encodeURIComponent(repoPath)}`)
let data = await res.json()
if (data.message) return reply('Repository not found.')
let repoInfo = `*📦 ${data.full_name}*\n\n`
repoInfo += `📝 ${data.description || 'No description'}\n`
repoInfo += `⭐ Stars: ${data.stargazers_count}\n`
repoInfo += `🍴 Forks: ${data.forks_count}\n`
repoInfo += `👁️ Watchers: ${data.watchers_count}\n`
repoInfo += `💻 Language: ${data.language || 'N/A'}\n`
repoInfo += `📅 Created: ${new Date(data.created_at).toLocaleDateString()}\n`
repoInfo += `🔗 ${data.html_url}\n\n`
repoInfo += `━━━━━━━━━━━━━━━━━━━━━\n\n`
repoInfo += `⭐ *Star* the repo to show your support!\n`
repoInfo += `🍴 *Fork* it to get your own copy and deploy your bot!\n\n`
repoInfo += `👉 Fork: ${data.html_url}/fork\n`
repoInfo += `⭐ Star: ${data.html_url}\n\n`
repoInfo += `_Your support helps us keep building!_`
reply(repoInfo)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'sc':
case 'script':
case 'source': {
let scText = `╭━━━〔 📂 *SOURCE CODE* 〕━━━╮
│
│ 🤖 *${global.botname}*
│
│ 🔗 *GitHub:*
│ github.com/TOOSII102/TOOSII-XD-ULTRA
│
│ ⭐ Star the repo to show support!
│ 🍴 Fork it to deploy your own bot!
│
│ 👉 Fork:
│ github.com/TOOSII102/TOOSII-XD-ULTRA/fork
│
│ 👨‍💻 Developer: *${global.ownername}*
│ 📞 Contact: ${global.ownerNumber}
│
╰━━━━━━━━━━━━━━━━━╯

_© ${global.ownername} — All Rights Reserved_`
reply(scText)
} break

case 'clone': {
if (!text) return reply(`Example: ${prefix}clone https://github.com/user/repo`)
try {
let match = text.match(/github\.com\/([^\/]+)\/([^\/\s]+)/)
if (!match) return reply('Invalid GitHub URL.')
let [, user, repo] = match
repo = repo.replace(/\.git$/, '')
let zipUrl = `https://api.github.com/repos/${user}/${repo}/zipball`
await X.sendMessage(m.chat, { document: { url: zipUrl }, mimetype: 'application/zip', fileName: `${repo}.zip` }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
default:
if (budy.startsWith('=>')) {
if (!isOwner) return
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return reply(bang)
}
try {
reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
reply(String(e))
}
}

if (budy.startsWith('>')) {
if (!isOwner) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await reply(require('util').format(teks))
}
}

if (budy.startsWith('$')) {
if (!isOwner) return
exec(budy.slice(2), (err, stdout) => {
if (err) return reply(`${err}`)
if (stdout) return reply(stdout)
})
}

if (global.chatBot && budy && !budy.startsWith('>') && !budy.startsWith('=>') && !budy.startsWith('$') && !isCmd && !m.key.fromMe) {
    try {
        let aiToken = process.env.GITHUB_AI_TOKEN
        if (aiToken) {
            let chatResponse = await axios.post('https://models.inference.ai.azure.com/chat/completions', {
                messages: [
                    { role: 'system', content: `You are ${global.botname}, a friendly and helpful WhatsApp bot assistant created by ${global.ownername}. Keep responses short and conversational.` },
                    { role: 'user', content: budy }
                ],
                model: 'gpt-4.1-mini',
                temperature: 0.7,
                max_tokens: 500
            }, {
                headers: {
                    'Authorization': `Bearer ${aiToken}`,
                    'Content-Type': 'application/json'
                }
            })
            let aiReply = chatResponse.data.choices[0].message.content
            if (aiReply) reply(aiReply)
        }
    } catch (chatErr) {
        console.log('[ChatBot] Error:', chatErr.message || chatErr)
    }
}
}

} catch (err) {
  let errMsg = (err.message || '').toLowerCase()
  let errStack = err.stack || err.message || util.format(err)

  // ── Silently ignore known non-critical WhatsApp protocol errors ──────────
  const silentErrors = [
    'no sessions',           // Signal protocol — no encryption session yet
    'sessionerror',          // Signal session missing for this JID
    'bad mac',               // Decryption mismatch — WhatsApp will retry
    'failed to decrypt',     // E2E decryption failure — not our bug
    'rate-overlimit',        // WA rate limit — will recover on its own
    'connection closed',     // Temporary network drop
    'connection lost',       // Network drop
    'timed out',             // Request timeout — not fatal
    'timedout',
    'socket hang up',        // TCP socket issue
    'econnreset',            // Connection reset by WA servers
    'enotfound',             // DNS / network
    'not-authorized',        // WA auth on specific request — not fatal
    'item-not-found',        // WA node not found — e.g. deleted message
    'invalid protocol',      // WA protocol mismatch — temporary
    'stream errored',        // WA stream error — will auto-reconnect
    'aborted',               // Request aborted
  ]
  const isSilent = silentErrors.some(e => errMsg.includes(e))

  console.log('====== ERROR REPORT ======')
  console.log(errStack)
  console.log('==========================')

  if (isSilent) {
    // Log only — do NOT spam owner with known protocol noise
    console.log(`[SILENT ERROR] ${err.message || 'Unknown'} — suppressed owner notification`)
    return
  }

  // Only report real unexpected errors to owner
  try {
    let shortStack = errStack.length > 1500 ? errStack.slice(0, 1500) + '\n...(truncated)' : errStack
    await X.sendMessage(`${owner}@s.whatsapp.net`, {
      text: `⚠️ *ERROR REPORT*\n\n📌 *Message:* ${err.message || '-'}\n📂 *Stack:*\n${shortStack}`,
      contextInfo: { forwardingScore: 9999999, isForwarded: true }
    }, { quoted: m })
  } catch (reportErr) {
    console.log('[Error Reporter] Failed to send error to owner:', reportErr.message || reportErr)
  }
}
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// File Update
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update File : ${__filename}`)
delete require.cache[file]
require(file)
})
