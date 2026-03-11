/**
 * lib/session.js
 * Decodes a TOOSII~ session ID → writes creds.json to sessions/
 */

const fs   = require('fs');
const path = require('path');
const { SESSION_ID, SESSION_PREFIX, SESSION_DIR } = require('../config');

function loadSession() {
    if (!SESSION_ID) return;                       // no session set — will use QR

    const sessDir = path.resolve(SESSION_DIR);
    if (!fs.existsSync(sessDir)) fs.mkdirSync(sessDir, { recursive: true });

    const credsPath = path.join(sessDir, 'creds.json');
    if (fs.existsSync(credsPath)) return;          // already restored — nothing to do

    if (!SESSION_ID.startsWith(SESSION_PREFIX)) {
        console.error('[Session] SESSION_ID does not start with expected prefix:', SESSION_PREFIX);
        return;
    }

    try {
        const base64Part = SESSION_ID.slice(SESSION_PREFIX.length);
        const decoded    = Buffer.from(base64Part, 'base64').toString('utf-8');
        JSON.parse(decoded);                       // validate it's real JSON before writing
        fs.writeFileSync(credsPath, decoded, 'utf-8');
        console.log('[Session] ✅ Session restored from SESSION_ID');
    } catch (err) {
        console.error('[Session] ❌ Failed to decode SESSION_ID:', err.message);
    }
}

module.exports = { loadSession };
