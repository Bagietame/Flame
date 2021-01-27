const Discord = require("discord.js")
const conf = require(`../../../bot/conf.json`)

const db = require(`quick.db`)

module.exports.run = async (client, message, args) => {
    const serw = client.guilds.cache.get(`796051225723404299`)

    const rola = serw.roles.cache.get(`796051225846087681`)
    
    const prefix = db.get(`${message.guild.id}_prefix`)
    if (args[0] == "korzyści" || args[0] == "korzysci" || args[0] == "komendy") {
        let komendy = new Discord.MessageEmbed()
        .setColor("f57700")
        .setAuthor(`Pakiet Premium!`, "https://cdn.discordapp.com/emojis/791014829644578826.png?v=1")
        .setDescription("\n> `●` *Unikalna Ranga* <@&"+rola+">\n> `●` *25 Boostów Reklam!*\n> `●` *Reklama w embedzie w dowolnym kolorze!*\n> `●` *Reklama na Osobnym Kanale!*\n> `●` *1500$ Co 24h w ekonomi!*\n> `●` *Własna Ranga!*\n\n> `●` *Dostęp do* **Flame Beta**")
        return message.channel.send(komendy)
    }

    if (args[0] == "platnosci" || args[0] == "płatności") {
        const premiumplatnosci = new Discord.MessageEmbed()
        .setColor("f57700")
        .setDescription("> <:premium:791014829644578826> *Premium Zakupisz u:*\n\n`●` *<@629779016533934080>*\n`●` *<@341516078867808267>*\n`●` <@737664846245527603>\n\n> <:pay:795729410996043786> *Metody Płatności:*\n\n<:psc:795730040934629406> `●` *PaySafeCard*\n<:paypal:795729779080298538> `●` *PayPal*\n<:tipply:795732356006412338> `●` *Tipply.pl*")
        .setFooter("Koszt 5pln/miesiąc", "")
        return message.channel.send(premiumplatnosci)
    }

    if (args[0] == "nadaj") {
        if (!conf.owner.includes(message.author.id)) return;
        let ziomek = client.guilds.cache.get(args[1])
        if (!ziomek) {
            let errorr = new Discord.MessageEmbed()
            .setDescription("> *Nie znalazłem podanego serwera w bazie!*")
            .setColor(conf.red)
            .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
            return message.channel.send(errorr)
        }

        const jd = db.get(`${ziomek.id}_premium`)

        if (jd == "tak") {
            let errorr = new Discord.MessageEmbed()
            .setDescription("> *Ten serwer ma już sybskrybcję premium!*")
            .setColor(conf.red)
            .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
            return message.channel.send(errorr)
        }

        db.set(`${ziomek.id}_premium`, "tak")

        let sukcesik = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Nadanie Premium!`, message.author.displayAvatarURL({dynamic:true}))
        .setDescription("> *Nadano Premium serwerowi* `"+ziomek.name+" ("+ziomek.id+")`")
        .setColor(conf.green)
        return message.channel.send(sukcesik)
    }

    if (args[0] == "odbierz") {
        if (!conf.owner.includes(message.author.id)) return;
        let ziomek = client.guilds.cache.get(args[1])
        if (!ziomek) {
            let errorr = new Discord.MessageEmbed()
            .setDescription("> *Nie znalazłem podanego serwera w bazie!*")
            .setColor(conf.red)
            .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
            return message.channel.send(errorr)
        }

        const jd = db.get(`${ziomek.id}_premium`)

        if (jd == null || jd == "nie") {
            let errorr = new Discord.MessageEmbed()
            .setDescription("> *Ten serwer nie ma subskrybcji premium!*")
            .setColor(conf.red)
            .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
            return message.channel.send(errorr)
        }

        db.set(`${ziomek.id}_premium`, "nie")

        db.set(`${ziomek.id}_typ`, "standard")

        let sukcesik = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Nadanie Premium!`, message.author.displayAvatarURL({dynamic:true}))
        .setDescription("> *Odebrano Premium użytkownikowi* `"+ziomek.name+" ("+ziomek.id+")`")
        .setColor(conf.green)
        return message.channel.send(sukcesik)
    }

    let stat = db.get(`${message.guild.id}_premium`)
    let kolor = ""

    if (stat == "tak") {
        stat = "Ten serwer posiada aktywną subskrybcje Premium!"
        kolor = "f57700"
    } else {
        stat = "Ten serwer nie posiada aktywnej subskrybcji Premium!"
        kolor = conf.red
    }

    let premium = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Premium!`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(kolor)
        .setDescription("> *"+stat+"*\n\n> **Komendy:**\n `●` *"+prefix+"premium korzyści* `-` *Pokazuje korzyści premium*\n `●` *"+prefix+"premium płatności* `-` *Pokazuje dostępne płatności*")
        return message.channel.send(premium)

}

module.exports.config = {
    name: "premium"
}