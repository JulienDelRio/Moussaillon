import {Message} from "discord.js";
import {PingFinder} from "../ping-finder";
import {injectable} from "inversify";
import {ReloadDataCommand} from "./reload-data-command";
import {IslandsInfosCommand} from "./islands-infos-command";
import {MoussaillonCommand} from "./moussaillon-command";
import {BotInfosCommand} from "./bot-infos-command";
import {TeamCommand} from "./team-command";
import {ToolsCommand} from "./tools-command";
import {MoussaillonRightsManager} from "../../bot/moussaillon-rights-manager";
import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Environment} from "../../tools/environment";
import {SeasInfoCommand} from "./seas-info-command";
import {CommandersCommand} from "./commanders-command";
import {AccountCommand} from "./account-command";
import {UserAccountManager} from "../../data/user-accounts/user-account-manager";

@injectable()
export class MessageResponder {
    private messageInterpreters: IMessageInterpreter[];
    private commandInterpreters: AbstractCommandInterpreter[]

    constructor() {
        this.messageInterpreters = [new PingFinder()];
        this.commandInterpreters = [
            new ReloadDataCommand(),
            new IslandsInfosCommand(),
            new MoussaillonCommand(),
            new BotInfosCommand(),
            new TeamCommand(),
            new ToolsCommand(),
            new SeasInfoCommand(),
            new CommandersCommand(),
            new AccountCommand()
        ]
    }

    async handle(message: Message): Promise<Message | Message[]> {
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
            for (let i = 0; i < this.messageInterpreters.length; i++) {
                let messageInterpreter = this.messageInterpreters[i];
                if (messageInterpreter.isHandled(message))
                    return messageInterpreter.handle(message);
            }
            if (this.isACommand(message)) {
                for (let i = 0; i < this.commandInterpreters.length; i++) {
                    let commandInterpreter = this.commandInterpreters[i];
                    if (commandInterpreter.isHandled(message)) {
                        const commandDescriptor = commandInterpreter.getCommandDescriptor(message);
                        var uam = UserAccountManager.getInstance();
                        var userId = parseInt(message.author.id);
                        const userAccount = await uam.getUser(userId);
                        if(uam.isAKnownAccount(message.author))
                        if (userAccount.availableAmount >= commandDescriptor.price) {
                            const promise = commandInterpreter.handle(message);
                            const success = uam.countCommand(userId, commandDescriptor);
                            console.log(`Register ${commandDescriptor.name}(${commandDescriptor.price}) for ${userId} : ` + success);
                            return promise;
                        } else {
                            return this.printNotEnoughCredit(message);
                        }
                    }
                }

            }
        } catch (e) {
            console.error("Error handling", e)
            return message.reply(e.message)
        }

        return Promise.reject(new NotHandledError("Message not handled"));
    }

    private printNotEnoughCredit(message: Message) {
        return message.channel.send("Pas assez de crédit pour cette commande.");
    }

    private isItABotMessage(message: Message): boolean {
        return message.author.bot;
    }

    private isTheBotAllowed(message: Message): boolean {

        if (!MoussaillonRightsManager.getInstance().isTheServerAllowed(message))
            return false

        if (!MoussaillonRightsManager.getInstance().isTheChanAllowed(message))
            return false

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
