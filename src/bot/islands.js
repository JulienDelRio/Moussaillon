'use strict';

exports.handle = function (message, commandParams) {
    let lowerCommandParams = commandParams.toLowerCase()
    let found = false;
    if (commandParams.length < 3) {
        message.channel.send("Saisir au moins 3 caractères.")
        found = true;
    } else {
        data.islands.forEach(function (ile) {
            if (ile.name.toLowerCase().match(lowerCommandParams)) {
                message.channel.send(ile.name + " dans la mer " + ile.sea)
                found = true;
            }
        })
    }
    if (!found)
        message.channel.send("Cette ile est inconnue au bataillon. Retente ta chance matelot.")
}