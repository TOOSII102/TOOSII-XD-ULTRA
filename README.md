<p align="center">
  <img src="https://files.catbox.moe/qbcebp.jpg" width="200" height="200" style="border-radius: 50%;" alt="TOOSII-XD ULTRA">
</p>

<h1 align="center">TOOSII-XD ULTRA</h1>

<p align="center">
  <b>WhatsApp Multi-Device Bot</b><br>
  <i>Built with gifted-baileys | by Toosii Tech</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-green?style=flat-square&logo=node.js" alt="Node">
  <img src="https://img.shields.io/badge/platform-WhatsApp-25D366?style=flat-square&logo=whatsapp&logoColor=white" alt="WhatsApp">
  <img src="https://img.shields.io/badge/license-Proprietary-red?style=flat-square" alt="License">
</p>

<p align="center">
  <a href="https://wa.me/254748340864">WhatsApp</a> &bull;
  <a href="https://t.me/toosiitech">Telegram</a> &bull;
  <a href="https://chat.whatsapp.com/CwNhH3QNvrVFdcKNgaKg4g">Community Group</a>
</p>

---

## Overview

**TOOSII-XD ULTRA** is a feature-rich WhatsApp Multi-Device Bot powered by the Baileys Web API. It supports over 150+ commands across AI chat, media downloading, sticker creation, group management, games, and more. Designed as a pure console application for maximum compatibility with hosting panels.

---

## Features

| Category | Highlights |
|---|---|
| **AI Chat** | Pollinations AI, Quantum AI, ChatBot mode |
| **Downloaders** | YouTube (audio/video), Instagram, TikTok, Facebook, MediaFire |
| **Stickers** | Image/video to sticker, Telegram sticker packs, emoji mix |
| **Group Management** | Add, kick, promote, demote, mute, open/close, warn system, anti-link, anti-tag, anti-sticker, anti-badword, anti-demote |
| **Media Tools** | Quote cards, BRAT generator, text effects (neon, fire, matrix, etc.), profile picture tools |
| **Search** | Wikimedia, manga/anime (OtakuDesu, Kusonime, Komiku), JKT48 news, earthquake info (BMKG) |
| **Games** | Leaderboards, interactive games with point tracking |
| **Bot Settings** | Prefix config, auto-read, auto-bio, fake presence, PM blocker, auto-react, status forwarding |
| **Owner Tools** | Plugin system (add/remove/list), broadcast, restart, join groups, multi-session |

---

## Deployment

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** or **yarn**
- A WhatsApp account to pair

### Quick Start

```bash
git clone https://github.com/TOOSII102/TOOSII-XD-ULTRA.git
cd TOOSII-XD-ULTRA
npm install
node index.js
```

On first launch, the bot will prompt you to:
1. Enter your WhatsApp phone number (with country code, e.g., `254748340864`)
2. A **pairing code** will be displayed in the terminal
3. Open WhatsApp on your phone > **Linked Devices** > **Link a Device** > Enter the pairing code

### Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

```bash
heroku create your-app-name
heroku buildpacks:set heroku/nodejs
git push heroku main
heroku ps:scale worker=1
```

> Uses a `worker` dyno (not `web`) since the bot is a persistent process.

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

```bash
railway init
railway up
```

### Bot Hosting Panels (Katabump, etc.)

1. Upload all files or clone from GitHub
2. Set start command: `node index.js`
3. Ensure Node.js 18+ is available
4. Start the bot and follow the pairing prompts in console

### Session Management

Sessions are stored in `sessions/<phone_number>/`. To transfer your bot to a new host:
1. Copy the entire `sessions/` directory to the new server
2. Start the bot — it will reconnect automatically without re-pairing

---

## Command Reference

### General

| Command | Description |
|---|---|
| `.menu` | Display full command menu |
| `.help` | Quick help guide |
| `.ping` / `.info` | Bot status, uptime, and server info |
| `.owner` | Show bot owner contact |
| `.sc` / `.source` | Bot source code link |

### AI & Chat

| Command | Description |
|---|---|
| `.chatai <prompt>` | Chat with Pollinations AI |
| `.quantum-ai <prompt>` | Quantum AI conversation |
| `.chatbot on/off` | Toggle auto-reply chat mode |

### Downloaders

| Command | Description |
|---|---|
| `.play <query>` | Search and download YouTube audio |
| `.ig <url>` | Download Instagram media |
| `.tt <url>` | Download TikTok video |
| `.fb <url>` | Download Facebook video |
| `.mediafire <url>` | Download from MediaFire |

### Stickers

| Command | Description |
|---|---|
| `.sticker` / `.s` | Convert image/video to sticker |
| `.emojimix <emoji1> <emoji2>` | Mix two emojis into a sticker |
| `.qc <text>` | Create a quote card sticker |
| `.telestick <url>` | Import Telegram sticker pack |

### Group Management

| Command | Description |
|---|---|
| `.add <number>` | Add member to group |
| `.kick <@user>` | Remove member from group |
| `.promote <@user>` | Promote member to admin |
| `.demote <@user>` | Demote admin to member |
| `.del` | Delete a message (reply to it) |
| `.warn <@user> [reason]` | Warn a user (3 warnings = kick) |
| `.unwarn <@user>` | Remove warnings |
| `.warnlist` | View all warnings |
| `.mute` / `.unmute` | Mute/unmute group |
| `.open` / `.close` | Open/close group |
| `.setgname <name>` | Change group name |
| `.setgdesc <text>` | Change group description |
| `.setgpp` | Change group picture (reply to image) |
| `.link` | Get group invite link |
| `.resetlink` | Reset group invite link |
| `.revoke` | Revoke group invite |
| `.approve [all]` | Approve pending join requests |
| `.reject [all]` | Reject pending join requests |
| `.tagall [message]` | Tag all group members |
| `.hidetag [message]` | Silently tag all members |
| `.ban <@user>` / `.unban <@user>` | Ban/unban from bot usage |

### Group Protection

| Command | Description |
|---|---|
| `.antilink on/off` | Auto-delete links (non-admin) |
| `.antibadword on/off` | Auto-detect bad words |
| `.antitag on/off` | Detect mass tagging |
| `.antisticker on/off` | Block stickers |
| `.antidemote on/off` | Re-promote demoted admins |

### Owner Commands

| Command | Description |
|---|---|
| `.self` / `.public` | Switch bot mode |
| `.join <link>` | Join a group via invite link |
| `.setprefix <char>` | Change command prefix |
| `.botname <name>` | Change bot display name |
| `.setauthor <name>` | Set sticker author |
| `.setpackname <name>` | Set sticker pack name |
| `.anticall on/off` | Auto-reject calls |
| `.autoread on/off` | Auto-read all messages |
| `.autobio on/off` | Auto-update WhatsApp bio |
| `.addplugin <url>` | Install external plugin |
| `.rmplugin <name>` | Remove a plugin |
| `.getplugin` | List installed plugins |
| `.restart` | Restart the bot |
| `.botsettings` | View all bot settings |

### Fun & Media

| Command | Description |
|---|---|
| `.waifu` / `.anime` | Random anime images |
| `.hug` / `.pat` / `.kiss` | Anime reactions |
| `.neon <text>` | Neon text effect |
| `.fire <text>` | Fire text effect |
| `.matrix <text>` | Matrix text effect |
| `.tweet <text>` | Fake tweet image |
| `.ytcomment <text>` | Fake YouTube comment |

---

## Architecture

```
TOOSII-XD-ULTRA/
  index.js              # Entry point - WhatsApp socket connection
  client.js             # Command handler - processes all messages
  setting.js            # Global configuration
  package.json          # Dependencies
  Procfile              # Heroku worker config
  sessions/             # Auth session data (auto-generated)
  database/             # User tracking, games, warnings (JSON)
  plugin/               # External plugin modules
  library/
    lib/                # Core utilities (myfunc, exif, store)
    scrape/             # Web scrapers (FB, wiki, anime, etc.)
    menulist/           # Menu text templates per category
```

### Key Design Decisions

- **Pure Console App** - No web server required; runs directly via `node index.js`
- **Multi-Device Protocol** - Uses gifted-baileys (Baileys fork) for WhatsApp Web multi-device
- **LID-Aware Admin Detection** - Properly handles WhatsApp's Linked ID system for accurate role detection in groups
- **Plugin Architecture** - Modular command system; add/remove commands without touching core code
- **Session Persistence** - Multi-file auth state for reliable reconnection

---

## Configuration

Edit `setting.js` to customize:

```javascript
global.owner = ["254748340864"]     // Owner phone number(s)
global.botname = "TOOSII-XD ULTRA"  // Bot display name
global.ownername = "Toosii Tech"    // Owner name
global.botPrefix = ""               // Custom prefix (empty = auto-detect)
global.botTimezone = "Africa/Nairobi"
```

### Feature Toggles (via commands or setting.js)

| Setting | Default | Description |
|---|---|---|
| `fakePresence` | `off` | Show typing/recording/online |
| `autoViewStatus` | `false` | Auto-view contacts' status |
| `autoLikeStatus` | `false` | Auto-react to status updates |
| `antiCall` | `false` | Auto-reject incoming calls |
| `autoRead` | `false` | Auto-read all incoming messages |
| `chatBot` | `false` | AI auto-reply mode |
| `pmBlocker` | `false` | Block non-owner private messages |
| `welcome` | `false` | Welcome/goodbye messages |

---

## Support

- **WhatsApp**: [wa.me/254748340864](https://wa.me/254748340864)
- **Telegram**: [t.me/toosiitech](https://t.me/toosiitech)
- **Community**: [Join WhatsApp Group](https://chat.whatsapp.com/CwNhH3QNvrVFdcKNgaKg4g)

---

<p align="center">
  <b>TOOSII-XD ULTRA</b> &mdash; by <a href="https://wa.me/254748340864">Toosii Tech</a> &copy; 2024&ndash;2026
</p>
