'use strict';

const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");
const version = require('./version.json');
const moussaillonBotPPUrl = "https://cdn.discordapp.com/avatars/845262214688669727/079857eb39dd2161aaca83daaf9982ab.png?size=4096"

exports.isHandled = function (command) {
    switch (command) {
        case "version":
        case "changelog":
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