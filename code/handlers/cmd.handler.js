const { readdirSync } = require(`fs`)
const { join, sep } = require(`path`)
const filePath = join(__dirname, "..", "cmd")

module.exports.run = (client) => {
    readdirSync(filePath).forEach(dirs => {
        for (const cmd of readdirSync(filePath+`${sep}${dirs}${sep}`).filter(cmd => cmd.endsWith(".js"))) {
            const prop = require(filePath+`${sep}${dirs}${sep}`+"/"+cmd)
            client.cmds.set(prop.config.name, prop)

            if (prop.config.aliases) for (const alias of prop.config.aliases) {
                client.aliases.set(alias, prop)
            }
        }
    })
    client.cmds.forEach(kom => {
        console.log(`Komenda ${kom.name}, została załadowana!`)
    })
    console.log(`Załadowana ilość komend: ${client.cmds.size}`)
}