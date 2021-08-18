import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";

const COMMAND_HELP: string = "aide";

export class HelpCommand extends AbstractCommandInterpreter {
    private _commandInterpreters: AbstractCommandInterpreter[] = [];

    handle(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message)
        switch (command) {
            case COMMAND_HELP:
                return this.handleHelp(message)
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

    getCommandsList(): string[] {
        return [];
    }

    getCommandHelp(command: string): string {
        throw new Error("Commande inconnue");
    }

    private handleHelp(message: Message): Promise<Message | Message[]> {
        const fullCommand = this.getFullCommand(message);
        if (fullCommand.split(' ').length <= 1) {
            return this.handleBaseHelp(message);
        } else {
            return this.handleCommandHelp(message);
        }
    }

    private handleBaseHelp(message: Message): Promise<Message | Message[]> {
        return message.reply("Explication de l'aide");
    }

    private handleCommandHelp(message: Message): Promise<Message | Message[]> {
        return message.reply("Explication d'une commande");
    }

    setCommandInterpreters(commandInterpreters: AbstractCommandInterpreter[]) {
        this._commandInterpreters = commandInterpreters;
    }
}