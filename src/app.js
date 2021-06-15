'use strict';

const express = require('express');
const path = require(`path`);
const bodyParser = require('body-parser');

const app = express();

// App config
app.use(bodyParser.urlencoded({extended: true}));

// Bot
const moussaillon = require("./bot/bot")
moussaillon.start();

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