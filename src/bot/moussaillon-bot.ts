import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {MessageResponder, NotHandledError} from "../services/commands/message-responder";
import {GoogleSheetDataLoader} from "../data/google-sheet-data-loader";
import {Environment} from "../tools/environment";
import {MoussaillonData} from "../data/models/moussaillon-data";

/*
const Discord = require('discord.js')
const {Intents} = require("discord.js");
const dataHelper = require("../../repo_js/bot/reload-data-command.ts");
const config = require('../../repo_js/bot/config.json');
const islands = require("../../repo_js/bot/islands-infos-command.ts");
const team = require("../../repo_js/bot/team-command.ts");
const moussaillon = require("../../repo_js/bot/moussaillon-command.ts");
const botinfos = require("../../repo_js/bot/bot-infos-command.ts");
const testdiscordapi = require("../../repo_js/bot/tools-command.ts");
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
    private readonly _client: Client;
    private readonly _token: string;
    private readonly _messageResponder: MessageResponder;
    private _data: MoussaillonData | undefined;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.MessageResponder) messageResponder: MessageResponder) {
        this._client = client;
        this._token = Environment.getInstance().getBotToken();
        this._messageResponder = messageResponder;
    }

    public listen(): Promise<string> {
        this._client.on('messageCreate', (message: Message) => {
            if (message.author.bot) {
                console.log('Ignoring bot message!')
                return;
            }

            console.log("Message received! Check it :", message.url);

            this._messageResponder.handle(message).then(() => {
                console.log("Message handled");
            }).catch((e) => {
                if (e instanceof NotHandledError) {
                    //console.error("Response not needed.")
                } else {
                    console.error("An error occurred during handling", e)
                }
            })
        });

        return this.initBot()
    }

    private initBot(): Promise<string> {
        return new Promise<string>((resolved, rejects) => {
            console.log("Load data");
            let dataLoader = new GoogleSheetDataLoader();
            dataLoader.loadData().then((data) => {
                console.log("data loaded");
                this._data = data;
                this._client.login(this._token).then(res => {
                    resolved("ok")
                }).catch((e) => {
                    rejects(e);
                })
            }).catch((e) => {
                rejects(e);
            })
        });
    }

    get data(): MoussaillonData {
        if (this._data === undefined) {
            console.error(new Error("Data should be initialized"));
            throw new Error("Data should be initialized");
        }
        return this._data;
    }

    get id(): string {
        if (this._client.user == null)
            throw new Error("User bot not found");
        return this._client.user.id;
    }


    get client(): Client {
        return this._client;
    }

    updateData(data: MoussaillonData) {
        this._data = data;
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