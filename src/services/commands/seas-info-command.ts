import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {Sea, SeasList} from "../../data/models/sea";
import {Island} from "../../data/models/island";

const COMMAND_SEA = "mer";
const COMMAND_SEAS = "mers";

export class SeasInfoCommand extends AbstractCommandInterpreter {
    isHandled(message: Message) {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_SEA:
            case COMMAND_SEAS:
                return true;
            default:
                return false
        }
    }

    handle(message: Message): Promise<Message | Message[]> {
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

    private handleSea(message: Message): Promise<Message | Message[]> {
        let commandParams = this.getCommandParamsString(message);
        let lowerCommandParams = commandParams.toLowerCase()
        let messagesToSend: Message[] = [];
        if (commandParams.length < 3) {
            return message.channel.send("Saisir au moins 3 caractères.")
        } else {
            let sea = this.getSeaByName(lowerCommandParams);
            if (sea == null) {
                return message.channel.send("Mer non reconnue")
            } else {
                if (this.isATestChan(message)) console.log("sea:", sea);

                // Retrieve islands
                let selectedIslandMap = new Map<number, Island>();
                this.getBot().data.islands.forEach(island => {
                    if (island.sea?.id == sea?.id){
                        switch (island.sea?.id) {
                            case SeasList.Paradis.valueOf():
                            case SeasList.Paradis.valueOf():
                            default:
                                selectedIslandMap.set(island.seaOrder, island);
                        }
                    }
                });
                if (this.isATestChan(message)) console.log(selectedIslandMap);

                let embed = this.getBasicEmbed(message);
                embed.setTitle(sea.name);

                embed.addField("Iles", this.getPrintableIslands(Array.from(selectedIslandMap.values())));

                // Send message
                return message.channel.send(embed)
            }
        }
        return message.channel.send("Non implémenté pour l'instant.")
    }

    private handleSeas(message: Message) {
        return message.channel.send("Non implémenté pour l'instant.")
    }

    private getSeaByName(commandParams: string): Sea | null {
        let seas = Array.from(this.getBot().data.seas.values());
        for (let i = 0; i < seas.length; i++) {
            let sea = seas[i];
            if (sea.name.toLowerCase().match(commandParams)) {
                return sea;
            }
        }
        return null;
    }

    private getPrintableIslands(islands: Island[]): string {
        let message = "";
        //console.log("islands", route);
        if (islands.length <= 1) {
            message += "═ " + islands + "\n";
        } else {
            for (let j = 0; j < islands.length; j++) {
                const island = islands[j];
                if (j == 0) {
                    message += "╔ " + island.name + "\n";
                } else if (j == islands.length - 1) {
                    message += "╚ " + island.name + "\n";
                } else {
                    message += "╠ " + island.name + "\n";
                }
            }
        }
        return message;
    }
}