const Discord = require('discord.js')

const discord = new Discord.Client()

exports.start = function (){
    discord.login('ODQ1MjYyMjE0Njg4NjY5NzI3.YKeZyA.cXf5yHDjaqfC8ivgRkHq3YeqIGI')
}

discord.on('ready', function () {
    console.log("Je suis connecté !")
})
discord.on('message', message => {
    if (message.content === 'ping') {
        message.reply('pong !')
    }
})