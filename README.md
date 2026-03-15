<div align="center">

<img src="https://files.catbox.moe/qbcebp.jpg" width="150" style="border-radius:50%" alt="TOOSII-XD ULTRA" />

<br/>

# ⚡ TOOSII-XD ULTRA

### *The most powerful WhatsApp Multi-Device Bot*

<br/>

[![Version](https://img.shields.io/badge/Version-2.0.0-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/TOOSII102/TOOSII-XD-ULTRA)
[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/Platform-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com)
[![Stars](https://img.shields.io/github/stars/TOOSII102/TOOSII-XD-ULTRA?style=for-the-badge&color=FFD700&logo=github)](https://github.com/TOOSII102/TOOSII-XD-ULTRA/stargazers)
[![Forks](https://img.shields.io/github/forks/TOOSII102/TOOSII-XD-ULTRA?style=for-the-badge&color=25D366&logo=github)](https://github.com/TOOSII102/TOOSII-XD-ULTRA/fork)

<br/>

[![WhatsApp](https://img.shields.io/badge/WhatsApp-Contact-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/254748340864)
[![Telegram](https://img.shields.io/badge/Telegram-Channel-2CA5E0?style=flat-square&logo=telegram&logoColor=white)](https://t.me/toosiitech)
[![Community](https://img.shields.io/badge/WhatsApp-Community-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/CwNhH3QNvrVFdcKNgaKg4g)
[![Session Generator](https://img.shields.io/badge/🔑_Session-Generator-128C7E?style=flat-square)](https://toosii-xd-session-generator-woyo.onrender.com/pair)

</div>

---

<div align="center">

## ✨ What is TOOSII-XD ULTRA?

</div>

**TOOSII-XD ULTRA** is a blazing-fast, feature-rich WhatsApp Multi-Device Bot built on the gifted-baileys protocol. With **250+ commands** spanning AI, media, group management, games, and more — it's the only bot you'll ever need.

> 🛡️ Built for reliability &nbsp;•&nbsp; ⚡ Instant responses &nbsp;•&nbsp; 🎨 Fully customizable &nbsp;•&nbsp; 🔌 Plugin-ready

---

## 🚀 Quick Start

```bash
git clone https://github.com/TOOSII102/TOOSII-XD-ULTRA.git
cd TOOSII-XD-ULTRA
npm install
node index.js
```

> 💡 First time? Get your session ID instantly at **[Session Generator →](https://toosii-xd-session-generator-woyo.onrender.com/pair)**

---

## ☁️ Deploy to Cloud

<div align="center">

| Platform | One-Click Deploy |
|:---:|:---:|
| **Heroku** | [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) |
| **Railway** | [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app) |
| **Render** | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com) |

</div>

<details>
<summary><b>📋 Heroku Setup</b></summary>

```bash
heroku create your-bot-name
heroku buildpacks:set heroku/nodejs
git push heroku main
heroku ps:scale worker=1
```
> Uses a `worker` dyno — the bot is a persistent process, not a web server.
</details>

<details>
<summary><b>📋 Railway Setup</b></summary>

```bash
railway init
railway up
```
Set the start command to `node index.js` in your Railway project settings.
</details>

---

## 🔑 Session Setup

Three ways to connect your bot:

| Method | How |
|---|---|
| **Pairing Code** | Run bot → select `1` → enter phone number → enter code in WhatsApp |
| **Session ID** | Visit [Session Generator](https://toosii-xd-session-generator-woyo.onrender.com/pair) → paste `SESSION_ID` in `.env` |
| **Existing Session** | Copy `sessions/<number>/` folder to new host — auto-reconnects |

**`.env` quick setup:**
```env
SESSION_ID=TOOSII~eyJub2lzZUtleS...   # from Session Generator
OWNER_NUMBER=254748340864               # your WhatsApp number (no + or spaces)
```

---

## ✨ Features

<div align="center">

| 🤖 AI & Chat | 📥 Downloaders | 🖼️ Stickers |
|:---:|:---:|:---:|
| 15+ AI models | YouTube Audio/Video | Image → Sticker |
| Auto ChatBot mode | Instagram Reels | Video → Sticker |
| Pollinations AI | TikTok Videos | Emoji Mix |
| Gemini, GPT-4o | Facebook Videos | Telegram Packs |
| DeepSeek, Mistral | MediaFire Files | BRAT Generator |

| 👥 Group Tools | 🎮 Games | 🛠️ Tools |
|:---:|:---:|:---:|
| Add / Kick / Promote | Truth or Dare | Translate |
| Warn System | 8-Ball | Remove BG |
| Anti-Link / Anti-Tag | Coin Flip | Screenshot |
| Anti-BadWord | Trivia | Shazam |
| Accept/Reject Joins | Tic-Tac-Toe | Location |

</div>

---

## 📋 Command Reference

<details>
<summary><b>📌 General</b></summary>

| Command | Description |
|---|---|
| `.menu` | Full command list |
| `.help` | Quick start guide |
| `.ping` | Bot speed & uptime |
| `.botinfo` | Bot info card |
| `.repo` | GitHub repository |
| `.sc` / `.source` | Source code |

</details>

<details>
<summary><b>🤖 AI & Chat</b></summary>

| Command | Description |
|---|---|
| `.ai <prompt>` | Pollinations AI |
| `.chatai <prompt>` | General AI chat |
| `.gemini-ai <prompt>` | Google Gemini |
| `.gpt-4o <prompt>` | OpenAI GPT-4o |
| `.deepseek <prompt>` | DeepSeek AI |
| `.mistral <prompt>` | Mistral AI |
| `.chatbot on/off` | Auto-reply mode |

</details>

<details>
<summary><b>📥 Downloaders</b></summary>

| Command | Description |
|---|---|
| `.play <query>` | YouTube audio |
| `.ytv <query>` | YouTube video |
| `.ig <url>` | Instagram media |
| `.tt <url>` | TikTok video |
| `.fb <url>` | Facebook video |
| `.spotify <query>` | Spotify track info |
| `.mediafire <url>` | MediaFire download |

</details>

<details>
<summary><b>🖼️ Stickers</b></summary>

| Command | Description |
|---|---|
| `.sticker` / `.s` | Media → sticker |
| `.take` / `.steal` | Re-pack a sticker |
| `.emojimix 😀+😎` | Mix two emojis |
| `.qc <text>` | Quote card |
| `.telestick <url>` | Telegram sticker pack |
| `.toimage` | Sticker → image |

</details>

<details>
<summary><b>👥 Group Management</b></summary>

| Command | Description |
|---|---|
| `.add <number>` | Add member |
| `.kick @user` | Remove member |
| `.promote @user` | Make admin |
| `.demote @user` | Remove admin |
| `.warn @user` | Issue warning |
| `.mute` / `.unmute` | Mute group |
| `.open` / `.close` | Toggle messaging |
| `.tagall` | Tag everyone |
| `.link` | Get invite link |
| `.setgname <n>` | Rename group |
| `.acceptjoin` | Approve join requests |

</details>

<details>
<summary><b>🛡️ Group Protection</b></summary>

| Command | Description |
|---|---|
| `.antilink on/off` | Block external links |
| `.antibadword on/off` | Filter bad words |
| `.antitag on/off` | Prevent mass tagging |
| `.antisticker on/off` | Block stickers |
| `.antidemote on/off` | Auto re-promote admins |
| `.antidelete on/off` | Detect deleted messages |

</details>

<details>
<summary><b>👑 Owner Commands</b></summary>

| Command | Description |
|---|---|
| `.self` / `.public` | Bot mode toggle |
| `.setprefix <char>` | Change prefix |
| `.botname <n>` | Rename bot |
| `.botpic` | Change bot profile pic |
| `.autobio on/off` | Auto status bio |
| `.autoread on/off` | Auto-read messages |
| `.anticall on/off` | Block calls |
| `.broadcast <msg>` | Message all chats |
| `.addplugin <url>` | Install plugin |
| `.restart` | Restart bot |

</details>

<details>
<summary><b>🎭 Text Effects</b></summary>

`.neon` `.fire` `.matrix` `.ice` `.glitch` `.thunder` `.devil` `.hacker` `.sand` `.blackpink` `.metallic` `.light` `.arena` `.1917` and many more!

</details>

---

## ⚙️ Configuration

Set these in your **`.env`** file — no code editing needed:

```env
SESSION_ID=TOOSII~eyJub2lzZUtleS...   # from Session Generator
OWNER_NUMBER=254748340864               # your WhatsApp number (no + or spaces)
```

The bot reads your number on startup and grants you owner access automatically.

To further customise display names, timezone, sticker info, etc., edit `setting.js`:

```javascript
global.botname     = "TOOSII-XD ULTRA"   // Bot display name
global.ownername   = "Toosii Tech"       // Your name
global.botTimezone = "Africa/Nairobi"    // Your timezone
global.packname    = "TOOSII-XD ULTRA"   // Sticker pack name
global.author      = "© Toosii Tech"    // Sticker author
```

---

## 🗂️ Project Structure

```
TOOSII-XD-ULTRA/
├── 📄 index.js          ← Bot entry point & WhatsApp socket
├── 📄 client.js         ← Command handler (250+ commands)
├── 📄 setting.js        ← Global configuration
├── 📄 logger.js         ← Smart noise suppressor
├── 📄 .env              ← Environment variables
├── 📁 sessions/         ← Auth data (auto-generated)
├── 📁 database/         ← Games, warnings, user data
├── 📁 plugin/           ← External plugin modules
└── 📁 library/
    ├── 📁 lib/          ← Core utils (exif, myfunc, store)
    ├── 📁 scrape/       ← Web scrapers
    └── 📁 menulist/     ← Menu templates
```

---

## 🛠️ Requirements

- **Node.js** v18.0.0 or higher
- **npm** v8+
- **ffmpeg** installed on the system
- A WhatsApp account

---

## 🤝 Support & Community

<div align="center">

| Platform | Link |
|:---:|:---:|
| 📞 **WhatsApp** | [wa.me/254748340864](https://wa.me/254748340864) |
| ✈️ **Telegram** | [t.me/toosiitech](https://t.me/toosiitech) |
| 👥 **Community Group** | [Join here](https://chat.whatsapp.com/CwNhH3QNvrVFdcKNgaKg4g) |
| 🔑 **Session Generator** | [Open Generator](https://toosii-xd-session-generator-woyo.onrender.com/pair) |

</div>

---

## ⭐ Support the Project

If TOOSII-XD ULTRA has been useful to you, please consider:

- ⭐ **[Starring](https://github.com/TOOSII102/TOOSII-XD-ULTRA)** this repository
- 🍴 **[Forking](https://github.com/TOOSII102/TOOSII-XD-ULTRA/fork)** it to deploy your own
- 📢 **Sharing** it with your community

> Every star motivates us to keep building and improving! 🙏

---

<div align="center">

**Made with ❤️ by [Toosii Tech](https://wa.me/254748340864)**

*© 2024 – 2026 TOOSII-XD ULTRA. All rights reserved.*

[![Star](https://img.shields.io/github/stars/TOOSII102/TOOSII-XD-ULTRA?style=social)](https://github.com/TOOSII102/TOOSII-XD-ULTRA)
[![Fork](https://img.shields.io/github/forks/TOOSII102/TOOSII-XD-ULTRA?style=social)](https://github.com/TOOSII102/TOOSII-XD-ULTRA/fork)

</div>
