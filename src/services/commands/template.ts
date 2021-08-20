import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";

const COMMAND_ONE: string = "one";

export class Template extends AbstractCommandInterpreter {

    handleMessage(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message)
        switch (command) {
            case COMMAND_ONE:
                return this.handleOne(message)
                break
            default :
                return Promise.reject();
        }
    }

    isCommandHandled(command: string): boolean {
        switch (command) {
            case COMMAND_ONE:
                return true;
            default:
                return false
        }
    }

    getCommandsList(): string[] {
        return [];
    }

    getCommandHelp(command: string): string {
        throw new Error("Commande inconnue");
    }

    private handleOne(message: Message): Promise<Message | Message[]> {
        return message.channel.send("One");
    }
}