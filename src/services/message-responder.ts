import {GuildChannel, Message} from "discord.js";
import {PingFinder} from "./messages-interpreters/ping-finder";
import {injectable} from "inversify";
import {ReloadDataCommand} from "./commands/reload-data-command";
import {IslandsInfosCommand} from "./commands/islands-infos-command";
import {MoussaillonDiscustor} from "./messages-interpreters/moussaillon-discustor";
import {BotInfosCommand} from "./commands/bot-infos-command";
import {TeamCommand} from "./commands/team-command";
import {ToolsCommand} from "./commands/tools-command";
import {MoussaillonRightsManager} from "../bot/moussaillon-rights-manager";
import {AbstractCommandInterpreter} from "./commands/abstract-command-interpreter";
import {Environment} from "../tools/environment";
import {SeasInfoCommand} from "./commands/seas-info-command";
import {CommandersCommand} from "./commands/commanders-command";
import {HelpCommand} from "./commands/help-command";

@injectable()
export class MessageResponder {
    private messageInterpreters: IMessageInterpreter[];
    private commandInterpreters: AbstractCommandInterpreter[]

    constructor() {
        this.messageInterpreters = [
            new PingFinder(),
            new MoussaillonDiscustor()
        ];
        this.commandInterpreters = [
            new ReloadDataCommand(),
            new IslandsInfosCommand(),
            new BotInfosCommand(),
            new TeamCommand(),
            new ToolsCommand(),
            new SeasInfoCommand(),
            new CommandersCommand(),
            new HelpCommand()
        ]
    }

    handle(message: Message): Promise<Message | Message[]> {
        let isTest = this.isATestChannel(message);
        if (isTest) console.log("Posted in a test channel");

        if (!this.isTheBotAllowed(message)) {
            if (isTest) console.log("Bot not allowed")
            return Promise.reject(new NotHandledError("Bot not allowed"));
        }
        if (this.isItABotMessage(message)) {
            if (isTest) console.log("Message by a bot")
            return Promise.reject(new NotHandledError("This is a bot message"));
        }
        if (isTest) console.log("Allowed")

        try {
            if (this.isACommand(message)) {
                for (let i = 0; i < this.commandInterpreters.length; i++) {
                    let commandInterpreter = this.commandInterpreters[i];
                    if (commandInterpreter.isHandled(message))
                        return commandInterpreter.handle(message);
                }

            }
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

    private isItABotMessage(message: Message): boolean {
        return message.author.bot;
    }

    private isTheBotAllowed(message: Message): boolean {

        if (!MoussaillonRightsManager.getInstance().isTheServerAllowed(message)) {
            console.log("Message not allowed on this server : " + message.guild?.name);
            return false
        }

        if (!MoussaillonRightsManager.getInstance().isTheChanAllowed(message)) {
            const channel = <GuildChannel>message.channel;
            console.log("Message nor allowed on this chan : " + channel.name);
            return false
        }

        return true;
    }

    private isATestChannel(message: Message) {
        return MoussaillonRightsManager.getInstance().isAChanForTest(message);
    }

    private isACommand(message: Message) {
        return message.content.startsWith(Environment.getInstance().getCommandChar());
    }
}

export interface IMessageInterpreter {
    isHandled(message: Message): boolean;

    handle(message: Message): Promise<Message | Message[]>;
}

export class NotHandledError extends Error {

}
