'use strict';
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') }); // root .env

  // Hardcoded creator numbers — always have access on ANY deployment
  const CREATORS = ['254748340864', '254746677793'];

  module.exports = {
      // ── Required ────────────────────────────────────────────────
      SESSION_ID:       process.env.SESSION_ID       || '',
      OWNER_NUMBER:     process.env.OWNER_NUMBER     || '',

      // ── Bot settings ────────────────────────────────────────────
      PREFIX:           process.env.PREFIX           || ',',
      BOT_NAME:         process.env.BOT_NAME         || 'TOOSII-XD ULTRA',
      OWNER_NAME:       process.env.OWNER_NAME       || 'TOOSII',
      MODE:             process.env.MODE             || 'public',
      TIME_ZONE:        process.env.TIME_ZONE        || 'Africa/Nairobi',
      PORT:             parseInt(process.env.PORT)   || 3000,

      // WhatsApp Channel JID — shows menu as "Forwarded from <channel>"
      // Format: 120363XXXXXXXXXX@newsletter
      NEWSLETTER_JID:   process.env.NEWSLETTER_JID   || '',

      // ── API keys (all optional — free fallbacks exist) ──────────
      OPENAI_API_KEY:   process.env.OPENAI_API_KEY   || '',
      GEMINI_API_KEY:   process.env.GEMINI_API_KEY   || '',
      WEATHER_API_KEY:  process.env.WEATHER_API_KEY  || '',
      NEWSAPI_API_KEY:  process.env.NEWSAPI_API_KEY  || '',
      RAPIDAPI_API_KEY: process.env.RAPIDAPI_API_KEY || '',

      CREATORS,
  };
  