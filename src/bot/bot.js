const Discord = require('discord.js')

const discord = new Discord.Client()

var botId;

exports.start = function () {
    discord.login('ODQ1MjYyMjE0Njg4NjY5NzI3.YKeZyA.cXf5yHDjaqfC8ivgRkHq3YeqIGI')
}

discord.on('ready', function () {
    console.log(`Je suis connecté : ${discord.user.id}`)
})
discord.on('message', message => {
    console.log(`New message from ${message.member} : ${message.content}`)
    dispatch(message);
})

function dispatch(message) {
    if (message.content === 'ping') {
        message.reply('pong !')
    } else if (message.content.match(`bonjour <@!${discord.user.id}>`)) {
        console.log(JSON.stringify(message, null, 4))
        message.channel.send(`Bonjour ${message.member} !`);
    }
}