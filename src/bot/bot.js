'use strict';

const fs = require('fs');
const Discord = require('discord.js')
const config = require('./config.json');
const islands = require("./islands.js");
const tools = require("./tools.js");
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
    try {

        let testChannel = config.testChannels.includes(message.channel.id);
        let allowedChannel = config.allowedChannels.includes(message.channel.id);
        if (!(allowedChannel || testChannel)) {
            console.log(`Wrong chan ${message.channel.name} (${message.channel.id})`);
            return
        }
        if (message.author.bot) {
            console.log("Message by a bot.")
            return;
        }
        if (message.content.startsWith(config.prefix)) {
            let command = message.content.substring(1).split(" ")[0].toLowerCase();
            let commandParams = message.content.substring(1 + 1 + command.length);

            if (tools.isHandled(command)){
                tools.handle(message, commandParams, discord);
            } else if (islands.isHandled(command)) {
                islands.handle(message, commandParams)
            } else if (testdiscordapi.isHandled(command)){
                if (testChannel)
                    testdiscordapi.handle(message, commandParams)
                else
                    console.log("test not allowed in " + message.channel.name);
            } else {
                console.log("It's a command not found : " + command)
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
        console.log("Not dispatched : " + message.url)
    } catch (e) {
        console.error("error catching : " + e.message, e);
    }
}