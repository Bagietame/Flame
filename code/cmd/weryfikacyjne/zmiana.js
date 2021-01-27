const Discord = require(`discord.js`)
const conf = require(`../../../bot/conf.json`)
const db = require(`quick.db`)

module.exports.run = async (client, message, args) => {
    if (!args.length) {
        let bladargs = new Discord.MessageEmbed()
        .setDescription("> *Podaj Argumenty!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(bladargs)
    }

    const status = db.get(`${args[1]}_reklama_status`)

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
    } else if (
        status === "odrzucona" ||
        status === "zmiana_odrzucona"
        ) {
        let errorek = new Discord.MessageEmbed()
        .setDescription("> *Ten serwer ma odrzuconą reklame i nie wysłał nowej do weryfikacji!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(errorek)
    } 

    if (status == "wyslana") {
        let server = client.guilds.cache.get(args[1])
        let embed = new Discord.MessageEmbed()
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Serwer* **"+server.name+"** *wniósł o pierwotne ustawienie reklamy!*")
        .setFooter(`.akceptuj ${args[1]} | .odrzuć ${args[1]} <powód>`, "")
        .setColor(conf.noye)
        return message.channel.send(embed)
    }

    if (args[0] == "akceptuj") {
        const reklama = db.get(`${args[1]}_reklama`)

        const ziomek = db.get(`${args[1]}_reklama_ustawiajacy`)

        const nr = db.get(`${args[1]}_reklama_nr`)

        const pw = client.users.cache.get(ziomek)
    
        db.set(`${args[1]}_reklama_status`, "wysylana")
        db.set(`reklama_nr_${nr}`, reklama)
        db.set(`reklama_nr_${nr}_uid`, args[1])
        db.set(`reklama_nr_${nr}_staty`, 0)
    
        const serverek = client.guilds.cache.get(args[1])
    
        let sukces = new Discord.MessageEmbed()
        .setDescription("> *Reklama serwera* `"+serverek.name+"` *Została zmieniona oraz dodana pod swój pierwotny numer!* `("+nr+")`")
        .setColor(conf.green)
        .setAuthor(`Akceptowanie Reklamy! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        message.channel.send(sukces)

        let napw = new Discord.MessageEmbed()
        .setAuthor("Status Twojej Reklamy!", "https://cdn.discordapp.com/emojis/787788981471019028.gif?v=1")
        .setColor(conf.green)
        .setDescription("> *Witaj, "+pw.tag+" Twoja reklama została pomyślnie zmieniona oraz dodana pod swój pierwotny numer czyli:* `("+nr+")`")
        pw.send(napw)

        let kanalek = client.channels.cache.get(conf.statusy)

        let statusxd = new Discord.MessageEmbed()
        .setColor(conf.green)
        .setAuthor(`Status Reklamy!`, "https://cdn.discordapp.com/emojis/787788981471019028.gif?v=1")
        .setDescription("> *Zmiana reklamy serwera* `"+serverek.name+"` *została zaakceptowana oraz dodana pod swój pierwotny numer!* `("+nr+")`")
        .setFooter(`Weryfikator: ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        return kanalek.send(statusxd)
    } else if (
        args[0] == "odrzuć" ||
        args[0] == "odrzuc"
    ) {
        const ziomek = db.get(`${args[1]}_reklama_ustawiajacy`)
        const pwdm = client.users.cache.get(ziomek)
        const server = client.guilds.cache.get(args[1])
        let argumenty = args.slice(2).join(" ") 

        const nr = db.get(`${args[1]}_reklama_nr`)
    
        if (!argumenty) {
            argumenty = "Powód nie został określony!"
        }
    
        let sukces = new Discord.MessageEmbed()
        .setDescription("> *Pomyślnie odrzucono zmiane reklamy, Serwera* `"+server.name+"` *Z powodem:* ```"+argumenty+"```")
        .setColor(conf.green)
        message.channel.send(sukces)
    
        let pw = new Discord.MessageEmbed()
        .setAuthor("Status Twojej Reklamy!", "https://cdn.discordapp.com/emojis/787788981474951198.gif?v=1")
        .setDescription("> *Witaj, "+pwdm.tag+" Twoja zmiana reklamy serwera* `"+server.name+" ("+args[1]+")` *została odrzucona z powodem:* ```"+argumenty+"```")
        .setFooter(`Ustaw reklame od nowa! .reklama <reklama>`)
        pwdm.send(pw)

        db.set(`reklama_nr_${nr}`, "zmiana_odrzucona")
    
        db.set(`${args[1]}_reklama_status`, "zmiana_odrzucona")
        db.set(`${args[1]}_reklama`, "zmiana_odrzucona")
        db.set(`${args[1]}_reklama_invite`, null)
        db.set(`${args[1]}_reklama_powod`, argumenty)

        let kanalek = client.channels.cache.get(conf.statusy)

        let statusxd = new Discord.MessageEmbed()
        .setColor(conf.red)
        .setAuthor(`Status Reklamy!`, "https://cdn.discordapp.com/emojis/787788981474951198.gif?v=1")
        .setDescription("> *Reklama serwera* `"+server.name+"` *została odrzucona z powodem:*\n```"+argumenty+"```")
        .setFooter(`Weryfikator: ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        kanalek.send(statusxd)
    }
}

module.exports.config = {
    name: "zmiana",
    aliases: ["z"],
    wer: "yes"
}