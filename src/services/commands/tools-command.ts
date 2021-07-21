'use strict';

import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";

import {MoussaillonMessageEmbed} from "../../tools/discord/moussaillon-message-embed";
import {Environment} from "../../tools/environment";

const COMMAND_TEST_EMBED: String = "testembed";

export class ToolsCommand extends AbstractCommandInterpreter {
    isHandled(message: Message) {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_TEST_EMBED:
                return true;
            default:
                return false
        }
    }

    handle(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_TEST_EMBED:
                return this.handleTestDiscordAPi(message);
            default:
                return Promise.reject();
        }
    }

    private handleTestDiscordAPi(message: Message): Promise<Message | Message[]> {
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL() ?? "")
            .setTitle('A slick little embed')
            .setColor(Environment.getInstance().getEmbedColor())
            .setDescription('Hello, this is a slick embed!');
        return message.channel.send(embed);
    }
}