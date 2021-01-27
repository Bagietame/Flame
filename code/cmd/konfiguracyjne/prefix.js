const Discord = require(`discord.js`)
const conf = require(`../../../bot/conf.json`)

const db = require(`quick.db`)

module.exports.run = async (client, message, args) => {

    if (!args.length) {
        let bladargs = new Discord.MessageEmbed()
        .setDescription("> *Podaj Nowy Prefix!*")
        .setAuthor(`Wystąpił Błąd! | ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.red)
        return message.channel.send(bladargs)
    }

    const nowy_prefix = args[0]

    
    let sukces = new Discord.MessageEmbed()
    .setDescription("> *Zmieniono serwerowy prefix na:* `"+nowy_prefix+"`")
    .setAuthor(`Zmiana Prefixu! | ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
    message.channel.send(sukces)
    db.set(`${message.guild.id}_prefix`, nowy_prefix)
}

module.exports.config = {
    name: "prefix",
    perms: ["ADMINISTRATOR"]
}