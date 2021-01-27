const db = require("quick.db")
const conf = require("../../../bot/conf.json")
const Discord = require(`discord.js`)

module.exports.run = async (client, message, args) => {
    const prefix = db.get(`${message.guild.id}_prefix`)

    let kanal = db.get(`${message.guild.id}_reklama_kanal`) 
    let premium = db.get(`${message.guild.id}_premium`)
    let staty = db.get(`reklama_nr_${message.guild.id}_staty`)
    let numer_reklamy = db.get(`${message.guild.id}_reklama_nr`) 
    let status = db.get(`${message.guild.id}_reklama_status`)
    let emojii = ""
    let powod = db.get(`${message.guild.id}_reklama_powod`)
    let nr = db.get(`${message.guild.id}_reklama_nr`)
    let emoji = ""

    if (staty == null) {
        db.set(`reklama_nr_${message.guild.id}_staty`, 0)
        staty = 0
    }

    if (nr == null) {
        nr = "<a:nocross:787788981474951198>"
    } 

    if (premium == null) {
        premium = "<a:nocross:787788981474951198>"
        emoji = "<:premiumaleczarne:791015439454699530>"
    } else if (premium == "tak") {
        premium = "<a:yescross:787788981471019028>"
        emoji = "<:premium:791014829644578826>"
    } else if (premium == "nie") {
        premium = "<a:nocross:787788981474951198>"
        emoji = "<:premiumaleczarne:791015439454699530>"
    }

    if (kanal == "usuniety") {
        kanal = "<a:nocross:787788981474951198>"
    } else if (kanal == null) {
        kanal = "<a:nocross:787788981474951198>"
    } else {
        kanal = `<#${kanal}>`
    }

    if (status == null) {
        emojii = "<:donotdisturb:791027115125375007>"
        status = "Reklama nie została wysłana do weryfikacji!"
    } else if (status == "wyslana" || status == "zmiana") {
        emojii = "<:idle:791027115440209930>"
        status = "Reklama oczekuje na weryfikacje!"
    } else if (status == "wysylana") {
        emojii = "<:online:791016351564431400>"
        status = "Reklama jest wysyłana w podstawowym cyklu!"
    } else if (status == "odrzucona") {
        emojii = "<:donotdisturb:791027115125375007>"
        status = "Reklama została odrzucona przez weryfikatora z powodem: "+powod+""
    } else if (status == "usunieta" || status == "zmiana_odrzucona") {
        emojii = "<:donotdisturb:791027115125375007>"
        status = "Reklama została usunięta przez zarząd z powodem: "+powod+""
    } 


    
    let embed = new Discord.MessageEmbed()
    .setThumbnail(message.guild.iconURL())
    .setAuthor(`Statystyki Serwera ${message.guild.name}`, `https://image.flaticon.com/icons/png/512/87/87578.png`)
    .setDescription("\n<:kanal:791027115473502238> `●` *Kanał Reklam:* "+kanal+"\n<:id:791026345261531186> `●` *Nr reklamy:* "+nr+"\n"+emoji+" `●` *Premium:* "+premium+"\n<:wyslana:791014829535002685> `●` *Reklama została Wysłana* `"+staty+"` *Razy* \n\n> "+emojii+" **Status Reklamy:**\n```"+status+"```\n[Dodaj Bota]("+conf.link_do_bota+") `|` [Serwer Support]("+conf.link_do_supportu+") `|` [Strona WwW]("+conf.strona_www+")")
    message.channel.send(embed)
}

module.exports.config = {
    name: "staty",
    aliases: ["status", "statystyki", "s"]
}