const db = require('quick.db');

module.exports = {
    name: "prefix",
    cooldown: 5,
    aliases: ["set-prefix"],

    run: async function(client, message, args) {
        var prefix = await db.fetch(`prefix_${message.guild.id}`);
        if (prefix == null) prefix = require('../../config/bot').prefix;
        var newPrefix = args.join(' ')
        if (!newPrefix) {
            db.set(`prefix_${message.guild.id}`, require('../../config/bot').prefix);
            message.channel.send({
                embed: {
                    description: `The bot prefix has rested to **${require('../../config/bot').prefix}**`,
                    color: 0x00D700
                }
            })
        } else if (newPrefix) {
            if (newPrefix.length > 7) {
                message.channel.send({
                    embed: {
                        color: 0xFF0000,
                        title: `**❌ | Error**`,
                        description: `This prefix is to long`
                    }
                })
                return
            }
            db.set(`prefix_${message.guild.id}`, newPrefix);
            message.channel.send({
                embed: {
                    description: `The bot prefix has changed to **${newPrefix}**`,
                    color: 0x00D700
                }
            })
        }
    }
}