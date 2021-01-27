const Discord = require("discord.js");
const conf = require("../../../bot/conf.json")
const { inspect } = require('util');
const db = require(`quick.db`)
module.exports.run = async (client, message, args) => {

    if (!args.length) {
        let argument = new Discord.MessageEmbed()
        .setDescription("> <:vs:792894988613845003> *Podaj Kod Do Ewaluacji!*")
        .setColor(conf.red)
        return message.channel.send(argument)
    }

    
    let evaled;
    try {
      evaled = await eval(args.join(" "));
      let value;
      if (evaled === undefined) {
          value = "Brak odpowiedzi!"
      } else {
          value = evaled
      }
      if (args.join(" ").toLowerCase().includes("token")) {
          value = "heheheheehehehe.huehuehue.xdxdxd.spierdalaj"
      }
      console.log(inspect(evaled));
      let hrStart = process.hrtime()
      let hrDiff;
      hrDiff = process.hrtime(hrStart)
      const embedgit = new Discord.MessageEmbed()
      .setAuthor(`By ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(conf.green)                  
      .setDescription("> <:vs:792894988613845003> *Kod Do Ewaluacji:* \n```javascript\n"+args.join(" ")+"```\n\n> <:zwroconed:792896752675979264> *Zwrócona Odpowiedź:* \n```"+value+"```\n\n> <:ping:788705251766042655> *Czas Odpowiedzi:*\n```" + `${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}` + "ms```")
      message.channel.send(embedgit)
    }
    catch (error) {
      console.log(error);
      const eo = new Discord.MessageEmbed()
      .setColor(conf.red)
      .setAuthor(`By ${message.author.tag}`, message.author.displayAvatarURL())
      .setDescription("<a:nocross:787788981474951198> __**Wystąpił Błąd:**__\n```"+error+"```")
      message.channel.send(eo)
    }
}

module.exports.config = {
    name: "eval",
    aliases: ["ewaluacja", "e"],
    owner: "yes"
}