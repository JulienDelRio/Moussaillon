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
                    .setTitle(island.name + " (" + island.sea + ")")
                    .setColor(config.embedColor)
                    .setDescription("Personnage/Lieu de quête : " + island.npc + "\n" +
                        "Commandant : " + island.commander + "\n" +
                        "Carte à collectionner : " + island.cardCode + " - " + island.cardName);
                message.channel.send(embed);
                found = true;
            }
        })
    }
    if (!found)
        message.channel.send("Cette ile est inconnue au bataillon. Retente ta chance matelot.")
}