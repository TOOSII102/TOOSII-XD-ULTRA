// Entry point — ensures yt-dlp is present, then loads the bot
  const path = require('path');
  const fs   = require('fs');
  const https = require('https');

  const BOT_DIR    = path.join(__dirname, 'bot');
  const YT_DLP     = path.join(BOT_DIR, 'yt-dlp');
  const YT_DLP_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

  function download(url, dest) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      const get  = (u) => https.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) return get(res.headers.location);
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
      get(url);
    });
  }

  async function ensureYtDlp() {
    if (fs.existsSync(YT_DLP)) return;
    console.log('[launcher] yt-dlp missing — downloading latest...');
    await download(YT_DLP_URL, YT_DLP);
    fs.chmodSync(YT_DLP, '755');
    console.log('[launcher] yt-dlp ready.');
  }

  process.chdir(BOT_DIR);
  ensureYtDlp()
    .catch((err) => console.error('[launcher] yt-dlp download failed:', err.message))
    .finally(() => require(path.join(__dirname, 'bot', 'index.js')));
  