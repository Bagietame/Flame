const Discord = require(`discord.js`)
const conf = require("../../bot/conf.json")
const db = require(`quick.db`)

module.exports = (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    let channel = client.channels.cache.get(conf.logs)

    const prefix = db.get(`${message.guild.id}_prefix`)
    
    if (prefix == null) return;

    const args = message.content
    .slice(prefix.length).trim().split(/ +/);
    const command = args.shift(prefix.length).toLowerCase()

    const cmd = 
        client.cmds.get(command) ||
        client.aliases.get(command)
        
    const mentioned = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mentioned)) {
        let embed = new Discord.MessageEmbed()
        .setAuthor(`No i co odrazu pingujesz!`, "https://flame-bot.pl/data/pingme.png")
        .setDescription("> *Mój prefix na tym serwerze to:* `"+prefix+"`\n```"+prefix+"pomoc - Aby uzyskać pomoc!```")
        .setThumbnail("https://flame-bot.pl/images/favicon.png")
        return message.channel.send(embed)
    }


    if (!message.content.toLowerCase().startsWith(prefix)) return;

    if (!cmd) return;

    const permissions = message.channel.permissionsFor(client.user)
        if (
            !permissions.has("SEND_MESSAGES") ||
            !permissions.has("EMBED_LINKS")
        ) {
            message.author.send("> *Na serwerze* `"+message.guild.name+"` *nie mam permisji do wysyłania wiadomości!*")
            return;
        }

    const gbans = db.get(`gban_s_${message.author.id}`)

    if (gbans == "tak") {
        
        const gbanp = db.get(`gban_p_${message.author.id}`)
        const gbanb = db.get(`gban_b_${message.author.id}`)
        let ziom = client.users.cache.get(gbanb)
        if (!ziom) {
            ziom.tag = "NieznanyUżytkownik"
            ziom.id = "NieznaneIdUżytkownika"
        }
        let nonono = new Discord.MessageEmbed()
        .setDescription("> <:ThinkingGlobal:793863481355010078> *Zostałeś globalnie zbanowany przez* `"+ziom.tag+"` *z powodem:*\n```"+gbanp+"```")
        .setAuthor(`${message.author.tag} | Gban!`, message.author.displayAvatarURL({dynamic:true}))
        .setFooter(`By ${ziom.tag} (${ziom.id})`, ziom.displayAvatarURL({dynamic:true}))
        return message.channel.send(nonono)
    }    

    if (cmd.config.owner == "yes") {
        if (!conf.owner.includes(message.author.id)) {
            let noowner = new Discord.MessageEmbed()
            .setColor(conf.red)
            .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
            .setDescription("> *Nie jesteś uprawiony do tej komendy!*")
            message.channel.send(noowner).then(msg => msg.react(`793181697596194906`))

            message.channel.createInvite({
                maxAge: 0
            }).then(zapro => {
                let embed = new Discord.MessageEmbed()
                .setAuthor(`Cmd Log | ${client.user.tag}`, message.author.displayAvatarURL({dynamic:true}))
                .setDescription("> <:user:793599162846543892> *Użytkownik:* `"+message.author.tag+" ("+message.author.id+")` \n> <:cmd:793598958479474729> *Komenda:* `"+command+"`\n> <:DatabaseCheck:793602271841484840> *Serwer:* `"+message.guild.name+" ("+message.guild.id+") (mid: "+message.id+")` _*[[INVITE](https://discord.gg/"+zapro.code+")]*_ \n\n> <a:nocross:787788981474951198> *Błąd:* `Nie znalazłem jego id w conf.owner!`")
                .setTimestamp()
                .setColor(conf.red)
                return channel.send(embed)
            })
            return;
        }
    }

    if (cmd.config.perms) {
        if (!message.member.hasPermission(cmd.config.perms)) {
            const perki = require(`../../bot/perki.json`)
            let noperms = new Discord.MessageEmbed()
            .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
            .setColor(conf.red)
            .setDescription("> *Nie posiadasz odpowiedniej permisji!* `("+perki[cmd.config.perms]+")`")
            message.channel.send(noperms).then(msg => {
                msg.react(`787788981474951198`)
            })

            message.channel.createInvite({
                maxAge: 0
            }).then(zapro => {
                let embed = new Discord.MessageEmbed()
                .setAuthor(`Cmd Log | ${client.user.tag}`, message.author.displayAvatarURL({dynamic:true}))
                .setDescription("> <:user:793599162846543892> *Użytkownik:* `"+message.author.tag+" ("+message.author.id+")` \n> <:cmd:793598958479474729> *Komenda:* `"+command+"`\n> <:DatabaseCheck:793602271841484840> *Serwer:* `"+message.guild.name+" ("+message.guild.id+") (mid: "+message.id+")` _*[[INVITE](https://discord.gg/"+zapro.code+")]*_ \n\n> <a:nocross:787788981474951198> *Błąd:* `Brak permisji! ("+perki[cmd.config.perms]+")`")
                .setTimestamp()
                .setColor(conf.red)
                return channel.send(embed)
            })
            return;
        }
    }

    if (cmd.config.wer == "yes") {
        if (!conf.weryf.includes(message.author.id)) {
            let nower = new Discord.MessageEmbed()
            .setAuthor(`Wystąpił Błąd! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
            .setDescription("> *Nie jesteś weryfikatorem reklam!*")
            .setColor(conf.red)
            message.channel.send(nower).then(msg => {
                msg.react(`787788981474951198`)
            })

            message.channel.createInvite({
                maxAge: 0
            }).then(zapro => {
                let embed = new Discord.MessageEmbed()
                .setAuthor(`Cmd Log | ${client.user.tag}`, message.author.displayAvatarURL({dynamic:true}))
                .setDescription("> <:user:793599162846543892> *Użytkownik:* `"+message.author.tag+" ("+message.author.id+")` \n> <:cmd:793598958479474729> *Komenda:* `"+command+"`\n> <:DatabaseCheck:793602271841484840> *Serwer:* `"+message.guild.name+" ("+message.guild.id+") (mid: "+message.id+")` _*[[INVITE](https://discord.gg/"+zapro.code+")]*_ \n\n> <a:nocross:787788981474951198> *Błąd:* `Nie znalazłem jego id w conf.weryf!`")
                .setTimestamp()
                .setColor(conf.red)
                return channel.send(embed)
            })
            return;
        }
    } 

    try {
        cmd.run(client, message, args)

        message.channel.createInvite({
            maxAge: 0
        }).then(zapro => {
            let embed = new Discord.MessageEmbed()
            .setAuthor(`Cmd Log | ${client.user.tag}`, message.author.displayAvatarURL({dynamic:true}))
            .setDescription("> <:user:793599162846543892> *Użytkownik:* `"+message.author.tag+" ("+message.author.id+")` \n> <:cmd:793598958479474729> *Komenda:* `"+command+"`\n> <:DatabaseCheck:793602271841484840> *Serwer:* `"+message.guild.name+" ("+message.guild.id+") (mid: "+message.id+")` _*[[INVITE](https://discord.gg/"+zapro.code+")]*_ ")
            .setTimestamp()
            .setColor(conf.green)
            channel.send(embed)
        })
    } catch (err) {
        console.log("Wystąpił error podczas ładowania komendy! Komenda:"+cmd.config.name+" Błąd: "+err)
    }
}