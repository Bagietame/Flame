const db = require("quick.db")
const conf = require("../../../bot/conf.json")
const Discord = require(`discord.js`)

module.exports.run = async (client, message, args) => {
    if (!args.length) {
        let bladargs = new Discord.MessageEmbed()
        .setDescription("> *Podaj Argumenty!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(bladargs)
    }

    const status = db.get(`${args[0]}_reklama_status`)

    if (status == "wysylana") { 
        let errorek = new Discord.MessageEmbed()
        .setDescription("> *Ten serwer ma aktualnie zweryfikowaną reklame!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(errorek)
    } else if (status == null) {
        let errorek = new Discord.MessageEmbed()
        .setDescription("> *Ten serwer nie istnieje w naszej bazie lub nie wysłał reklamy do zweryfikowania!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(errorek)
    } else if (status === "odrzucona") {
        let errorek = new Discord.MessageEmbed()
        .setDescription("> *Ten serwer ma odrzuconą reklame i nie wysłał nowej do weryfikacji!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(errorek)
    }

    if (status == "zmiana") {
        let server = client.guilds.cache.get(args[1])
        let zmianioned = new Discord.MessageEmbed()
        .setDescription("> *Serwer* **"+server.name+"** *wniósł o zmiane reklamy!*")
        .setFooter(`.zmiana akceptuj ${args[1]} | .zmiana odrzuć ${args[1]} <powód>`)
        .setColor(conf.noye)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(zmianioned)
    }

    const ziomek = db.get(`${args[0]}_reklama_ustawiajacy`)
    const pwdm = client.users.cache.get(ziomek)
    const server = client.guilds.cache.get(args[0])
    let argumenty = args.slice(1).join(" ") 

    if (!argumenty) {
        argumenty = "Powód nie został określony!"
    }

    let sukces = new Discord.MessageEmbed()
    .setDescription("> *Pomyślnie odrzucono reklame serwera* `"+server.name+"` *Z powodem:* ```"+argumenty+"```")
    .setColor(conf.green)
    message.channel.send(sukces)

    let pw = new Discord.MessageEmbed()
    .setAuthor("Status Twojej Reklamy!", "https://cdn.discordapp.com/emojis/787788981474951198.gif?v=1")
    .setDescription("> *Twoja reklama serwera* `"+server.name+" ("+args[0]+")` *została odrzucona z powodem:* ```"+argumenty+"```")
    pwdm.send(pw)

    db.set(`${args[0]}_reklama_status`, "odrzucona")
    db.set(`${args[0]}_reklama`, "usunieta")
    db.set(`${args[0]}_reklama_invite`, null)
    db.set(`${args[0]}_reklama_ustawiajacy`, null)
    db.set(`${args[0]}_reklama_powod`, argumenty)

    let kanalek = client.channels.cache.get(conf.statusy)

        let statusxd = new Discord.MessageEmbed()
        .setColor(conf.red)
        .setAuthor(`Status Reklamy!`, "https://cdn.discordapp.com/emojis/787788981474951198.gif?v=1")
        .setDescription("> *Reklama serwera* `"+server.name+"` *została odrzucona z powodem:*\n```"+argumenty+"```")
        .setFooter(`Weryfikator: ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        kanalek.send(statusxd)
}

module.exports.config = {
    name: "odrzuc",
    aliases: ["odrzuć"],
    wer: "yes"
}