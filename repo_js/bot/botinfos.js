'use strict';

const MoussaillonMessageEmbed = require("../../src/tools/discord/moussaillon-message-embed.ts");
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
            break
        case "changelog":
            handleChangelog(message)
            break
        case "history":
            handleHistory(message)
            break
        default:
            console.error("Not a good command : " + command)
            break
    }
}

function handleVersion(message) {
    message.channel.send("Version : " + version.currentVersion)
}

function displayVersion(version, embed, isLong = false) {
    if (isLong) {
        if (version.changelog.long && Array.isArray(version.changelog.long)) {
            for (let i = 0; i < version.changelog.long.length; i++) {
                let changelogpart = version.changelog.long[i];
                embed.addField("Version " + version.version + " part " +
                    (i + 1), changelogpart)
            }
        } else {
            let changelog;
            if (version.changelog.long)
                changelog = version.changelog.long;
            else
                changelog = version.changelog.short;
            embed.addField("Version " + version.version, changelog)
        }
    } else {
        let changelog = version.changelog.short;
        embed.addField("Version " + version.version, changelog)
    }
}

function handleChangelog(message) {
    let commandElements = message.content.split(" ")
    let selectedVersion = 0;
    if (commandElements.length <= 1) {
        // No param
    } else {
        let paramVersion = commandElements[1]
        let found = false
        for (let i = 0; i < version.hystory.length && !found; i++) {
            let versionTested = version.hystory[i].version;
            var match = versionTested.match(paramVersion);
            if (match && versionTested === match[0]) {
                selectedVersion = i;
                found = true
            }
        }
    }

    let versionToDisplay = version.hystory[selectedVersion];

    if (versionToDisplay) {
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
            .setTitle("Changelog de Moussaisson")
            .setThumbnail(moussaillonBotPPUrl)
        displayVersion(versionToDisplay, embed, true);
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
        displayVersion(version.hystory[i], embed)
        //embed.addField(version.hystory[i].version, version.hystory[i].changelog)
    }

    message.channel.send(embed);

}