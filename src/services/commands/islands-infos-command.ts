'use strict';

import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {MoussaillonMessageEmbed} from "../../tools/discord/moussaillon-message-embed";
import {Environment} from "../../tools/environment";

const COMMAND_ISLAND: String = "ile";


export class IslandsInfosCommand extends AbstractCommandInterpreter {

    constructor() {
        super();
    }

    isCommandHandled(command: string): boolean {
        switch (command) {
            case COMMAND_ISLAND:
                return true;
            default:
                return false
        }
    }

    handleMessage(message: Message): Promise<Message | Message[]> {
        switch (this.getCommand(message)) {
            case COMMAND_ISLAND:
                return this.islandInfo(message);
            default :
                return Promise.reject();
        }
    }

    getCommandsList(): string[] {
        return [];
    }

    getCommandHelp(command: string): string {
        throw new Error("Commande inconnue");
    }

    private async islandInfo(message: Message): Promise<Message | Message[]> {
        let commandParams = this.getCommandParamsString(message);
        let lowerCommandParams = commandParams.toLowerCase()
        let messagesToSend: Message[] = [];
        if (commandParams.length < 3) {
            return await message.reply("Saisir au moins 3 caractères.")
        } else {
            let islands = Array.from(this.getBot().data.islands.values());
            for (let i = 0; i < islands.length; i++) {
                let island = islands[i];
                if (island.name.toLowerCase().match(lowerCommandParams)) {
                    if (this.isATestChan(message)) console.log("island:", island);

                    // Prepare data
                    let islandName = island.name;
                    let islandSea = island.sea?.name ?? "Inconnu";
                    if (island.seaInfo)
                        islandSea += " - " + island.seaInfo;
                    let npc = island.npc;
                    let commander = island.commander?.name ?? "Inconnu";
                    if (island.commander?.type) {
                        commander += " - " + island.commander?.type;
                    }
                    let cardCode = island.cardCode;
                    let cardName = island.cardName;
                    let routeFrom = island.routeFrom;
                    let routeTo = island.routeTo;
                    let boat = island.boat;
                    let claimed = island.claimed;
                    let poneglyphe = island.poneglyphe;
                    let calmBelt = island.calmBelt;

                    // Create message
                    let authorAvatarURL = message.author.avatarURL();
                    if (authorAvatarURL == null)
                        authorAvatarURL = "";
                    const embed = this.getBasicEmbed(message)
                        .setTitle(islandName + " (" + islandSea + ")");

                    let titleBasic = "Informations générales";
                    let messageBasic = "" +
                        "👨 _Personnage/Lieu de quête :_ " + npc + "\n" +
                        "🎖️ _Commandant :_ " + commander + "\n" +
                        "🃏 _Carte à collectionner :_ " + cardCode + " - " + cardName + "\n" +
                        "🛂 _Controlé par :_ " + claimed + "\n";
                    messageBasic += "\u200b\n";
                    embed.addField(titleBasic, messageBasic)

                    let titleNav = "Navigation";
                    let messageNav = "" +
                        "__Vous pouvez y arriver par...__" + "\n";
                    messageNav += this.getPrintableRoute(routeFrom) + "\n";

                    messageNav += "__Vous pouvez allez vers...__" + "\n";
                    messageNav += this.getPrintableRoute(routeTo) + "\n";

                    messageNav += "__A travers CalmBelt...__" + "\n";
                    messageNav += this.getPrintableRoute(calmBelt);

                    messageNav += "\u200b";
                    embed.addField(titleNav, messageNav)

                    let titleSpoiler = "And now... Spoilers...";
                    let messageSpoiler = "" +
                        "🗿 Y'a-t-il un Poneglyphe ? ||" + poneglyphe + "||\n" +
                        "⛵ Un bateau ? ||" + boat + "||\n";
                    messageSpoiler += "\u200b\n";
                    embed.addField(titleSpoiler, messageSpoiler)

                    if (island.moreInfo) {
                        let titleMoreInfo = "Autres informations";
                        let messageMoreInfo = island.moreInfo;
                        embed.addField(titleMoreInfo, messageMoreInfo)

                    }

                    // Send message
                    let messageSent = await message.channel.send({embeds: [embed]})
                    messagesToSend.push(messageSent);
                }

            }
        }
        if (messagesToSend.length <= 0) {
            return await message.reply("Cette ile est inconnue au bataillon. Retente ta chance matelot.")
        } else {
            return messagesToSend;
        }
    }

    private getPrintableRoute(route: string): string {
        let message = "";
        let routeSteps = route.split("\n");
        //console.log("routeSteps", route);
        if (routeSteps.length <= 1) {
            message += "═ " + routeSteps + "\n";
        } else {
            for (let j = 0; j < routeSteps.length; j++) {
                const routeFromStep = routeSteps[j];
                if (j == 0) {
                    message += "╔ " + routeFromStep + "\n";
                } else if (j == routeSteps.length - 1) {
                    message += "╚ " + routeFromStep + "\n";
                } else {
                    message += "╠ " + routeFromStep + "\n";
                }
            }
        }
        return message;
    }
}