import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {Sea, SeasList} from "../../data/models/sea";
import {Island} from "../../data/models/island";
import {MoussaillonMessageEmbed} from "../../tools/discord/moussaillon-message-embed";
import {Environment} from "../../tools/environment";

const COMMAND_SEA = "mer";
const COMMAND_SEAS = "mers";

export class SeasInfoCommand extends AbstractCommandInterpreter {

    getCommandsCategoryName(): string {
        return "Informations à propos des mers";
    }

    isCommandHandled(command: string): boolean {
        switch (command) {
            case COMMAND_SEA:
            case COMMAND_SEAS:
                return true;
            default:
                return false
        }
    }

    handleMessage(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_SEA:
                return this.handleSea(message);
            case COMMAND_SEAS:
                return this.handleSeas(message);
            default:
                return Promise.reject();
        }
    }

    getCommandsList(): string[] {
        return [COMMAND_SEA, COMMAND_SEAS];
    }

    getCommandHelp(command: string): string {
        const commandChar = Environment.getInstance().getCommandChar();
        switch (command) {
            case COMMAND_SEA:
                return commandChar + COMMAND_SEA + " {nom de la mer} : \n" +
                    "Affiche la liste des iles de la mer."
            case COMMAND_SEAS:
                return commandChar + COMMAND_SEAS + " : \n" +
                    "Affiche la liste des mers."
            default:
                throw new Error("Commande inconnue");
        }
    }

    private handleSea(message: Message): Promise<Message | Message[]> {
        let commandParams = this.getCommandParamsString(message);
        let lowerCommandParams = commandParams.toLowerCase()
        let messagesToSend: Message[] = [];
        if (commandParams.length < 3) {
            return message.reply("Saisir au moins 3 caractères.")
        } else {
            let sea = this.getSeaByName(lowerCommandParams);
            if (sea == undefined) {
                return message.reply("Mer non reconnue")
            } else {
                if (this.isATestChan(message)) console.log("sea:", sea);

                let embed = this.getBasicEmbed(message);
                embed.setTitle(sea.name);
                this.displaySea(sea, embed);

                // Send message
                return message.channel.send({embeds: [embed]})
            }
        }
    }

    private handleSeas(message: Message) {
        let embed = this.getBasicEmbed(message);
        //embed.setTitle("Liste des mers");
        let content = "";
        this.getBot().data.seas.forEach(sea => {
            content += "- " + sea.name + "\n";
        })
        embed.addField("Liste des mers", content);
        return message.channel.send({embeds: [embed]})
    }

    private getSeaByName(commandParams: string): Sea | undefined {
        let seas = Array.from(this.getBot().data.seas.values());
        for (let i = 0; i < seas.length; i++) {
            let sea = seas[i];
            if (sea.name.toLowerCase().match(commandParams)) {
                return sea;
            }
        }
        return undefined;
    }

    private getPrintableIslands(islands: Island[]): string {
        let message = "";
        //console.log("islands", route);
        if (islands.length == 0) {
            message += "Pas d'ile\n";
        } else if (islands.length == 1) {
            message += "═ " + this.getPrintableIsland(islands[0]) + "\n";
        } else {
            for (let j = 0; j < islands.length; j++) {
                const island = islands[j];
                if (j == 0) {
                    message += "╔ " + this.getPrintableIsland(island) + "\n";
                } else if (j == islands.length - 1) {
                    message += "╚ " + this.getPrintableIsland(island) + "\n";
                } else {
                    message += "╠ " + this.getPrintableIsland(island) + "\n";
                }
            }
        }
        return message;
    }

    private getPrintableNewWorldIslands(islands: Island[]): string {
        let message = "";
        //console.log("islands", route);
        if (islands.length == 0) {
            message += "Pas d'ile\n";
        } else if (islands.length == 1) {
            message += "═ " + this.getPrintableIsland(islands[0]) + "\n";
        } else {
            for (let j = 0; j < islands.length; j++) {
                const island = islands[j];
                if (j == 0) {
                    message += "╔ Log1 - " + this.getPrintableIsland(island) + "\n";
                } else if (j == islands.length - 1) {
                    message += "╚ Log agité - " + this.getPrintableIsland(island) + "\n";
                } else {
                    message += "╠ Log" + (j + 1) + " - " + this.getPrintableIsland(island) + "\n";
                }
            }
        }
        return message;
    }

    private displaySea(sea: Sea, embed: MoussaillonMessageEmbed) {

        switch (sea.id) {
            case SeasList.EastBlue.valueOf():
            case SeasList.WestBlue.valueOf():
            case SeasList.NorthBlue.valueOf():
            case SeasList.SouthBlue.valueOf():
            case SeasList.CalmBelt.valueOf():
            case SeasList.FondsMarins.valueOf():
            case SeasList.IleCeleste.valueOf():
            case SeasList.RedLine.valueOf():
                this.displaySimpleSea(sea, embed);
                break;
            case SeasList.NouveauMonde.valueOf():
                this.displayNewWorld(sea, embed);
                break
            case SeasList.Paradis.valueOf():
                this.displayParadise(sea, embed);
                break;
            default :
                throw new Error("Mer inexistante");
        }
    }

    private displaySimpleSea(sea: Sea, embed: MoussaillonMessageEmbed) {
        const islandSection = sea.islandsSections.get(0);
        if (islandSection == undefined) {
            console.error("Section not found for sea :", sea);
            throw new Error("Section d'ile inconnue : 0");
        }
        let islands = Array.from(islandSection.values());
        embed.addField("Iles", this.getPrintableIslands(islands));

    }

    private displayNewWorld(sea: Sea, embed: MoussaillonMessageEmbed) {
        let islandsSections = sea.islandsSections;

        for (let i = 1; i < islandsSections.size; i++) {
            let currentSection = sea.islandsSections.get(i);
            if (currentSection == undefined) {
                console.error("Section " + i + " not found for sea :", sea);
                throw new Error("Section d'ile inconnue : " + sea.name + " " + i);
            }
            embed.addField("Palier " + i, this.getPrintableNewWorldIslands(Array.from(currentSection.values())));
        }

        let basicSection = sea.islandsSections.get(0);
        if (basicSection == undefined) {
            console.error("Section basic not found for sea :", sea);
            throw new Error("Section d'ile inconnue : " + sea.name + " basic");
        }

        let otherIslands = Array.from(basicSection.values());
        embed.addField("Autres iles", this.getPrintableIslands(otherIslands));

    }

    private displayParadise(sea: Sea, embed: MoussaillonMessageEmbed) {
        let islandsSections = sea.islandsSections;

        let basicSection = sea.islandsSections.get(0);
        if (basicSection == undefined) {
            console.error("Section basic not found for sea :", sea);
            throw new Error("Section d'ile inconnue : " + sea.name + " basic");
        }

        let otherIslands = Array.from(basicSection.values());
        const capJumeaux = otherIslands.shift();
        if (capJumeaux == undefined) {
            console.error("Cap Jumeaux should be here : 1", basicSection);
            throw new Error("Il manque Cap Jumeaux");
        }
        embed.addField("Départ", this.getPrintableIslands([capJumeaux]));

        for (let i = 1; i < islandsSections.size; i++) {
            let currentSection = sea.islandsSections.get(i);
            if (currentSection == undefined) {
                console.error("Section " + i + " not found for sea :", sea);
                throw new Error("Section d'ile inconnue : " + sea.name + " " + i);
            }
            embed.addField("Route " + i, this.getPrintableIslands(Array.from(currentSection.values())));
        }
        embed.addField("Autres iles", this.getPrintableIslands(otherIslands));

    }

    private getPrintableIsland(island: Island) {
        let result = "**" + island.name + "**";
        result += " (" + island.commander?.name + ", *" + island.commander?.type + "*) ";
        if (island.isStation)
            result += "🚆";
        return result
    }
}