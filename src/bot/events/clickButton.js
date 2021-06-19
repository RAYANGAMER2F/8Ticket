const { MessageButton, MessageActionRow } = require('discord-buttons');
const db = require('quick.db');

module.exports = async function(client, button) {
    if (button.id == 'createTicket') {
        var checkTickets = button.guild.channels.cache.find(c => c.name == `ticket-${button.clicker.user.username}`)
        if (checkTickets) {
            button.channel.send({
                embed: {
                    color: 0xFF0000,
                    title: `**❌ | Error**`,
                    description: `You already have a ticket open before`
                }
            }).then(async function(m) {
                setTimeout(() => {
                    m.delete()
                }, 1000 * 7);
            })
            return
        }
        button.guild.channels.create(`ticket-${button.clicker.user.username}`, {
            permissionOverwrites: [{
                    id: button.clicker.user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: db.fetch(`TicketAdminRole_${button.guild.id}`),
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                }, {
                    id: button.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async function(channel) {
            db.set(`TicketControl_${channel.id}`, button.clicker.user.id);
            let btn = new MessageButton()
                .setStyle("grey")
                .setEmoji("🔒")
                .setID("configTicket");
            let row = new MessageActionRow()
                .addComponent(btn);
            channel.send(`<@${button.clicker.user.id}>`, {
                embed: {
                    description: `Please wait for a **ADMIN** response!!
                    Press **"🔒"** to close this ticket`,
                    color: 0x2F3136
                },
                component: row
            })
        })
    } else if (button.id == 'configTicket') {
        if (!button.channel.name.includes("ticket-")) {
            return;
        }
        var member = db.fetch(`TicketControl_${button.channel.id}`);
        button.channel.overwritePermissions([{
                id: member,
                deny: ['SEND_MESSAGES'],
                allow: ['VIEW_CHANNEL']
            },
            {
                id: db.fetch(`TicketAdminRole_${button.guild.id}`),
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
            }, {
                id: button.guild.roles.everyone,
                deny: ["VIEW_CHANNEL"]
            }
        ]);
        button.channel.send({
            embed: {
                description: `Ticket has been Closed By <@!${button.clicker.user.id}>`,
                color: 0xFFE700
            }
        }).then(async function(m) {
            setTimeout(() => {
                m.delete()
            }, 1000 * 5);
        })
        let btn = new MessageButton()
            .setStyle("grey")
            .setEmoji("🔓")
            .setID("reopenTicket");
        let btn2 = new MessageButton()
            .setStyle("grey")
            .setEmoji("⛔")
            .setID("deleteTicket");
        let row = new MessageActionRow()
            .addComponent(btn2)
            .addComponent(btn);
        button.channel.send({
            embed: {
                description: 'Press **"⛔"** to delete the ticket\nPress **"🔓" to reopen the ticket**',
                color: 0xFF0000
            },
            component: row
        })
    } else if (button.id == "deleteTicket") {
        db.delete(`TicketControl_${button.channel.id}`);
        button.channel.send({
            embed: {
                description: 'Ticket will be deleted in a few seconds',
                color: 0xFF0000
            }
        });
        setTimeout(() => {
            button.channel.delete()
        }, 1000 * 4.3);
    } else if (button.id == "reopenTicket") {
        button.channel.send({
            embed: {
                description: `Ticket has been reopened By <@!${button.clicker.user.id}>`,
                color: 0xFFE700
            }
        }).then(async function(m) {
            setTimeout(() => {
                m.delete()
            }, 1000 * 5);
        })
        var member = db.fetch(`TicketControl_${button.channel.id}`);
        button.channel.overwritePermissions([{
                id: member,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
            },
            {
                id: db.fetch(`TicketAdminRole_${button.guild.id}`),
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
            }, {
                id: button.guild.roles.everyone,
                deny: ["VIEW_CHANNEL"]
            }
        ]);
    }
}