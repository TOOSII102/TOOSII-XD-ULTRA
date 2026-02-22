import { spawn, ChildProcess } from "child_process";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const PORT = parseInt(process.env.PORT || "5000", 10);
const BOT_DIR = path.join(process.cwd(), "bot");

let botProcess: ChildProcess | null = null;
let botRunning = false;
const logBuffer: string[] = [];
const MAX_LOG_LINES = 500;
const clients: WebSocket[] = [];

function broadcast(data: object) {
  const msg = JSON.stringify(data);
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}

function addLog(text: string) {
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.trim()) {
      logBuffer.push(line);
      if (logBuffer.length > MAX_LOG_LINES) logBuffer.shift();
      broadcast({ type: "output", data: line });
    }
  }
}

function startBot() {
  if (botProcess && botRunning) return;

  logBuffer.length = 0;
  addLog("[SYSTEM] Starting bot...");
  broadcast({ type: "status", running: true });

  botProcess = spawn("node", ["index.js"], {
    cwd: BOT_DIR,
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env },
  });

  botRunning = true;

  botProcess.stdout?.on("data", (data: Buffer) => {
    addLog(data.toString("utf-8"));
  });

  botProcess.stderr?.on("data", (data: Buffer) => {
    addLog(data.toString("utf-8"));
  });

  botProcess.on("error", (err) => {
    addLog(`[SYSTEM] Bot error: ${err.message}`);
    botRunning = false;
    broadcast({ type: "status", running: false });
  });

  botProcess.on("exit", (code) => {
    addLog(`[SYSTEM] Bot process exited with code ${code}`);
    botRunning = false;
    botProcess = null;
    broadcast({ type: "status", running: false });
  });
}

function stopBot() {
  if (!botProcess) return;
  addLog("[SYSTEM] Stopping bot...");
  botProcess.kill("SIGTERM");
  setTimeout(() => {
    if (botProcess) {
      botProcess.kill("SIGKILL");
      botProcess = null;
      botRunning = false;
    }
  }, 5000);
}

function restartBot() {
  addLog("[SYSTEM] Restarting bot...");
  if (botProcess) {
    botProcess.on("exit", () => {
      setTimeout(startBot, 500);
    });
    stopBot();
  } else {
    startBot();
  }
}

function sendInput(text: string) {
  if (botProcess && botProcess.stdin && botRunning) {
    botProcess.stdin.write(text + "\n");
    addLog(`> ${text}`);
  }
}

const TERMINAL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TOOSII-XD ULTRA - Console</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'SF Mono','Fira Code','Cascadia Code',Consolas,monospace;background:#0a0e17;color:#c5cdd9;height:100vh;display:flex;flex-direction:column;overflow:hidden}
.header{background:#111827;border-bottom:1px solid #1f2937;padding:0 1rem;display:flex;align-items:center;justify-content:space-between;height:48px;flex-shrink:0}
.header-left{display:flex;align-items:center;gap:.75rem}
.logo{font-size:.9rem;font-weight:700;color:#fff;letter-spacing:.5px}
.logo span{color:#3b82f6}
.status-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;transition:background .3s}
.status-dot.running{background:#22c55e;box-shadow:0 0 8px #22c55e60}
.status-text{font-size:.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:1px}
.controls{display:flex;gap:.5rem}
.btn{padding:.4rem 1rem;border:1px solid #374151;border-radius:.35rem;background:#1f2937;color:#d1d5db;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .15s;font-family:inherit;text-transform:uppercase;letter-spacing:.5px}
.btn:hover{background:#374151;color:#fff}
.btn:active{transform:scale(.97)}
.btn-start{border-color:#166534;color:#4ade80}
.btn-start:hover{background:#166534;color:#fff}
.btn-restart{border-color:#92400e;color:#fbbf24}
.btn-restart:hover{background:#92400e;color:#fff}
.btn-stop{border-color:#991b1b;color:#f87171}
.btn-stop:hover{background:#991b1b;color:#fff}
.terminal{flex:1;overflow-y:auto;padding:.75rem 1rem;font-size:.82rem;line-height:1.65;background:#0a0e17;scroll-behavior:smooth}
.terminal::-webkit-scrollbar{width:6px}
.terminal::-webkit-scrollbar-track{background:transparent}
.terminal::-webkit-scrollbar-thumb{background:#1f2937;border-radius:3px}
.terminal::-webkit-scrollbar-thumb:hover{background:#374151}
.line{white-space:pre-wrap;word-wrap:break-word;padding:1px 0}
.line.system{color:#6b7280}
.line.error{color:#f87171}
.line.input{color:#60a5fa}
.line.success{color:#4ade80}
.line.warn{color:#fbbf24}
.line.code{color:#c084fc;font-weight:700;font-size:.95rem}
.input-bar{background:#111827;border-top:1px solid #1f2937;padding:.5rem 1rem;display:flex;align-items:center;gap:.75rem;flex-shrink:0}
.prompt{color:#3b82f6;font-weight:700;font-size:.85rem;flex-shrink:0}
.cmd-input{flex:1;background:transparent;border:none;color:#e5e7eb;font-size:.85rem;font-family:inherit;outline:none;caret-color:#3b82f6}
.cmd-input::placeholder{color:#374151}
.cmd-input:disabled{opacity:.5}
.send-btn{background:#1f2937;border:1px solid #374151;border-radius:.3rem;padding:.35rem .75rem;color:#9ca3af;font-size:.75rem;cursor:pointer;font-family:inherit;transition:all .15s}
.send-btn:hover{background:#374151;color:#fff}
@media(max-width:600px){.header{padding:0 .5rem}.btn{padding:.35rem .6rem;font-size:.65rem}.terminal{padding:.5rem}.input-bar{padding:.4rem .5rem}}
</style>
</head>
<body>
<div class="header">
<div class="header-left">
<div class="logo"><span>TOOSII-XD</span> ULTRA</div>
<div class="status-dot" id="statusDot"></div>
<div class="status-text" id="statusText">Offline</div>
</div>
<div class="controls">
<button class="btn btn-start" id="btnStart" onclick="sendAction('start')" data-testid="button-start">Start</button>
<button class="btn btn-restart" id="btnRestart" onclick="sendAction('restart')" data-testid="button-restart">Restart</button>
<button class="btn btn-stop" id="btnStop" onclick="sendAction('stop')" data-testid="button-stop">Stop</button>
</div>
</div>
<div class="terminal" id="terminal" data-testid="terminal-output">
<div class="line system">[SYSTEM] Welcome to TOOSII-XD ULTRA Console</div>
<div class="line system">[SYSTEM] Click "Start" to launch the bot</div>
</div>
<div class="input-bar">
<span class="prompt">&gt;&gt;</span>
<input type="text" class="cmd-input" id="cmdInput" placeholder="Type a command..." data-testid="input-command" autocomplete="off" />
<button class="send-btn" onclick="sendCommand()" data-testid="button-send">Send</button>
</div>
<script>
let ws;
let reconnectTimer;
const terminal = document.getElementById('terminal');
const cmdInput = document.getElementById('cmdInput');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

function connect() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(proto + '//' + location.host + '/ws');

  ws.onopen = () => {
    addLine('[SYSTEM] Connected to server', 'system');
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  };

  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === 'output') {
        addLine(msg.data);
      } else if (msg.type === 'history') {
        terminal.innerHTML = '';
        (msg.lines || []).forEach(l => addLine(l));
      } else if (msg.type === 'status') {
        updateStatus(msg.running);
      }
    } catch {}
  };

  ws.onclose = () => {
    updateStatus(false);
    reconnectTimer = setTimeout(connect, 2000);
  };

  ws.onerror = () => {};
}

function addLine(text, cls) {
  const div = document.createElement('div');
  div.className = 'line';
  if (cls) div.classList.add(cls);
  else if (text.startsWith('[SYSTEM]')) div.classList.add('system');
  else if (text.startsWith('>')) div.classList.add('input');
  else if (/error|failed|invalid/i.test(text)) div.classList.add('error');
  else if (/PAIRING CODE:|Connected:/i.test(text)) div.classList.add('code');
  else if (/success|connected|reconnect/i.test(text)) div.classList.add('success');
  else if (/warning|warn|deprecated/i.test(text)) div.classList.add('warn');
  div.textContent = text;
  terminal.appendChild(div);
  terminal.scrollTop = terminal.scrollHeight;
}

function updateStatus(running) {
  statusDot.className = 'status-dot' + (running ? ' running' : '');
  statusText.textContent = running ? 'Running' : 'Offline';
  cmdInput.disabled = !running;
}

function sendCommand() {
  const cmd = cmdInput.value.trim();
  if (!cmd || !ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'input', data: cmd }));
  cmdInput.value = '';
}

function sendAction(action) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'action', action }));
}

cmdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendCommand();
});

connect();
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(TERMINAL_HTML);
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  if (url.pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on("connection", (ws) => {
  clients.push(ws);

  ws.send(JSON.stringify({ type: "history", lines: [...logBuffer] }));
  ws.send(JSON.stringify({ type: "status", running: botRunning }));

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === "input" && msg.data) {
        sendInput(msg.data);
      } else if (msg.type === "action") {
        if (msg.action === "start") startBot();
        else if (msg.action === "stop") stopBot();
        else if (msg.action === "restart") restartBot();
      }
    } catch {}
  });

  ws.on("close", () => {
    const idx = clients.indexOf(ws);
    if (idx !== -1) clients.splice(idx, 1);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`TOOSII-XD ULTRA console running on port ${PORT}`);
});

process.on("SIGINT", () => {
  if (botProcess) botProcess.kill("SIGINT");
  process.exit(0);
});
process.on("SIGTERM", () => {
  if (botProcess) botProcess.kill("SIGTERM");
  process.exit(0);
});
