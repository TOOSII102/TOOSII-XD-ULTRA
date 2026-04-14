'use strict';

const { getBotName } = require('../../lib/botname');

// ── Unicode font map ──────────────────────────────────────────────────────────
const NORMAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const MAPS = {
    bold: {
        label: 'Bold',
        map: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗',
    },
    italic: {
        label: 'Italic',
        map: '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789',
    },
    bolditalic: {
        label: 'Bold Italic',
        map: '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛0123456789',
    },
    script: {
        label: 'Script',
        map: '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789',
    },
    fraktur: {
        label: 'Fraktur',
        map: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789',
    },
    double: {
        label: 'Double-struck',
        map: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
    },
    monospace: {
        label: 'Monospace',
        map: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
    },
    sans: {
        label: 'Sans-serif',
        map: '𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫',
    },
    sansbold: {
        label: 'Sans Bold',
        map: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵',
    },
    circle: {
        label: 'Circled',
        map: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨',
    },
    square: {
        label: 'Squared',
        map: '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789',
    },
    fullwidth: {
        label: 'Full Width',
        map: 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９',
    },
    flip: {
        label: 'Flipped',
        map: 'ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎzɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎz0123456789',
        upper: 'ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎz',
    },
};

// Build char lookup for each map
const FONT_TABLES = {};
for (const [key, { map }] of Object.entries(MAPS)) {
    FONT_TABLES[key] = {};
    const chars = [...map]; // split by unicode codepoints
    [...NORMAL].forEach((c, i) => {
        if (chars[i]) FONT_TABLES[key][c] = chars[i];
    });
}

function convert(text, fontKey) {
    const table = FONT_TABLES[fontKey] || {};
    return [...text].map(c => table[c] || c).join('');
}

const STYLE_NAMES = Object.keys(MAPS);

module.exports = [
    {
        name: 'font',
        aliases: ['fonts', 'textfont', 'stylefont', 'fancyfont', 'fontstyle'],
        description: 'Convert text to a fancy Unicode font — .font <style> <text>',
        category: 'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();

            const style = (args[0] || '').toLowerCase();
            const text  = args.slice(1).join(' ').trim();

            if (!style || !MAPS[style] || !text) {
                const preview = STYLE_NAMES.map(s => `║ ▸ *${s}* — ${convert('Hello', s)}`).join('\n');
                return sock.sendMessage(chatId, {
                    text: [
                        `╔═|〔  FONT STYLES ✍️ 〕`,
                        `║`,
                        preview,
                        `║`,
                        `║ 💡 *Usage* : ${prefix}font <style> <text>`,
                        `║ 💡 *Example*: ${prefix}font bold Hello World`,
                        `║`,
                        `╚═|〔 ${name} 〕`,
                    ].join('\n')
                }, { quoted: msg });
            }

            const output = convert(text, style);
            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  FONT — ${MAPS[style].label} ✍️ 〕`,
                    `║`,
                    `║ ${output}`,
                    `║`,
                    `╚═|〔 ${name} 〕`,
                ].join('\n')
            }, { quoted: msg });
        }
    },

    {
        name: 'allfont',
        aliases: ['allfonts', 'fontall', 'showfonts', 'fontpreview'],
        description: 'Show text in all font styles at once — .allfont <text>',
        category: 'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const text   = args.join(' ').trim() || 'Hello';

            const lines = STYLE_NAMES.map(s => `║ *${MAPS[s].label}*\n║ ${convert(text, s)}`).join('\n║\n');

            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  ALL FONTS ✍️ 〕`,
                    `║`,
                    `║ Text: *${text}*`,
                    `║`,
                    lines,
                    `║`,
                    `╚═|〔 ${name} 〕`,
                ].join('\n')
            }, { quoted: msg });
        }
    },

    {
        name: 'reverse',
        aliases: ['reversetext', 'flip text', 'textreverse', 'backwards'],
        description: 'Reverse any text — .reverse <text>',
        category: 'utility',
        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const text   = args.join(' ').trim();
            if (!text) return sock.sendMessage(chatId, {
                text: `╔═|〔  REVERSE ↩️ 〕\n║\n║ ▸ *Usage* : ${prefix}reverse <text>\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });

            const reversed = [...text].reverse().join('');
            await sock.sendMessage(chatId, {
                text: `╔═|〔  REVERSE ↩️ 〕\n║\n║ *Input*  : ${text}\n║ *Output* : ${reversed}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    },
];
