//═════════════════════════════════//

/*
🔗 TOOSII-XD ULTRA Bot System
by Toosii Tech • 2024 - 2026

Simple In-Memory Store for WhatsApp Bot
*/

//═════════════════════════════════//

const { proto } = require('gifted-baileys')

function makeInMemoryStore(config = {}) {
    const logger = config.logger || console
    
    const store = {
        chats: new Map(),
        messages: new Map(),
        contacts: new Map(),
        groupMetadata: new Map(),
        presences: new Map(),
        
        bind: (ev) => {
            // Bind events to store
            ev.on('messaging-history.set', ({ chats, contacts, messages, isLatest }) => {
                if (chats) {
                    chats.forEach(chat => {
                        store.chats.set(chat.id, chat)
                    })
                }
                if (contacts) {
                    contacts.forEach(contact => {
                        store.contacts.set(contact.id, contact)
                    })
                }
                if (messages) {
                    messages.forEach(msg => {
                        const chatId = msg.key.remoteJid
                        if (!store.messages.has(chatId)) {
                            store.messages.set(chatId, new Map())
                        }
                        store.messages.get(chatId).set(msg.key.id, msg)
                    })
                }
            })
            
            ev.on('chats.set', ({ chats }) => {
                chats.forEach(chat => store.chats.set(chat.id, chat))
            })
            
            ev.on('chats.upsert', (chats) => {
                chats.forEach(chat => store.chats.set(chat.id, chat))
            })
            
            ev.on('chats.update', (updates) => {
                updates.forEach(update => {
                    const chat = store.chats.get(update.id)
                    if (chat) {
                        Object.assign(chat, update)
                        store.chats.set(update.id, chat)
                    }
                })
            })
            
            ev.on('chats.delete', (ids) => {
                ids.forEach(id => store.chats.delete(id))
            })
            
            ev.on('contacts.set', ({ contacts }) => {
                contacts.forEach(contact => store.contacts.set(contact.id, contact))
            })
            
            ev.on('contacts.upsert', (contacts) => {
                contacts.forEach(contact => store.contacts.set(contact.id, contact))
            })
            
            ev.on('contacts.update', (updates) => {
                updates.forEach(update => {
                    const contact = store.contacts.get(update.id)
                    if (contact) {
                        Object.assign(contact, update)
                        store.contacts.set(update.id, contact)
                    }
                })
            })
            
            ev.on('messages.set', ({ messages: msgs, isLatest }) => {
                msgs.forEach(msg => {
                    const chatId = msg.key.remoteJid
                    if (!store.messages.has(chatId)) {
                        store.messages.set(chatId, new Map())
                    }
                    store.messages.get(chatId).set(msg.key.id, msg)
                })
            })
            
            ev.on('messages.upsert', ({ messages: msgs, type }) => {
                msgs.forEach(msg => {
                    const chatId = msg.key.remoteJid
                    if (!store.messages.has(chatId)) {
                        store.messages.set(chatId, new Map())
                    }
                    const chatMsgs = store.messages.get(chatId)
                    chatMsgs.set(msg.key.id, msg)
                    if (chatMsgs.size > 200) {
                        const iter = chatMsgs.keys()
                        for (let i = 0; i < 100; i++) chatMsgs.delete(iter.next().value)
                    }
                })
            })
            
            ev.on('messages.update', (updates) => {
                updates.forEach(update => {
                    const chatMessages = store.messages.get(update.key.remoteJid)
                    if (chatMessages) {
                        const msg = chatMessages.get(update.key.id)
                        if (msg) {
                            Object.assign(msg, update.update)
                            chatMessages.set(update.key.id, msg)
                        }
                    }
                })
            })
            
            ev.on('messages.delete', (update) => {
                if ('all' in update) {
                    store.messages.delete(update.jid)
                } else {
                    const chatMessages = store.messages.get(update.keys[0]?.remoteJid)
                    if (chatMessages) {
                        update.keys.forEach(key => chatMessages.delete(key.id))
                    }
                }
            })
            
            ev.on('groups.update', (updates) => {
                updates.forEach(update => {
                    const metadata = store.groupMetadata.get(update.id)
                    if (metadata) {
                        Object.assign(metadata, update)
                        store.groupMetadata.set(update.id, metadata)
                    }
                })
            })
            
            ev.on('group-participants.update', ({ id, participants, action }) => {
                const metadata = store.groupMetadata.get(id)
                if (metadata) {
                    switch (action) {
                        case 'add':
                            metadata.participants.push(...participants.map(p => ({ id: p, admin: null })))
                            break
                        case 'remove':
                            metadata.participants = metadata.participants.filter(p => !participants.includes(p.id))
                            break
                        case 'promote':
                            metadata.participants.forEach(p => {
                                if (participants.includes(p.id)) p.admin = 'admin'
                            })
                            break
                        case 'demote':
                            metadata.participants.forEach(p => {
                                if (participants.includes(p.id)) p.admin = null
                            })
                            break
                    }
                    store.groupMetadata.set(id, metadata)
                }
            })
            
            ev.on('presence.update', ({ id, presences }) => {
                store.presences.set(id, presences)
            })
        },
        
        loadMessages: async (jid, count) => {
            const chatMessages = store.messages.get(jid)
            if (chatMessages) {
                return Array.from(chatMessages.values()).slice(-count)
            }
            return []
        },
        
        loadMessage: async (jid, id) => {
            const chatMessages = store.messages.get(jid)
            if (chatMessages) {
                return chatMessages.get(id)
            }
            return undefined
        },
        
        mostRecentMessage: async (jid) => {
            const chatMessages = store.messages.get(jid)
            if (chatMessages && chatMessages.size > 0) {
                const msgs = Array.from(chatMessages.values())
                return msgs[msgs.length - 1]
            }
            return undefined
        },
        
        fetchImageUrl: async (jid, sock) => {
            try {
                return await sock.profilePictureUrl(jid, 'image')
            } catch {
                return undefined
            }
        },
        
        fetchGroupMetadata: async (jid, sock) => {
            if (!store.groupMetadata.has(jid)) {
                const metadata = await sock.groupMetadata(jid)
                store.groupMetadata.set(jid, metadata)
            }
            return store.groupMetadata.get(jid)
        },
        
        toJSON: () => {
            return {
                chats: Array.from(store.chats.entries()),
                messages: Array.from(store.messages.entries()).map(([k, v]) => [k, Array.from(v.entries())]),
                contacts: Array.from(store.contacts.entries())
            }
        },
        
        fromJSON: (json) => {
            if (json.chats) {
                json.chats.forEach(([k, v]) => store.chats.set(k, v))
            }
            if (json.messages) {
                json.messages.forEach(([k, v]) => {
                    const map = new Map()
                    v.forEach(([mk, mv]) => map.set(mk, mv))
                    store.messages.set(k, map)
                })
            }
            if (json.contacts) {
                json.contacts.forEach(([k, v]) => store.contacts.set(k, v))
            }
        },
        
        writeToFile: (path) => {
            const fs = require('fs')
            fs.writeFileSync(path, JSON.stringify(store.toJSON(), null, 2))
        },
        
        readFromFile: (path) => {
            const fs = require('fs')
            if (fs.existsSync(path)) {
                const json = JSON.parse(fs.readFileSync(path, 'utf-8'))
                store.fromJSON(json)
            }
        }
    }
    
    return store
}

module.exports = { makeInMemoryStore }
