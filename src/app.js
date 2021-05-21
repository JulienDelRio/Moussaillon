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

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;