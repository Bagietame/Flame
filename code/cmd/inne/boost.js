const Discord = require(`discord.js`)
const conf = require(`../../../bot/conf.json`)
const db = require(`quick.db`)
const Math = require(`mathjs`)

module.exports.run = async (client, message, args) => {
    let boosts = db.get(`${message.author.id}_boosty`)

    if (boosts == null) {
        db.set(`${message.author.id}_boosty`, 0)
        boosts = db.get(`${message.author.id}_boosty`)
    }

    const prefix = db.get(`${message.guild.id}_prefix`)

    if (args[0] == "stan") {
        let typ = message.mentions.members.first()

        if (!typ) {
            let embed = new Discord.MessageEmbed()
            .setDescription("> <:boost:796120730588545044> *Aktualnie Posiadasz:* "+boosts+"\n```"+prefix+"boost - Aby zboostować serwera na ktrórym się znajdujesz!```")
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
            .setColor(conf.green)
            return message.channel.send(embed)
        }

        if (db.get(`${typ.user.id}_boosty`) == null) {
            db.set(`${typ.user.id}_boosty`, 0)
        }

        const boostytypa = db.get(`${typ.user.id}_boosty`)

        let embed = new Discord.MessageEmbed()
        .setDescription("> <:boost:796120730588545044> *"+typ.user.tag+" Aktualnie Posiada:* "+boostytypa+"")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.green)
        return message.channel.send(embed)
    }

    if (args[0] == "dodaj") {
        if (conf.owner.includes(message.author.id)) {
            if (Number.isNaN(+args[1])) {
                let errorr = new Discord.MessageEmbed()
                .setDescription("> *Argument 2 musi być liczbą!*")
                .setColor(conf.red)
                .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
                return message.channel.send(errorr)
            }

            const ziomek = 
                message.mentions.members.first() ||
                client.users.cache.get(args[2])

            if (!ziomek) {
                let errorr = new Discord.MessageEmbed()
                .setDescription("> *Nie znalazłem podanego użytkownika w bazie!*")
                .setColor(conf.red)
                .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
                return message.channel.send(errorr)
            }

            if (db.get(`${ziomek.id}_boosty`) == null) {
                db.set(`${ziomek.id}_boosty`, 0)
            }

            let nowe = Number(args[1])
            let jeden = Number(db.get(`${ziomek.id}_boosty`))

            let matma = Number(jeden + nowe)

            db.set(`${ziomek.id}_boosty`, matma)

            let sd = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag} | Dodawanie Boostów!`, message.author.displayAvatarURL({dynamic:true}))
            .setColor(conf.green)
            .setDescription("> <:boost:796120730588545044> *Dodano* `"+nowe+"` *Boostów dla* `"+ziomek.user.tag+"`")
            return message.channel.send(sd)
        } else {
            return;
        }
    }

    if (args[0] == "odbierz") {
        if (conf.owner.includes(message.author.id)) {
            const ziomek = 
                message.mentions.members.first() ||
                client.users.cache.get(args[2])

            if (!ziomek) {
                let errorr = new Discord.MessageEmbed()
                .setDescription("> *Nie znalazłem podanego użytkownika w bazie!*")
                .setColor(conf.red)
                .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
                return message.channel.send(errorr)
            }

            if (args[1] == "all") {
                const all = db.get(`${message.author.id}_boosty`)

                db.set(`${message.author.id}_boosty`, 0)

                let sd = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag} | Odbieranie Boostów!`, message.author.displayAvatarURL({dynamic:true}))
                .setColor(conf.green)
                .setDescription("> <:boost:796120730588545044> *Odebrano* `"+all+"` *Boostów od* `"+ziomek.user.tag+"`")
                return message.channel.send(sd)
            }
            if (Number.isNaN(+args[1])) {
                let errorr = new Discord.MessageEmbed()
                .setDescription("> *Argument 2 musi być liczbą!*")
                .setColor(conf.red)
                .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
                return message.channel.send(errorr)
            }

            let nowe = Number(args[1])
            let jeden = Number(db.get(`${message.author.id}_boosty`))

            let matma = Number(jeden - nowe)

            db.set(`${message.author.id}_boosty`, matma)

            let sd = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag} | Odbieranie Boostów!`, message.author.displayAvatarURL({dynamic:true}))
            .setColor(conf.green)
            .setDescription("> <:boost:796120730588545044> *Odebrano* `"+nowe+"` *Boostów od* `"+ziomek.user.tag+"`")
            return message.channel.send(sd)
        } else {
            return;
        }
    }

    if (boosts < 1) {
        let errorr = new Discord.MessageEmbed()
        .setDescription("> *Twoja liczba boostów wynosi* `0` *więc nie możesz zboostować tego serwera!*")
        .setColor(conf.red)
        .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
        return message.channel.send(errorr)
    }

    const permki = message.channel.permissionsFor(client.user)
    if (!permki.has("MANAGE_MESSAGES")) {
        let emed = new Discord.MessageEmbed()
        .setDescription("> *Na kanale* `"+message.channel.name+"` *Nie mam permisji* `Zarządzanie Wiadomościami` *Komenda nie może zostać wykonana ponieważ nie będę mógł wyczyścić reakcji!*")
        .setColor(conf.red)
        .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
        return message.channel.send(emed)
    }

    
    const filter = (reaction, user) => {
      return user.id == message.author.id
    } 

    const cooldown_ziomka = db.get(`boost_cool_${message.author.id}`)
        if (cooldown_ziomka == "tak") {
            const cooldown_byq = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
            .setDescription("> *Zanim dasz kolejknego boosta odczekaj 30 minut!*")
            .setColor(conf.red)
            return message.channel.send(cooldown_byq)
        }

    
    let embed = new Discord.MessageEmbed()
    .setDescription("> <a:czas:796121285880971295> *Czy napewno chcesz dać boosta serwerowi* `"+message.guild.name+"`? \n```Zareaguj odpowiednią Emotką```")
    .setAuthor(`${message.author.tag} | Ad Boost!`, message.author.displayAvatarURL({dynamic:true}))
    .setColor(conf.noye)
    message.channel.send(embed).then(async msg => {
        await msg.react(`787788981471019028`), await msg.react(`787788981474951198`)

        let jd = 1

        const tak = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Ad Boost!`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.green)
        .setDescription("> <:boost:796120730588545044> *Boost został przekazany do kolejki, zostanie aktywowany w przciągu max. 4 minut!*")

        const nie = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Anulowano!`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(conf.red)
        .setDescription("> <:boost:796120730588545044> *Nadanie boosta zostało anulowane!*")

        const brak = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
        .setDescription("> *Serwer* `"+message.guild.name+"` *nie ma ustawionej reklamy!*")
        .setColor(conf.red)

        const collector = msg.createReactionCollector(filter, { time: 60000 })
        

        collector.on("collect", (reaction, user) => {
            reaction.users.remove(user.id)
            if (user.id !== message.author.id) return;
            if (reaction.emoji.id === "787788981471019028") {
                msg.reactions.removeAll()
                jd = 2
                msg.edit(tak)
                const czas = Math.floor(Math.random() * (180000 - 60000)) + 60000;
                setTimeout (function () {
                    db.set(`boost_cool_${message.author.id}`, "nie")
                }, 30 * 60 * 1000);
                db.set(`boost_cool_${message.author.id}`, "tak")

                const nr = db.get(`${message.guild.id}_reklama_nr`)

                const reklama = db.get(`reklama_nr_${nr}`)

                if (reklama == null || reklama == "usunieta" || reklama == "zmiana_odrzucona") return msg.edit(brak)
                client.guilds.cache.forEach(each_serwery => {

                    const invite = db.get(`${message.guild.id}_reklama_invite`)

                    let jeden = Number(1)
                    let boossssttytytyy = Number(db.get(`${message.author.id}_boosty`))

                    let matemax = Number(boossssttytytyy - jeden)

                    db.set(`${message.author.id}_boosty`, matemax)

                    if (!client.channels.cache.get(db.get(`${each_serwery.id}_reklama_kanal`))) return; 
                    if (!db.get(`${each_serwery.id}_reklama_kanal`)) return;
                    const kanalek = client.channels.cache.get(db.get(`${each_serwery.id}_reklama_kanal`))
                    const permissions = kanalek.permissionsFor(client.user)
                    if (!permissions.has("SEND_MESSAGES") || !permissions.has("EMBED_LINKS") || !permissions.has("VIEW_CHANNEL")) return;

                    const kanalek_reklam = db.get(`${each_serwery.id}_reklama_kanal`) 
            
                    const wyslij = client.channels.cache.get(kanalek_reklam)

                    let boooscik = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(`${message.author.tag} | Boost Reklamy!`, message.author.displayAvatarURL({dynamic:true}))
                    .setDescription(reklama)

                    setTimeout (function () {
                        wyslij.send(boooscik).then(wyslij.send("<:linkacz:793591761792401478> *Link:* "+invite))
                    }, czas);  
                    return;
                })
            }
            if (reaction.emoji.id === "787788981474951198") {
                msg.reactions.removeAll()
                jd = 2
                msg.edit(nie)
                return;
            }
        })

        const czas = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Wystąpił Błąd!`, message.author.displayAvatarURL({dynamic:true}))
        .setDescription("> <a:czas:796121285880971295> *Czas Na Dodanie reakcji Minął!*")
        .setColor(conf.red)

        setTimeout (function () {
            if (jd == 1) {
                msg.edit(czas)
                msg.reactions.removeAll()
            } else {return}
        }, 60000); 
    })

    
}

module.exports.config = {
    name: 'boost'
}