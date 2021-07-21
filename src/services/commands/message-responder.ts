import {Message} from "discord.js";
import {PingFinder} from "../ping-finder";
import {injectable} from "inversify";
import {ReloadDataCommand} from "./reload-data-command";
import {IslandsInfosCommand} from "./islands-infos-command";
import {MoussaillonCommand} from "./moussaillon-command";
import {BotInfosCommand} from "./bot-infos-command";
import {TeamCommand} from "./team-command";
import {ToolsCommand} from "./tools-command";

@injectable()
export class MessageResponder {
    private messageInterpreters: IMessageInterpreter[];

    constructor() {
        this.messageInterpreters = [new PingFinder(),
            new ReloadDataCommand(),
            new IslandsInfosCommand(),
            new MoussaillonCommand(),
            new BotInfosCommand(),
            new TeamCommand(),
            new ToolsCommand()
        ]
    }

    handle(message: Message): Promise<Message | Message[]> {
        try {
            for (let i = 0; i < this.messageInterpreters.length; i++) {
                let messageInterpreter = this.messageInterpreters[i];
                if (messageInterpreter.isHandled(message))
                    return messageInterpreter.handle(message);
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
