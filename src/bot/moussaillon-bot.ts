import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {MessageResponder} from "../services/message-responder";

/*
const Discord = require('discord.js')
const {Intents} = require("discord.js");
const dataHelper = require("../../repo_js/bot/dataHelper.js");
const config = require('../../repo_js/bot/config.json');
const islands = require("../../repo_js/bot/islands.js");
const tools = require("../../repo_js/bot/tools.js");
const team = require("../../repo_js/bot/team.js");
const moussaillon = require("../../repo_js/bot/moussaillon.js");
const botinfos = require("../../repo_js/bot/botinfos.js");
const testdiscordapi = require("../../repo_js/bot/testdiscordapi.js");
const data = require("../../repo_js/data/data.json");
const {Intents} = require("discord.js");
const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
]);

const discord = new Discord.Client({ws: {intents}})
*/

@injectable()
export class MoussaillonBot {
    private client: Client;
    private readonly token: string;
    private messageResponder: MessageResponder;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.MessageResponder) messageResponder: MessageResponder) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
    }

    public listen(): Promise<string> {
        this.client.on('message', (message: Message) => {
            if (message.author.bot) {
                console.log('Ignoring bot message!')
                return;
            }

            console.log("Message received! Contents: ", message.content);

            this.messageResponder.handle(message).then(() => {
                console.log("Response sent!");
            }).catch(() => {
                console.log("Response not sent.")
            })
        });

        return this.client.login(this.token);
    }

    private old_dispatch(message: Message) {
        /*
        try {

            let testChannel = data.rights.testChannels.includes(message.channel.id);
            let allowedChannel = data.rights.allowedChannels.includes(message.channel.id);
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

                if (tools.isHandled(command)) {
                    tools.handle(message, commandParams, discord);
                } else if (islands.isHandled(command)) {
                    islands.handle(message, commandParams)
                } else if (team.isHandled(command)) {
                    team.handle(message, data)
                } else if (testdiscordapi.isHandled(command)) {
                    if (testChannel)
                        testdiscordapi.handle(message, commandParams)
                    else
                        console.log("test not allowed in " + message.channel.name);
                } else if (dataHelper.isHandled(command)) {
                    dataHelper.handle(message)
                } else if (botinfos.isHandled(command)) {
                    botinfos.handle(message)
                } else {
                    console.log("It's a command not found : " + command)
                }
                return;
            }
            if (moussaillon.isHandled(message, discord.user.id)) {
                moussaillon.handle(message, discord.user.id)
                return
            }
            if (message.content === 'ping') {
                message.reply('pong !')
                return;
            }
            console.log("Not dispatched : " + message.url)
        } catch (e) {
            console.error("error catching : " + e.message, e);
        }
        */
    }
}