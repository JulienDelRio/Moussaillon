'use strict';

const config = require('./config.json');
const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");

exports.handle = function (message, commandParams) {
    let lowerCommandParams = commandParams.toLowerCase()
    let found = false;
    if (commandParams.length < 3) {
        message.channel.send("Saisir au moins 3 caractères.")
        found = true;
    } else {
        data.islands.forEach(function (island) {
            if (island.name.toLowerCase().match(lowerCommandParams)) {
                const embed = new MoussaillonMessageEmbed()
                    .setTitle(island.name)
                    .setColor(config.embedColor)
                    .setDescription("L'ile se trouve sur " + island.sea + "\n" +
                        "Elle est controlée par " + island.npc);
                    message.channel.send(embed);
                found = true;
            }
        })
    }
    if (!found)
        message.channel.send("Cette ile est inconnue au bataillon. Retente ta chance matelot.")
}