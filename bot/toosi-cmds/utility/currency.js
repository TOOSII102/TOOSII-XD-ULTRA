'use strict';

const { getBotName } = require('../../lib/botname');

const POPULAR = ['usd','kes','eur','gbp','ngn','zar','inr','cny','jpy','cad','aud','aed','brl','mxn','egp','ghs','tzs','ugx','rwf','etb'];

const SYMBOLS = {
    usd:'$', eur:'€', gbp:'£', jpy:'¥', cny:'¥', inr:'₹', kes:'KSh',
    ngn:'₦', zar:'R', cad:'CA$', aud:'A$', aed:'د.إ', brl:'R$', mxn:'MX$',
    egp:'E£', ghs:'₵', tzs:'TSh', ugx:'USh', rwf:'Fr', etb:'Br'
};

async function getRates(base) {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`Rate API HTTP ${res.status}`);
    const data = await res.json();
    if (!data[base]) throw new Error('Invalid base currency');
    return data[base];
}

function fmt(n) {
    if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (n >= 1)    return n.toFixed(4).replace(/\.?0+$/, '');
    return n.toFixed(6).replace(/\.?0+$/, '');
}

module.exports = [
    {
        name: 'currency',
        aliases: ['forex', 'convert', 'exchange', 'fx', 'rate'],
        description: 'Convert between currencies — .currency <amount> <from> <to>',
        category: 'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            try { await sock.sendMessage(chatId, { react: { text: '💱', key: msg.key } }); } catch {}

            const USAGE = `╔═|〔  CURRENCY 💱 〕\n║\n║ ▸ *Usage*   : ${prefix}currency <amount> <from> <to>\n║ ▸ *Example* : ${prefix}currency 100 USD KES\n║ ▸ *Example* : ${prefix}currency 50 EUR GBP\n║\n╚═╝`;

            const amount = parseFloat(args[0]);
            if (!args[0] || isNaN(amount) || amount <= 0) return sock.sendMessage(chatId, { text: USAGE }, { quoted: msg });

            const from = (args[1] || '').toLowerCase();
            const to   = (args[2] || '').toLowerCase();
            if (!from || !to) return sock.sendMessage(chatId, { text: USAGE }, { quoted: msg });

            try {
                const rates = await getRates(from);
                const rate  = rates[to];
                if (!rate) throw new Error(`Unknown currency: ${to.toUpperCase()}`);

                const result   = amount * rate;
                const fromSym  = SYMBOLS[from] || from.toUpperCase();
                const toSym    = SYMBOLS[to]   || to.toUpperCase();

                await sock.sendMessage(chatId, {
                    text: [
                        `╔═|〔  CURRENCY 💱 〕`,
                        `║`,
                        `║ ▸ *From*   : ${fromSym} ${fmt(amount)} ${from.toUpperCase()}`,
                        `║ ▸ *To*     : ${toSym} ${fmt(result)} ${to.toUpperCase()}`,
                        `║ ▸ *Rate*   : 1 ${from.toUpperCase()} = ${fmt(rate)} ${to.toUpperCase()}`,
                        `║ ▸ *Source* : Fawazahmed0 (live)`,
                        `║`,
                        `╚═╝`,
                    ].join('\n')
                }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  CURRENCY 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
                }, { quoted: msg });
            }
        }
    },

    {
        name: 'rates',
        aliases: ['usdrates', 'forexrates', 'currencyrates', 'fxrates'],
        description: 'Show popular currency rates vs USD',
        category: 'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const base   = (args[0] || 'usd').toLowerCase();
            try { await sock.sendMessage(chatId, { react: { text: '📊', key: msg.key } }); } catch {}

            try {
                const allRates = await getRates(base);
                const lines = POPULAR
                    .filter(c => c !== base && allRates[c])
                    .map(c => {
                        const sym = SYMBOLS[c] || c.toUpperCase();
                        return `║ ▸ 1 ${base.toUpperCase()} = *${fmt(allRates[c])}* ${c.toUpperCase()} (${sym})`;
                    });

                await sock.sendMessage(chatId, {
                    text: [`╔═|〔  FOREX RATES 📊 〕`, `║`, `║ ▸ *Base* : ${base.toUpperCase()}`, `║`, ...lines, `║`, `╚═╝`].join('\n')
                }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  FOREX RATES 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
                }, { quoted: msg });
            }
        }
    }
];
