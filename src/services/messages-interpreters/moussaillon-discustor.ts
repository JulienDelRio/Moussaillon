'use strict';

import {AbstractCommandInterpreter} from "../commands/abstract-command-interpreter";
import {Message, MessageOptions} from "discord.js";
import {IMessageInterpreter} from "../message-responder";
import container from "../../../inversify.config";
import {MoussaillonBot} from "../../bot/moussaillon-bot";
import {TYPES} from "../../types";

export class MoussaillonDiscustor implements IMessageInterpreter {
    handleMessage(message: Message): Promise<Message | Message[]> {
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

    isMessageHandled(message: Message): boolean {
        let isHandled = false;
        isHandled = this.isMentioned(message)
        return isHandled
    }

    private isMentioned(message: Message): boolean {
        const bot = container.get<MoussaillonBot>(TYPES.MoussaillonBot);
        if (message.mentions.has(bot.id)) {
            return true;
        }
        return false;
    }

}