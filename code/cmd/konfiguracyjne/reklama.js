const db = require("quick.db")
const conf = require("../../../bot/conf.json")
const Discord = require(`discord.js`)

module.exports.run = async (client, message, args) => {
    const prefix = db.get(`${message.guild.id}_prefix`)
    
    const kanal = db.get(`${message.guild.id}_reklama_kanal`)
    
    //sprawdzanie czy jest ustawiony kanal reklam

    if (kanal == null) {
        let brakkanalu = new Discord.MessageEmbed()
        .setDescription("> *Kanał reklam nie jest ustawiony!*\n```"+prefix+"kanał <#oznaczenie>```")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(brakkanalu)
    }

    const status = db.get(`${message.guild.id}_reklama_status`)

    //sprawdzanie statusu

    if (status === "wyslana") {
        let wyslana = new Discord.MessageEmbed()
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Twoja reklama jest w trakcie weryfikacji!*")
        .setColor(conf.red)
        return message.channel.send(wyslana)
    } else if (status === "zmiana") {
        let wysylana = new Discord.MessageEmbed()
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *W ostatnim czasie dokonałeś zmiany reklamy, oczekuje ona na weryfikacje! Jej status zobaczysz używając:* `"+prefix+"status`")
        .setColor(conf.red)
        return message.channel.send(wysylana)
    }

    let reklama = args.slice(0).join(" ")
    
    if (reklama < 10) {
      let blad = new Discord.MessageEmbed()
      .setDescription("> *Reklama nie może być mniejsza niż 10 słów!*")
      .setAuthor(`Wystąpił Błąd! | ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
      .setColor(conf.red)
    return message.channel.send(blad)
} 

    //sprawdzanie czy w reklamie nie ma wzmainek

    if (reklama.includes("@everyone")) {
        let ping = new Discord.MessageEmbed()
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Twoja reklama nie może zawierać wzmianki* `@everyone`")
        .setColor(conf.red)
        return message.channel.send(ping)
    } else if (reklama.includes("@here")) {
        let ping = new Discord.MessageEmbed()
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Twoja reklama nie może zawierać wzmianki* `@here`")
        .setColor(conf.red)
        return message.channel.send(ping)
    } 

    //sprawdzanie czy w reklamie nie ma linku do serwera

    if (reklama.includes("discord.gg" || "discordapp.com/invite/")) {
        let linkwreklamie = new Discord.MessageEmbed()
        .setDescription("> *Twoja reklama zawiera link do serwera! Usuń go, bot wygeneruje własny aby zarząd miał wgląd do statystyk!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(linkwreklamie)
    }

    if (
        status === "wysylana" ||
        status === "zmiana_odrzucona"
        ) {
        let zmianiaad = new Discord.MessageEmbed()
        .setDescription("> *Pomyślnie zlecono zmiane reklamy! Jej status zobaczysz używając:* `"+prefix+"status`")
        .setColor(conf.green)
        .setAuthor(`Zmiana Reklamy! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        message.channel.send(zmianiaad)

        message.channel.createInvite({
            maxAge: 0
        }).then(zapro => {
            const weryfikacja = client.channels.cache.get(conf.kanal_wer)

            db.set(`${message.guild.id}_reklama_status`, "zmiana")
            db.set(`${message.guild.id}_reklama`, reklama)
            db.set(`${message.guild.id}_reklama_cykl`, "Standard")
            db.set(`${message.guild.id}_reklama_invite`, `https://discord.gg/${zapro.code}`)
            db.set(`${message.guild.id}_reklama_ustawiajacy`, message.author.id)

            const weryfikacyjny_prefix = db.get(`${conf.serw_wer}_prefix`)
          
            let reklamanowa = new Discord.MessageEmbed()
            .setDescription("> <:5238_categoria_emoji:793909932373573644> *Akcja:* `Zmiana Reklamy!`\n\n> <:DatabaseCheck:793602271841484840> *Serwer:* `"+message.guild.name+" ("+message.guild.id+")` **[ZAPROSZENIE](https://discord.gg/"+zapro.code+")**\n> <:kanal:791027115473502238> *Kanał reklam:* <a:yescross:787788981471019028> \n\n*Reklama:* ```"+reklama+"```")
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL)
            .setFooter(`${weryfikacyjny_prefix}zmiana akceptuj ${message.guild.id} | ${weryfikacyjny_prefix}zmiana odrzuć ${message.guild.id} <powód>`, "")
            weryfikacja.send(reklamanowa).then(async mssg => {
                await mssg.react(`787788981471019028`), await mssg.react(`798914860830294118`), await mssg.react(`787788981474951198`)
            })
        })   
        return;
    }


    //sukces!

    let sukces = new Discord.MessageEmbed()
    .setDescription("> *Twoja reklama została wysłana do weryfikacji! Jej status znajdziesz wpisująć:* `"+prefix+"status`")
    .setColor(conf.green)
    .setAuthor(`Ustawienie Reklamy! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
    message.channel.send(sukces) 
        message.channel.createInvite({
            maxAge: 0
        }).then(zapro => {
            const weryfikacja = client.channels.cache.get(conf.kanal_wer)

            db.set(`${message.guild.id}_reklama_status`, "wyslana")
            db.set(`${message.guild.id}_reklama`, reklama)
            db.set(`${message.guild.id}_reklama_cykl`, "Standard")
            db.set(`${message.guild.id}_reklama_invite`, `https://discord.gg/${zapro.code}`)
            db.set(`${message.guild.id}_reklama_ustawiajacy`, message.author.id)

            const weryfikacyjny_prefix = db.get(`${conf.serw_wer}_prefix`)
            
            let reklamanowa = new Discord.MessageEmbed()
            .setDescription("> <:5238_categoria_emoji:793909932373573644> *Akcja:* `Ustawienie Reklamy!`\n\n> <:DatabaseCheck:793602271841484840> *Serwer:* `"+message.guild.name+" ("+message.guild.id+")` **[ZAPROSZENIE](https://discord.gg/"+zapro.code+")**\n> <:kanal:791027115473502238> *Kanał reklam:* <a:yescross:787788981471019028> \n\n*Reklama:* ```"+reklama+"```")
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL)
            .setFooter(`${weryfikacyjny_prefix}akceptuj ${message.guild.id} | ${weryfikacyjny_prefix}odrzuć ${message.guild.id} <powód>`, "")
            weryfikacja.send(reklamanowa).then(async mssg => {
                await mssg.react(`787788981471019028`), await mssg.react(`787788981474951198`)
            })
        })   
        return;
}

module.exports.config = {
    name: "reklama",
    aliases: ["r", "ad"],
    perms: ["ADMINISTRATOR"]
}