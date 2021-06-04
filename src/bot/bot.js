'use strict';

const fs = require('fs');
const Discord = require('discord.js')
const iles = require("./iles.js")


const discord = new Discord.Client()

var botId = null;

exports.start = function () {
    discord.login('ODQ1MjYyMjE0Njg4NjY5NzI3.YKeZyA.cXf5yHDjaqfC8ivgRkHq3YeqIGI')
}

discord.on('ready', function () {
    console.log(`Je suis connecté : ${discord.user.id}`)

    let rawdata = fs.readFileSync('./data/data.json');
    global.data = JSON.parse(rawdata);
})
discord.on('message', message => {
    console.log(`New message from ${message.member} : ${message.content}`)
    dispatch(message);
})

function dispatch(message) {
    if (message.author.bot) {
        console.log("Message from the bot himself.")
        return;
    }
    if (message.content.startsWith("=")) {
        let command = message.content.substring(1).split(" ")[0]
        let commandParams = message.content.substring(1 + 1 + command.length);

        switch (command) {
            case "ile":
                iles.handle(message, commandParams)
                break
            default:
                console.log("It's a command : " + command)
        }
        return;
    }
    if (message.content === 'ping') {
        message.reply('pong !')
        return;
    }
    if (message.content.toLowerCase().match(`bonjour <@!${discord.user.id}>`.toLowerCase())) {
        message.channel.send(`Bonjour ${message.member} !`);
        return;
    }

    console.log("Not dispatched")
}