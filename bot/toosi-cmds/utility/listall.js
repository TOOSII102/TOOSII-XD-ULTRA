'use strict';

const { resolveDisplayWithName } = require('../../lib/groupUtils');
const { getBotName } = require('../../lib/botname');

module.exports = {
    name:        'listall',
    aliases:     ['memberlist', 'listmembers', 'members', 'la'],
    description: 'List all members in the group with their names — .listall',
    category:    'group',

    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        try { await sock.sendMessage(chatId, { react: { text: '📋', key: msg.key } }); } catch {}

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  📋 MEMBER LIST 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═╝`
            }, { quoted: msg });
        }

        try {
            const meta         = await sock.groupMetadata(chatId);
            const participants = meta.participants;
            const total        = participants.length;
            const adminCount   = participants.filter(p => p.admin).length;

            // Resolve all members in parallel
            const resolved = await Promise.all(
                participants.map(async (p, i) => {
                    const display = await resolveDisplayWithName(sock, chatId, p.id || '', p.notify || null)
                        .catch(() => (p.id || '').split('@')[0].split(':')[0] || 'Unknown');
                    const badge = p.admin === 'superadmin' ? '👑' : p.admin === 'admin' ? '⭐' : '👤';
                    return { i: i + 1, badge, display };
                })
            );

            // Sort: superadmin → admin → members, then by display string
            resolved.sort((a, b) => {
                const rank = m => m.badge === '👑' ? 0 : m.badge === '⭐' ? 1 : 2;
                return rank(a) - rank(b) || a.display.localeCompare(b.display);
            });

            // Re-number after sort
            resolved.forEach((r, i) => { r.i = i + 1; });

            // Build lines
            const header = [
                `╔═|〔  📋 MEMBER LIST 〕`,
                `║`,
                `║ ▸ *Group*   : ${meta.subject}`,
                `║ ▸ *Members* : ${total}  (👑⭐ Admins: ${adminCount})`,
                `║`,
            ];

            const memberLines = resolved.map(r =>
                `║  ${r.i.toString().padStart(3, ' ')}. ${r.badge} ${r.display}`
            );

            const footer = [
                `║`,
                `║ 👑 = Owner  ⭐ = Admin  👤 = Member`,
                `║`,
                `╚═╝`,
            ];

            const allLines = [...header, ...memberLines, ...footer];
            const fullText = allLines.join('\n');

            // Split into chunks of ~3800 chars for large groups
            if (fullText.length <= 4000) {
                return sock.sendMessage(chatId, { text: fullText }, { quoted: msg });
            }

            // Chunked send
            const CHUNK = 3600;
            let   chunk = header.join('\n') + '\n';
            let   part  = 1;
            let   first = true;

            for (const line of memberLines) {
                if ((chunk + line + '\n').length > CHUNK) {
                    await sock.sendMessage(chatId, { text: chunk.trim() }, first ? { quoted: msg } : {});
                    first = false;
                    chunk = `╔═|〔  📋 MEMBER LIST — part ${++part} 〕\n║\n`;
                    await new Promise(r => setTimeout(r, 700));
                }
                chunk += line + '\n';
            }

            // Last chunk + footer
            chunk += footer.join('\n');
            await sock.sendMessage(chatId, { text: chunk.trim() }, first ? { quoted: msg } : {});

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  📋 MEMBER LIST 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝`
            }, { quoted: msg });
        }
    }
};
