import {Message} from "discord.js";
import {PingFinder} from "../ping-finder";
import {injectable} from "inversify";
import {ReloadDataCommand} from "./reload-data-command";
import {IslandsInfosCommand} from "./islands-infos-command";
import {MoussaillonCommand} from "./moussaillon-command";
import {BotInfosCommand} from "./bot-infos-command";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private reloadDataCommand: ReloadDataCommand;
    private islandsInfo: IslandsInfosCommand;
    private moussaillonCommand: MoussaillonCommand;
    private botInfosCommand: BotInfosCommand;

    constructor() {
        this.pingFinder = new PingFinder();
        this.reloadDataCommand = new ReloadDataCommand();
        this.islandsInfo = new IslandsInfosCommand();
        this.moussaillonCommand = new MoussaillonCommand();
        this.botInfosCommand = new BotInfosCommand();
    }

    handle(message: Message): Promise<Message | Message[]> {
        try {
            if (this.pingFinder.isHandled(message)) {
                return this.pingFinder.handle(message);
            } else if (this.reloadDataCommand.isHandled(message)) {
                return this.reloadDataCommand.handle(message);
            } else if (this.islandsInfo.isHandled(message)) {
                return this.islandsInfo.handle(message);
            } else if (this.moussaillonCommand.isHandled(message)) {
                return this.moussaillonCommand.handle(message);
            } else if (this.botInfosCommand.isHandled(message)) {
                return this.botInfosCommand.handle(message);
            }
        } catch (e) {
            console.error("Error handling", e)
            return message.reply(e.message)
        }

        return Promise.reject(new NotHandledError("Message not handled"));
    }
}

export interface IMessageInterpreter {
    isHandled(message: Message): boolean;

    handle(message: Message): Promise<Message | Message[]>;
}

export class NotHandledError extends Error {

}
