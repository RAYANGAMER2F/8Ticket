module.exports = {
    name: "help",
    cooldown: 5,
    aliases: ["القني يابني"],

    run: async function(client, message, args) {
        try {
          message.channel.send({
            embed: {
              title: 'Bot Commands 💚',
              description: `
                            help
                            setup
                            open
                            add
                            remove
                            rename
                            prefix
                            ping
                            \`والله شوف قايمة هيلب علا السخانه كدا الواحد عايز ينام ’_’ خش هنا: discord.gg/developer-support و هم بيساعدوك كيف تحلها\`
                           `
            }
          })
        } catch (err) {
            return;
        }
    }
}
