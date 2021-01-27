module.exports = (client) => {
    client.on(`message`, (message) => {
        const conf = require(`../../bot/conf.json`)
        if (message.author.bot) return;
        if (!message.guild) return;
        const db = require(`quick.db`)
        const prefix = db.get(`${message.guild.id}_prefix`)

        if (prefix == null) {
            db.set(`${message.guild.id}_prefix`, conf.prefix)
            if (message.content.toLowerCase().startsWith(conf.prefix)) {
                const args = message.content
                .slice(conf.prefix.length).trim().split(/ +/);
                const command = args.shift(conf.prefix.length).toLowerCase()
                const cmd = 
                    client.cmds.get(command) ||
                    client.aliases.get(command)

                if (cmd) {
                    try {
                        cmd.run(client, message, args)
                    } catch (err) {
                        console.log("Wystąpił error podczas ładowania komendy! Komenda:"+cmd.config.name+" Błąd: "+err)
                    }
                }
            }
        }
    })  
}