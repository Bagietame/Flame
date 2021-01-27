const Discord = require(`discord.js`)
const conf = require(`../../../bot/conf.json`)
const db = require(`quick.db`)
const Math = require(`mathjs`)

module.exports.run = async (client, message, args) => {
    let premium_status = ""

    var used = process.memoryUsage().heapUsed / 1024 / 1024;

    const getpremium = db.get(`${message.guild.id}_premium`)

    if (getpremium == null) {
        premium_status = "<a:nocross:787788981474951198>"
    } else {
        premium_status = "<a:yescross:787788981471019028>"
    }

        let embed = new Discord.MessageEmbed()
        .setColor(conf.green)
        .setAuthor(`Informacje dot. bota!`, "https://emoji.gg/assets/emoji/3224_info.png")
        .setThumbnail("https://flame-bot.pl/images/favicon.png")
        .setDescription("> <:ping:788705251766042655> *Ping:* `"+client.ws.ping+"` \n> <:ramik:788705478045204490> *Użycie ramu:* `"+Math.round(used * 100) / 100+"mb`\n> <:user:793599162846543892> *Użytkownicy:* "+client.users.cache.size+"\n> <:database:788706022733774868> *Serwery:* `"+client.guilds.cache.size+"` \n\n> *Status Premium:* __**"+premium_status+"**__\n\n[Dodaj Bota]("+conf.link_do_bota+") | [Serwer Support]("+conf.link_do_supportu+") | [Strona]("+conf.strona_www+")")
        return message.channel.send(embed)
}

module.exports.config = {
    name: "botinfo",
    aliases: ["info", "bot"]
}