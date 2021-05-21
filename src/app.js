'use strict';

const express = require('express');
const path = require(`path`);
const bodyParser = require('body-parser');

const app = express();

// App config
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// Root listener
app.get('/', (req, res) => {
    res.status(200).send('Hello, world!').end();
});

// Add Submit listener
app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/submit.html'));
});

app.post('/submit', (req, res) => {
    console.log({
        name: req.body.name,
        message: req.body.message
    });
    res.send('Thanks for your message!');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;