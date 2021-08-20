import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {Commander} from "../../data/models/commander";

const COMMAND_COMMANDERS: string = "commandants";

export class CommandersCommand extends AbstractCommandInterpreter {

    handleMessage(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message)
        switch (command) {
            case COMMAND_COMMANDERS:
                return this.handleDisplayCommanders(message)
                break
            default :
                return Promise.reject();
        }
    }

    isCommandHandled(command: string): boolean {
        switch (command) {
            case COMMAND_COMMANDERS:
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

    private handleDisplayCommanders(message: Message): Promise<Message | Message[]> {
        let command = this.getFullCommand(message);
        console.log(command)
        let commandElements = command.split(" ");
        let searchedCommandantsTypeName: string | undefined = undefined;
        if (commandElements.length > 1)
            searchedCommandantsTypeName = commandElements[1];

        // Prepare commanders
        const commandersByTypes = new Map<string, Commander[]>();
        const commandersList = this.getBot().data.commanders;

        let foundCommandantsTypeName: string | undefined;
        commandersList.forEach((commander, key, map) => {
            const commanderType = commander.type;
            if (commanderType == undefined)
                throw new Error("Commandant inconnu");
            let commanderTypeFromMap = commandersByTypes.get(commanderType);
            if (commanderTypeFromMap == undefined) {
                commanderTypeFromMap = <Commander[]>[];
                if (searchedCommandantsTypeName && commanderType.toLowerCase().match(searchedCommandantsTypeName))
                    foundCommandantsTypeName = commanderType;
                commandersByTypes.set(commanderType, commanderTypeFromMap)
            }
            commanderTypeFromMap.push(commander);
        })

        // Display commanders
        let embed = this.getBasicEmbed(message);
        embed.setTitle("Commandants");

        if (foundCommandantsTypeName != undefined) {
            let commanders = commandersByTypes.get(foundCommandantsTypeName);
            if (!commanders)
                throw new Error("Devrait trouver les commandants.")
            let content = this.getPrintableCommanderType(commanders)
            embed.addField(foundCommandantsTypeName, content);

        } else {
            commandersByTypes.forEach((commanders, key) => {
                let content = this.getPrintableCommanderType(commanders)
                embed.addField(key, content);
            })
        }

        return message.channel.send({embeds: [embed]});
    }

    private getPrintableCommanderType(commanders: Commander[]): string {
        let res = "";
        commanders.forEach(commander => {
            const island = commander.island;
            if (island == undefined)
                throw new Error("Il manque l'ile du commandant " + commander.name);
            const sea = island.sea;
            if (sea == undefined) {
                throw new Error("Il manque la mer de l'ile " + island.name);
            }
            res += "- **" + commander.name + "** sur " + island.name + " (*" + sea.name + "*)\n";
        })
        return res;
    }
}