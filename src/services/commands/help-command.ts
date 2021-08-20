import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {Environment} from "../../tools/environment";

const COMMAND_HELP: string = "aide";
const COMMAND_COMMANDS: string = "commandes";

export class HelpCommand extends AbstractCommandInterpreter {
    private _commandInterpreters: AbstractCommandInterpreter[] = [];

    getCommandsCategoryName(): string {
        return "L'aide du bot";
    }

    handleMessage(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message)
        switch (command) {
            case COMMAND_HELP:
                return this.handleHelp(message)
                break
            case COMMAND_COMMANDS:
                return this.handleCommands(message)
                break
            default :
                return Promise.reject();
        }
    }

    isCommandHandled(command: string): boolean {
        switch (command) {
            case COMMAND_HELP:
            case COMMAND_COMMANDS:
                return true;
            default:
                return false
        }
    }

    getCommandsList(): string[] {
        return [COMMAND_HELP, COMMAND_COMMANDS];
    }

    getCommandHelp(command: string): string {
        var commandChar = Environment.getInstance().getCommandChar();
        switch (command) {
            case COMMAND_HELP:
                return commandChar + COMMAND_HELP + " {commande} :\n" +
                    "Affiche la documentation de la commande passée en paramètre.\n" +
                    "Si pas de commande en paramètre, affiche cette aide.\n" +
                    "Pour afficher la liste des commandes : " + commandChar + COMMAND_COMMANDS;
            case COMMAND_COMMANDS:
                return commandChar + COMMAND_COMMANDS + " :\n" +
                    "Affiche la liste des commandes interprétées par le bot."
            default:
                throw new Error("Commande inconnue");
        }
    }

    private handleCommands(message: Message): Promise<Message | Message[]> {
        if (this._commandInterpreters.length == 0) {
            return message.reply("Liste de commandes inconnues");
        } else {
            let embed = this.getBasicEmbed(message);
            embed.setTitle("Liste des commandes");
            embed.addField("Explications :", "Pour la documentation d'une commande, taper : " + Environment.getInstance().getCommandChar() + "aide" +
                " {commande}");
            this._commandInterpreters.forEach(function (interpreter) {
                let commandsList = "";
                interpreter.getCommandsList().forEach(function (command) {
                    commandsList += command + "\n";
                })
                if (commandsList.length > 0) {
                    embed.addField(interpreter.getCommandsCategoryName(), commandsList);
                }
            })
            return message.channel.send({embeds: [embed]});
        }
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
        return message.reply(this.getCommandHelp(COMMAND_HELP));
    }

    private handleCommandHelp(message: Message): Promise<Message | Message[]> {
        // this._commandInterpreters.forEach(function (interpreter) {
        //     if (interpreter.isCommandHandled())
        // })
        return message.reply("Explication d'une commande");
    }

    setCommandInterpreters(commandInterpreters: AbstractCommandInterpreter[]) {
        this._commandInterpreters = commandInterpreters;
    }
}