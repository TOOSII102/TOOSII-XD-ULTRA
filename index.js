// Entry point — changes working directory to bot/ then loads the bot
  // This ensures dotenv finds bot/.env and all relative paths resolve correctly
  const path = require('path');
  process.chdir(path.join(__dirname, 'bot'));
  require(path.join(__dirname, 'bot', 'index.js'));
  