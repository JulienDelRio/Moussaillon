import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {MoussaillonMessageEmbed} from "../../tools/discord/moussaillon-message-embed";

import changelogHistoryJson from "../../bot/changelogHistory.json";
import {Environment} from "../../tools/environment";

const moussaillonBotPPUrl: string = "https://cdn.discordapp.com/avatars/845262214688669727/079857eb39dd2161aaca83daaf9982ab.png?size=4096"
const COMMAND_VERSION: string = "version";
const COMMAND_CHANGELOG: string = "changelog";
const COMMAND_HISTORY: string = "history";

export class BotInfosCommand extends AbstractCommandInterpreter {
    private changelogHistory: IChangelogHistory = <IChangelogHistory>changelogHistoryJson;

    getCommandsCategoryName(): string {
        return "Informations à propos du bot";
    }

    handleMessage(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message)
        switch (command) {
            case COMMAND_VERSION:
                return this.handleVersion(message)
                break
            case COMMAND_CHANGELOG:
                return this.handleChangelog(message)
                break
            case COMMAND_HISTORY:
                return this.handleHistory(message)
                break
            default :
                return Promise.reject();
        }
    }

    isCommandHandled(command: string): boolean {
        switch (command) {
            case COMMAND_VERSION:
            case COMMAND_CHANGELOG:
            case COMMAND_HISTORY:
                return true;
            default:
                return false
        }
    }

    getCommandsList(): string[] {
        return [COMMAND_VERSION, COMMAND_CHANGELOG, COMMAND_HISTORY];
    }

    getCommandHelp(command: string): string {
        var commandChar = Environment.getInstance().getCommandChar();
        switch (command) {
            case COMMAND_VERSION:
                return commandChar + COMMAND_VERSION + " : \n" +
                    "Affiche le numéro de version courant";
            case COMMAND_CHANGELOG:
                return commandChar + COMMAND_CHANGELOG + " {numéro de version?} : \n" +
                    "Affiche le changelog de la version {numéro de version}.\n" +
                    "Si aucun {numéro de version} indiqué, affiche le dernier changelog.\n" +
                    "Affiche un message d'erreur si le numéro de version est inconnu.";
            case COMMAND_HISTORY:
                return commandChar + COMMAND_HISTORY + " {nombre?} :\n" +
                    "Affiche le résumé des {nombre} dernières versions.\n" +
                    "Si aucun {nombre} n'est indiqué, affiche les 10 dernières versions";
            default:
                throw new Error("Commande inconnue");
        }
    }

    private handleVersion(message: Message): Promise<Message | Message[]> {
        return message.channel.send("Version : " + this.changelogHistory.currentVersion)
    }

    private displayVersion(versionToDisplay: IVersion, embed: MoussaillonMessageEmbed, isLong = false) {
        console.log("versionToDisplay (" + isLong + ")", versionToDisplay)
        if (isLong && versionToDisplay.changelog.long) {
            versionToDisplay.changelog.long.forEach(value => {
                const longSection: ILongChangelogSection = value;
                embed.addField(longSection.title, longSection.content);
            })
        } else {
            let changelog = versionToDisplay.changelog.short;
            embed.addField(versionToDisplay.version, changelog)
        }
    }

    handleChangelog(message: Message): Promise<Message | Message[]> {
        let commandElements = message.content.split(" ")
        let selectedVersion = 0;
        if (commandElements.length <= 1) {
            // No param
        } else {
            let paramVersion = commandElements[1]
            let found = false
            for (let i = 0; i < this.changelogHistory.history.length && !found; i++) {
                let versionTested = this.changelogHistory.history[i].version;
                var match = versionTested.match(paramVersion);
                if (match && versionTested === match[0]) {
                    selectedVersion = i;
                    found = true
                }
            }
            if (!found)
                throw new Error("Numéro de version inconnu");
        }

        let versionToDisplay: IVersion = this.changelogHistory.history[selectedVersion];

        if (versionToDisplay) {
            let avatarURL = message.author.avatarURL();
            if (avatarURL == null) {
                avatarURL = "";
            }
            const embed = new MoussaillonMessageEmbed()
                .setAuthor("Commande par " + message.author.username, avatarURL)
                .setTitle("Changelog de la version " + versionToDisplay.version)
                .setThumbnail(moussaillonBotPPUrl)
            this.displayVersion(versionToDisplay, embed, true);
            return message.channel.send({embeds: [embed]});
        } else {
            return message.reply("Il n'y a pas de changelog...")
        }
    }

    handleHistory(message: Message): Promise<Message | Message[]> {
        let commandElements = message.content.split(" ")
        let nbVersion = 10
        if (commandElements.length <= 1) {
            // No param
        } else {
            let parsedNbRanks = Number.parseInt(commandElements[1])
            if (!Number.isNaN(parsedNbRanks) && parsedNbRanks > 0) {
                nbVersion = parsedNbRanks
            }
        }

        let avatarURL = message.author.avatarURL();
        if (avatarURL == null)
            avatarURL = "";
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, avatarURL)
            .setTitle("Historique des versions de Moussaisson")
            .setThumbnail(moussaillonBotPPUrl)

        console.log("changelogHistory:", this.changelogHistory);
        for (let i = 0; i < nbVersion && i < this.changelogHistory.history.length; i++) {
            this.displayVersion(this.changelogHistory.history[i], embed)
            //embed.addField(version.history[i].version, this.changelogHistory.history[i].changelog)
        }

        return message.channel.send({embeds: [embed]});

    }
}

export interface IChangelogHistory {
    currentVersion: string,
    history: IVersion[]
}

export interface IVersion {
    version: string,
    changelog: IChangelog
}

export interface IChangelog {
    short: string,
    long: ILongChangelogSection[]
}

export interface ILongChangelogSection {
    title: string,
    content: string
}