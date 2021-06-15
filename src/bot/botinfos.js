'use strict';

const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");
const version = require('./version.json');
const moussaillonBotPPUrl = "https://cdn.discordapp.com/avatars/845262214688669727/079857eb39dd2161aaca83daaf9982ab.png?size=4096"

exports.isHandled = function (command) {
    switch (command) {
        case "version":
        case "changelog":
        case "history":
            return true;
        default:
            return false
    }
}

exports.handle = function (message) {
    let command = message.content.substring(1).split(" ")[0].toLowerCase();
    switch (command) {
        case "version":
            handleVersion(message)
        case "changelog":
            handleChangelog(message)
        case "history":
            handleHistory(message)
        default:
            console.error("Not a good command : " + command)
            return
    }
}

function handleVersion(message) {
    message.channel.send("Version : " + version.currentVersion)
}

function handleChangelog(message) {
    let lastVersion = version.hystory[0];

    if (lastVersion) {
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
            .setTitle("Changelog de Moussaisson")
            .setThumbnail(moussaillonBotPPUrl)
            .addField("Version " + lastVersion.version, lastVersion.changelog)
        message.channel.send(embed);
    } else {
        message.channel.send("Il n'y a pas de changelog...")
    }
}

function handleHistory(message) {
    let commandElements = message.content.split(" ")
    let nbVersion = 10
    if (commandElements.length <= 1) {
        // No param
    } else {
        let parsedNbRanks = Number.parseInt(commandElements[1])
        if (!Number.isNaN(parsedNbRanks) && parsedNbRanks > 0) {
            nbVersion = parsedNbRanks
        }
    }

    const embed = new MoussaillonMessageEmbed()
        .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
        .setTitle("Historique des versions de Moussaisson")
        .setThumbnail(moussaillonBotPPUrl)

    for (let i = 0; i < nbVersion && i < version.hystory.length; i++) {
        embed.addField(version.hystory[i].version, version.hystory[i].changelog)
    }

    message.channel.send(embed);

}