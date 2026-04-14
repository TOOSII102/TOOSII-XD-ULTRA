# TOOSII-XD ULTRA — WhatsApp Bot

  ## Overview

  A feature-rich WhatsApp bot built with [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys).
  900+ commands across AI, games, utility, group management, search, media, and more.
  All AI features branded as **Toosii AI**.

  ## Quick Start

  ```bash
  cd bot
  cp .env.example .env
  # Fill in SESSION_ID and OWNER_NUMBER in .env
  node index.js
  ```

  ## Stack

  - **Runtime**: Node.js 20.x
  - **WhatsApp library**: @whiskeysockets/baileys 7.0.0-rc.9
  - **Prefix**: `,` (comma)
  - **Version**: 1.2.0

  ## Project Structure

  ```
  bot/
  ├── index.js              ← Main entry point
  ├── config.js             ← Bot configuration
  ├── package.json          ← Dependencies
  ├── .env.example          ← Environment variable template
  ├── lib/                  ← Core libraries
  │   ├── chatbot-store.js  ← Toosii AI chatbot (Pollinations)
  │   ├── botname.js        ← Dynamic bot name
  │   └── authState.js      ← Session management
  ├── toosi-cmds/           ← All command files
  │   ├── owner/            ← Owner-only commands
  │   ├── group/            ← Group management
  │   ├── utility/          ← Utility tools
  │   ├── search/           ← Search & GitHub
  │   ├── stalker/          ← User info commands
  │   ├── fun/              ← Games & fun
  │   ├── media/            ← Media commands
  │   └── automation/       ← Auto-features
  └── data/                 ← Runtime data (gitignored)
  ```

  ## Environment Variables

  | Variable | Required | Description |
  |---|---|---|
  | `SESSION_ID` | ✅ | From session generator |
  | `OWNER_NUMBER` | ✅ | WhatsApp number (no + or spaces) |
  | `PREFIX` | optional | Default: `,` |
  | `BOT_NAME` | optional | Default: `TOOSII-XD` |
  | `MODE` | optional | `public` or `private` |
  | `TIME_ZONE` | optional | Default: `Africa/Nairobi` |

  Session generator: https://toosiitechdevelopertools.zone.id/session

  ## GitHub Repo

  **Main branch**: `TOOSII102/toosii-xd-ultra` (main) — development  
  **Heroku branch**: `TOOSII102/toosii-xd-ultra` (heroku) — deploy-ready (bot files at root)

  ## Deployment

  The bot can be deployed to any container-based platform:
  - **bot-hosting.net** (Pterodactyl) — upload files, set env vars in panel
  - **Heroku** — use the `heroku` branch, set Config Vars
  - **Koyeb** — use the `heroku` branch, set environment variables
  - **Railway** — connect GitHub, set environment variables

  > Note: Vercel, Netlify, and serverless platforms are NOT compatible (require long-running process + WebSocket).

  ## Key Commands

  | Command | Description |
  |---|---|
  | `,menu` | Full command list |
  | `,update` | Pull latest from GitHub and restart |
  | `,restart` | Restart the bot process |
  | `,setprefix` | Change command prefix |
  | `,mode` | Switch public/private mode |
  | `,ai` | Chat with Toosii AI |
  