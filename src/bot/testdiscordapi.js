'use strict';

const config = require('./config.json');
const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");

exports.handle = function (message, commandParams) {
    console.log(`commandParams ${commandParams}`)
    const embed = new MoussaillonMessageEmbed()
        .setTitle('A slick little embed')
        .setColor(config.embedColor)
        .setDescription('Hello, this is a slick embed!');
    message.channel.send(embed);
}