const Discord = require(`discord.js`)
const conf = require(`../../../bot/conf.json`)
const db = require(`quick.db`)

module.exports.run = async (client, message, args) => {
    const prefix = db.get(`${message.guild.id}_prefix`)
    const channel = client.channels.cache.get(conf.logs)

    if (!args.length) {
        let bladargs = new Discord.MessageEmbed()
        .setDescription("> *Podaj Argumenty!*\n```"+prefix+"gban <odbierz/nadaj> <oznacznie/id>```")
        .setColor(conf.red)
        return message.channel.send(bladargs)
    } 

    const typ = 
        message.mentions.members.first() ||
        client.users.cache.get(args[1])

    if (!typ) {
        let embed = new Discord.MessageEmbed()
        .setDescription("> *Oznacz osobe lub podaj jej id!*\n```"+prefix+"gban <odbierz/nadaj> <oznacznie/id>```")
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setColor(conf.red)
        return message.channel.send(embed)
    }

    if (args[0] == "nadaj") {
        let powod = args.slice(2).join(" ")

        if (!powod) {
            powod = "Powód nie został podany!"
        }
        db.set(`gban_s_${typ.id}`, "tak")
        db.set(`gban_p_${typ.id}`, powod)
        db.set(`gban_b_${typ.id}`, message.author.id)

        let embed = new Discord.MessageEmbed()
        .setDescription("> <:ThinkingGlobal:793863481355010078> *Nałożono globalną blokade na użytkownika* **"+typ.user.tag+"** `("+typ.id+")`\n```"+powod+"```")
        .setAuthor(`${message.author.tag} | Gban!`, message.author.displayAvatarURL({ dynamic:true }))
        .setColor(conf.green)
        message.channel.send(embed)

        let napw = new Discord.MessageEmbed()
        .setDescription("> <:ThinkingGlobal:793863481355010078> *Zostałeś globalnie zbanowany! Powód:*\n```"+powod+"```")
        .setFooter(`By ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.red)
        .setAuthor(`${typ.user.tag} | Gban`, typ.user.displayAvatarURL({dynamic:true}))
        typ.send(napw)

        let log = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Gban!`, message.author.displayAvatarURL({dynamic:true}))
        .setDescription("> <:ThinkingGlobal:793863481355010078> *Globalna blokada na użytkownika* `"+typ.user.tag+" ("+typ.id+")` *została nałożona przez* `"+message.author.tag+" ("+message.author.id+")`\n```"+powod+"```")
        .setColor(conf.red)
        .setTimestamp()
        return channel.send(log)
    } else if (args[0] == "odbierz") {
        db.set(`gban_s_${typ.id}`, "nie")
        db.set(`gban_p_${typ.id}`, "Globalna blokda zdjęta przez: "+message.author.tag+" ("+message.author.id+")")

        let embed = new Discord.MessageEmbed()
        .setDescription("> <:ThinkingGlobal:793863481355010078> *Zdjęto globalną blokade na użytkownika* **"+typ.user.tag+"** `("+typ.id+")`")
        .setAuthor(`${message.author.tag} | Gban!`, message.author.displayAvatarURL({ dynamic:true }))
        .setColor(conf.green)
        message.channel.send(embed)

        let napw = new Discord.MessageEmbed()
        .setDescription("> <:ThinkingGlobal:793863481355010078> *Zostałeś globalnie odbanowany!*")
        .setFooter(`By ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.green)
        .setAuthor(`${typ.user.tag} | Gban`, typ.user.displayAvatarURL({dynamic:true}))
        typ.send(napw)

        let log = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Gban!`, message.author.displayAvatarURL({dynamic:true}))
        .setDescription("> <:ThinkingGlobal:793863481355010078> *Globalna blokada na użytkownika* `"+typ.user.tag+" ("+typ.id+")` *została zdjęta przez* `"+message.author.tag+" ("+message.author.id+")`")
        .setColor(conf.green)
        .setTimestamp()
        return channel.send(log)
    }


}

module.exports.config = {
    name: "gban",
    owner: "yes"
}