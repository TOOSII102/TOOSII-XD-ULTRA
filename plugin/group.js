/**
 * plugins/group.js
 * Group management: kick, add, promote, demote, mute, unmute, tagall, groupinfo
 */

// ── helpers ──────────────────────────────────────────────────────────────────

/** Extract JID from @mention or plain number in message */
function mentionedJids(msg) {
    const m = msg.message?.extendedTextMessage || msg.message?.conversation;
    if (typeof m === 'object') {
        return m?.contextInfo?.mentionedJid || [];
    }
    return [];
}

function numToJid(num) {
    const clean = num.replace(/[^0-9]/g, '');
    return clean.includes('@') ? clean : `${clean}@s.whatsapp.net`;
}

// ─────────────────────────────────────────────────────────────────────────────

const kick = {
    name: ['kick', 'remove'],
    description: 'Remove a member from the group',
    category: 'Group',
    async handler({ sock, jid, isGroup, msg, args, reply, isOwner }) {
        if (!isGroup) return reply('⚠️ This command only works in groups.');

        const meta  = await sock.groupMetadata(jid);
        const botId = sock.user.id.replace(/:.*@/, '@s.whatsapp.net');
        const isAdmin = meta.participants.find(p => p.id === botId)?.admin;
        if (!isAdmin) return reply('⚠️ I need to be an *admin* to kick members.');

        const targets = mentionedJids(msg);
        if (!targets.length && args[0]) targets.push(numToJid(args[0]));
        if (!targets.length) return reply('⚠️ Please @mention or provide the number to kick.');

        await sock.groupParticipantsUpdate(jid, targets, 'remove');
        await reply(`✅ Kicked ${targets.length} member(s).`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const add = {
    name: ['add'],
    description: 'Add a member to the group',
    category: 'Group',
    async handler({ sock, jid, isGroup, args, reply }) {
        if (!isGroup) return reply('⚠️ This command only works in groups.');
        if (!args[0]) return reply('⚠️ Usage: .add <number>');

        const target = numToJid(args[0]);
        const result = await sock.groupParticipantsUpdate(jid, [target], 'add');
        const status = result?.[0]?.status;
        if (status === '200') return reply(`✅ Added *${args[0]}* to the group.`);
        if (status === '403') return reply(`❌ *${args[0]}* has privacy settings that prevent being added.`);
        if (status === '408') return reply(`❌ *${args[0]}* is not on WhatsApp.`);
        return reply(`ℹ️ Done. Status code: ${status}`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const promote = {
    name: ['promote'],
    description: 'Promote a member to admin',
    category: 'Group',
    async handler({ sock, jid, isGroup, msg, args, reply }) {
        if (!isGroup) return reply('⚠️ This command only works in groups.');

        const targets = mentionedJids(msg);
        if (!targets.length && args[0]) targets.push(numToJid(args[0]));
        if (!targets.length) return reply('⚠️ Please @mention or provide the number to promote.');

        await sock.groupParticipantsUpdate(jid, targets, 'promote');
        await reply(`✅ Promoted ${targets.length} member(s) to admin.`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const demote = {
    name: ['demote'],
    description: 'Remove admin from a member',
    category: 'Group',
    async handler({ sock, jid, isGroup, msg, args, reply }) {
        if (!isGroup) return reply('⚠️ This command only works in groups.');

        const targets = mentionedJids(msg);
        if (!targets.length && args[0]) targets.push(numToJid(args[0]));
        if (!targets.length) return reply('⚠️ Please @mention or provide the number to demote.');

        await sock.groupParticipantsUpdate(jid, targets, 'demote');
        await reply(`✅ Demoted ${targets.length} member(s).`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const mute = {
    name: ['mute', 'lock'],
    description: 'Mute group (admins only can chat)',
    category: 'Group',
    async handler({ sock, jid, isGroup, reply }) {
        if (!isGroup) return reply('⚠️ This command only works in groups.');
        await sock.groupSettingUpdate(jid, 'announcement');
        await reply('🔇 Group has been *muted*. Only admins can send messages.');
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const unmute = {
    name: ['unmute', 'unlock', 'open'],
    description: 'Unmute group (everyone can chat)',
    category: 'Group',
    async handler({ sock, jid, isGroup, reply }) {
        if (!isGroup) return reply('⚠️ This command only works in groups.');
        await sock.groupSettingUpdate(jid, 'not_announcement');
        await reply('🔊 Group has been *unmuted*. Everyone can send messages.');
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const tagall = {
    name: ['tagall', 'everyone', '@all'],
    description: 'Tag all group members',
    category: 'Group',
    async handler({ sock, jid, isGroup, reply, query }) {
        if (!isGroup) return reply('⚠️ This command only works in groups.');

        const meta    = await sock.groupMetadata(jid);
        const members = meta.participants.map(p => p.id);
        const text    = (query ? `📢 *${query}*\n\n` : '📢 *Tagging everyone:*\n\n') +
                        members.map(id => `@${id.split('@')[0]}`).join(' ');

        await sock.sendMessage(jid, { text, mentions: members });
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const groupinfo = {
    name: ['groupinfo', 'ginfo', 'gcinfo'],
    description: 'Show group information',
    category: 'Group',
    async handler({ sock, jid, isGroup, reply }) {
        if (!isGroup) return reply('⚠️ This command only works in groups.');

        const meta    = await sock.groupMetadata(jid);
        const admins  = meta.participants.filter(p => p.admin).map(p => `+${p.id.split('@')[0]}`).join(', ');
        const created = new Date(meta.creation * 1000).toLocaleDateString();

        const text =
            `╔══════════════════════════════╗\n` +
            `║   📋 *Group Information*\n` +
            `╚══════════════════════════════╝\n\n` +
            `📌 *Name:* ${meta.subject}\n` +
            `🆔 *ID:* ${jid}\n` +
            `👥 *Members:* ${meta.participants.length}\n` +
            `👑 *Admins:* ${admins || 'None'}\n` +
            `📅 *Created:* ${created}\n` +
            (meta.desc ? `\n📝 *Description:*\n${meta.desc}` : '');
        await reply(text);
    },
};

// ─────────────────────────────────────────────────────────────────────────────

module.exports = [kick, add, promote, demote, mute, unmute, tagall, groupinfo];
