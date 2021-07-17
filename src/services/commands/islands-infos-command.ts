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

    isHandled(message: Message): boolean {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_ISLAND:
                return true;
            default:
                return false
        }
    }

    handle(message: Message): Promise<Message | Message[]> {
        switch (this.getCommand(message)) {
            case COMMAND_ISLAND:
                return this.islandInfo(message);
            default :
                return Promise.reject();
        }
    }

    private async islandInfo(message: Message): Promise<Message | Message[]> {
        let commandParams = this.getCommandParamsString(message);
        let lowerCommandParams = commandParams.toLowerCase()
        let messagesToSend: Message[] = [];
        if (commandParams.length < 3) {
            return await message.channel.send("Saisir au moins 3 caractères.")
        } else {
            let islands = this.getBot().data.islands;
            for (let i = 0; i < islands.length; i++) {
                let island = islands[i];
                if (island.name.toLowerCase().match(lowerCommandParams)) {
                    // Prepare data
                    let islandName = this.getValueOrDefault(island.name, "A venir..");
                    let islandSea = this.getValueOrDefault(island.sea, "A venir..");
                    let npc = this.getValueOrDefault(island.npc, "A venir..");
                    let commander = this.getValueOrDefault(island.commander, "A venir..");
                    let cardCode = this.getValueOrDefault(island.cardCode, "A venir..");
                    let cardName = this.getValueOrDefault(island.cardName, "A venir..");
                    let routeFrom = this.getValueOrDefault(island.routeFrom, "A venir...");
                    let routeTo = this.getValueOrDefault(island.routeTo, "A venir...");
                    let boat = this.getValueOrDefault(island.boat, "Non........");
                    let claimed = this.getValueOrDefault(island.claimed, "Personne");
                    let poneglyphe = this.getValueOrDefault(island.poneglyphe, "Non");

                    // Create message
                    let authorAvatarURL = message.author.avatarURL();
                    if (authorAvatarURL == null)
                        authorAvatarURL = "";
                    const embed = new MoussaillonMessageEmbed()
                        .setAuthor("Commande par " + message.author.username, authorAvatarURL)
                        .setTitle(islandName + " (" + islandSea + ")")
                        .setColor(Environment.getInstance().getEmbedColor())
                        .addField("Controlé par", claimed)
                        .addField("Personnage/Lieu de quête", npc, true)
                        .addField("Commandant", commander, true)
                        .addField("Carte à collectionner", cardCode + " - " + cardName, true)
                        .addField("Vous pouvez y arriver par...", routeFrom, true)
                        .addField("Vous pouvez allez vers...", routeTo, true)
                        .addField('\u200b', '\u200b')
                        .addField("And now... Spoilers...", '\u200b')
                        .addField("Y'a-t-il un Poneglyphe ?", "||" + poneglyphe + "||", true)
                        .addField("Un bateau ?", "||" + boat + "||", true);

                    // Send message
                    let messageSent = await message.channel.send(embed)
                    messagesToSend.push(messageSent);
                }

            }
        }
        if (messagesToSend.length <= 0) {
            return await message.channel.send("Cette ile est inconnue au bataillon. Retente ta chance matelot.")
        } else {
            return messagesToSend;
        }
    }

    private getValueOrDefault(value: string, defaultValue: string) {
        if (!value || value.length === 0)
            return defaultValue
        else
            return value
    }
}