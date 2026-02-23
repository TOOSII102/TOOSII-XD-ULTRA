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
const isOwner = (
    m.key.fromMe ||
    senderNumber === botNum ||
    ownerNums.includes(senderNumber) ||
    (m.sender && ownerNums.map(v => v + '@s.whatsapp.net').includes(m.sender)) ||
    (m.sender && m.sender.split('@')[0].split(':')[0] === botNum)
) || false;
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const groupMetadata = m.isGroup ? await X.groupMetadata(from).catch(e => {}) : ''
const groupName = m.isGroup ? groupMetadata.subject : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
const botLid = X.user?.lid ? X.decodeJid(X.user.lid) : null
const botNumberClean = botNumber.split(':')[0].split('@')[0]
const botLidClean = botLid ? botLid.split(':')[0].split('@')[0] : null
const isBotAdmins = m.isGroup ? participants.some(p => {
    const pid = (p.id || '').split(':')[0].split('@')[0]
    const isBot = pid === botNumberClean || 
                  p.id === botNumber || 
                  (botLid && (p.id === botLid || pid === botLidClean)) ||
                  (X.user?.id && p.id === X.user.id)
    return isBot && (p.admin === 'admin' || p.admin === 'superadmin')
}) : false
const isAdmins = m.isGroup ? (isOwner || participants.some(p => {
    const pid = (p.id || '').split(':')[0].split('@')[0]
    const sid = (m.sender || '').split(':')[0].split('@')[0]
    return (pid === sid || p.id === m.sender) && (p.admin === 'admin' || p.admin === 'superadmin')
})) : false
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Setting Console
if (m.message) {
console.log(chalk.black(chalk.bgWhite('[ New Message ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('» Dari'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('» Di'), chalk.green(m.isGroup ? pushname : 'Private Chat', from))
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
reply(`bot online ✅`)
}       

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Mode Gate: Private mode = only owner can use commands
if (isCmd && !isOwner && X.public === false) {
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
const menuFiles = ['aimenu','toolsmenu','groupmenu','ownermenu','searchmenu','gamemenu','stickermenu','othermenu','downloadermenu'];
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
_ꜱᴇᴀʀᴄʜ | ꜱᴛɪᴄᴋᴇʀ | ɢᴀᴍᴇꜱ | ᴏᴛʜᴇʀ_

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
      aiMenu
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
      aiMenu
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
reply(`TOOSII-XD ULTRA Bot\nContact: https://wa.me/254748340864\nTelegram: https://t.me/toosiitech`)
}
break

case 'infobot':
case 'botinfo': {
  const botInfo = `
╭─ ⌬ Bot Info
│ • Name    : ${botname}
│ • Owner   : ${ownername}
│ • Version  : ${botver}
│ • Command : ${totalfitur()}
│ • Runtime  : ${runtime(process.uptime())}\n╰─────────────
`
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

    await X.sendImageAsSticker(m.chat, outputVideoPath, m, {
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
await X.sendImageAsSticker(m.chat, buffer, m, { packname: ``, author: `${global.author}` });
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
    await X.sendImageAsSticker(m.chat, api, m, { packname: '', author: `${packname}` });
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
    X.sendImageAsSticker(m.chat, rest.result, m, {
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
let encmedia = await X.sendImageAsSticker(m.chat, media, m, {
packname: global.packname,
author: global.author
})
} else if (/video/.test(mime)) {
if ((quoted.msg || quoted).seconds > 31) return reply('Maximum 30 seconds!')
let media = await quoted.download()
let encmedia = await X.sendVideoAsSticker(m.chat, media, m, {
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
if (global.autoViewStatus) {
    global.autoViewStatus = false
    reply('*Auto View Status OFF*\nBot will no longer auto-view contact statuses.')
} else {
    global.autoViewStatus = true
    reply('*Auto View Status ON*\nBot will now automatically view all contact statuses.')
}
}
break

case 'autolikestatus':
case 'autolike':
case 'als': {
if (!isOwner) return reply(mess.OnlyOwner)
let emojiArg = (args.join(' ') || '').trim()
if (!emojiArg) {
    let statusMsg = global.autoLikeStatus ? 'ON' : 'OFF'
    let currentEmoji = global.autoLikeEmoji || 'Not set'
    reply(`*Auto Like Status: ${statusMsg}*\nCurrent emoji: ${currentEmoji}\n\n*Usage:*\n• ${prefix}autolikestatus [emoji] - Set emoji and turn ON\n• ${prefix}autolikestatus off - Turn OFF\n• ${prefix}autolikestatus - Check status\n\n*Examples:*\n• ${prefix}autolikestatus \u2764\uFE0F\n• ${prefix}autolikestatus \uD83D\uDD25\n• ${prefix}autolikestatus \uD83D\uDE02\n• ${prefix}autolikestatus \uD83D\uDC4D\n• ${prefix}autolikestatus off`)
} else if (emojiArg.toLowerCase() === 'off') {
    global.autoLikeStatus = false
    global.autoLikeEmoji = ''
    reply('*Auto Like Status OFF*\nBot will no longer auto-react to contact statuses.')
} else {
    global.autoLikeEmoji = emojiArg
    global.autoLikeStatus = true
    reply(`*Auto Like Status ON*\nBot will react to all contact statuses with: ${emojiArg}`)
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
let statusArg = (args.join(' ') || '').trim().toLowerCase()
if (statusArg === 'off' || statusArg === 'disable') {
    global.statusToGroup = ''
    reply('*Status Forwarding OFF*\nContact statuses will no longer be forwarded to any group.')
} else if (m.isGroup) {
    global.statusToGroup = m.chat
    let gName = groupName || m.chat
    reply(`*Status Forwarding ON*\nAll contact statuses (images, videos, text) will now be forwarded to this group: *${gName}*`)
} else {
    if (global.statusToGroup) {
        reply(`*Status Forwarding is ON*\nCurrently forwarding to: *${global.statusToGroup}*\n\n• Use in a group to change target\n• ${prefix}togroupstatus off - Disable`)
    } else {
        reply(`*Status Forwarding is OFF*\n\nUse this command inside a group chat to set it as the target for status forwarding.\n\n• ${prefix}togroupstatus off - Disable`)
    }
}
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Developer tools
case 'self':
case 'private': {
if (!isOwner) return reply(mess.OnlyOwner)
X.public = false
reply(`*🔒 Bot Mode: PRIVATE*\n\n🚫 Only the owner can use bot commands.\nOther users will be ignored.`)
}
break

case 'public': {
if (!isOwner) return reply(mess.OnlyOwner)
X.public = true
reply(`*⚡ Bot Mode: PUBLIC*\n\n✅ Everyone can use bot commands.\nAll users have access to the bot.`)
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
    let asmState = global.antiStatusMention ? 'ON' : 'OFF'
    let asmAction = global.antiStatusMentionAction || 'warn'
    reply(`*Anti Status Mention*\n\nStatus: *${asmState}*\nAction: *${asmAction}*\n\nWhen someone mentions a group in their status, the bot will take action against them in that group.\n\n*Usage:*\n${prefix}antistatusmention on\n${prefix}antistatusmention off\n${prefix}antistatusmention warn - Warn the user (3 warns = kick)\n${prefix}antistatusmention delete - Delete their messages in the group\n${prefix}antistatusmention kick - Remove them from the group\n\n_Current action: ${asmAction}_`)
} else if (asmArg === 'on' || asmArg === 'enable') {
    global.antiStatusMention = true
    reply(`*Anti Status Mention ON*\nAction: *${global.antiStatusMentionAction || 'warn'}*\nAnyone who mentions a group in their status will be actioned.`)
} else if (asmArg === 'off' || asmArg === 'disable') {
    global.antiStatusMention = false
    reply('*Anti Status Mention OFF*')
} else if (asmArg === 'warn') {
    global.antiStatusMention = true
    global.antiStatusMentionAction = 'warn'
    reply('*Anti Status Mention: WARN*\nUsers who mention a group in their status will be warned. 3 warnings = auto-kick.')
} else if (asmArg === 'delete' || asmArg === 'del') {
    global.antiStatusMention = true
    global.antiStatusMentionAction = 'delete'
    reply('*Anti Status Mention: DELETE*\nMessages from users who mention a group in their status will be deleted in that group.')
} else if (asmArg === 'kick' || asmArg === 'remove') {
    global.antiStatusMention = true
    global.antiStatusMentionAction = 'kick'
    reply('*Anti Status Mention: KICK*\nUsers who mention a group in their status will be removed from that group.')
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
    let adState = global.antiDelete ? 'ON' : 'OFF'
    reply(`*Anti-Delete: ${adState}*\nWhen ON, deleted messages are forwarded to the owner.\n\nUsage:\n${prefix}antidelete on\n${prefix}antidelete off`)
} else if (adArg === 'on' || adArg === 'enable') {
    global.antiDelete = true
    reply('*Anti-Delete ON*\nDeleted messages will be forwarded to the owner.')
} else if (adArg === 'off' || adArg === 'disable') {
    global.antiDelete = false
    reply('*Anti-Delete OFF*')
}
}
break

case 'botsettings':
case 'settings':
case 'botconfig': {
if (!isOwner) return reply(mess.OnlyOwner)
let settingsText = `*${global.botname} - Settings*\n\n`
settingsText += `*Bot Info*\n`
settingsText += `- Name: ${global.botname}\n`
settingsText += `- Version: ${global.botver}\n`
settingsText += `- Prefix: ${global.botPrefix || 'Multi-prefix'}\n`
settingsText += `- Timezone: ${global.botTimezone}\n`
settingsText += `- Mode: ${X.public ? 'Public' : 'Self'}\n`
settingsText += `- URL: ${global.botUrl || global.wagc}\n\n`
settingsText += `*Sticker*\n`
settingsText += `- Pack: ${global.packname}\n`
settingsText += `- Author: ${global.author}\n\n`
settingsText += `*Auto Features*\n`
settingsText += `- Auto Read: ${global.autoRead ? 'ON' : 'OFF'}\n`
settingsText += `- Auto Bio: ${global.autoBio ? 'ON' : 'OFF'}\n`
settingsText += `- ChatBot: ${global.chatBot ? 'ON' : 'OFF'}\n`
settingsText += `- Auto View Status: ${global.autoViewStatus ? 'ON' : 'OFF'}\n`
settingsText += `- Auto Like Status: ${global.autoLikeStatus ? 'ON' : 'OFF'} ${global.autoLikeEmoji ? '(' + global.autoLikeEmoji + ')' : ''}\n`
settingsText += `- Auto Reply Status: ${global.autoReplyStatus ? 'ON' : 'OFF'}\n`
settingsText += `- Forward Status: ${global.statusToGroup ? 'ON' : 'OFF'}\n`
settingsText += `- Fake Presence: ${global.fakePresence}\n\n`
settingsText += `*Protection*\n`
settingsText += `- Anti-Call: ${global.antiCall ? 'ON' : 'OFF'}\n`
settingsText += `- Anti-Link: ${global.antiLink ? 'ON' : 'OFF'}\n`
settingsText += `- Anti-Delete: ${global.antiDelete ? 'ON' : 'OFF'}\n`
settingsText += `- Anti Status Mention: ${global.antiStatusMention ? 'ON' : 'OFF'}\n\n`
settingsText += `*Group*\n`
settingsText += `- Welcome: ${global.welcome ? 'ON' : 'OFF'}\n`
settingsText += `- Admin Events: ${global.adminevent ? 'ON' : 'OFF'}`
reply(settingsText)
}
break

case 'restart':
if (!isOwner) return reply(mess.OnlyOwner)
reply(`Restarting...`)
await sleep(3000)
process.exit()
break

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
                  let welState = global.welcome ? 'ON' : 'OFF'
                  reply(`*Welcome/Goodbye Messages: ${welState}*\n\nUsage:\n${prefix}${command} on - Enable\n${prefix}${command} off - Disable`)
               } else if (welArg === 'on' || welArg === 'enable' || welArg === 'hidup') {
                  global.welcome = true
                  reply('*Welcome/Goodbye Messages ON*\nNew members will be greeted and departures announced.')
               } else if (welArg === 'off' || welArg === 'disable' || welArg === 'mati') {
                  global.welcome = false
                  reply('*Welcome/Goodbye Messages OFF*')
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
                  let evState = global.adminevent ? 'ON' : 'OFF'
                  reply(`*Admin Events (Promote/Demote): ${evState}*\n\nUsage:\n${prefix}${command} on - Enable\n${prefix}${command} off - Disable`)
               } else if (evArg === 'on' || evArg === 'enable' || evArg === 'hidup') {
                  global.adminevent = true
                  reply('*Admin Events ON*\nPromote/demote notifications will be sent in the group.')
               } else if (evArg === 'off' || evArg === 'disable' || evArg === 'mati') {
                  global.adminevent = false
                  reply('*Admin Events OFF*')
               }
            }
            break
            
            
                        case 'add': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isAdmins && !isOwner) return reply(mess.admin);
                                if (!text && !m.quoted) {
                                        reply(`_Example :_\n\n ${prefix + command} 62xxx`);
                                } else {
                                        const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
                                        try {
                                                await X.groupParticipantsUpdate(m.chat, [numbersOnly], 'add')
                                                        .then(async (res) => {
                                                                for (let i of res) {
                                                                        let invv = await X.groupInviteCode(m.chat);
                                                                        if (i.status == 408) return reply(`_[ Error ]_ User recently left the group`);
                                                                        if (i.status == 401) return reply(`_] Error ]_ Bot is blocked by user`);
                                                                        if (i.status == 409) return reply(`_[ Report ]_ User is already in the group`);
                                                                        if (i.status == 500) return reply(`_[ Invalid ]_ Group is full`);
                                                                        if (i.status == 403) {
                                                                                await X.sendMessage(m.chat, { 
                                                                                        text: `@${numbersOnly.split('@')[0]} Target cannot be added because their account is private. Sending an invite to their private chat`, 
                                                                                        mentions: [numbersOnly] 
                                                                                }, { quoted: m });
                                                                                await X.sendMessage(numbersOnly, { 
                                                                                        text: `${'https://chat.whatsapp.com/' + invv}\n━━━━━━━━━━━━━━━━━━━━━\n\nAdmin: wa.me/${m.sender}\n Has Invited You To This Group`, 
                                                                                        detectLink: true, 
                                                                                        mentions: [numbersOnly] 
                                                                                }, { quoted: m }).catch((err) => reply('Failed to send invite! 😔'));
                                                                        } else {
                                                                                reply(mess.success);
                                                                        }
                                                                }
                                                        });
                                        } catch (e) {
                                                reply('Failed to add user, something went wrong!');
                                        }
                                }
                        }
                        break;

                        case 'kick':
                        case 'remove': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isOwner && !isAdmins) return reply(mess.admin);
                                let users = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
                                if (!users) return reply(`*Usage:* ${prefix + command} @user or reply to their message`);
                                if (owner.includes(users.replace('@s.whatsapp.net', ''))) {
                                        return reply('Cannot remove the bot owner.');
                                }
                                try {
                                        await X.groupParticipantsUpdate(m.chat, [users], 'remove');
                                        let num = users.split('@')[0]
                                        X.sendMessage(from, { text: `*@${num} has been removed from the group.*`, mentions: [users] }, { quoted: m })
                                } catch (err) {
                                        console.error(err);
                                        reply(mess.error);
                                }
                        };
                        break;

                        case 'del':
                        case 'delete': {
                                if (!m.quoted) return reply(`*Usage:* Reply to a message with ${prefix + command} to delete it.`);
                                try {
                                        if (m.quoted.key.fromMe || isOwner || (m.isGroup && isAdmins)) {
                                                await X.sendMessage(m.chat, { delete: m.quoted.key });
                                        } else {
                                                reply('You can only delete bot messages or your own messages (admin required in groups).');
                                        }
                                } catch (err) {
                                        reply('Failed to delete message. Make sure the bot is an admin.');
                                }
                        }
                        break;

                        case 'warn': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isOwner && !isAdmins) return reply(mess.admin);
                                let warnUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
                                if (!warnUser) return reply(`*Usage:* ${prefix}warn @user [reason]\nReply to a message or mention someone.`);
                                if (owner.includes(warnUser.replace('@s.whatsapp.net', ''))) return reply('Cannot warn the bot owner.');
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
                                        X.sendMessage(from, { text: `*@${warnNum} has reached ${maxWarns}/${maxWarns} warnings and has been removed from the group.*\n\nReason: ${warnReason}`, mentions: [warnUser] }, { quoted: m });
                                    } catch { reply(mess.error); }
                                } else {
                                    X.sendMessage(from, { text: `*Warning ${warnCount}/${maxWarns} for @${warnNum}*\nReason: ${warnReason}\n\n_${maxWarns - warnCount} more warning(s) before removal._`, mentions: [warnUser] }, { quoted: m });
                                }
                        }
                        break;

                        case 'unwarn':
                        case 'resetwarn': {
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isOwner && !isAdmins) return reply(mess.admin);
                                let uwUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
                                if (!uwUser) return reply(`*Usage:* ${prefix}unwarn @user\nReply to a message or mention someone.`);
                                let uwDbPath = path.join(__dirname, 'database', 'warnings.json');
                                let uwDb = {};
                                try { uwDb = JSON.parse(fs.readFileSync(uwDbPath, 'utf-8')); } catch { uwDb = {}; }
                                if (uwDb[m.chat] && uwDb[m.chat][uwUser]) {
                                    uwDb[m.chat][uwUser] = [];
                                    fs.writeFileSync(uwDbPath, JSON.stringify(uwDb, null, 2));
                                    let uwNum = uwUser.split('@')[0];
                                    X.sendMessage(from, { text: `*Warnings cleared for @${uwNum}.*`, mentions: [uwUser] }, { quoted: m });
                                } else {
                                    reply('This user has no warnings.');
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
                                if (warnEntries.length === 0) return reply('No warnings in this group.');
                                let warnListText = `*Group Warnings*\n\n`;
                                let warnMentions = [];
                                for (let [jid, warns] of warnEntries) {
                                    let num = jid.split('@')[0];
                                    warnMentions.push(jid);
                                    warnListText += `@${num} - ${warns.length}/3 warnings\n`;
                                    warns.forEach((w, i) => {
                                        warnListText += `  ${i + 1}. ${w.reason} (${new Date(w.time).toLocaleDateString()})\n`;
                                    });
                                    warnListText += '\n';
                                }
                                X.sendMessage(from, { text: warnListText.trim(), mentions: warnMentions }, { quoted: m });
                        }
                        break;

                        case 'promote': {
                                if (!m.isGroup) return reply(mess.OnlyGrup)
                                if (!isOwner && !isAdmins) return reply(mess.admin)
                                let users = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
                                if (!users) return reply(`*Example:* ${prefix + command} @user or reply to their message`)
                                try {
                                    await X.groupParticipantsUpdate(m.chat, [users], 'promote')
                                    let num = users.split('@')[0]
                                    X.sendMessage(from, { text: `*✅ @${num} has been promoted to admin!*`, mentions: [users] }, { quoted: m })
                                } catch(err) {
                                    let errMsg = (err?.message || err || '').toString().toLowerCase()
                                    if (errMsg.includes('not-authorized') || errMsg.includes('403') || errMsg.includes('admin')) {
                                        reply('🤖 I need to be a group admin to promote members. Please make me admin first.')
                                    } else {
                                        reply(mess.error)
                                    }
                                }
                        }
                        break

                        case 'demote': {
                                if (!m.isGroup) return reply(mess.OnlyGrup)
                                if (!isOwner && !isAdmins) return reply(mess.admin)
                                let users = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
                                if (!users) return reply(`*Example:* ${prefix + command} @user or reply to their message`)
                                try {
                                    await X.groupParticipantsUpdate(m.chat, [users], 'demote')
                                    let num = users.split('@')[0]
                                    X.sendMessage(from, { text: `*✅ @${num} has been demoted from admin.*`, mentions: [users] }, { quoted: m })
                                } catch(err) {
                                    let errMsg = (err?.message || err || '').toString().toLowerCase()
                                    if (errMsg.includes('not-authorized') || errMsg.includes('403') || errMsg.includes('admin')) {
                                        reply('🤖 I need to be a group admin to demote members. Please make me admin first.')
                                    } else {
                                        reply(mess.error)
                                    }
                                }
                        }
                        break

                        case 'revoke':{
                                if (!m.isGroup) return reply(mess.OnlyGrup);
                                if (!isAdmins && !isOwner) return reply(mess.admin);
                                try {
                                    await X.groupRevokeInvite(m.chat)
                                    reply(mess.success)
                                } catch(err) {
                                    let errMsg = (err?.message || '').toLowerCase()
                                    if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
                                    else reply(mess.error)
                                }
                                }
                                break

                        case 'approve':
                        case 'acceptjoin': {
                                if (!m.isGroup) return reply(mess.OnlyGrup)
                                if (!isAdmins && !isOwner) return reply(mess.admin)
                                try {
                                        let pending = await X.groupRequestParticipantsList(m.chat)
                                        if (!pending || pending.length === 0) return reply('No pending join requests.')
                                        if (text && text.toLowerCase() === 'all') {
                                                let jids = pending.map(p => p.jid)
                                                await X.groupRequestParticipantsUpdate(m.chat, jids, 'approve')
                                                reply(`Approved all *${jids.length}* pending join request(s).`)
                                        } else if (text) {
                                                let target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                                                let found = pending.find(p => p.jid === target)
                                                if (!found) return reply(`That number is not in the pending requests.\n\nPending: ${pending.map(p => p.jid.split('@')[0]).join(', ')}`)
                                                await X.groupRequestParticipantsUpdate(m.chat, [target], 'approve')
                                                reply(`Approved @${target.split('@')[0]}`)
                                        } else {
                                                let list = pending.map((p, i) => `${i + 1}. ${p.jid.split('@')[0]}`).join('\n')
                                                reply(`*Pending Join Requests (${pending.length}):*\n\n${list}\n\n*Usage:*\n• ${prefix}approve all - Approve everyone\n• ${prefix}approve [number] - Approve specific\n• ${prefix}reject all - Reject everyone\n• ${prefix}reject [number] - Reject specific`)
                                        }
                                } catch (err) {
                                        console.error('Approve error:', err)
                                        reply('Failed to process join requests: ' + (err.message || 'Unknown error'))
                                }
                        }
                        break

                        case 'reject':
                        case 'rejectjoin': {
                                if (!m.isGroup) return reply(mess.OnlyGrup)
                                if (!isAdmins && !isOwner) return reply(mess.admin)
                                try {
                                        let pending = await X.groupRequestParticipantsList(m.chat)
                                        if (!pending || pending.length === 0) return reply('No pending join requests.')
                                        if (text && text.toLowerCase() === 'all') {
                                                let jids = pending.map(p => p.jid)
                                                await X.groupRequestParticipantsUpdate(m.chat, jids, 'reject')
                                                reply(`Rejected all *${jids.length}* pending join request(s).`)
                                        } else if (text) {
                                                let target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                                                let found = pending.find(p => p.jid === target)
                                                if (!found) return reply(`That number is not in the pending requests.`)
                                                await X.groupRequestParticipantsUpdate(m.chat, [target], 'reject')
                                                reply(`Rejected @${target.split('@')[0]}`)
                                        } else {
                                                let list = pending.map((p, i) => `${i + 1}. ${p.jid.split('@')[0]}`).join('\n')
                                                reply(`*Pending Join Requests (${pending.length}):*\n\n${list}\n\nUse ${prefix}reject all or ${prefix}reject [number]`)
                                        }
                                } catch (err) {
                                        console.error('Reject error:', err)
                                        reply('Failed to process join requests: ' + (err.message || 'Unknown error'))
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
    if (!args[0]) return reply(`Enter a prompt for image generation!\nExample: ${prefix+command} a woman holding a Coca-Cola bottle leaning against a wall`);
    let prompt = encodeURIComponent(args.join(' '));
    let apiUrl = `https://velyn.biz.id/api/ai/magicStudio?prompt=${prompt}&apikey=velyn`;
 
    try {
        let res = await fetch(apiUrl);
        let contentType = res.headers.get('content-type');
 
        console.log('Content-Type:', contentType); 
 
        if (contentType && contentType.startsWith('image')) {
            let buffer = await res.buffer();
            await X.sendFile(m.chat, buffer, 'magicStudio.jpg', `Image generated successfully\n${packname}`, xy);
        } else {
            reply('Failed to get image, API may be experiencing errors.');
        }
    } catch (e) {
        console.error('Fetch Error:', e);
        reply('An error occurred while contacting the API.');
    }
};
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

  const responseText = `*⚡ ${global.botname || 'TOOSII-XD ULTRA'} — Server Info*

*PING*
• Latency: ${latensi}ms
• Bot Uptime: ${runtime(process.uptime())}
• Server Uptime: ${runtime(os.uptime())}

*SERVER*
• OS: ${osType} (${platform})
• Release: ${release}
• Arch: ${arch}
• Node.js: ${nodeVersion}

*CPU*
• Model: ${cpuModel}
• Cores: ${coreCount}
• Usage: ${cpuUsage}
• Load: ${loadAverage.join(', ')}

*MEMORY*
• Total: ${formatp(totalMem)}
• Used: ${formatp(usedMem)}
• Free: ${formatp(freeMem)}${storageText}
`
  return responseText.trim()
}

const responseText = await getServerInfo()
await X.sendMessage(m.chat, { text: responseText }, { quoted: m })
}
break           

case 'totalfitur':{
reply(`Total Bot Features: ${totalfitur()}`)
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

case 'setpp': {
if (!isOwner) return reply(mess.OnlyOwner)
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}setpp to set bot profile picture`)
try {
let media = await X.downloadAndSaveMediaMessage(m.quoted, 'setpp_temp')
await X.updateProfilePicture(X.user.id, { url: media })
fs.unlinkSync(media)
reply('*Bot profile picture updated!*')
} catch(e) { reply('Failed to update profile picture: ' + e.message) }
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
try {
await X.groupSettingUpdate(m.chat, 'announcement')
reply('*Group muted.* Only admins can send messages.')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply(mess.error)
}
} break

case 'unmute': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
try {
await X.groupSettingUpdate(m.chat, 'not_announcement')
reply('*Group unmuted.* Everyone can send messages.')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply(mess.error)
}
} break

case 'ban': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let banUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
if (!banUser) return reply(`Usage: ${prefix}ban @user`)
let users = loadUsers()
if (!users[banUser]) users[banUser] = { name: banUser.split('@')[0], firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString(), commandCount: 0, commands: {} }
users[banUser].banned = true
saveUsers(users)
X.sendMessage(from, { text: `*@${banUser.split('@')[0]} has been banned from using the bot.*`, mentions: [banUser] }, { quoted: m })
} break

case 'unban': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let unbanUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
if (!unbanUser) return reply(`Usage: ${prefix}unban @user`)
let usersDb = loadUsers()
if (usersDb[unbanUser]) { usersDb[unbanUser].banned = false; saveUsers(usersDb) }
X.sendMessage(from, { text: `*@${unbanUser.split('@')[0]} has been unbanned.*`, mentions: [unbanUser] }, { quoted: m })
} break

case 'antibadword': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let abwArg = (args[0] || '').toLowerCase()
if (abwArg === 'on') { global.antiBadword = true; reply('*Anti Badword ON*') }
else if (abwArg === 'off') { global.antiBadword = false; reply('*Anti Badword OFF*') }
else reply(`*Anti Badword: ${global.antiBadword ? 'ON' : 'OFF'}*\nUsage: ${prefix}antibadword on/off`)
} break

case 'antitag': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let atgArg = (args[0] || '').toLowerCase()
if (atgArg === 'on') { global.antiTag = true; reply('*Anti Tag ON*\nMass tagging will be detected.') }
else if (atgArg === 'off') { global.antiTag = false; reply('*Anti Tag OFF*') }
else reply(`*Anti Tag: ${global.antiTag ? 'ON' : 'OFF'}*\nUsage: ${prefix}antitag on/off`)
} break

case 'antisticker': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let asArg = (args[0] || '').toLowerCase()
if (asArg === 'on') { global.antiSticker = true; reply('*Anti Sticker ON*') }
else if (asArg === 'off') { global.antiSticker = false; reply('*Anti Sticker OFF*') }
else reply(`*Anti Sticker: ${global.antiSticker ? 'ON' : 'OFF'}*\nUsage: ${prefix}antisticker on/off`)
} break

case 'antidemote': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let adArg2 = (args[0] || '').toLowerCase()
if (adArg2 === 'on') { global.antiDemote = true; reply('*Anti Demote ON*\nDemoted admins will be re-promoted.') }
else if (adArg2 === 'off') { global.antiDemote = false; reply('*Anti Demote OFF*') }
else reply(`*Anti Demote: ${global.antiDemote ? 'ON' : 'OFF'}*\nUsage: ${prefix}antidemote on/off`)
} break

case 'setgdesc': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!text) return reply(`Usage: ${prefix}setgdesc [new description]`)
try {
await X.groupUpdateDescription(m.chat, text)
reply('*Group description updated.*')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply(mess.error)
}
} break

case 'setgname': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!text) return reply(`Usage: ${prefix}setgname [new name]`)
try {
await X.groupUpdateSubject(m.chat, text)
reply('*Group name updated.*')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply(mess.error)
}
} break

case 'setgpp': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}setgpp`)
try {
let media = await m.quoted.download()
await X.updateProfilePicture(m.chat, media)
reply('*Group profile picture updated!*')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply('Failed: ' + err.message)
}
} break

case 'open': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
try {
await X.groupSettingUpdate(m.chat, 'not_announcement')
reply('*Group opened.* Everyone can send messages.')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply(mess.error)
}
} break

case 'close': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
try {
await X.groupSettingUpdate(m.chat, 'announcement')
reply('*Group closed.* Only admins can send messages.')
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply(mess.error)
}
} break

case 'resetlink': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
try {
await X.groupRevokeInvite(m.chat)
let newCode = await X.groupInviteCode(m.chat)
reply(`*Group link reset.*\nNew link: https://chat.whatsapp.com/${newCode}`)
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply(mess.error)
}
} break

case 'link': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
try {
let code = await X.groupInviteCode(m.chat)
reply(`*Group Invite Link:*\nhttps://chat.whatsapp.com/${code}`)
} catch(err) {
let errMsg = (err?.message || '').toLowerCase()
if (errMsg.includes('not-authorized') || errMsg.includes('403')) reply('I need to be a group admin to do this.')
else reply(mess.error)
}
} break

case 'goodbye': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let gbArg = (args[0] || '').toLowerCase()
if (gbArg === 'on') { global.welcome = true; reply('*Goodbye Messages ON*') }
else if (gbArg === 'off') { global.welcome = false; reply('*Goodbye Messages OFF*') }
else reply(`*Goodbye: ${global.welcome ? 'ON' : 'OFF'}*\nUsage: ${prefix}goodbye on/off`)
} break

// GROUP TOOLS COMMANDS
case 'tagall': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
let tagMsg = text || 'Tag All Members'
let tagText = `*${tagMsg}*\n\n`
let mentions = []
for (let mem of participants) { tagText += `@${mem.id.split('@')[0]}\n`; mentions.push(mem.id) }
X.sendMessage(from, { text: tagText, mentions }, { quoted: m })
} break

case 'tag': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!text) return reply(`Usage: ${prefix}tag [message]`)
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
let tnaText = (text || 'Attention non-admins!') + '\n\n'
nonAdmins.forEach(id => tnaText += `@${id.split('@')[0]}\n`)
X.sendMessage(from, { text: tnaText, mentions: nonAdmins }, { quoted: m })
} break

case 'mention': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!text) return reply(`Usage: ${prefix}mention [message]`)
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
if (!isOwner) return reply(mess.OnlyOwner)
reply(`*Bot Pairing Info:*\nBot Number: ${botNumber}\nUse the console to pair a new device.`)
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
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}${command} [question]\nDefault: Describe this image in detail`)
try {
let mediaPath = await X.downloadAndSaveMediaMessage(m.quoted, 'vision_temp')
let media = fs.readFileSync(mediaPath)
let uploadedUrl = await uploadImage(media)
let question = text || 'Describe this image in detail'
let response = await axios.get('https://gemini-api-5k0h.onrender.com/gemini/image', { params: { q: question, url: uploadedUrl } })
let desc = response.data?.content || 'Failed to analyze image.'
reply(`*Image Analysis:*\n${desc}`)
fs.unlinkSync(mediaPath)
} catch(e) { reply('Error analyzing image: ' + e.message) }
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
if (!text) return reply(`Example: ${prefix}speechwrite Write a graduation speech about perseverance`)
try {
let { data } = await axios.post('https://text.pollinations.ai/openai', { messages: [{ role: 'system', content: 'You are a professional speechwriter. Write eloquent, engaging speeches.' }, { role: 'user', content: 'Write a speech: ' + text }], stream: false }, { headers: { 'Content-Type': 'application/json' } })
reply(data?.choices?.[0]?.message?.content || 'No response.')
} catch(e) { reply('Error: ' + (e.message || 'Failed')) }
} break

case 'imagine':
case 'flux': {
if (!text) return reply(`Example: ${prefix}${command} a sunset over mountains`)
try {
let imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?width=1024&height=1024&nologo=true`
await X.sendMessage(m.chat, { image: { url: imgUrl }, caption: `*Generated Image:*\n${text}` }, { quoted: m })
} catch(e) { reply('Error generating image: ' + e.message) }
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
if (!m.quoted || !/audio|video/.test(m.quoted.mimetype || '')) return reply(`Reply to an audio/video with ${prefix}shazam`)
try {
reply('*Shazam:* Audio recognition is not available via free API. Try using the Shazam app directly.')
} catch(e) { reply('Error: ' + e.message) }
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
if (!m.quoted) return reply(`Reply to an image/video/document with ${prefix}tourl`)
try {
let mediaPath = await X.downloadAndSaveMediaMessage(m.quoted, 'tourl_temp')
let media = fs.readFileSync(mediaPath)
let url = await uploadImage(media)
reply(`*File URL:*\n${url}`)
fs.unlinkSync(mediaPath)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'vcf': {
if (!m.isGroup) return reply(mess.OnlyGrup)
if (!isAdmins && !isOwner) return reply(mess.admin)
try {
let vcfContent = 'BEGIN:VCARD\nVERSION:3.0\n'
for (let p of participants) {
let num = p.id.split('@')[0]
vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${num}\nTEL;type=CELL:+${num}\nEND:VCARD\n`
}
let vcfBuffer = Buffer.from(vcfContent)
await X.sendMessage(m.chat, { document: vcfBuffer, mimetype: 'text/vcard', fileName: `${groupMetadata.subject}_contacts.vcf` }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

case 'runtime':
case 'alive': {
let uptime = process.uptime()
let hrs = Math.floor(uptime / 3600)
let mins = Math.floor((uptime % 3600) / 60)
let secs = Math.floor(uptime % 60)
reply(`*${global.botname} is alive!*\n\nRuntime: ${hrs}h ${mins}m ${secs}s\nPrefix: ${prefix || '.'}\nMode: ${X.public ? 'Public' : 'Self'}\nVersion: ${global.botver || '2.0.0'}\n\n${global.packname}`)
} break

case 'block': {
if (!isOwner) return reply(mess.OnlyOwner)
let blockUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
if (!blockUser) return reply(`Usage: ${prefix}block @user`)
try {
await X.updateBlockStatus(blockUser, 'block')
reply(`*@${blockUser.split('@')[0]} has been blocked.*`)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'unblock': {
if (!isOwner) return reply(mess.OnlyOwner)
let unblockUser = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null
if (!unblockUser) return reply(`Usage: ${prefix}unblock @user`)
try {
await X.updateBlockStatus(unblockUser, 'unblock')
reply(`*@${unblockUser.split('@')[0]} has been unblocked.*`)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'listblock': {
if (!isOwner) return reply(mess.OnlyOwner)
try {
let blocked = await X.fetchBlocklist()
if (!blocked.length) return reply('No blocked users.')
let list = blocked.map((b, i) => `${i+1}. @${b.split('@')[0]}`).join('\n')
X.sendMessage(from, { text: `*Blocked Users (${blocked.length}):*\n\n${list}`, mentions: blocked }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Sticker & Converter Commands
case 'stickercrop':
case 'scrop': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}stickercrop`)
try {
let mediaPath = await X.downloadAndSaveMediaMessage(m.quoted, 'scrop_temp')
let media = fs.readFileSync(mediaPath)
let sticker = new Sticker(media, { pack: global.packname, author: global.author, type: 'crop', quality: 80 })
await X.sendMessage(m.chat, await sticker.toMessage(), { quoted: m })
fs.unlinkSync(mediaPath)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'take':
case 'steal': {
if (!m.quoted || !/sticker/.test(m.quoted.mtype || '')) return reply(`Reply to a sticker with ${prefix}take [pack|author]`)
try {
let [pack, auth] = (text || `${global.packname}|${global.author}`).split('|')
let stickerBuf = await m.quoted.download()
let sticker = new Sticker(stickerBuf, { pack: pack?.trim() || global.packname, author: auth?.trim() || global.author, type: 'full' })
await X.sendMessage(m.chat, await sticker.toMessage(), { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

case 'meme':
case 'smeme': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}meme [top text|bottom text]`)
if (!text) return reply(`Example: ${prefix}meme When the code works|But you don't know why`)
try {
let [topText, bottomText] = text.split('|').map(t => (t || '').trim())
let mediaPath = await X.downloadAndSaveMediaMessage(m.quoted, 'meme_temp')
let media = fs.readFileSync(mediaPath)
let url = await uploadImage(media)
let memeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(topText || '_')}/${encodeURIComponent(bottomText || '_')}.png?background=${encodeURIComponent(url)}`
await X.sendMessage(m.chat, { image: { url: memeUrl }, caption: '*Meme created!*' }, { quoted: m })
fs.unlinkSync(mediaPath)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'blur': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}blur`)
try {
reply('*Blur:* Image blur requires image processing libraries. Use a photo editing app for this feature.')
} catch(e) { reply('Error: ' + e.message) }
} break

case 'removebg': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}removebg`)
try {
let mediaPath = await X.downloadAndSaveMediaMessage(m.quoted, 'rmbg_temp')
let media = fs.readFileSync(mediaPath)
let url = await uploadImage(media)
let apiRes = await fetch(`https://api.remove.bg/v1.0/removebg`, { method: 'POST', headers: { 'X-Api-Key': process.env.REMOVEBG_KEY || '' }, body: JSON.stringify({ image_url: url, size: 'auto' }) })
if (!apiRes.ok) return reply('*RemoveBG:* API key not configured or limit reached.\nSet REMOVEBG_KEY environment variable.')
let buffer = Buffer.from(await apiRes.arrayBuffer())
await X.sendMessage(m.chat, { image: buffer, caption: '*Background Removed!*' }, { quoted: m })
fs.unlinkSync(mediaPath)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'simage':
case 'timage':
case 'toimage': {
if (!m.quoted || !/sticker/.test(m.quoted.mtype || '')) return reply(`Reply to a sticker with ${prefix}${command}`)
try {
let stickerBuf = await m.quoted.download()
await X.sendMessage(m.chat, { image: stickerBuf, caption: '*Sticker converted to image!*' }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
} break

case 'totext': {
if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) return reply(`Reply to an image with ${prefix}totext`)
try {
let mediaPath = await X.downloadAndSaveMediaMessage(m.quoted, 'ocr_temp')
let media = fs.readFileSync(mediaPath)
let url = await uploadImage(media)
let res = await axios.get('https://gemini-api-5k0h.onrender.com/gemini/image', { params: { q: 'Extract all text from this image. Return only the text content.', url: url } })
let extractedText = res.data?.content || 'No text found.'
reply(`*Extracted Text:*\n${extractedText}`)
fs.unlinkSync(mediaPath)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'toaudio':
case 'tomp3': {
if (!m.quoted || !/video/.test(m.quoted.mimetype || '')) return reply(`Reply to a video with ${prefix}${command}`)
try {
let mediaPath = await X.downloadAndSaveMediaMessage(m.quoted, 'tomp3_temp')
let media = fs.readFileSync(mediaPath)
await X.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg' }, { quoted: m })
fs.unlinkSync(mediaPath)
} catch(e) { reply('Error: ' + e.message) }
} break

case 'toppt': {
if (!m.quoted || !/audio/.test(m.quoted.mimetype || '')) return reply(`Reply to an audio with ${prefix}toppt`)
try {
let audioBuf = await m.quoted.download()
await X.sendMessage(m.chat, { audio: audioBuf, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
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
try {
let res = await fetch('https://api.quotable.io/random')
let data = await res.json()
reply(`*💬 Quote:*\n"${data.content}"\n\n— *${data.author}*`)
} catch {
let quotes = ['"The only way to do great work is to love what you do." — Steve Jobs', '"Innovation distinguishes between a leader and a follower." — Steve Jobs', '"Life is what happens when you\'re busy making other plans." — John Lennon', '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt']
reply(quotes[Math.floor(Math.random() * quotes.length)])
}
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
if (!text) return reply(`Example: ${prefix}${command} Your Text Here`)
try {
let styleMap = { metallic: 'metallic chrome 3D text', ice: 'frozen ice crystal text', snow: 'snowy winter text', impressive: 'impressive golden 3D text', matrix: 'green matrix code text', light: 'glowing light text', neon: 'neon glowing sign text', devil: 'dark red devil fire text', purple: 'purple galaxy text', thunder: 'lightning thunder text', leaves: 'green leaves nature text', '1917': 'vintage war 1917 style text', arena: 'battle arena warrior text', hacker: 'green hacker terminal text', sand: 'sandy desert text', blackpink: 'blackpink kpop style text', glitch: 'digital glitch effect text', fire: 'burning fire flame text' }
let style = styleMap[command] || command + ' style text'
let imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`"${text}" written in ${style} style, text art, typography, digital art, high quality`)}?width=1024&height=512&nologo=true`
await X.sendMessage(m.chat, { image: { url: imgUrl }, caption: `*${command.charAt(0).toUpperCase() + command.slice(1)} Text:* ${text}` }, { quoted: m })
} catch(e) { reply('Error: ' + e.message) }
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
let scText = `*${global.botname} Source Code*\n\n`
scText += `🔗 *GitHub:* https://github.com/TOOSII102/TOOSII-XD-ULTRA\n\n`
scText += `⭐ Don't forget to *Star* the repo!\n`
scText += `🍴 *Fork* it to deploy your own bot!\n\n`
scText += `👉 Fork: https://github.com/TOOSII102/TOOSII-XD-ULTRA/fork\n\n`
scText += `Developer: ${global.ownername}\n`
scText += `Contact: ${global.ownerNumber}\n\n`
scText += `© ${global.ownername} - All Rights Reserved`
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
  let error = err.stack || err.message || util.format(err);
  console.log('====== ERROR REPORT ======');
  console.log(error);
  console.log('==========================');

  await X.sendMessage(`${owner}@s.whatsapp.net`, {
    text: `⚠️ *LAPORAN ERROR!*\n\n📌 *Message:* ${err.message || '-'}\n📂 *Stack Trace:*\n${error}`,
    contextInfo: { forwardingScore: 9999999, isForwarded: true }
  }, { quoted: m });
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