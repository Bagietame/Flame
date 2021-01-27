const Discord = require(`discord.js`)
const db = require("quick.db")
const conf = require("../../../bot/conf.json")

module.exports.run = async (client, message, args) => {
    function run(command) {
        command(
            message
        );
      }
    
    if (!args.length) {
        let bladargs = new Discord.MessageEmbed()
        .setDescription("> *Podaj Argumenty!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(bladargs)
    }

    const status = db.get(`${args[0]}_reklama_status`)

    if (status == "wysylana") { 
        let errorek = new Discord.MessageEmbed()
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Ten serwer ma aktualnie zweryfikowaną reklame!*")
        .setColor(conf.red)
        return message.channel.send(errorek)
    } else if (status == null) {
        let errorek = new Discord.MessageEmbed()
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Ten serwer nie istnieje w naszej bazie lub nie wysłał reklamy do zweryfikowania!*")
        .setColor(conf.red)
        return message.channel.send(errorek)
    } else if (status === "odrzucona") {
        let errorek = new Discord.MessageEmbed()
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        .setDescription("> *Ten serwer ma odrzuconą reklame i nie wysłał nowej do weryfikacji!*")
        .setColor(conf.red)
        return message.channel.send(errorek)
    }

    if (status == "zmiana") {
        let server = client.guilds.cache.get(args[0])
        let zmianioned = new Discord.MessageEmbed()
        .setDescription("> *Serwer* `"+server.name+"` *wniósł o zmiane reklamy!*")
        .setFooter(`.zmiana akceptuj ${args[0]} | .zmiana odrzuć ${args[0]} <powód>`)
        .setColor(conf.noye)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(zmianioned)
    }

    db.set(`pierwszy`, 1)

    run(search)

    async function search() {
        let jd = db.get(`pierwszy`)
        
        let reklamka = db.get(`reklama_nr_${jd}`)

        if (reklamka == null) {
            db.set(`znaleziony`, jd)
            run(ustawianie)
            return;
        } else if (reklamka == "usunieta") {
            db.set(`znaleziony`, jd)
            run(ustawianie)
            return;
        }

        let num1 = Number(jd)
        let num2 = Number(1)

        let dodawanko = num1 + num2
        db.set(`pierwszy`, dodawanko)
        run(search)
        return;
    }

    async function ustawianie() {
    
        const matma = db.get(`znaleziony`)
    
        const reklama = db.get(`${args[0]}_reklama`)

        const ziomek = db.get(`${args[0]}_reklama_ustawiajacy`)

        const pw = client.users.cache.get(ziomek)
    
        db.set(`${args[0]}_reklama_status`, "wysylana")
        db.set(`reklama_nr_${matma}`, reklama)
        db.set(`reklama_nr_${matma}_uid`, args[0])
        db.set(`${args[0]}_reklama_nr`, matma)
        db.set(`reklama_nr_${matma}_staty`, 0)
    
        const serverek = client.guilds.cache.get(args[0])
    
        let sukces = new Discord.MessageEmbed()
        .setDescription("> *Reklama serwera* `"+serverek.name+"` *Została dodana pod numer:* `"+matma+"`")
        .setColor(conf.green)
        message.channel.send(sukces)

        let napw = new Discord.MessageEmbed()
        .setAuthor("Status Twojej Reklamy!", "https://cdn.discordapp.com/emojis/787788981471019028.gif?v=1")
        .setColor(conf.green)
        .setDescription("> *Witaj, "+pw.tag+" Twoja reklama serwera* `"+serverek.name+"` *została zaakceptowana oraz dodana pod numer* `"+matma+"`*!*")
        pw.send(napw)

        let kanalek = client.channels.cache.get(conf.statusy)

        let statusxd = new Discord.MessageEmbed()
        .setColor(conf.green)
        .setAuthor(`Status Reklamy!`, "https://cdn.discordapp.com/emojis/787788981471019028.gif?v=1")
        .setDescription("> *Reklama serwera* `"+serverek.name+"` *została zaakceptowana oraz dodana pod numer:* `"+matma+"`")
        .setFooter(`Weryfikator: ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        kanalek.send(statusxd)
    }
}

module.exports.config = {
    name: "akceptuj",
    wer: "yes"
}