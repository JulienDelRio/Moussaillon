'use strict';

const express = require('express');
const path = require(`path`);
const bodyParser = require('body-parser');
const Discord = require('discord.js')


const app = express();
const bot = new Discord.Client()

// App config
app.use(bodyParser.urlencoded({extended: true}));

// Bot
bot.on('ready', function () {
    console.log("Je suis connecté !")
})
bot.on('message', message => {
    if (message.content === 'ping') {
        message.reply('pong !')
    }
})

bot.login('ODQ1MjYyMjE0Njg4NjY5NzI3.YKeZyA.cXf5yHDjaqfC8ivgRkHq3YeqIGI')

// Routes
// Root listener
app.get('/', (req, res) => {
    res.status(200).send('Hello, world!').end();
});

// Api
// ----- Interactions
app.post('/api/interactions', (req, res) => {
    var reqIp = req.headers['x-appengine-user-ip'];
    if(!reqIp) reqIp = req.ip
    console.log(`Request received from ${reqIp}`);
    res.setHeader('content-type', 'application/json');
    let payload = {
        "type": 1
    }
    res.status(200).send(JSON.stringify(payload, null, 4)).end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;