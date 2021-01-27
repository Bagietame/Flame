const db = require("quick.db")
const conf = require("../../../bot/conf.json")
const Discord = require(`discord.js`)

module.exports.run = async (client, message, args) => {
    const prefix = db.get(`${message.guild.id}_prefix`)
       
    const kanal = message.mentions.channels.first();

    if (
        !kanal || 
        kanal.type !== "text"
        ) {
        let brakoznaczenia = new Discord.MessageEmbed()
        .setDescription("> *Musisz oznaczyć kanał który mam ustawić!* \n```"+prefix+"kanał <#oznaczenie>```")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(brakoznaczenia)
    }

    const permissions = kanal.permissionsFor(client.user);
    if (!permissions.has("SEND_MESSAGES") || !permissions.has("MANAGE_CHANNELS") || !permissions.has("EMBED_LINKS") || !permissions.has("VIEW_CHANNEL")) {
        let emed = new Discord.MessageEmbed()
        .setDescription("> *Na kanale* `"+kanal.name+"` *Nie mam odpowiednich permisji*\n```Potrzebne Permisje: Wysyłanie Wiadomości, Zarządzanie Kanałem, Wyświetlanie podglądu Linków, Wyświetl Kanał```")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(emed)
    }

    const rola = message.guild.roles.everyone

    const permissionss = kanal.permissionsFor(rola)
    if (
        !permissionss.has("EMBED_LINKS") ||
        !permissionss.has("VIEW_CHANNEL") ||
        !permissionss.has("READ_MESSAGE_HISTORY")
    ) {
        let emed = new Discord.MessageEmbed()
        .setDescription("> *Na kanale* `"+kanal.name+"` *Osoby z rolą* `@everyone` *nie mają odpowiednich permisji!* \n`-` Wyświetl Kanał, \n`-` Czytanie Historii Kanału\n`-` Wyświetlanie podglądu linku")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(emed)
    } else if (permissionss.has("SEND_MESSAGES")) {
        let emed = new Discord.MessageEmbed()
        .setDescription("> *Na kanale* `"+kanal.name+"` *Osoby z rolą* `@everyone` *mogą wysyłać wiadomości!*")
        .setColor(conf.red)
        .setImage(`https://flame-bot.pl/data/wysylanie.gif`)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(emed)
    }

    let sukces = new Discord.MessageEmbed()
        .setDescription("> *Pomyślnie ustawiono kanał reklam na <#"+kanal+">*")
        .setColor(conf.green)
        .setAuthor(`Ustawienie Kanału Reklam! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        message.channel.send(sukces)

        kanal.setTopic('<:flame:795806250578477106> Na tym kanale reklamy, wysyła bot Flame! https://flame-bot.pl')

        message.channel.createInvite({
            maxAge: 0
        }).then(zapro => {
            db.set(`${message.guild.id}_reklama_kanal`, kanal.id)
            db.set(`${message.guild.id}_reklama_ustawiajacy`, message.author.id)


            const kanalek = client.channels.cache.get(conf.logs)
        
            let nowy = new Discord.MessageEmbed()
            .setColor(conf.green)
            .setAuthor(`Ads Log | ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic:true }))
            .setDescription("> <:DatabaseCheck:793602271841484840> *Serwer* `"+message.guild.name+" ("+message.guild.id+")` *ustawił kanał reklam!*\n\n> <:kanal:791027115473502238> *Kanał:* `"+kanal.name+" ("+kanal.id+")` _*[INVITE](https://discord.gg/"+zapro.code+")*_")
            return kanalek.send(nowy)
        })

    
}

module.exports.config = {
    name: "kanal",
    aliases: ["kanał", "k", "channel", "ch"],
    perms: ["ADMINISTRATOR"]
}