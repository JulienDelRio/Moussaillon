const Discord = require('discord.js')

const bot = new Discord.Client()

exports.start = function (){
    bot.on('ready', function () {
        console.log("Je suis connecté !")
    })
    bot.on('message', message => {
        if (message.content === 'ping') {
            message.reply('pong !')
        }
    })

    bot.login('ODQ1MjYyMjE0Njg4NjY5NzI3.YKeZyA.cXf5yHDjaqfC8ivgRkHq3YeqIGI')
}