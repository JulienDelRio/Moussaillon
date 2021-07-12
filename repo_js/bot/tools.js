'use strict';

const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");

exports.isHandled = function (command) {
    switch (command) {
        default:
            return false
    }
}

exports.handle = function (message) {
    let command = message.content.substring(1).split(" ")[0].toLowerCase();
    switch (command) {
        default:
            console.error("Not a good command : " + command)
            return
    }
}