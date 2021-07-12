import {Message} from "discord.js";
import {PingFinder} from "./ping-finder";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;

    constructor(
        @inject(TYPES.PingFinder) pingFinder: PingFinder
    ) {
        this.pingFinder = pingFinder;
    }

    handle(message: Message): Promise<Message | Message[]> {
        try {
            if (this.pingFinder.isPing(message.content)) {
                return message.reply('pong!');
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

