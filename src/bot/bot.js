'use strict';

const fs = require('fs');
const Discord = require('discord.js')
const config = require('./config.json');
const islands = require("./islands.js");
const testdiscordapi = require("./testdiscordapi.js");
const data = require("../data/data.json");


const discord = new Discord.Client()

var botId = null;

exports.start = function () {
    discord.login(config.token);
}

discord.on('ready', function () {
    console.log(`Je suis connecté : ${discord.user.id}`)

    global.data = data;
})
discord.on('message', message => {
    dispatch(message);
})

function dispatch(message) {
    let testChannel = config.testChannels.includes(message.channel.id);
    console.log(message.channel.name + " is test ? " + testChannel)
    let allowedChannel = config.allowedChannels.includes(message.channel.id);
    console.log(message.channel.name + " is allowed ? " + allowedChannel)
    if (!(allowedChannel || testChannel)) {
        console.log(`Wrong chan ${message.channel.name} (${message.channel.id})`);
        return
    }
    if (message.author.bot) {
        console.log("Message from the bot himself.")
        return;
    }
    if (message.content.startsWith(config.prefix)) {
        let command = message.content.substring(1).split(" ")[0]
        let commandParams = message.content.substring(1 + 1 + command.length);

        switch (command) {
            case "test":
                if (testChannel)
                    testdiscordapi.handle(message, commandParams)
                else
                    console.log("test not allowed in " + message.channel.name);
                break
            case "ile":
                islands.handle(message, commandParams)
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