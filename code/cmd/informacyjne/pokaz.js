const Discord = require(`discord.js`)
const db = require(`quick.db`)
const conf = require(`../../../bot/conf.json`)

module.exports.run = async (client, message, args) => {
    const nr = db.get(`${message.guild.id}_reklama_nr`)
    const reklama = db.get(`reklama_nr_${nr}`)
    const prefix = db.get(`${message.guild.id}_prefix`)

    let status = db.get(`${message.guild.id}_reklama_status`)

    if (status == "usunieta") {
        let embed = new Discord.MessageEmbed()
        .setDescription("> <:donotdisturb:791027115125375007> *Reklama została usunięta!*\n```Ustaw reklame ponownie używając: "+prefix+"reklama <reklama>```")
        .setAuthor(`Reklama Usunięta! ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.red)
        .setFooter(`Więcej informacji znajdziesz używając: ${prefix}status`)
        return message.channel.send(embed)
    } else if (status == null) {
        let embed = new Discord.MessageEmbed()
        .setDescription("> <:idle:791027115440209930> *Reklama nie została ustawiona!*\n```Ustaw reklame używając: "+prefix+"reklama <reklama>```")
        .setAuthor(`Reklama nie ustawiona! ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.red)
        return message.channel.send(embed)
    } else if (
        status == "odrzucona" ||
        status == "zmiana_odrzucona"
        ) {
        let embed = new Discord.MessageEmbed()
        .setDescription("> <:idle:791027115440209930> *Reklama została odrzucona przez weryfikatora!*\n```Ustaw reklame ponownie używając: "+prefix+"reklama <reklama>```")
        .setAuthor(`Reklama Odrzucona! ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.red)
        .setFooter(`Więcej informacji znajdziesz używając: ${prefix}status`)
        return message.channel.send(embed)
    }  

    let embed = new Discord.MessageEmbed()
    .setDescription("> *Treść reklamy:*\n\n"+reklama+"")
    .setAuthor(`${message.author.tag}! Serwer: ${message.guild.name}!`, message.author.displayAvatarURL({dynamic:true}))
    .setColor(conf.green)
    return message.channel.send(embed)

    
}

module.exports.config = {
    name: "pokaz",
    aliases: ["pokaż", "show"]
}