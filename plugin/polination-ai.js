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
require('../setting')
const axios = require('axios');

module.exports = {
    type: 'ai',
    command: ['poliai', 'polination-ai'],
    operate: async (context) => {
        const { args, reply } = context;

  try {
    if (!args[0]) return reply(`╔══════════════════════════╗\n║   ⚡ *TOOSII-XD ULTRA*\n║   _WhatsApp Multi-Device Bot_\n╚══════════════════════════╝\n\n  🤖 *Pollinations AI*\n\n  └ Send a message to get a response!\n\n  _Example: .poliai What is AI?_\n\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n_⚡ Powered by Toosii Tech — wa.me/254748340864_`)

    let { data } = await axios.post('https://text.pollinations.ai/openai', {
      messages: [
        { role: 'system', content: 'You are a helpful assistant for TOOSII-XD ULTRA WhatsApp bot by Toosii Tech.' },
        { role: 'user', content: args.join(' ') }
      ],
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 14; NX769J Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36'
      }
    })

    const result = data?.choices?.[0]?.message?.content
    if (!result) return reply(`❌ *No response from AI. Try again.*`)

    reply(`╔══════════════════════════╗\n║   ⚡ *TOOSII-XD ULTRA*\n║   _WhatsApp Multi-Device Bot_\n╚══════════════════════════╝\n\n  🤖 *Pollinations AI*\n\n${result}\n\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n_⚡ Powered by Toosii Tech — wa.me/254748340864_`)

  } catch (e) {
    reply(`❌ *Error* — AI service unavailable. Please try again.\n\n_⚡ TOOSII-XD ULTRA by Toosii Tech_`)
  }
 }
}
