require('dotenv').config(); // Recommended way of loading dotenv
import container from "../inversify.config";
import {TYPES} from "./types";
import {MoussaillonBot} from "./bot/moussaillon-bot";
import express from "express";
import bodyParser from "body-parser";

export const app = express();

// App config
app.use(bodyParser.urlencoded({extended: true}));

// Bot
let bot = container.get<MoussaillonBot>(TYPES.MoussaillonBot);
bot.listen().then(() => {
    console.log('Logged in!')
}).catch((error) => {
    console.log('Oh no! ', error)
});

// Routes
// Root listener
app.get('/', (req, res) => {
    res.status(200).send('Moussaillon est en ligne.').end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
