//═════════════════════════════════//

/*
🔗 TOOSII-XD ULTRA Bot System
by Toosii Tech • 2024 - 2026

>> Contact Links:
・WhatsApp : wa.me/254748340864
・Telegram : t.me/toosiitech
*/

//═════════════════════════════════//
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Smart Log Suppressor
// Silences noisy, irrelevant, or repetitive logs
// while keeping important bot activity visible.
//━━━━━━━━━━━━━━━━━━━━━━━━//

const _origLog   = console.log.bind(console)
const _origWarn  = console.warn.bind(console)
const _origError = console.error.bind(console)
const _origInfo  = console.info.bind(console)
const _origDebug = console.debug.bind(console)

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Patterns that are ALWAYS silenced
// (Signal noise, Baileys internals, pino spam, WA protocol junk)
const SUPPRESS_PATTERNS = [
    // WhatsApp / libsignal protocol noise
    /no sessions/i,
    /sessionerror/i,
    /bad mac/i,
    /failed to decrypt/i,
    /no senderkey/i,
    /invalid prekey/i,
    /invalid message/i,
    /nosuchsession/i,
    /session_cipher/i,
    /libsignal/i,
    /queue_job/i,
    /retry.*decrypt/i,
    /decryption.*fail/i,
    /senderkey.*missing/i,
    /\[Signal\]/i,
    /\[Suppressed/i,

    // Baileys internal verbose logs
    /connection.*keep.?alive/i,
    /keep.?alive.*sent/i,
    /recv.*node/i,
    /send.*node/i,
    /decoded.*node/i,
    /tag.*recv/i,
    /binary.*node/i,
    /writing.*to.*socket/i,
    /got.*ping/i,
    /pong.*sent/i,
    /generating.*keys/i,
    /waiting.*for.*message/i,
    /processing.*handshake/i,
    /registering.*connection/i,
    /account.*sync/i,
    /app.*state.*sync/i,
    /key.*count.*change/i,
    /pre.?key.*upload/i,
    /fetching.*latest.*baileys/i,

    // Pino / logger internal
    /^\s*\{.*"level":\s*(10|20|30).*\}\s*$/,  // pino JSON silent/debug/info
    /pino.*child/i,
    /logger.*stream/i,

    // WA receipt / ack spam
    /receipt.*ack/i,
    /message.*ack.*\d/i,
    /read.*receipt/i,
    /delivery.*receipt/i,
    /\bACK\b/,
    /status.*update.*\d/i,

    // Generic axios / fetch internals
    /socket hang up/i,
    /ECONNRESET/,
    /ETIMEDOUT/,
    /ECONNABORTED/,
    /getaddrinfo/i,
    /connect ENOENT/i,
    /tunneling socket/i,

    // Node internal warnings we don't care about
    /ExperimentalWarning/i,
    /punycode.*deprecated/i,
    /DeprecationWarning.*punycode/i,
    /MaxListenersExceededWarning/i,
    /NODE_TLS_REJECT_UNAUTHORIZED/i,

    // Repeated bot-internal noise
    /\[Auto-Bio\]/i,
    /LID.*pre-loaded/i,
    /LID.*updated from creds/i,
    /LID.*loaded from creds/i,
    /Reconnecting existing session/i,
    /Auto-viewed status/i,
    /Auto-liked status/i,
    /Auto-liked \(DM fallback\)/i,
    /Auto-replied to status/i,
    /Forwarded.*status.*to group/i,
    /Deleted message from flagged/i,
    /WebSocket error \(handled\)/i,
    /store.*bind/i,
    /\[ChatBoAI-Auto\]/i,
    /\[AI-Mode\]/i,
    /\[ChatBot\]/i,
]

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Patterns that are ALWAYS shown (whitelist — never suppressed)
const ALWAYS_SHOW_PATTERNS = [
    /\[BOT_CONNECTED/i,
    /PAIRING_CODE/i,
    /PAIRING CODE/i,
    /Connected:/i,
    /Connection Successful/i,
    /INTEGRITY CHECK FAILED/i,
    /Device logged out/i,
    /Session file corrupted/i,
    /All pairing attempts failed/i,
    /Restart required/i,
    /Connection timed out/i,
    /Connection closed/i,
    /Connection lost/i,
    /Connection replaced/i,
    /Unknown DisconnectReason/i,
    /\[UncaughtException\]/i,
    /\[UnhandledRejection\]/i,
    /\[connectSession\] Error/i,
    /Pairing attempt.*failed/i,
]

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Rate limiter — prevents repeated identical messages flooding the console
const _recentLogs  = new Map()
const RATE_WINDOW  = 10000  // 10 seconds
const RATE_LIMIT   = 3      // max same message in window

function _isRateLimited(msg) {
    const now = Date.now()
    const key  = String(msg).slice(0, 120)  // use first 120 chars as key
    const entry = _recentLogs.get(key)
    if (!entry) {
        _recentLogs.set(key, { count: 1, ts: now })
        return false
    }
    if (now - entry.ts > RATE_WINDOW) {
        _recentLogs.set(key, { count: 1, ts: now })
        return false
    }
    entry.count++
    if (entry.count === RATE_LIMIT + 1) {
        // Show once that it's being suppressed
        _origLog(`\x1b[2m[Logger] Suppressing repeated message: "${key.slice(0, 60)}..."\x1b[0m`)
    }
    return entry.count > RATE_LIMIT
}

// Periodic cleanup so the Map doesn't grow forever
setInterval(() => {
    const now = Date.now()
    for (const [k, v] of _recentLogs) {
        if (now - v.ts > RATE_WINDOW * 2) _recentLogs.delete(k)
    }
}, 60000)

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Core filter function
function _shouldSuppress(args) {
    const msg = args.map(a => {
        if (typeof a === 'string') return a
        try { return JSON.stringify(a) } catch { return String(a) }
    }).join(' ')

    // Whitelist check — never suppress these
    for (const p of ALWAYS_SHOW_PATTERNS) {
        if (p.test(msg)) return false
    }

    // Suppress pattern check
    for (const p of SUPPRESS_PATTERNS) {
        if (p.test(msg)) return true
    }

    // Rate limit check
    if (_isRateLimited(msg)) return true

    return false
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Override console methods
console.log = (...args) => {
    if (_shouldSuppress(args)) return
    _origLog(...args)
}

console.warn = (...args) => {
    if (_shouldSuppress(args)) return
    _origWarn(...args)
}

console.error = (...args) => {
    if (_shouldSuppress(args)) return
    _origError(...args)
}

console.info = (...args) => {
    if (_shouldSuppress(args)) return
    _origInfo(...args)
}

// debug is almost always noise — fully suppress unless explicitly shown
console.debug = (...args) => { /* suppressed */ }

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Suppress Node.js process warnings (e.g. punycode, experimental)
const _origEmitWarning = process.emitWarning.bind(process)
process.emitWarning = (warning, ...rest) => {
    const msg = String(warning)
    if (
        /punycode/i.test(msg) ||
        /ExperimentalWarning/i.test(msg) ||
        /DeprecationWarning/i.test(msg) ||
        /MaxListeners/i.test(msg)
    ) return
    _origEmitWarning(warning, ...rest)
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Expose helpers for runtime control
module.exports = {
    // Temporarily mute ALL output (e.g. during bulk operations)
    mute() {
        console.log = () => {}
        console.warn = () => {}
        console.error = () => {}
        console.info = () => {}
    },

    // Restore filtered output
    unmute() {
        console.log   = (...a) => { if (!_shouldSuppress(a)) _origLog(...a) }
        console.warn  = (...a) => { if (!_shouldSuppress(a)) _origWarn(...a) }
        console.error = (...a) => { if (!_shouldSuppress(a)) _origError(...a) }
        console.info  = (...a) => { if (!_shouldSuppress(a)) _origInfo(...a) }
    },

    // Add a custom suppress pattern at runtime
    suppress(pattern) {
        if (pattern instanceof RegExp) SUPPRESS_PATTERNS.push(pattern)
        else SUPPRESS_PATTERNS.push(new RegExp(pattern, 'i'))
    },

    // Add a custom always-show pattern at runtime
    allow(pattern) {
        if (pattern instanceof RegExp) ALWAYS_SHOW_PATTERNS.push(pattern)
        else ALWAYS_SHOW_PATTERNS.push(new RegExp(pattern, 'i'))
    },

    // Print directly, bypassing all filters (for critical messages)
    force(...args) { _origLog(...args) },

    // Check suppression without side effects
    wouldSuppress(...args) { return _shouldSuppress(args) }
}
