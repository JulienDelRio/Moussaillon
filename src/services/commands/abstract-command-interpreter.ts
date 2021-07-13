import {Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {IMessageInterpreter} from "./message-responder"

@injectable()
export abstract class AbstractCommandInterpreter implements IMessageInterpreter {
    private _commandChar: string;

    constructor(@inject(TYPES.CommandChar) commandChar: string) {
        this._commandChar = commandChar;
    }

    abstract isHandled(message: Message): boolean;

    abstract handle(message: Message): Promise<Message | Message[]>;

    getCommand(message: Message): String {
        if (this._commandChar === undefined) {
            throw new Error("Command should be initialized")
        }
        let command = message.content.substring(1).split(" ")[0].toLowerCase();
        return command;
    }

    getFullCommand(message: Message): String {
        let command = message.content.substring(1).toLowerCase();
        return command;
    }

    isCommand(message: Message): boolean {
        if (typeof this._commandChar === "string") {
            return message.content.startsWith(this._commandChar)
        } else {
            throw new Error("Command char should be a string");
        }
    }

}