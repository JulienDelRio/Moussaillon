'use strict';

import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";

import {MoussaillonMessageEmbed} from "../../tools/discord/moussaillon-message-embed";

const COMMAND_TEST_EMBED: String = "testembed";
const COMMAND_PRINTDATA: String = "printdata";

export class ToolsCommand extends AbstractCommandInterpreter {

    getCommandsCategoryName(): string {
        return "Pour des tests";
    }

    isCommandHandled(command: string): boolean {
        switch (command) {
            case COMMAND_TEST_EMBED:
            case COMMAND_PRINTDATA:
                return true;
            default:
                return false
        }
    }

    handleMessage(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_TEST_EMBED:
                return this.handleTestDiscordAPi(message);
            case COMMAND_PRINTDATA:
                return this.handleTestDiscordAPi(message);
            default:
                return Promise.reject();
        }
    }

    getCommandsList(): string[] {
        return [];
    }

    getCommandHelp(command: string): string {
        throw new Error("Commande inconnue");
    }

    private handlePrintData(message: Message): Promise<Message | Message[]> {
        console.log(this.getBot().data);
        return message.reply("Données affichées dans la console.")
    }

    private handleTestDiscordAPi(message: Message): Promise<Message | Message[]> {
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL() ?? "")
            .setTitle('A slick little embed')
            .setDescription('Hello, this is a slick embed!');
        return message.channel.send({embeds: [embed]});
    }
}