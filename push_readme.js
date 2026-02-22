const { Octokit } = require('@octokit/rest');

async function getAccessToken() {
  let cs;
  const h = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const t = process.env.REPL_IDENTITY ? 'repl ' + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? 'depl ' + process.env.WEB_REPL_RENEWAL : null;
  cs = await fetch('https://' + h + '/api/v2/connection?include_secrets=true&connector_names=github', { headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': t } }).then(r => r.json()).then(d => d.items?.[0]);
  return cs?.settings?.access_token || cs?.settings?.oauth?.credentials?.access_token;
}

async function main() {
  const token = await getAccessToken();
  const octokit = new Octokit({ auth: token });
  const owner = 'TOOSII102', repo = 'TOOSII-XD-ULTRA';

  const readme = `<p align="center">
  <img src="https://files.catbox.moe/qbcebp.jpg" width="200" height="200" style="border-radius: 50%;" alt="TOOSII-XD ULTRA">
</p>

<h1 align="center">TOOSII-XD ULTRA</h1>

<p align="center">
  <b>Advanced WhatsApp Multi-Device Bot</b><br>
  <i>Built with Baileys MD | 350+ Commands | Fully Modular</i>
</p>

<p align="center">
  <a href="https://github.com/TOOSII102/TOOSII-XD-ULTRA/stargazers"><img src="https://img.shields.io/github/stars/TOOSII102/TOOSII-XD-ULTRA?style=for-the-badge&color=yellow" alt="Stars"></a>
  <a href="https://github.com/TOOSII102/TOOSII-XD-ULTRA/network/members"><img src="https://img.shields.io/github/forks/TOOSII102/TOOSII-XD-ULTRA?style=for-the-badge&color=blue" alt="Forks"></a>
  <a href="https://github.com/TOOSII102/TOOSII-XD-ULTRA/issues"><img src="https://img.shields.io/github/issues/TOOSII102/TOOSII-XD-ULTRA?style=for-the-badge&color=red" alt="Issues"></a>
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Version-2.0.0-purple?style=for-the-badge" alt="Version">
</p>

<p align="center">
  <a href="https://wa.me/254748340864">WhatsApp</a> |
  <a href="https://t.me/toosiitech">Telegram</a>
</p>

---

## Overview

**TOOSII-XD ULTRA** is a powerful, feature-rich WhatsApp Multi-Device Bot built on the Baileys protocol. With **350+ commands** across 13 categories, it delivers AI chat, media downloading, group management, games, sticker creation, and much more — all from your WhatsApp.

---

## Features

| Category | Commands | Highlights |
|----------|----------|------------|
| **AI** | 15+ | ChatGPT, Copilot, Gemini, Vision, WormGPT, Grok, Mistral, Perplexity |
| **Downloaders** | 10+ | YouTube, Instagram, TikTok, Facebook, Spotify, APK, Git Clone |
| **Group Admin** | 20+ | Mute, Ban, Anti-Link, Anti-Badword, Anti-Tag, Anti-Sticker |
| **Group Tools** | 10+ | TagAll, HideTag, Group Info, Admins List, Reset Link |
| **Owner** | 25+ | Auto-React, PM Blocker, Set Bot PP, Mode Switch, Broadcast |
| **Search & Tools** | 15+ | YouTube Search, Image Search, Movie, Screenshot, Translate, Shazam |
| **Sticker & Convert** | 10+ | Sticker, Crop, Take, Meme, RemoveBG, ToImage, ToAudio, ToPPT |
| **Games** | 12+ | TicTacToe, Hangman, Trivia, Truth/Dare, 8Ball, Coinflip, RPS, Slots |
| **Fun & Social** | 12+ | Compliment, Flirt, Shayari, Ship, Joke, Quote, Fact |
| **Anime** | 15+ | Neko, Waifu, Hug, Kiss, Pat, Poke, Cry, Anime Search |
| **Text Maker** | 18 | Metallic, Neon, Fire, Glitch, Thunder, Matrix, Hacker, BlackPink |
| **Image Edit** | 14 | Heart, Circle, LGBT, Jail, Triggered, Tweet, YT Comment |
| **GitHub** | 3 | GitHub Profile, Repo Info, Clone |

---

## Deployment

### Requirements

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- A **WhatsApp** account

### Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/TOOSII102/TOOSII-XD-ULTRA.git

# Navigate to the project directory
cd TOOSII-XD-ULTRA

# Install dependencies
npm install

# Start the bot
node index.js
\`\`\`

When the bot starts, you will see:

\`\`\`
+==========================================+
|         TOOSII-XD ULTRA v2.0.0           |
|      WhatsApp Multi-Device Bot           |
|        by Toosii Tech                    |
+==========================================+

Choose login method:
1) Enter WhatsApp Number (Pairing Code)
2) Paste Session ID
\`\`\`

Enter your WhatsApp number (with country code, e.g. \`254748340864\`) and use the pairing code displayed in the terminal to link your WhatsApp.

---

### Deploy on Hosting Platforms

<details>
<summary><b>Heroku</b></summary>

1. Fork this repository
2. Create a new Heroku app
3. Connect your GitHub repo to Heroku
4. Set buildpack to \`heroku/nodejs\`
5. Deploy and scale the worker dyno:
   \`\`\`bash
   heroku ps:scale worker=1
   \`\`\`
</details>

<details>
<summary><b>Railway</b></summary>

1. Fork this repository
2. Go to [Railway](https://railway.app)
3. Create new project from GitHub repo
4. Railway will auto-detect Node.js and deploy
</details>

<details>
<summary><b>VPS / Server</b></summary>

\`\`\`bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone and start
git clone https://github.com/TOOSII102/TOOSII-XD-ULTRA.git
cd TOOSII-XD-ULTRA
npm install

# Run with PM2 for auto-restart
npm install -g pm2
pm2 start index.js --name toosii-bot
pm2 save
pm2 startup
\`\`\`
</details>

<details>
<summary><b>Katabump / Bot Panels</b></summary>

1. Upload the bot files or ZIP
2. Set start command: \`node index.js\`
3. Ensure Node.js v18+ runtime
4. Start the bot from the panel
</details>

---

## Configuration

Edit \`setting.js\` to customize the bot:

| Setting | Description | Default |
|---------|-------------|---------|
| \`global.owner\` | Owner WhatsApp number(s) | \`["254748340864"]\` |
| \`global.botname\` | Bot display name | \`TOOSII-XD ULTRA\` |
| \`global.packname\` | Sticker pack name | \`TOOSII-XD ULTRA\` |
| \`global.author\` | Sticker author | \`Toosii Tech\` |
| \`global.autoRead\` | Auto-read messages | \`false\` |
| \`global.chatBot\` | AI auto-reply | \`false\` |
| \`global.antiCall\` | Block calls | \`false\` |
| \`global.antiLink\` | Delete links in groups | \`false\` |

---

## Command Usage

All commands use the \`.\` prefix by default (configurable).

\`\`\`
.menu          - Show full command list
.menu ai       - AI commands only
.menu group    - Group commands only
.menu games    - Game commands only
.ping          - Bot speed & server info
.alive         - Check if bot is online
\`\`\`

---

## Architecture

\`\`\`
TOOSII-XD-ULTRA/
+-- index.js          # Main entry & WhatsApp connection
+-- client.js         # Command handler (350+ commands)
+-- setting.js        # Bot configuration
+-- package.json      # Dependencies
+-- Procfile          # Heroku deployment
+-- database/         # JSON data storage
+-- library/
|   +-- lib/          # Utility functions
|   +-- scrape/       # Web scrapers & uploaders
|   +-- menulist/     # Command menu displays
+-- plugin/           # Modular plugin system
\`\`\`

---

## Support

Need help? Reach out:

- **WhatsApp**: [wa.me/254748340864](https://wa.me/254748340864)
- **Telegram**: [@toosiitech](https://t.me/toosiitech)
- **Issues**: [GitHub Issues](https://github.com/TOOSII102/TOOSII-XD-ULTRA/issues)

---

## License

This project is proprietary software by **Toosii Tech**. Unauthorized modification, redistribution, or removal of credits is strictly prohibited.

---

<p align="center">
  <b>TOOSII-XD ULTRA v2.0.0</b><br>
  Made with care by <a href="https://wa.me/254748340864">Toosii Tech</a><br>
  &copy; 2024 - 2026
</p>
`;

  let sha;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: 'README.md' });
    sha = data.sha;
  } catch {}

  await octokit.repos.createOrUpdateFileContents({
    owner, repo,
    path: 'README.md',
    message: 'Add professional README',
    content: Buffer.from(readme).toString('base64'),
    sha
  });

  console.log('README pushed!');
  console.log('https://github.com/TOOSII102/TOOSII-XD-ULTRA');
}
main().catch(e => { console.error(e.message); process.exit(1); });
