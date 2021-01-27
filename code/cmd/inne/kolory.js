const Discord = require(`discord.js`)
const conf = require("../../../bot/conf.json")

const db = require("quick.db")

module.exports.run = async (client, message, args) => {
    let status = db.get(`${message.guild.id}_premium`)
    let prefix = db.get(`${message.guild.id}_prefix`)
    if (status == "tak") {
        status = "Dziękujemy za wspieranie projektu poprzez subskybcję premium!"
    } else {
        status = "Zakup premium używająć "+prefix+"premium"
    }
    let kolory = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag} | Dostępne Kolory!`, message.author.displayAvatarURL({dynamic:true}))
    .setDescription(">>> <:bialy:798632461445627916> `-` **Biały**\n<:czarny:798632461785497643> `-` **Czarny**\n\n<:niebieski:798632462565638154> `-` **Niebieski**\n<:granatowy:798632462158135408> `-` **Granatowy**\n\n<:srebrny:798632462024048723> `-` **Srebrny**\n<:szary:798632461960871986> `-` **Szary**\n<:grafitowy:798632462291828736> `-` **Grafitowy**\n\n<:zolty:798632461818134619> `-` **Żółty**\n<:zloty:798632461713408062> `-` **Złoty**\n\n<:zielony:798632462120386610> `-` **Zielony**\n<:limonkowy:798632461583253545> `-` **Limonkowy**\n\n<:czerwony:798632461868728340> `-` **Czerwony**\n\n<:czekoladowy:798632462241497088> `-` **Czekoladowy**\n<:brazowy:798632461835173939> `-` **Brązowy**")
    .setFooter(status, message.guild.iconURL({dynamic:true}))
    return message.channel.send(kolory)
}

module.exports.config = {
    name: "kolory",
    aliases: ["kolorki", "colors"]
}