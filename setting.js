//═════════════════════════════════//

/*
🔗 TOOSII-XD ULTRA Bot System
by Toosii Tech • 2024 - 2026

>> Contact Links:
・WhatsApp : wa.me/254748340864
・Telegram : t.me/toosiitech

⚠️ PROPRIETARY SOFTWARE - DO NOT MODIFY
Any unauthorized modification, redistribution,
or removal of credits is strictly prohibited.
*/

//═════════════════════════════════//
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Owner Setting - DO NOT MODIFY
global.owner = ["254748340864",]
global.ownername = "Toosii Tech"
global._protectedOwner = "254748340864"
global._protectedBrand = "TOOSII-XD ULTRA"
global._protectedAuthor = "Toosii Tech"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Bot Setting
global.botname = "TOOSII-XD ULTRA"
global.botver = "2.0.0"
global.idch = "120363299254074394@newsletter"
global.newsletterName = "TOOSII-XD ULTRA Updates"
global.typebot = "Multi-Device Bot"
global.session = "session"
global.thumb = "https://files.catbox.moe/qbcebp.jpg"
global.wagc = "https://wa.me/254748340864"
global.welcome = false
global.adminevent = false
global.fakePresence = 'off'
global.autoViewStatus = false
global.autoLikeStatus = false
global.statusMentionWarns = {}
global.statusMentionDeleteList = {}
global.autoLikeEmoji = ''
global.statusToGroup = ''
global.botPrefix = ''
global.antiCall = false
global.autoRead = false
global.chatBot = false
global.autoBio = false
global.autoReplyStatus = false
global.autoReplyStatusMsg = ''
global.antiStatusMention = false
global.antiStatusMentionAction = 'warn'
global.antiLink = false
global.antiDelete = false
global.autoReact = false
global.autoReactEmoji = '👍'
global.pmBlocker = false
global.antiBadword = false
global.antiTag = false
global.antiSticker = false
global.antiDemote = false
global.menuThumb = ''
global.botTimezone = 'Africa/Nairobi'
global.botPic = ''
global.botUrl = 'https://wa.me/254748340864'
//━━━━━━━━━━━━━━━━━━━━━━━━//
// GitHub Repo URL (used by .update command — set this to your repo)
global.repoUrl = 'https://github.com/TOOSII102/TOOSII-XD-ULTRA'
global.ownerFontMode = 'off' // Set via .setfont [name], disable via .fontoff
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Sticker Marker
global.packname = "TOOSII-XD ULTRA"
global.author = "© Toosii Tech"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Social Links
global.telegram = "https://t.me/toosiitech"
global.ownerNumber = "+254748340864"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Respon Message
global.mess = {
    success: '✅ *Success!* Operation completed.',
    admin: '🚫 *Admin Only* — This command requires group admin privileges.',
    botAdmin: '⚠️ *Bot Not Admin* — Please promote me to group admin first, then try again.',
    OnlyOwner: '🔒 *Owner Only* — This command is restricted to the bot owner.',
    OnlyGrup: '👥 *Group Only* — This command can only be used in group chats.',
    private: '📩 *Private Chat Only* — Please send this command in my DM.',
    wait: '',
    error: '❌ *Error* — Something went wrong. Please try again.',
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// File Update
let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update File 📁 : ${__filename}`)
delete require.cache[file]
require(file)
})
