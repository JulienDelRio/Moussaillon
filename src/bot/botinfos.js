'use strict';

const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");
const version = require('./version.json');

exports.isHandled = function (command) {
    switch (command) {
        case "version":
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
        default:
            console.error("Not a good command : " + command)
            return
    }
}

function handleVersion(message) {
    message.channel.send("Version : " + version.currentVersion)
}
