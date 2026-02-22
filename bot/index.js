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
// Module
require("./setting")
const { default: makeWASocket, DisconnectReason, jidDecode, proto, getContentType, useMultiFileAuthState, downloadContentFromMessage } = require("gifted-baileys")
const { makeInMemoryStore } = require('./library/lib/store')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const readline = require("readline");
const _ = require('lodash')
const yargs = require('yargs/yargs')
const PhoneNumber = require('awesome-phonenumber')
const FileType = require('file-type')
const path = require('path')
const fetch = require("node-fetch") 
const { getBuffer } = require('./library/lib/myfunc')
const { imageToWebp, imageToWebp3, videoToWebp, writeExifImg, writeExifImgAV, writeExifVid } = require('./library/lib/exif')

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception (handled):', err.message || err)
})
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection (handled):', err.message || err)
})

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Anti-Tampering Protection
const _ov = '254748340864'
const _bn = 'TOOSII-XD ULTRA'
const _ba = 'Toosii Tech'
function _integrityCheck() {
    const ownerValid = global.owner && global.owner.includes(_ov)
    const nameValid = global.botname && global.botname.includes('TOOSII')
    const authorValid = global.ownername === _ba
    if (!ownerValid || !nameValid || !authorValid) {
        console.log('\n╔══════════════════════════════════════════╗')
        console.log('║  ⚠️  INTEGRITY CHECK FAILED               ║')
        console.log('║  Unauthorized modification detected.      ║')
        console.log('║  This bot is property of Toosii Tech.     ║')
        console.log('║  Restore original settings to continue.   ║')
        console.log('║  Contact: wa.me/254748340864               ║')
        console.log('╚══════════════════════════════════════════╝\n')
        process.exit(1)
    }
    global.owner = [...new Set([_ov, ...global.owner])]
    global._protectedOwner = _ov
    global._protectedBrand = _bn
    global._protectedAuthor = _ba
}
_integrityCheck()
setInterval(_integrityCheck, 300000)

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Session & State
const SESSIONS_DIR = path.join(__dirname, 'sessions')
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true })

const activeSessions = new Map()
const processedMsgs = new Set()
const msgRetryCache = new Map()

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Web Panel + Terminal Login Interface
const http = require('http')
const { WebSocketServer, WebSocket } = require('ws')

const WEB_PORT = parseInt(process.env.PORT || '5000', 10)
const logBuffer = []
const MAX_LOG_LINES = 500
const wsClients = []
let currentPairingCode = null
let connectedUser = null
const startTime = Date.now()

const origLog = console.log.bind(console)
const origErr = console.error.bind(console)

function addLog(text) {
    const line = typeof text === 'string' ? text : String(text)
    origLog(line)
    logBuffer.push(line)
    if (logBuffer.length > MAX_LOG_LINES) logBuffer.shift()
    const pairingMatch = line.match(/\[PAIRING_CODE:([^\]]+)\]/)
    if (pairingMatch) {
        currentPairingCode = pairingMatch[1]
        wsBroadcast({ type: 'pairing_code', code: currentPairingCode })
    }
    const connMatch = line.match(/\[BOT_CONNECTED:([^\]]+)\]/)
    if (connMatch) {
        connectedUser = connMatch[1]
        currentPairingCode = null
        wsBroadcast({ type: 'connected', user: connectedUser })
    }
    wsBroadcast({ type: 'output', data: line })
}

console.log = (...args) => addLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
console.error = (...args) => { origErr(...args); addLog('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')) }

function wsBroadcast(data) {
    const msg = JSON.stringify(data)
    for (const ws of wsClients) {
        if (ws.readyState === WebSocket.OPEN) ws.send(msg)
    }
}

function getSessionsList() {
    const sessions = []
    if (fs.existsSync(SESSIONS_DIR)) {
        const dirs = fs.readdirSync(SESSIONS_DIR).filter(d => {
            const p = path.join(SESSIONS_DIR, d)
            return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'creds.json'))
        })
        for (const d of dirs) {
            const info = activeSessions.get(d)
            sessions.push({ phone: d, status: info ? info.status : 'saved' })
        }
    }
    return sessions
}

async function handlePhoneLogin(phone) {
    phone = phone.replace(/[^0-9]/g, '')
    if (phone.length < 10 || phone.length > 15) {
        addLog(`[ ${_bn} ] Invalid number. Must be 10-15 digits with country code.`)
        wsBroadcast({ type: 'login_error', message: 'Invalid number. Must be 10-15 digits with country code.' })
        return
    }
    if (phone.startsWith('0')) {
        addLog(`[ ${_bn} ] Do not start with 0. Use country code instead.`)
        wsBroadcast({ type: 'login_error', message: 'Do not start with 0. Use country code instead.' })
        return
    }
    currentPairingCode = null
    connectedUser = null
    addLog(`[ ${_bn} ] Connecting with number: ${phone}...`)
    wsBroadcast({ type: 'login_status', message: 'Connecting...' })
    await connectSession(phone)
}

async function handleSessionLogin(sessionId) {
    if (!sessionId || sessionId.length < 10) {
        addLog(`[ ${_bn} ] Invalid Session ID.`)
        wsBroadcast({ type: 'login_error', message: 'Invalid Session ID. Too short.' })
        return
    }
    try {
        addLog(`[ ${_bn} ] Processing Session ID...`)
        wsBroadcast({ type: 'login_status', message: 'Processing Session ID...' })
        let credsData
        try {
            credsData = JSON.parse(Buffer.from(sessionId, 'base64').toString('utf-8'))
        } catch {
            try {
                credsData = JSON.parse(sessionId)
            } catch {
                addLog(`[ ${_bn} ] Invalid Session ID format. Must be base64 encoded or JSON.`)
                wsBroadcast({ type: 'login_error', message: 'Invalid Session ID format.' })
                return
            }
        }
        const sessionPhone = credsData.me?.id?.split(':')[0]?.split('@')[0] || 'imported_' + Date.now()
        const sessionDir = path.join(SESSIONS_DIR, sessionPhone)
        if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })
        fs.writeFileSync(path.join(sessionDir, 'creds.json'), JSON.stringify(credsData, null, 2))
        addLog(`[ ${_bn} ] Session ID saved for ${sessionPhone}`)
        addLog(`[ ${_bn} ] Connecting...`)
        await connectSession(sessionPhone)
    } catch (err) {
        addLog(`[ ${_bn} ] Error processing Session ID: ${err.message || err}`)
        wsBroadcast({ type: 'login_error', message: 'Error: ' + (err.message || err) })
    }
}

const PANEL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TOOSII-XD ULTRA</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'SF Mono','Fira Code',Consolas,monospace;background:#0a0e17;color:#c5cdd9;height:100vh;display:flex;flex-direction:column;overflow:hidden}
.header{background:#111827;border-bottom:1px solid #1f2937;padding:.6rem 1rem;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.header-left{display:flex;align-items:center;gap:.75rem}
.logo{font-size:1rem;font-weight:700;color:#fff;letter-spacing:.5px}
.logo span{color:#3b82f6}
.status-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;transition:background .3s}
.status-dot.running{background:#22c55e;box-shadow:0 0 8px #22c55e60}
.status-text{font-size:.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:1px}
.main{display:flex;flex:1;overflow:hidden}
.sidebar{width:320px;background:#111827;border-right:1px solid #1f2937;display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}
.sidebar-section{padding:1rem;border-bottom:1px solid #1f2937}
.sidebar-section h3{font-size:.75rem;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:.75rem}
.tab-bar{display:flex;gap:0;margin-bottom:.75rem}
.tab{flex:1;padding:.45rem;border:1px solid #374151;background:#1f2937;color:#9ca3af;font-size:.7rem;font-weight:600;cursor:pointer;text-align:center;font-family:inherit;transition:all .15s}
.tab:first-child{border-radius:.35rem 0 0 .35rem}
.tab:last-child{border-radius:0 .35rem .35rem 0}
.tab.active{background:#3b82f6;color:#fff;border-color:#3b82f6}
.input-group{margin-bottom:.6rem}
.input-group label{display:block;font-size:.7rem;color:#9ca3af;margin-bottom:.3rem}
.input-group input,.input-group textarea{width:100%;padding:.5rem .6rem;background:#0a0e17;border:1px solid #374151;border-radius:.35rem;color:#e5e7eb;font-size:.8rem;font-family:inherit;outline:none;transition:border .15s}
.input-group input:focus,.input-group textarea:focus{border-color:#3b82f6}
.input-group textarea{resize:vertical;min-height:60px}
.submit-btn{width:100%;padding:.55rem;border:none;border-radius:.35rem;background:#3b82f6;color:#fff;font-size:.8rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;margin-top:.3rem}
.submit-btn:hover{background:#2563eb}
.submit-btn:disabled{opacity:.5;cursor:not-allowed}
.pairing-box{display:none;background:#1e3a5f;border:2px solid #3b82f6;border-radius:.5rem;padding:1rem;text-align:center;margin-top:.75rem}
.pairing-box.visible{display:block}
.pairing-label{font-size:.7rem;color:#93c5fd;text-transform:uppercase;letter-spacing:1px;margin-bottom:.4rem}
.pairing-code{font-size:1.8rem;font-weight:700;color:#fff;letter-spacing:4px;margin:.3rem 0}
.pairing-hint{font-size:.65rem;color:#93c5fd;line-height:1.5;margin-top:.5rem}
.connected-box{display:none;background:#14532d;border:2px solid #22c55e;border-radius:.5rem;padding:1rem;text-align:center;margin-top:.75rem}
.connected-box.visible{display:block}
.connected-label{font-size:.7rem;color:#86efac;text-transform:uppercase;letter-spacing:1px}
.connected-user{font-size:1rem;font-weight:700;color:#fff;margin:.3rem 0}
.error-box{display:none;background:#7f1d1d;border:1px solid #ef4444;border-radius:.35rem;padding:.5rem .7rem;margin-top:.5rem;font-size:.75rem;color:#fca5a5}
.error-box.visible{display:block}
.sessions-list{font-size:.75rem}
.session-item{display:flex;justify-content:space-between;align-items:center;padding:.4rem .5rem;background:#0a0e17;border-radius:.3rem;margin-bottom:.3rem}
.session-phone{color:#e5e7eb}
.session-status{font-size:.65rem;padding:.15rem .4rem;border-radius:.2rem;text-transform:uppercase;letter-spacing:.5px}
.session-status.connected{background:#14532d;color:#4ade80}
.session-status.connecting{background:#92400e;color:#fbbf24}
.session-status.saved{background:#1f2937;color:#9ca3af}
.session-status.disconnected{background:#7f1d1d;color:#f87171}
.session-status.reconnecting{background:#92400e;color:#fbbf24}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.info-card{background:#0a0e17;border-radius:.35rem;padding:.5rem .6rem}
.info-label{font-size:.6rem;color:#6b7280;text-transform:uppercase;letter-spacing:.5px}
.info-value{font-size:.85rem;color:#e5e7eb;font-weight:600;margin-top:.15rem}
.terminal-area{flex:1;display:flex;flex-direction:column;overflow:hidden}
.terminal{flex:1;overflow-y:auto;padding:.75rem 1rem;font-size:.8rem;line-height:1.6;scroll-behavior:smooth}
.terminal::-webkit-scrollbar{width:6px}
.terminal::-webkit-scrollbar-track{background:transparent}
.terminal::-webkit-scrollbar-thumb{background:#1f2937;border-radius:3px}
.line{white-space:pre-wrap;word-wrap:break-word;padding:1px 0}
.line.system{color:#6b7280}
.line.error{color:#f87171}
.line.input{color:#60a5fa}
.line.success{color:#4ade80}
.line.warn{color:#fbbf24}
.line.code{color:#c084fc;font-weight:700;font-size:.95rem}
.input-bar{background:#111827;border-top:1px solid #1f2937;padding:.5rem 1rem;display:flex;align-items:center;gap:.75rem;flex-shrink:0}
.prompt{color:#3b82f6;font-weight:700;font-size:.85rem;flex-shrink:0}
.cmd-input{flex:1;background:transparent;border:none;color:#e5e7eb;font-size:.82rem;font-family:inherit;outline:none;caret-color:#3b82f6}
.cmd-input::placeholder{color:#374151}
@media(max-width:768px){
.main{flex-direction:column}
.sidebar{width:100%;max-height:45vh;border-right:none;border-bottom:1px solid #1f2937}
}
</style>
</head>
<body>
<div class="header">
<div class="header-left">
<div class="logo"><span>TOOSII-XD</span> ULTRA</div>
<div class="status-dot" id="statusDot"></div>
<div class="status-text" id="statusText">Offline</div>
</div>
</div>
<div class="main">
<div class="sidebar">
<div class="sidebar-section">
<h3>Connect WhatsApp</h3>
<div class="tab-bar">
<div class="tab active" id="tabPhone" onclick="switchTab('phone')" data-testid="tab-phone">Phone Number</div>
<div class="tab" id="tabSession" onclick="switchTab('session')" data-testid="tab-session">Session ID</div>
</div>
<div id="phoneForm">
<div class="input-group">
<label>WhatsApp Number (with country code)</label>
<input type="text" id="phoneInput" placeholder="e.g. 254748340864" data-testid="input-phone" autocomplete="off" />
</div>
<div style="font-size:.65rem;color:#6b7280;margin-bottom:.5rem">No + or leading 0. Example: 254... (Kenya), 234... (Nigeria)</div>
<button class="submit-btn" id="btnConnect" onclick="connectPhone()" data-testid="button-connect">Get Pairing Code</button>
</div>
<div id="sessionForm" style="display:none">
<div class="input-group">
<label>Paste Session ID</label>
<textarea id="sessionInput" placeholder="Paste base64 or JSON session ID..." data-testid="input-session" rows="3"></textarea>
</div>
<button class="submit-btn" id="btnSession" onclick="connectSession()" data-testid="button-session-connect">Connect with Session ID</button>
</div>
<div class="error-box" id="errorBox"></div>
<div class="pairing-box" id="pairingBox">
<div class="pairing-label">Your Pairing Code</div>
<div class="pairing-code" id="pairingCode" data-testid="text-pairing-code">----</div>
<div class="pairing-hint">Open WhatsApp &gt; Settings &gt; Linked Devices &gt; Link a Device &gt; Link with phone number &gt; Enter the code above</div>
</div>
<div class="connected-box" id="connectedBox">
<div class="connected-label">Connected</div>
<div class="connected-user" id="connectedUser" data-testid="text-connected-user">-</div>
</div>
</div>
<div class="sidebar-section">
<h3>Sessions</h3>
<div class="sessions-list" id="sessionsList" data-testid="sessions-list">Loading...</div>
</div>
<div class="sidebar-section">
<h3>Server Info</h3>
<div class="info-grid">
<div class="info-card"><div class="info-label">Uptime</div><div class="info-value" id="infoUptime">0s</div></div>
<div class="info-card"><div class="info-label">Memory</div><div class="info-value" id="infoMemory">-</div></div>
<div class="info-card"><div class="info-label">Sessions</div><div class="info-value" id="infoSessions">0</div></div>
<div class="info-card"><div class="info-label">Status</div><div class="info-value" id="infoStatus">Starting</div></div>
</div>
</div>
</div>
<div class="terminal-area">
<div class="terminal" id="terminal" data-testid="terminal-output"></div>
<div class="input-bar">
<span class="prompt">&gt;&gt;</span>
<input type="text" class="cmd-input" id="cmdInput" placeholder="Type a command..." data-testid="input-command" autocomplete="off" />
</div>
</div>
</div>
<script>
let ws;
let reconnTimer;
const terminal=document.getElementById('terminal');
const cmdInput=document.getElementById('cmdInput');
function connect(){
const proto=location.protocol==='https:'?'wss:':'ws:';
ws=new WebSocket(proto+'//'+location.host+'/ws');
ws.onopen=()=>{addLine('[SYSTEM] Connected to panel','system');if(reconnTimer){clearTimeout(reconnTimer);reconnTimer=null}};
ws.onmessage=(e)=>{try{const m=JSON.parse(e.data);
if(m.type==='output')addLine(m.data);
else if(m.type==='history'){terminal.innerHTML='';(m.lines||[]).forEach(l=>addLine(l))}
else if(m.type==='status')updateStatus(m);
else if(m.type==='pairing_code'){document.getElementById('pairingBox').className='pairing-box visible';document.getElementById('pairingCode').textContent=m.code;document.getElementById('connectedBox').className='connected-box';document.getElementById('errorBox').className='error-box';document.getElementById('btnConnect').disabled=false;document.getElementById('btnConnect').textContent='Get Pairing Code'}
else if(m.type==='connected'){document.getElementById('connectedBox').className='connected-box visible';document.getElementById('connectedUser').textContent=m.user;document.getElementById('pairingBox').className='pairing-box';document.getElementById('errorBox').className='error-box';updateStatus({running:true,sessions:m.sessions||[]});document.getElementById('btnConnect').disabled=false;document.getElementById('btnConnect').textContent='Get Pairing Code';document.getElementById('btnSession').disabled=false;document.getElementById('btnSession').textContent='Connect with Session ID'}
else if(m.type==='login_error'){document.getElementById('errorBox').className='error-box visible';document.getElementById('errorBox').textContent=m.message;document.getElementById('btnConnect').disabled=false;document.getElementById('btnConnect').textContent='Get Pairing Code';document.getElementById('btnSession').disabled=false;document.getElementById('btnSession').textContent='Connect with Session ID'}
else if(m.type==='login_status'){document.getElementById('errorBox').className='error-box';addLine('[LOGIN] '+m.message,'system')}
else if(m.type==='sessions_update')renderSessions(m.sessions||[]);
else if(m.type==='server_info')updateServerInfo(m);
}catch{}};
ws.onclose=()=>{reconnTimer=setTimeout(connect,2000)};
ws.onerror=()=>{};
}
function addLine(text,cls){
const div=document.createElement('div');div.className='line';
if(cls)div.classList.add(cls);
else if(text.startsWith('[SYSTEM]')||text.startsWith('[LOGIN]'))div.classList.add('system');
else if(text.startsWith('>'))div.classList.add('input');
else if(/error|failed|invalid/i.test(text)&&!/handled/i.test(text))div.classList.add('error');
else if(/PAIRING.CODE/i.test(text))div.classList.add('code');
else if(/success|connected|open/i.test(text))div.classList.add('success');
else if(/warning|warn|deprecated/i.test(text))div.classList.add('warn');
div.textContent=text;terminal.appendChild(div);terminal.scrollTop=terminal.scrollHeight;
}
function updateStatus(s){
const dot=document.getElementById('statusDot');const txt=document.getElementById('statusText');
dot.className='status-dot'+(s.running?' running':'');
txt.textContent=s.running?'Running':'Offline';
if(s.sessions)renderSessions(s.sessions);
}
function renderSessions(sessions){
const el=document.getElementById('sessionsList');
document.getElementById('infoSessions').textContent=sessions.length;
if(!sessions.length){el.innerHTML='<div style="color:#6b7280">No sessions yet</div>';return}
el.innerHTML=sessions.map(s=>'<div class="session-item"><span class="session-phone">'+s.phone+'</span><span class="session-status '+s.status+'">'+s.status+'</span></div>').join('');
}
function updateServerInfo(info){
document.getElementById('infoUptime').textContent=info.uptime||'-';
document.getElementById('infoMemory').textContent=info.memory||'-';
document.getElementById('infoStatus').textContent=info.botStatus||'-';
}
function switchTab(tab){
document.getElementById('tabPhone').className='tab'+(tab==='phone'?' active':'');
document.getElementById('tabSession').className='tab'+(tab==='session'?' active':'');
document.getElementById('phoneForm').style.display=tab==='phone'?'block':'none';
document.getElementById('sessionForm').style.display=tab==='session'?'block':'none';
document.getElementById('errorBox').className='error-box';
}
function connectPhone(){
const phone=document.getElementById('phoneInput').value.trim();
if(!phone){document.getElementById('errorBox').className='error-box visible';document.getElementById('errorBox').textContent='Please enter a phone number';return}
document.getElementById('btnConnect').disabled=true;document.getElementById('btnConnect').textContent='Connecting...';
document.getElementById('errorBox').className='error-box';
document.getElementById('pairingBox').className='pairing-box';
document.getElementById('connectedBox').className='connected-box';
if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type:'phone_login',phone:phone}));
}
function connectSession(){
const sid=document.getElementById('sessionInput').value.trim();
if(!sid){document.getElementById('errorBox').className='error-box visible';document.getElementById('errorBox').textContent='Please paste a session ID';return}
document.getElementById('btnSession').disabled=true;document.getElementById('btnSession').textContent='Connecting...';
document.getElementById('errorBox').className='error-box';
document.getElementById('connectedBox').className='connected-box';
if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type:'session_login',sessionId:sid}));
}
cmdInput.addEventListener('keydown',(e)=>{if(e.key==='Enter'){const cmd=cmdInput.value.trim();if(cmd&&ws&&ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify({type:'command',data:cmd}));cmdInput.value=''}}});
connect();
setInterval(()=>{if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type:'ping'}))},15000);
</script>
</body>
</html>`;

function formatUptime(ms) {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    const d = Math.floor(h / 24)
    if (d > 0) return d + 'd ' + (h % 24) + 'h ' + (m % 60) + 'm'
    if (h > 0) return h + 'h ' + (m % 60) + 'm ' + (s % 60) + 's'
    if (m > 0) return m + 'm ' + (s % 60) + 's'
    return s + 's'
}

const webServer = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'ok', uptime: formatUptime(Date.now() - startTime), sessions: getSessionsList().length }))
        return
    }
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(PANEL_HTML)
})

const wss = new WebSocketServer({ noServer: true })

webServer.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '/', 'http://' + (request.headers.host || 'localhost'))
    if (url.pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => { wss.emit('connection', ws, request) })
    } else {
        socket.destroy()
    }
})

wss.on('connection', (ws) => {
    wsClients.push(ws)
    ws.send(JSON.stringify({ type: 'history', lines: [...logBuffer] }))
    ws.send(JSON.stringify({ type: 'status', running: activeSessions.size > 0, sessions: getSessionsList() }))
    if (currentPairingCode) ws.send(JSON.stringify({ type: 'pairing_code', code: currentPairingCode }))
    if (connectedUser) ws.send(JSON.stringify({ type: 'connected', user: connectedUser, sessions: getSessionsList() }))
    const mem = process.memoryUsage()
    ws.send(JSON.stringify({ type: 'server_info', uptime: formatUptime(Date.now() - startTime), memory: (mem.heapUsed / 1024 / 1024).toFixed(1) + ' MiB', botStatus: activeSessions.size > 0 ? 'Running' : 'Waiting' }))

    ws.on('message', (raw) => {
        try {
            const msg = JSON.parse(raw.toString())
            if (msg.type === 'phone_login' && msg.phone) {
                handlePhoneLogin(msg.phone)
            } else if (msg.type === 'session_login' && msg.sessionId) {
                handleSessionLogin(msg.sessionId)
            } else if (msg.type === 'command' && msg.data) {
                addLog('> ' + msg.data)
            } else if (msg.type === 'ping') {
                const mem = process.memoryUsage()
                ws.send(JSON.stringify({ type: 'server_info', uptime: formatUptime(Date.now() - startTime), memory: (mem.heapUsed / 1024 / 1024).toFixed(1) + ' MiB', botStatus: activeSessions.size > 0 ? 'Running' : 'Waiting' }))
                ws.send(JSON.stringify({ type: 'sessions_update', sessions: getSessionsList() }))
            }
        } catch {}
    })

    ws.on('close', () => {
        const idx = wsClients.indexOf(ws)
        if (idx !== -1) wsClients.splice(idx, 1)
    })
})

webServer.listen(WEB_PORT, '0.0.0.0', () => {
    addLog(`[ ${_bn} ] Web panel running on port ${WEB_PORT}`)
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

function waitForConsoleInput() {
    rl.once('line', async (input) => {
        const cmd = input.trim()
        if (cmd === '1') {
            origLog('')
            origLog(`[ ${_bn} ] Enter your WhatsApp number with country code`)
            origLog(`[ ${_bn} ] Example: 254748340864 (Kenya), 2348012345678 (Nigeria), 12025551234 (US)`)
            origLog(`[ ${_bn} ] Do NOT include + or leading 0`)
            origLog('')
            rl.once('line', async (phoneInput) => {
                const phone = phoneInput.trim().replace(/[^0-9]/g, '')
                if (phone.length < 10 || phone.length > 15) {
                    addLog(`[ ${_bn} ] Invalid number. Must be 10-15 digits with country code.`)
                    waitForConsoleInput()
                    return
                }
                if (phone.startsWith('0')) {
                    addLog(`[ ${_bn} ] Do not start with 0. Use country code instead.`)
                    waitForConsoleInput()
                    return
                }
                addLog(`[ ${_bn} ] Connecting with number: ${phone}...`)
                await connectSession(phone)
                waitForConsoleInput()
            })
        } else if (cmd === '2') {
            origLog('')
            origLog(`[ ${_bn} ] Paste your Session ID below:`)
            origLog('')
            rl.once('line', async (sessionInput) => {
                await handleSessionLogin(sessionInput.trim())
                waitForConsoleInput()
            })
        } else if (cmd === '3') {
            addLog(`[ ${_bn} ] Skipped. Bot is running with existing sessions.`)
            waitForConsoleInput()
        } else if (cmd.length >= 10 && /^[0-9]+$/.test(cmd)) {
            addLog(`[ ${_bn} ] Detected phone number: ${cmd}`)
            addLog(`[ ${_bn} ] Connecting...`)
            await connectSession(cmd)
            waitForConsoleInput()
        } else if (cmd) {
            addLog(`[ ${_bn} ] Unknown command: "${cmd}"`)
            addLog(`[ ${_bn} ] Type 1 for Pairing Code, 2 for Session ID`)
            waitForConsoleInput()
        } else {
            waitForConsoleInput()
        }
    })
}

async function startBot() {
    addLog('')
    addLog('╔══════════════════════════════════════════╗')
    addLog('║         TOOSII-XD ULTRA v2.0.0          ║')
    addLog('║      WhatsApp Multi-Device Bot          ║')
    addLog('║        by Toosii Tech © 2024-2026       ║')
    addLog('╚══════════════════════════════════════════╝')
    addLog('')

    const existingSessions = []
    if (fs.existsSync(SESSIONS_DIR)) {
        const dirs = fs.readdirSync(SESSIONS_DIR).filter(d => {
            const p = path.join(SESSIONS_DIR, d)
            return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'creds.json'))
        })
        existingSessions.push(...dirs)
    }

    if (existingSessions.length > 0) {
        addLog(`[ ${_bn} ] Found ${existingSessions.length} existing session(s): ${existingSessions.join(', ')}`)
        addLog(`[ ${_bn} ] Reconnecting existing sessions...`)
        addLog('')
        for (const phone of existingSessions) {
            connectSession(phone)
        }
        addLog('')
        addLog(`[ ${_bn} ] Choose login method:`)
        addLog(`[ ${_bn} ] 1) Enter WhatsApp Number (Pairing Code)`)
        addLog(`[ ${_bn} ] 2) Paste Session ID`)
        addLog(`[ ${_bn} ] 3) Skip (already connected)`)
        addLog('')
    } else {
        addLog(`[ ${_bn} ] No existing sessions found.`)
        addLog('')
        addLog(`[ ${_bn} ] Choose login method:`)
        addLog(`[ ${_bn} ] 1) Enter WhatsApp Number (Pairing Code)`)
        addLog(`[ ${_bn} ] 2) Paste Session ID`)
        addLog('')
        addLog(`[ ${_bn} ] Or use the web panel at port ${WEB_PORT}`)
        addLog('')
    }

    waitForConsoleInput()
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Connection Bot - Multi-Session

async function connectSession(phone) {
try {
const sessionDir = path.join(SESSIONS_DIR, phone)
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })

activeSessions.set(phone, { socket: null, status: 'connecting', connectedUser: phone })

const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
const X = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: false,
auth: state,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: false,
syncFullHistory: false,
markOnlineOnConnect: true,
browser: ["Ubuntu", "Chrome", "20.0.04"],
msgRetryCounterCache: msgRetryCache,
getMessage: async (key) => {
    if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id)
        return msg?.message || undefined
    }
    return { conversation: '' }
},
});

activeSessions.set(phone, { socket: X, status: 'connecting', connectedUser: phone })

if (X.ws) {
    X.ws.on('error', (err) => {
        console.log(`[${phone}] WebSocket error (handled):`, err.message || err)
    })
}
X.ev.on('CB:error', () => {})

if (!X.authState.creds.registered) {
    console.log(`[${phone}] Waiting for WebSocket handshake...`)
    await new Promise(resolve => setTimeout(resolve, 5000))
    console.log(`[${phone}] Requesting pairing code...`)
    let retries = 0
    const maxRetries = 3
    let paired = false
    while (retries < maxRetries && !paired) {
        try {
            let code = await X.requestPairingCode(phone);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(`[PAIRING_CODE:${code}]`)
            console.log('')
            console.log(`╔══════════════════════════════════════════╗`)
            console.log(`║  PAIRING CODE: ${code}                    ║`)
            console.log(`╚══════════════════════════════════════════╝`)
            console.log('')
            console.log(`[ ${_bn} ] Open WhatsApp > Settings > Linked Devices > Link a Device`)
            console.log(`[ ${_bn} ] Choose "Link with phone number" and enter the code above`)
            console.log('')
            paired = true
        } catch (err) {
            retries++
            console.error(`[${phone}] Pairing attempt ${retries}/${maxRetries} failed:`, err.message || err)
            if (retries < maxRetries) {
                console.log(`[${phone}] Retrying in 3 seconds...`)
                await new Promise(resolve => setTimeout(resolve, 3000))
            }
        }
    }
    if (!paired) {
        console.error(`[${phone}] All pairing attempts failed`)
        activeSessions.delete(phone)
        try { X.end(); } catch(e) {}
        try {
            const sessDir = path.join(SESSIONS_DIR, phone)
            if (fs.existsSync(sessDir)) fs.rmSync(sessDir, { recursive: true, force: true })
        } catch(e) {}
        return
    }
} else {
    console.log(`[${phone}] Reconnecting existing session...`)
}

store.bind(X.ev)

X.ev.on('messages.upsert', async chatUpdate => {
try {
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') {
    if (!mek.key.fromMe) {
        try {
            if (global.autoViewStatus) {
                await X.readMessages([mek.key])
                console.log(`[${phone}] Auto-viewed status from ${mek.key.participant || mek.key.remoteJid}`)
            }
            if (global.autoLikeStatus && global.autoLikeEmoji) {
                await X.sendMessage('status@broadcast', {
                    react: { text: global.autoLikeEmoji, key: mek.key }
                }, { statusJidList: [mek.key.participant || mek.key.remoteJid] })
                console.log(`[${phone}] Auto-liked status from ${mek.key.participant || mek.key.remoteJid} with ${global.autoLikeEmoji}`)
            }
            if (global.autoReplyStatus && global.autoReplyStatusMsg) {
                let statusPoster = mek.key.participant || mek.key.remoteJid
                try {
                    await X.sendMessage(statusPoster, { text: global.autoReplyStatusMsg })
                    console.log(`[${phone}] Auto-replied to status from ${statusPoster}`)
                } catch (arErr) {
                    console.log(`[${phone}] Auto-reply status error:`, arErr.message || arErr)
                }
            }
            if (global.antiStatusMention) {
                try {
                    let msgContent2 = mek.message
                    let mentionedJids = []
                    let ct = Object.keys(msgContent2)[0]
                    if (msgContent2[ct] && msgContent2[ct].contextInfo && msgContent2[ct].contextInfo.mentionedJid) {
                        mentionedJids = msgContent2[ct].contextInfo.mentionedJid
                    }
                    let botJid = X.decodeJid(X.user.id)
                    let mentioner = (mek.key.participant || mek.key.remoteJid).split('@')[0]
                    let ownerJid2 = global.owner[0] + '@s.whatsapp.net'
                    let statusText = ''
                    if (msgContent2[ct]) {
                        statusText = msgContent2[ct].text || msgContent2[ct].caption || ''
                    }
                    if (mentionedJids.includes(botJid)) {
                        await X.sendMessage(ownerJid2, { text: `*Status Mention Alert*\n\n+${mentioner} mentioned you in their status.` })
                        console.log(`[${phone}] Status mention detected from ${mentioner}`)
                    }
                    let groupMentioned = mentionedJids.filter(jid => jid.endsWith('@g.us'))
                    let mentionerJid = mentioner + '@s.whatsapp.net'
                    let asmAction = global.antiStatusMentionAction || 'warn'
                    if (groupMentioned.length > 0) {
                        for (let gJid of groupMentioned) {
                            let groupName = gJid
                            try {
                                let gMeta = await X.groupMetadata(gJid)
                                groupName = gMeta.subject || gJid
                                let isMember = gMeta.participants.some(p => p.id.includes(mentioner))
                                let botIsAdmin2 = gMeta.participants.some(p => {
                                    let pNum = p.id.split('@')[0]
                                    let botNum2 = (X.user.id || '').split(':')[0].split('@')[0]
                                    return (pNum === botNum2 || p.id === X.user.id) && (p.admin === 'admin' || p.admin === 'superadmin')
                                })
                                let isOwnerMention = global.owner.includes(mentioner)
                                if (isMember && botIsAdmin2 && !isOwnerMention) {
                                    if (asmAction === 'kick') {
                                        await X.groupParticipantsUpdate(gJid, [mentionerJid], 'remove')
                                        await X.sendMessage(gJid, { text: `*@${mentioner} has been removed for mentioning this group in their status.*`, mentions: [mentionerJid] })
                                        await X.sendMessage(ownerJid2, { text: `*Anti-Status Action: KICKED*\n+${mentioner} was removed from "${groupName}" for mentioning the group in their status.` })
                                    } else if (asmAction === 'delete') {
                                        await X.sendMessage(gJid, { text: `*Warning: @${mentioner} mentioned this group in their status.*\nTheir messages will be monitored.`, mentions: [mentionerJid] })
                                        await X.sendMessage(ownerJid2, { text: `*Anti-Status Action: ALERT*\n+${mentioner} mentioned "${groupName}" in their status. Warning sent to group.` })
                                    } else {
                                        const warnDbPath2 = path.join(__dirname, 'database', 'warnings.json')
                                        let warnDb2 = {}
                                        try { warnDb2 = JSON.parse(fs.readFileSync(warnDbPath2, 'utf-8')) } catch { warnDb2 = {} }
                                        let gWarns = warnDb2[gJid] || {}
                                        let uWarns = gWarns[mentionerJid] || []
                                        uWarns.push({ reason: 'Mentioned group in WhatsApp status', time: new Date().toISOString(), by: 'bot-auto' })
                                        gWarns[mentionerJid] = uWarns
                                        warnDb2[gJid] = gWarns
                                        fs.writeFileSync(warnDbPath2, JSON.stringify(warnDb2, null, 2))
                                        let wCount = uWarns.length
                                        let maxW = 3
                                        if (wCount >= maxW) {
                                            await X.groupParticipantsUpdate(gJid, [mentionerJid], 'remove')
                                            gWarns[mentionerJid] = []
                                            warnDb2[gJid] = gWarns
                                            fs.writeFileSync(warnDbPath2, JSON.stringify(warnDb2, null, 2))
                                            await X.sendMessage(gJid, { text: `*@${mentioner} reached ${maxW}/${maxW} warnings and has been removed.*\nReason: Mentioning group in status.`, mentions: [mentionerJid] })
                                            await X.sendMessage(ownerJid2, { text: `*Anti-Status Action: WARNED & KICKED*\n+${mentioner} reached max warnings in "${groupName}" and was removed.` })
                                        } else {
                                            await X.sendMessage(gJid, { text: `*Warning ${wCount}/${maxW} for @${mentioner}*\nReason: Mentioning this group in WhatsApp status.\n_${maxW - wCount} more warning(s) before removal._`, mentions: [mentionerJid] })
                                            await X.sendMessage(ownerJid2, { text: `*Anti-Status Action: WARNED*\n+${mentioner} warned (${wCount}/${maxW}) in "${groupName}" for mentioning the group in their status.` })
                                        }
                                    }
                                } else {
                                    await X.sendMessage(ownerJid2, { text: `*Group Mention in Status*\n\n+${mentioner} mentioned "${groupName}" in their status.${!botIsAdmin2 ? '\n_Bot is not admin in this group, no action taken._' : ''}${isOwnerMention ? '\n_Owner is protected, no action taken._' : ''}` })
                                }
                            } catch (gErr) {
                                await X.sendMessage(ownerJid2, { text: `*Group Mention in Status*\n+${mentioner} mentioned a group in their status.\nGroup: ${gJid}` })
                            }
                        }
                        console.log(`[${phone}] Group mention in status from ${mentioner} - action: ${asmAction}`)
                    }
                    let linkMatch2 = statusText.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/g)
                    if (linkMatch2 && linkMatch2.length > 0) {
                        await X.sendMessage(ownerJid2, { text: `*Group Link in Status*\n\n+${mentioner} shared a group link in their status:\n${linkMatch2.map(l => '• https://' + l).join('\n')}` })
                        console.log(`[${phone}] Group link in status from ${mentioner}`)
                    }
                } catch (smErr) {
                    console.log(`[${phone}] Anti-status-mention error:`, smErr.message || smErr)
                }
            }
            if (global.statusToGroup) {
                let statusSender = mek.key.participant || mek.key.remoteJid
                let senderName = statusSender.split('@')[0]
                let msgContent = mek.message
                let contentType = Object.keys(msgContent)[0]
                let targetGroup = global.statusToGroup
                try {
                    if (contentType === 'imageMessage' && msgContent.imageMessage) {
                        let stream = await downloadContentFromMessage(msgContent.imageMessage, 'image')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                        let caption = msgContent.imageMessage.caption || ''
                        await X.sendMessage(targetGroup, { image: buffer, caption: `*Status from +${senderName}*\n${caption}` })
                    } else if (contentType === 'videoMessage' && msgContent.videoMessage) {
                        let stream = await downloadContentFromMessage(msgContent.videoMessage, 'video')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
                        let caption = msgContent.videoMessage.caption || ''
                        await X.sendMessage(targetGroup, { video: buffer, caption: `*Status from +${senderName}*\n${caption}` })
                    } else if (contentType === 'extendedTextMessage' && msgContent.extendedTextMessage) {
                        let statusText = msgContent.extendedTextMessage.text || ''
                        await X.sendMessage(targetGroup, { text: `*Status from +${senderName}*\n\n${statusText}` })
                    } else if (contentType === 'conversation') {
                        await X.sendMessage(targetGroup, { text: `*Status from +${senderName}*\n\n${msgContent.conversation}` })
                    }
                    console.log(`[${phone}] Forwarded status from ${senderName} to group`)
                } catch (fwdErr) {
                    console.log(`[${phone}] Status forward error:`, fwdErr.message || fwdErr)
                }
            }
        } catch (err) {
            console.log(`[${phone}] Auto status action error:`, err.message || err)
        }
    }
    return
}
if (!X.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
let msgId = mek.key.id
if (processedMsgs.has(msgId)) return
processedMsgs.add(msgId)
if (processedMsgs.size > 5000) {
    let iter = processedMsgs.values()
    for (let i = 0; i < 2000; i++) { processedMsgs.delete(iter.next().value) }
}
if (global.autoRead && !mek.key.fromMe) {
    try { await X.readMessages([mek.key]) } catch {}
}
if (global.antiLink && mek.message && !mek.key.fromMe) {
    let chat = mek.key.remoteJid
    if (chat && chat.endsWith('@g.us')) {
        let msgBody = ''
        if (mek.message.conversation) msgBody = mek.message.conversation
        else if (mek.message.extendedTextMessage) msgBody = mek.message.extendedTextMessage.text || ''
        else if (mek.message.imageMessage) msgBody = mek.message.imageMessage.caption || ''
        else if (mek.message.videoMessage) msgBody = mek.message.videoMessage.caption || ''
        let linkRegex = /https?:\/\/[^\s]+|wa\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+/gi
        if (linkRegex.test(msgBody)) {
            let senderJid = mek.key.participant || mek.key.remoteJid
            let ownerNum = global.owner[0] + '@s.whatsapp.net'
            let senderNum = senderJid.replace('@s.whatsapp.net', '').replace('@lid', '').split(':')[0]
            let isOwnr = global.owner.includes(senderNum) || mek.key.fromMe
            if (!isOwnr) {
                try {
                    let groupMeta = await X.groupMetadata(chat)
                    let botId = X.decodeJid(X.user.id)
                    let isBotAdmin = groupMeta.participants.some(p => X.decodeJid(p.id) === botId && (p.admin === 'admin' || p.admin === 'superadmin'))
                    if (isBotAdmin) {
                        await X.sendMessage(chat, { delete: mek.key })
                        await X.sendMessage(chat, { text: `*Anti-Link*\n@${senderNum}, links are not allowed in this group.`, mentions: [senderJid] })
                    }
                } catch {}
            }
        }
    }
}
m = smsg(X, mek, store)
require("./client")(X, m, chatUpdate, store)
} catch (err) {
console.log(err)
}
})

X.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

X.getName = (jid, withoutContact= false) => {
id = X.decodeJid(jid)
withoutContact = X.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = X.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === X.decodeJid(X.user.id) ?
X.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

X.public = true 

X.serializeM = (m) => smsg(X, m, store);
X.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update;
if (connection === "close") {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
if (reason === DisconnectReason.badSession) {
console.log(`[${phone}] Session file corrupted`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'disconnected'
  } else if (reason === DisconnectReason.connectionClosed) {
console.log(`[${phone}] Connection closed, reconnecting...`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'reconnecting'
setTimeout(() => connectSession(phone), 3000);
  } else if (reason === DisconnectReason.connectionLost) {
console.log(`[${phone}] Connection lost, reconnecting...`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'reconnecting'
setTimeout(() => connectSession(phone), 3000);
  } else if (reason === DisconnectReason.connectionReplaced) {
console.log(`[${phone}] Connection replaced`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'disconnected'
  } else if (reason === DisconnectReason.loggedOut) {
console.log(`[${phone}] Device logged out, removing session`);
activeSessions.delete(phone)
try {
    const sessDir = path.join(SESSIONS_DIR, phone)
    if (fs.existsSync(sessDir)) fs.rmSync(sessDir, { recursive: true, force: true })
} catch(e) {}
  } else if (reason === DisconnectReason.restartRequired) {
console.log(`[${phone}] Restart required, reconnecting...`);
connectSession(phone);
  } else if (reason === DisconnectReason.timedOut) {
console.log(`[${phone}] Connection timed out, reconnecting...`);
if (activeSessions.has(phone)) activeSessions.get(phone).status = 'reconnecting'
setTimeout(() => connectSession(phone), 3000);
  } else {
console.log(`[${phone}] Unknown DisconnectReason: ${reason}|${connection}`);
setTimeout(() => connectSession(phone), 5000);
  }
} else if (connection === "open") {
const connUser = X.user?.id?.split(':')[0] || phone
activeSessions.set(phone, { socket: X, status: 'connected', connectedUser: connUser })
try {
X.newsletterFollow('120363299254074394@newsletter')
} catch (e) {}
try {
X.groupAcceptInvite('CwNhH3QNvrVFdcKNgaKg4g')
console.log(`[${phone}] Auto-joined WhatsApp group`)
} catch (e) {
console.log(`[${phone}] Could not auto-join group:`, e.message || e)
}
const connectedJid = X.user.id.replace(/:.*@/, '@')
X.sendMessage(connectedJid, {text: `\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\u2502  *TOOSII-XD ULTRA*\n\u2502  _WhatsApp Multi-Device Bot_\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n\u2705 *Connection Successful!*\n\n\u250F\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2503 *User:* ${connUser}\n\u2503 *Status:* Active & Online\n\u2503 *Bot:* TOOSII-XD ULTRA v2.0\n\u2517\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n\u25B8 Type *.menu* to view all commands\n\u25B8 Type *.help* for quick assistance\n\n\u250F\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2503 *Join Our Community*\n\u2503 https://chat.whatsapp.com/CwNhH3QNvrVFdcKNgaKg4g\n\u2517\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n_Powered by Toosii Tech_\n_wa.me/254748340864_`})
console.log(`[BOT_CONNECTED:${connUser}]`)
console.log(`[${phone}] Connected: ${JSON.stringify(X.user.id)}`);
}
});

X.ev.on('creds.update', saveCreds)

X.sendText = (jid, text, quoted = '', options) => X.sendMessage(jid, { text: text, ...options }, { quoted })

X.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await X.getFile(path, true)
        let {
            res,
            data: file,
            filename: pathFile
        } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                }
            }
            catch (e) {
                if (e.json) throw e.json
            }
        }
        let opt = {
            filename
        }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '',
            mimetype = type.mime,
            convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime))(
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        if (options.asDocument) mtype = 'document'

        delete options.asSticker
        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage

        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: {
                url: pathFile
            },
            mimetype
        }
        let m
        try {
            m = await X.sendMessage(jid, message, {
                ...opt,
                ...options
            })
        }
        catch (e) {
            m = null
        }
        finally {
            if (!m) m = await X.sendMessage(jid, {
                ...message,
                [mtype]: file
            }, {
                ...opt,
                ...options
            })
            file = null
            return m
        }
    }
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Welcome Setting

    X.ev.on('group-participants.update', async (anu) => {
        if (global.welcome){
console.log(anu)
try {
let metadata = await X.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await X.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await X.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
memb = metadata.participants.length
groupwelcome = await getBuffer(ppuser)
groupleft = await getBuffer(ppuser)
                if (anu.action == 'add') {
                const Xbuffer = await getBuffer(ppuser)
                let XName = num
                    const members = metadata.participants.length
                Xbody = `
┏──────────────────────⏣ 
@${XName.split("@")[0]}
┣──────────────────────⏣
┣⛩️•   𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 
┣${metadata.subject}
┣⛩️•   𝗠𝗲𝗺𝗯𝗲𝗿 : 
┣${members}th
└───────────────┈ ⳹`
X.sendMessage(anu.id,
 { text: Xbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": groupwelcome,
"sourceUrl": `${wagc}`}}})
                } else if (anu.action == 'remove') {
                        const Xbuffer = await getBuffer(ppuser)
                        let XName = num
                    const Xmembers = metadata.participants.length
                    Xbody = `
┏──────────────────────⏣ 
┣@${XName.split("@")[0]}
┣──────────────────────⏣
┣⛩️•   𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 
┣${metadata.subject}
┣⛩️•   𝗠𝗲𝗺𝗯𝗲𝗿 : 
┣${members}th
└───────────────┈ ⳹`
X.sendMessage(anu.id,
 { text: Xbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": groupleft,
"sourceUrl": `${wagc}`}}})
}
}
} catch (err) {
console.log(err)
}
}
})
//━━━━━━━━━━━━━━━━━━━━━━━━//
    X.ev.on('group-participants.update', async (anu) => {
        if (global.adminevent){
console.log(anu)
try {
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await X.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await X.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
 if (anu.action == 'promote') {
let XName = num
Xbody = ` 
━━━━━━━━━━━━━━━━━━━━━
         *[ PROMOTE ]*
@${XName.split("@")[0]}, Congratulations! You are now an *Admin*
━━━━━━━━━━━━━━━━━━━━━`
   X.sendMessage(anu.id,
 { text: Xbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": groupwelcome,
"sourceUrl": `${wagc}`}}})
} else if (anu.action == 'demote') {
let XName = num
Xbody = `
━━━━━━━━━━━━━━━━━━━━━
         *[ DEMOTE ]*
@${XName.split("@")[0]}, You have been *demoted* from admin
━━━━━━━━━━━━━━━━━━━━━`
X.sendMessage(anu.id,
 { text: Xbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": groupleft,
"sourceUrl": `${wagc}`}}})
}
}
} catch (err) {
console.log(err)
}
}
})
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Anti-Call Handler
X.ev.on('call', async (callData) => {
    if (!global.antiCall) return
    try {
        let calls = Array.isArray(callData) ? callData : [callData]
        for (let call of calls) {
            if (call.status === 'offer') {
                let callerId = call.from
                await X.rejectCall(call.id, call.from)
                await X.sendMessage(callerId, {
                    text: `*Anti-Call Active*\nCalls are not allowed. Please send a message instead.\n\n_This is an automated response from ${global.botname}_`
                })
                console.log(`[Anti-Call] Rejected call from ${callerId}`)
            }
        }
    } catch (err) {
        console.log('[Anti-Call] Error:', err.message || err)
    }
})
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Anti-Delete Handler
X.ev.on('messages.update', async (updates) => {
    if (!global.antiDelete) return
    try {
        for (let update of updates) {
            if (update.update && (update.update.messageStubType === proto.WebMessageInfo.StubType.REVOKE || update.update.messageStubType === 1)) {
                let chat = update.key.remoteJid
                let senderJid = update.key.participant || update.key.remoteJid
                let senderNum = senderJid.replace('@s.whatsapp.net', '').replace('@lid', '').split(':')[0]
                let ownerJid = global.owner[0] + '@s.whatsapp.net'
                try {
                    let msgStore = store
                    if (msgStore && msgStore.messages && msgStore.messages[chat]) {
                        let msgs = msgStore.messages[chat]
                        let deletedMsg = msgs.array ? msgs.array.find(m => m.key.id === update.key.id) : null
                        if (deletedMsg && deletedMsg.message) {
                            let delType = getContentType(deletedMsg.message)
                            let delBody = deletedMsg.message.conversation || 
                                         (deletedMsg.message.extendedTextMessage && deletedMsg.message.extendedTextMessage.text) ||
                                         (deletedMsg.message.imageMessage && deletedMsg.message.imageMessage.caption) ||
                                         (deletedMsg.message.videoMessage && deletedMsg.message.videoMessage.caption) || ''
                            let notifText = `*Anti-Delete Detected*\n\nFrom: @${senderNum}\nChat: ${chat}\nType: ${delType}\n${delBody ? 'Content: ' + delBody : ''}`
                            await X.sendMessage(ownerJid, { text: notifText, mentions: [senderJid] })
                            if (deletedMsg.message.imageMessage || deletedMsg.message.videoMessage || deletedMsg.message.audioMessage || deletedMsg.message.documentMessage) {
                                try {
                                    await X.sendMessage(ownerJid, { forward: deletedMsg })
                                } catch {}
                            }
                        } else {
                            await X.sendMessage(ownerJid, { text: `*Anti-Delete*\n@${senderNum} deleted a message in ${chat}`, mentions: [senderJid] })
                        }
                    } else {
                        await X.sendMessage(ownerJid, { text: `*Anti-Delete*\n@${senderNum} deleted a message in ${chat}`, mentions: [senderJid] })
                    }
                } catch (e) {
                    console.log('[Anti-Delete] Store error:', e.message || e)
                }
            }
        }
    } catch (err) {
        console.log('[Anti-Delete] Error:', err.message || err)
    }
})
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Auto Bio Handler
let autoBioInterval = null
function startAutoBio() {
    if (autoBioInterval) clearInterval(autoBioInterval)
    autoBioInterval = setInterval(async () => {
        if (!global.autoBio) return
        try {
            let tz = global.botTimezone || 'Africa/Nairobi'
            let timeStr = moment().tz(tz).format('HH:mm:ss')
            let dateStr = moment().tz(tz).format('DD/MM/YYYY')
            await X.updateProfileStatus(`${global.botname} | ${timeStr} | ${dateStr}`)
        } catch (err) {
            console.log('[Auto-Bio] Error:', err.message || err)
        }
    }, 60000)
}
startAutoBio()
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Message Types
X.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
let trueFileName = attachExtension ? ('./tmp/' + filename + '.' + type.ext) : './tmp/' + filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

X.sendStickerFromUrl = async(from, PATH, quoted, options = {}) => {
let { writeExif } = require('./tmp')
let types = await X.getFile(PATH, true)
let { filename, size, ext, mime, data } = types
let type = '', mimetype = mime, pathFile = filename
if (/webp/.test(mime) || (/image/.test(mime) && options.asSticker)) type = 'sticker'
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else type = 'document'
let msg = await X.sendMessage(from, { [type]: { url: pathFile }, mimetype, ...options }, { quoted })
return msg
}

X.sendImageAsStickerAV = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
    buffer = await writeExifImgAV(buff, options)
} else {
    buffer = await imageToWebp(buff)
}
await X.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

X.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message.msg || message, messageType)
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

X.getFile = async (PATH, save) => {
    let res
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (data = fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
    let type = await FileType.fromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
    }
    let filename = path.join(__dirname, 'tmp', new Date * 1 + '.' + type.ext)
    if (data && save) fs.promises.writeFile(filename, data)
    return {
        res,
        filename,
        size: await (data).length,
        ...type,
        data
    }
}

} catch (err) {
    console.error(`[connectSession] Error:`, err)
}
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Message Serializer
function smsg(X, m, store) {
if (!m) return m
let M = proto.WebMessageInfo
if (m.key) {
m.id = m.key.id
m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
m.chat = m.key.remoteJid
m.fromMe = m.key.fromMe
m.isGroup = m.chat.endsWith('@g.us')
m.sender = X.decodeJid(m.fromMe && X.user.id || m.participant || m.key.participant || m.chat || '')
if (m.isGroup) m.participant = X.decodeJid(m.key.participant) || ''
}
if (m.message) {
m.mtype = getContentType(m.message)
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
if (m.quoted) {
let type = getContentType(quoted)
m.quoted = m.quoted[type]
if (['productMessage'].includes(type)) {
type = getContentType(m.quoted)
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
}
m.quoted.mtype = type
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
m.quoted.sender = X.decodeJid(m.msg.contextInfo.participant)
m.quoted.fromMe = m.quoted.sender === (X.user && X.user.id)
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false
let q = await store.loadMessage(m.chat, m.quoted.id, X)
return exports.smsg(X, q, store)
}
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGroup ? { participant: m.quoted.sender } : {})
})
m.quoted.delete = () => X.sendMessage(m.quoted.chat, { delete: vM.key })
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => X.copyNForward(jid, vM, forceForward, options)
m.quoted.download = () => X.downloadMediaMessage(m.quoted)
}
}
if (m.msg.url) m.download = () => X.downloadMediaMessage(m.msg)
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
m.reply = (text, chatId = m.chat, options = {}) => X.sendMessage(chatId, { text: text, ...options }, { quoted: m, ...options })
m.copy = () => exports.smsg(X, M.fromObject(M.toObject(m)))
return m
}

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Start the bot
startBot()
