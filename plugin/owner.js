/**
 * plugins/owner.js
 * Owner-only commands: broadcast, restart
 */

const broadcast = {
    name: ['broadcast', 'bc'],
    description: 'Broadcast a message to all chats',
    category: 'Owner',
    ownerOnly: true,
    async handler({ sock, query, reply }) {
        if (!query) return reply('⚠️ Usage: .broadcast <message>');

        const chats = await sock.groupFetchAllParticipating();
        const jids  = Object.keys(chats);

        let sent = 0;
        for (const jid of jids) {
            try {
                await sock.sendMessage(jid, {
                    text: `📢 *Broadcast Message*\n\n${query}`,
                });
                sent++;
            } catch {}
            await new Promise(r => setTimeout(r, 500));
        }
        await reply(`✅ Broadcast sent to *${sent}* group(s).`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const restart = {
    name: ['restart', 'reboot'],
    description: 'Restart the bot',
    category: 'Owner',
    ownerOnly: true,
    async handler({ reply }) {
        await reply('♻️ Restarting bot...');
        setTimeout(() => process.exit(0), 1500);   // process manager (pm2 / forever) will restart it
    },
};

// ─────────────────────────────────────────────────────────────────────────────

module.exports = [broadcast, restart];
