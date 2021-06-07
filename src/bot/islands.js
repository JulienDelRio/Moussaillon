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
                // Prepare data
                let islandName = defaultValuedefaultValue(island.name, "A venir..");
                let islandSea = defaultValuedefaultValue(island.sea, "A venir..");
                let npc = defaultValuedefaultValue(island.npc, "A venir..");
                let commander = defaultValuedefaultValue(island.commander, "A venir..");
                let cardCode = defaultValuedefaultValue(island.cardCode, "A venir..");
                let cardName = defaultValuedefaultValue(island.cardName, "A venir..");
                let routeFrom = defaultValuedefaultValue(island.routeFrom, "A venir...");
                let routeTo = defaultValuedefaultValue(island.routeTo, "A venir...");
                let boat = defaultValuedefaultValue(island.boat, "Non........");
                let claimed = defaultValuedefaultValue(island.claimed, "Personne");
                let poneglyphe = defaultValuedefaultValue(island.poneglyphe, "Non");

                // Create message
                const embed = new MoussaillonMessageEmbed()
                    .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
                    .setTitle(islandName + " (" + islandSea + ")")
                    .setColor(config.embedColor)
                    .addField("Controlé par", claimed)
                    .addField("Personnage/Lieu de quête", npc, true)
                    .addField("Commandant", commander, true)
                    .addField("Carte à collectionner", cardCode + " - " + cardName, true)
                    .addField("Vous pouvez y arriver par...", routeFrom, true)
                    .addField("Vous pouvez allez vers...", routeTo, true)
                    .addField('\u200b', '\u200b')
                    .addField("And now... Spoilers...", '\u200b')
                    .addField("Y'a-t-il un Poneglyphe ?", "||" + poneglyphe + "||", true)
                    .addField("Un bateau ?", "||" + boat + "||", true);

                // Send message
                message.channel.send(embed);
                found = true;
            }
        })
    }
    if (!found)
        message.channel.send("Cette ile est inconnue au bataillon. Retente ta chance matelot.")
}

function defaultValuedefaultValue(value, defaultValue) {
    if (!value || value.length === 0)
        return defaultValue
    else
        return value
}