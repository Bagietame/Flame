const db = require("quick.db")
const conf = require("../../../bot/conf.json")
const Discord = require(`discord.js`)

module.exports.run = async (client, message, args) => {
    const prefix = db.get(`${message.guild.id}_prefix`)
    const premium = db.get(`${message.guild.id}_premium`)

    if (premium == "tak") {
        let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Help Menu`, message.author.displayAvatarURL({dynamic:true}))
        .setColor("#ff7621")
        .setDescription("> <:info:788716998405521459> __**Informacyjne:**__ \n\n`●` __"+prefix+"botinfo__ `-` **Informacje o bocie**\n`●` __"+prefix+"statystyki__ `-` **Statystyki serwera**\n`●` __"+prefix+"pokaż__ `-` **Pokazuje reklame serwera na którym się znajdujesz!**\n\n> <:ustawienia:788716998561497089> __**Konfiguracyjne:**__\n\n`●` __"+prefix+"kanał <#oznaczenie>__ `-` **Ustawia kanał reklam!**\n`●` __"+prefix+"reklama <reklama>__ `-` **Ustawia reklame serwera!** `(Pamiętaj że nie może ona zawierać zaproszenia ani wzmianek!)` \n`●` __"+prefix+"prefix <nowy>__ `-` **Ustawia nowy serwerowy prefix!**\n\n> <:premium:791014829644578826> __**Premium:**__\n\n`●` __"+prefix+"konfiguracja typ <embed/normal>__ `-` **Ustawia typ wysyłanej reklamy!**\n`●` __"+prefix+"konfiguracja kolor <kolor>__ `-` **Ustawia Kolor wysyłanej reklamy w embedzie** `(Dostępne kolory: "+prefix+"kolory)`\n\n[Dodaj Bota]("+conf.link_do_bota+") `|` [Serwer Support]("+conf.link_do_supportu+") `|` [Strona WwW]("+conf.strona_www+")")
        .setThumbnail("https://flame-bot.pl/images/favicon.png")
        return message.channel.send(embed)
    } else {
        let embed = new Discord.MessageEmbed()
        .setColor("#ff7621")
        .setAuthor(`${message.author.tag} | Help Menu`, message.author.displayAvatarURL({dynamic:true}))
        .setDescription("> <:info:788716998405521459> __**Informacyjne:**__ \n\n`●` __"+prefix+"botinfo__ `-` **Informacje o bocie**\n`●` __"+prefix+"statystyki__ `-` **Statystyki serwera**\n`●` __"+prefix+"pokaż__ `-` **Pokazuje reklame serwera na którym się znajdujesz!**\n\n> <:ustawienia:788716998561497089> __**Konfiguracyjne:**__\n\n`●` __"+prefix+"kanał <#oznaczenie>__ `-` **Ustawia kanał reklam!**\n`●` __"+prefix+"reklama <reklama>__ `-` **Ustawia reklame serwera!** `(Pamiętaj że nie może ona zawierać zaproszenia ani wzmianek!)` \n`●` __"+prefix+"prefix <nowy>__ `-` **Ustawia nowy serwerowy prefix!**\n\n[Dodaj Bota]("+conf.link_do_bota+") `|` [Serwer Support]("+conf.link_do_supportu+") `|` [Strona WwW]("+conf.strona_www+")")
        .setThumbnail("https://flame-bot.pl/images/favicon.png")
        return message.channel.send(embed)
    }
}

module.exports.config = {
    name: "pomoc",
    aliases: ["help", "h", "p"]
}