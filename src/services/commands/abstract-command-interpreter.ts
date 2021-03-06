import {Message} from "discord.js";
import {injectable} from "inversify";
import {IMessageInterpreter} from "../message-responder"
import {Environment} from "../../tools/environment";
import {MoussaillonBot} from "../../bot/moussaillon-bot";
import container from "../../../inversify.config";
import {TYPES} from "../../types";
import {MoussaillonRightsManager} from "../../bot/moussaillon-rights-manager";
import {MoussaillonMessageEmbed} from "../../tools/discord/moussaillon-message-embed";

@injectable()
export abstract class AbstractCommandInterpreter implements IMessageInterpreter {

    abstract isCommandHandled(command: string): boolean;

    abstract handleMessage(message: Message, isATest?: boolean): Promise<Message | Message[]>;

    abstract getCommandsList(): string[];

    abstract getCommandHelp(command: string): string;

    abstract getCommandsCategoryName(): string;

    isMessageHandled(message: Message): boolean {
        let command = this.getCommand(message);
        return this.isCommandHandled(command);
    }

    isCommand(message: Message): boolean {
        if (typeof Environment.getInstance().getCommandChar() === "string") {
            return message.content.startsWith(Environment.getInstance().getCommandChar())
        } else {
            throw new Error("Command char should be a string");
        }
    }

    protected getCommand(message: Message): string {
        if (Environment.getInstance().getCommandChar() === undefined) {
            throw new Error("Command should be initialized")
        }
        let command = message.content.substring(1).split(" ")[0].toLowerCase();
        return command;
    }

    protected getFullCommand(message: Message): string {
        let command = message.content.substring(1).toLowerCase();
        return command;
    }

    protected getCommandParamsArray(message: Message): string[] {
        let fullCommand = this.getFullCommand(message);
        let params = fullCommand.split(" ")
        let command = params.shift()
        return params;
    }

    protected getCommandParamsString(message: Message): string {
        let fullCommand = this.getFullCommand(message);
        let params = fullCommand.split(" ")
        let command = params.shift()
        return params.join(" ");
    }

    protected getBot(): MoussaillonBot {
        const bot = container.get<MoussaillonBot>(TYPES.MoussaillonBot);
        if (bot === undefined) {
            throw new Error("Bot should be initialized")
        }
        return bot;
    }

    protected isATestChan(message: Message): boolean {
        return MoussaillonRightsManager.getInstance().isAChanForTest(message);
    }

    protected getBasicEmbed(message: Message): MoussaillonMessageEmbed {
        let authorAvatarURL = message.author.avatarURL();
        if (authorAvatarURL == null)
            authorAvatarURL = "";
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, authorAvatarURL)
        return embed;
    }

}