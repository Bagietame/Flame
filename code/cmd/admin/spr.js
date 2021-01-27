const db = require("quick.db")
const conf = require("../../../bot/conf.json")
const Discord = require(`discord.js`)

module.exports.run = async (client, message, args) => {
    if (!args.length) {
        let bladargs = new Discord.MessageEmbed()
        .setDescription("> *Podaj Argumenty!*")
        .setColor(conf.red)
        return message.channel.send(bladargs)
    }

    const reklama = db.get(`reklama_nr_${args[0]}`)
    const uid = db.get(`reklama_nr_${args[0]}_uid`)
    const status = db.get(`${uid}_reklama_status`)

    let sukces = new Discord.MessageEmbed()
    .setDescription("> *Nr:* `"+args[0]+"` \n\n> *Id:* `"+uid+"`\n> *Status:* `"+status+"`\n\n> *Reklama:* ```"+reklama+"```")
    .setColor(conf.green)
    message.channel.send(sukces)
}

module.exports.config = {
    name: "spr",
    aliases: ["sprawdz", "sprawdź"],
    wer: "yes"
}