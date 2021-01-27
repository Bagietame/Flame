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

    //dane z bazy danych po nr reklamy 
    const id = db.get(`reklama_nr_${args[0]}_uid`)
    //dane z bazy danych po id serwera
    const status = db.get(`${id}_reklama_status`)
    const ustw = db.get(`${id}_reklama_ustawiajacy`)

    if (status === null) {
        let errorek = new Discord.MessageEmbed()
        .setDescription("> *Ten serwer nie istnieje w naszej bazie lub nie wysłał reklamy do zweryfikowania!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(errorek)
    }

    db.set(`${id}_reklama_status`, "usunieta")
    db.set(`${id}_reklama`, "usunieta")
    db.set(`${id}_reklama_invite`, null)
    db.set(`${id}_reklama_ustawiajacy`, null)
    db.set(`${id}_reklama_nr`, null)

    db.set(`reklama_nr_${args[0]}_uid`, null)
    db.set(`reklama_nr_${args[0]}`, "usunieta") 

    db.set(`reklama_nr_${id}_staty`, 0)

    const server = client.guilds.cache.get(id)
    let argumenty = args.splice(1).join(" ")
    const ziomek = client.users.cache.get(ustw)

    if (!argumenty) {
        argumenty = "Powód nie został określony!"
    }

    let embed = new Discord.MessageEmbed()
    .setDescription("> *Pomyślnie usunięto reklame serwera* `"+server.name+"` *Który miał numer:* `"+args[0]+"`\n```"+argumenty+"```")
    .setColor(conf.red)
    .setAuthor(`Usuwanie Reklam! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
    message.channel.send(embed)

    let pwmessage = new Discord.MessageEmbed()
    .setAuthor("Status Twojej Reklamy!", "https://cdn.discordapp.com/emojis/787788981474951198.gif?v=1")
    .setDescription("> *Fatalna wiadomość! Twoja reklama serwera* `"+server.name+"` *została usunięta z powodem:* \n```"+argumenty+"```") 
    .setColor(conf.red)
    ziomek.send(pwmessage)

    db.set(`${id}_reklama_powod`, argumenty)

    let kanalek = client.channels.cache.get(conf.statusy)

        let statusxd = new Discord.MessageEmbed()
        .setColor(conf.red)
        .setAuthor(`Usunięcie reklamy!`, "https://cdn.discordapp.com/emojis/787788981474951198.gif?v=1")
        .setDescription("> *Reklama serwera* `"+server.name+"` *została usunięta z powodem:*\n```"+argumenty+"```")
        .setFooter(`Weryfikator: ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        kanalek.send(statusxd)
}

module.exports.config = {
    name: "usun",
    aliases: ["usuń"],
    wer: "yes"
}