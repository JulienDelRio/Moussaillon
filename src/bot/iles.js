'use strict';

exports.handle = function (message, commandParams) {
    let lowerCommandParams = commandParams.toLowerCase()
    let found = false;
    data.iles.forEach(function (ile) {
        if (ile.name.toLowerCase() == lowerCommandParams){
            message.channel.send(ile.name + " dans la mer " + ile.sea)
            found = true;
        }
    })
    if (!found)
        message.channel.send("Cette ile est inconnue au bataillon. Retente ta chance matelot.")
}