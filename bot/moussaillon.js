'use strict';

exports.isHandled = function (message, botid) {
    let isHandled = false;
    isHandled = isMentioned(message, botid)
    return isHandled
}

exports.handle = function (message) {
    if (message.content.toLowerCase().includes("bonjour")) {
        message.channel.send(`Bonjour ${message.member.displayName} !`);
    } else if (message.content.toLowerCase().includes("merci")) {
        message.channel.send(`C'est un plaisir. Je serai toujours là pour toi ${message.member.displayName} !`);
    } else {
        message.channel.send("Woof !");
    }
}

function isMentioned(message, botid) {
    let botMention = "<@!" + botid + ">"
    return message.content.toLowerCase().includes(botMention)
}