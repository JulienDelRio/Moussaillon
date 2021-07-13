import {Message} from "discord.js";
import {PingFinder} from "../ping-finder";
import {inject, injectable} from "inversify";
import {ReloadDataCommand} from "./reload-data-command";
import {TYPES} from "../../types";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private reloadDataCommand: ReloadDataCommand;

    constructor(@inject(TYPES.ReloadDataCommand) googleSheetCommand: ReloadDataCommand) {
        this.pingFinder = new PingFinder();
        this.reloadDataCommand = googleSheetCommand;
    }

    handle(message: Message): Promise<Message | Message[]> {
        try {
            if (this.pingFinder.isHandled(message)) {
                return this.pingFinder.handle(message);
            } else if (this.reloadDataCommand.isHandled(message)) {
                return this.reloadDataCommand.handle(message);
            }
        } catch (e) {
            return message.reply(e.message)
        }

        return Promise.reject();
    }
}

export interface IMessageInterpreter {
    isHandled(message: Message): boolean;

    handle(message: Message): Promise<Message | Message[]>;
}

