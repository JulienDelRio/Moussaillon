'use strict';

import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message, MessageOptions} from "discord.js";

export class MoussaillonCommand extends AbstractCommandInterpreter {
    handle(message: Message): Promise<Message | Message[]> {
        let member = message.member;
        let lowerCaseMessage = message.content.toLowerCase();
        if (member == null) {
            return message.reply("Je ne sais pas à qui répondre 🤔");
        } else if (lowerCaseMessage.includes("bonjour")) {
            let messageContent = `Bonjour ${member.displayName} !`;
            return message.reply(messageContent);
        } else if (lowerCaseMessage.includes("merci")) {
            return message.reply(`C'est un plaisir. Je serai toujours là pour toi ${member.displayName} !`);
        } else {
            return message.reply("Woof !");

        }
    }

    isHandled(message: Message): boolean {
        let isHandled = false;
        isHandled = this.isMentioned(message)
        return isHandled
    }

    private isMentioned(message: Message): boolean {
        let botMention = "<@!" + this.getBot().id + ">"
        return message.content.toLowerCase().includes(botMention)
    }

}