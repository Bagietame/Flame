const { Client, Collection, Discord } = require("discord.js")
const client = new Client()
const conf = require("./bot/conf.json")
const db = require(`quick.db`)


client.cmds = new Collection()
client.aliases = new Collection()

//odpalanie cmd handlera
const commands = require(`./code/handlers/cmd.handler`)
commands.run(client)

//odpalanie event handlera
const events = require(`./code/handlers/event.handler`)
events.run(client)

//bot loguje sie za pomoca tokenu
client.login(conf.token)

client.on(`guildCreate`, (guild) => {
    client.user.setActivity(`Flame | Serwery: ${client.guilds.cache.size}`, { type: 'WATCHING' })
})

client.on(`guildDelete`, (guild) => {
    client.user.setActivity(`Flame | Serwery: ${client.guilds.cache.size}`, { type: 'WATCHING' })
})

client.on(`ready`, (message) => {
    client.user.setActivity(`Flame | Serwery: ${client.guilds.cache.size}`, { type: 'WATCHING' })
    db.set(`aktualny`, 1)
    console.log(`Zalogowano jako: ${client.user.tag} (${client.user.id})`)
    const channel = client.channels.cache.get(conf.logs)
    const log_bot = new Discord.MessageEmbed()
    .setAuthor(`Log Bot | ${client.user.tag}`, client.user.displayAvatarURL())
    .setDescription("> *Rozpoczęto kolejke! Numer:* `1`")
    .setTimestamp()
    channel.send(log_bot)
    
    setInterval(() => {
        let st = db.get(`kolejka_s`)
        if (st == "tak") {
          run(kolejka)
        } else {
          return;
        }
        
    }, 8 * 60 * 1000)

    async function kolejka() {
        let aktualny = db.get(`aktualny`)

        let reklama = db.get(`reklama_nr_${aktualny}`)
    
        if (
            reklama === "usunieta" ||
            reklama === "zmiana_odrzucona"
            ) {
            const nnum1 = Number(aktualny)
            const nnum2 = Number("1")
            
            const dodawaniee = nnum1 + nnum2
            
            db.set(`aktualny`, dodawaniee)
            run(kolejka)
            return;
        } else if (reklama === null) {
            db.set(`aktualny`, 1)
            const log_bot = new Discord.MessageEmbed()
            .setAuthor(`Ads Bot | ${client.user.tag}`, client.user.displayAvatarURL())
            .setDescription("> *Kolejka zakończona, ustawiono numer na:* `1`")
            .setTimestamp()
            channel.send(log_bot)
            run(kolejka)
            return;
        }
        let id = db.get(`reklama_nr_${aktualny}_uid`) 

        const statystyki = db.get(`reklama_nr_${id}_staty`) 

        if (statystyki == null) {
        db.set(`reklama_nr_${id}_staty`, 0)
        }

        const staty1 = Number(statystyki)
        const staty2 = Number(1)

        const wyjsciowe = staty1 + staty2

        db.set(`reklama_nr_${id}_staty`, wyjsciowe)
    
        client.guilds.cache.forEach(each_serwery => {
            if (!client.channels.cache.get(db.get(`${each_serwery.id}_reklama_kanal`))) return; 
            if (!db.get(`${each_serwery.id}_reklama_kanal`)) return;
            const test = client.channels.cache.get(db.get(`${each_serwery.id}_reklama_kanal`))
            const permissions = test.permissionsFor(client.user)
            if (
                !permissions.has("SEND_MESSAGES") ||
                !permissions.has("EMBED_LINKS") ||
                !permissions.has("VIEW_CHANNEL")
                ) {
                console.log("Brak permijsi w serwerze: "+each_serwery.name)
                const numerek = db.get(`${each_serwery.id}_reklama_nr`)
                db.set(`${each_serwery.id}_reklama_status`, "usunieta")
                db.set(`${each_serwery.id}_reklama`, "usunieta")
                db.set(`${each_serwery.id}_reklama_invite`, null)
                db.set(`${each_serwery.id}_reklama_ustawiajacy`, null)
                db.set(`${each_serwery.id}_reklama_nr`, null)
                db.set(`reklama_nr_${each_serwery.id}_staty`, 0)
                db.set(`${each_serwery.id}_reklama_kanal`, null)

                db.set(`reklama_nr_${numerek}_uid`, null)
                db.set(`reklama_nr_${numerek}`, "usunieta") 

                db.set(`${each_serwery.id}_reklama_powod`, "Brak Permisji do kanału reklam!")
                const owner = client.users.cache.get(`737664846245527603`)
                owner.send(`**${each_serwery.name}** (${each_serwery.id}) **Usunalem im reklame bo mi zajebali permisje :D**`)
                return;
            }

            
            const kanalek_reklam = db.get(`${each_serwery.id}_reklama_kanal`) 
            const zaproszenie = db.get(`${id}_reklama_invite`)

            let kolor_reklamy = db.get(`${id}_typ_kolor`)
            let typ_reklamy = db.get(`${id}_typ`)

            let tresc = ""
            
            if (kolor_reklamy == null) {
              kolor_reklamy = "RANDOM"
            }
            
            if (typ_reklamy === null) {
                typ_reklamy = "normal"
            }

            if (typ_reklamy == "embed" || typ_reklamy == "ramka"){
                tresc = new Discord.MessageEmbed()
                .setColor(kolor_reklamy)
                .setDescription(":1234: "+aktualny+" `//` :id: "+id+"\n\n "+reklama+"\n\n> :link: **-** "+zaproszenie)
                .setFooter("Dziękujemy za wspieranie projektu poprzez subskybcję premium!", "https://flame-bot.pl/images/favicon.png")
            } else if (typ_reklamy == "normal" || typ_reklamy == "normalna") {
                tresc = ":1234: "+aktualny+" `//` :id: "+id+"\n\n "+reklama+"\n\n> :link: **-** "+zaproszenie
            }

            const wyslij = client.channels.cache.get(kanalek_reklam)
            if (typ_reklamy == "embed" || typ_reklamy == "ramka") {
                wyslij.send(tresc)
                wyslij.send("^^ :link: **-** "+zaproszenie)
            } else {
                wyslij.send(tresc)
            }
            
            const num1 = Number(aktualny)
            const num2 = Number("1")
            
            const dodawanie = num1 + num2
            
            db.set(`aktualny`, dodawanie)
        })
    }
    })

//usuniety kanal reklam 


client.on(`channelDelete`, (channel) => {
        const kanal = db.get(`${channel.guild.id}_reklama_kanal`)

        if (kanal == channel.id) {
            const ziomek = db.get(`${channel.guild.id}_reklama_ustawiajacy`)
            const nr = db.get(`${channel.guild.id}_reklama_nr`)
            db.set(`${channel.guild.id}_reklama_status`, "usunieta")
            db.set(`${channel.guild.id}_reklama`, "usunieta")
            db.set(`${channel.guild.id}_reklama_invite`, null)
            db.set(`${channel.guild.id}_reklama_ustawiajacy`, null)
            db.set(`${channel.guild.id}_reklama_nr`, null)

            db.set(`reklama_nr_${nr}_uid`, null)
            db.set(`reklama_nr_${nr}`, "usunieta")
            
            db.set(`${channel.guild.id}_reklama_kanal`, null)

            const typ = client.users.cache.get(ziomek)

            const kanal = client.channels.cache.get(conf.logs)

            if (!typ) {
                db.set(`${channel.guild.id}_reklama_powod`, "Usunięty kanał reklam.")
                const botlog = new Discord.MessageEmbed()
                .setColor(conf.red)
                .setAuthor(`Ads Log | Usunięty kanał reklam!`, client.user.displayAvatarURL({dynamic:true}))
                .setDescription("> <:kanal:791027115473502238> *Kanał reklam serwera* `"+channel.guild.name+" ("+channel.guild.id+")` *został usunięty, nasz system automatycznie usunął ich reklame z bazy!*\n> <a:nocross:787788981474951198> *Błąd:* `Wiadomość dm do własiciela nie została wysłana, nie odnalazłem własciciela w cache'u!`")
                return kanal.send(botlog)
            }

            const botlog = new Discord.MessageEmbed()
            .setColor(conf.red)
            .setAuthor(`Ads Log | Usunięty kanał reklam!`, typ.displayAvatarURL({dynamic:true}))
            .setDescription("> <:kanal:791027115473502238> *Kanał reklam serwera* `"+channel.guild.name+" ("+channel.guild.id+")` *został usunięty, nasz system automatycznie usunął ich reklame z bazy!*")
            kanal.send(botlog)

            const dmlog = new Discord.MessageEmbed()
            .setDescription("> *Witaj, "+typ.tag+" Twoja reklama serwera* `"+channel.guild.name+"` *została usunięta z powodu usunięcia kanału reklam! Ustaw ją ponownie:*\n```.reklama <reklama>```")
            .setColor(conf.red)
            .setFooter(`By: Automatic Channel System`, "")
            .setAuthor(`${typ.tag} | Usunięty kanał reklam!`, typ.displayAvatarURL({dynamic:true}))
            typ.send(dmlog)

            db.set(`${channel.guild.id}_reklama_powod`, "Usunięty kanał reklam.")
        }
})

//usuniecie bota 

client.guilds.cache.forEach(g => {
    message.channel.send(g.name)
})

client.on(`guildDelete`, (guild) => {
        const ziomek = db.get(`${guild.id}_reklama_ustawiajacy`)
        const nr = db.get(`${guild.id}_reklama_nr`)
        db.set(`${guild.id}_reklama_status`, "usunieta")
        db.set(`${guild.id}_reklama`, "usunieta")
        db.set(`${guild.id}_reklama_invite`, null)
        db.set(`${guild.id}_reklama_ustawiajacy`, null)
        db.set(`${guild.id}_reklama_nr`, null)
        

        db.set(`reklama_nr_${nr}_uid`, null)
        db.set(`reklama_nr_${nr}`, "usunieta")
        
        db.set(`${guild.id}_reklama_kanal`, null)

        const typ = client.users.cache.get(ziomek)

        const kanal = client.channels.cache.get(conf.logs)

        if (!typ) {
          db.set(`${guild.id}_reklama_powod`, "Bot Usunięty.")
            return;
        }

        const dmlog = new Discord.MessageEmbed()
        .setDescription("> *Witaj, "+typ.tag+" Bot został usunięty z serwera* `"+guild.name+"` *automatycznie usunęliśmy reklame z kolejki!*")
        .setColor(conf.red)
        .setFooter(`By: Automatic Server System`, "")
        .setAuthor(`${typ.tag} | Bot Usunięty!`, typ.displayAvatarURL({dynamic:true}))
        typ.send(dmlog)

        db.set(`${guild.id}_reklama_powod`, "Bot Usunięty.")    
        
        let kanalll = client.channels.cache.get(conf.nowyserw)

        const invitechannels = guild.channels.cache.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));

        invitechannels.random().createInvite({
            maxAge: 0
        }).then(zapro => {
            let loggg = new Discord.MessageEmbed()
            .setAuthor(`Usunięty Serwer!`, guild.iconURL({dynamic:true})) 
            .setThumbnail(guild.iconURL({dynamic:true}))
            .setDescription("> <:DatabaseCheck:793602271841484840> *Serwer:* `"+guild.name+" ("+guild.id+")` *[[Zaproszenie](https://discord.gg/"+zapro.code+")]*")
            .setColor(conf.red)
            kanalll.send(loggg)
        })
})

//nowy serwer 

client.on(`guildCreate`, async (guild) => {
    let kanalll = client.channels.cache.get(conf.nowyserw)
    db.set(`reklama_nr_${guild.id}_staty`, 0)

    const invitechannels = guild.channels.cache.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));

    invitechannels.random().createInvite({
        maxAge: 0
    }).then(zapro => {
        let loggg = new Discord.MessageEmbed()
        .setAuthor(`Nowy Serwer!`, guild.iconURL({dynamic:true})) 
        .setThumbnail(guild.iconURL({dynamic:true}))
        .setDescription("> <:DatabaseCheck:793602271841484840> *Serwer:* `"+guild.name+" ("+guild.id+")` *[[Zaproszenie](https://discord.gg/"+zapro.code+")]*")
        .setColor(conf.green)
        kanalll.send(loggg)
    })
})