import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {Environment} from "../../tools/environment";

const COMMAND_ONE: string = "one";

export class Template extends AbstractCommandInterpreter {

    getCommandsCategoryName(): string {
        return "A réécrire";
    }

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
        var commandChar = Environment.getInstance().getCommandChar();
        switch (command) {
            case COMMAND_ONE:
                return "Commande template";
            default:
                throw new Error("Commande inconnue");
        }
    }

    private handleOne(message: Message): Promise<Message | Message[]> {
        return message.channel.send("One");
    }
}