const Discord = require(`discord.js`)
const conf = require(`../../../bot/conf.json`)
const kolory = require(`../../../bot/kolory.json`)
const emoji = require(`../../../bot/emoji.json`)

const db = require(`quick.db`)

module.exports.run = async (client, message, args) => {
    const status_p = db.get(`${message.guild.id}_premium`)

    const prefix = db.get(`${message.guild.id}_prefix`)

    if (status_p == null || status_p == "nie") {
        let brak_p = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Brak Premium!`, message.author.displayAvatarURL({dynamic:true}))
        .setDescription("> *Aby dokonać konfiguracji PREMIUM musisz być subskrybentem premium!*\n```"+prefix+"premium - aby zakupić subskrybcje!```")
        .setColor(conf.red)
        return message.channel.send(brak_p)
    }

    if (args[0] == "kolor") {
        if (args[1] == null || args[1] == undefined) {
            let bladargs = new Discord.MessageEmbed()
            .setDescription("> *Podaj Argumenty!*")
            .setColor(conf.red)
            .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
            return message.channel.send(bladargs)
        }

        let wybrany_kolor = args[1].toLowerCase()

        if (kolory[wybrany_kolor] == undefined || kolory[wybrany_kolor] == null) {
            let bladargs = new Discord.MessageEmbed()
            .setDescription("> *Taki kolor nie istnieje w naszej bazie! Dostępne kolory znajdziesz pod komendą* `"+prefix+"kolory`")
            .setColor(conf.red)
            .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
            return message.channel.send(bladargs)
        }

        db.set(`${message.guild.id}_typ_kolor`, kolory[wybrany_kolor])
        
        let sukces = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Kolor Reklamy!`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Kolor został pomyślnie zmieniony!*\n**Nowy Kolor:** "+emoji[wybrany_kolor]+" **"+kolory[wybrany_kolor]+"**")
        .setFooter("Dziękujemy za wspieranie projektu poprzez subskybcję premium!", message.guild.iconURL({dynamic:true}))
        return message.channel.send(sukces)
    }

    if (args[0] == "typ" || args[0] == "type") {
        if (args[1] == null || args[1] == undefined) {
            let bladargs = new Discord.MessageEmbed()
            .setDescription("> *Podaj Argumenty!*")
            .setColor(conf.red)
            .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
            return message.channel.send(bladargs)
        }

        const dostepne_typy = ["embed", "ramka", "normal", "normalna"]
        
        if (!dostepne_typy.includes(args[1])) {
            let bladargs = new Discord.MessageEmbed()
            .setDescription("> *Podaj poprawny typ wiadomości!*\n```"+prefix+"konf typ <embed/normalna>```")
            .setColor(conf.red)
            .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
            return message.channel.send(bladargs)
        }

        const ostateczny = args[1].toLowerCase()

        db.set(`${message.guild.id}_typ`, ostateczny)

        let sukces = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Typ Reklamy!`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Typ wysyłanej reklamy został pomyślnie zmieniony!*\n**Nowy Typ:** __*"+ostateczny+"*__")
        .setFooter("Dziękujemy za wspieranie projektu poprzez subskybcję premium!", message.guild.iconURL({dynamic:true}))
        return message.channel.send(sukces)
    }

    let embed = new Discord.MessageEmbed()
    .setDescription("> <:premium:791014829644578826> __**Premium:**__\n\n`●` __**"+prefix+"konfiguracja typ <embed/normal>**__ `-` **Ustawia typ wysyłanej reklamy!**\n`●` __**"+prefix+"konfiguracja kolor <kolor>**__ `-` **Ustawia Kolor wysyłanej reklamy w embedzie** `(Dostępne kolory: "+prefix+"kolory)`")
    .setAuthor(`${message.author.tag} | Konfiguracja Premium!`, message.author.displayAvatarURL({ dynamic:true }))
    .setFooter("Dziękujemy za wspieranie projektu poprzez subskybcję premium!", message.guild.iconURL({dynamic:true}))
    return message.channel.send(embed)
}

module.exports.config = {
    name: "konfiguracja",
    aliases: ["konf"],
    perms: ["ADMINISTRATOR"]
}