import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {MessageResponder, NotHandledError} from "../services/commands/message-responder";
import {GoogleSheetDataLoader} from "../data/google-sheet-data-loader";
import {Environment} from "../tools/environment";
import {MoussaillonData} from "../data/models/moussaillon-data";

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
}