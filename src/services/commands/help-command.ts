import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";

const COMMAND_HELP: string = "aide";

export class HelpCommand extends AbstractCommandInterpreter {

    handle(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message)
        switch (command) {
            case COMMAND_HELP:
                return this.handleOne(message)
                break
            default :
                return Promise.reject();
        }
    }

    isHandled(message: Message): boolean {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_HELP:
                return true;
            default:
                return false
        }
    }

    private handleOne(message: Message): Promise<Message | Message[]> {
        return message.reply("Aide");
    }
}