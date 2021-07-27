import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {MoussaillonMessageEmbed} from "../../tools/discord/moussaillon-message-embed";

import changelogJson from "../../bot/version.json";

const moussaillonBotPPUrl: string = "https://cdn.discordapp.com/avatars/845262214688669727/079857eb39dd2161aaca83daaf9982ab.png?size=4096"
const COMMAND_VERSION: string = "version";
const COMMAND_CHANGELOG: string = "changelog";
const COMMAND_HISTORY: string = "history";

export class BotInfosCommand extends AbstractCommandInterpreter {
    private changelogHistory: IChangelogHistory = <IChangelogHistory>changelogJson;

    handle(message: Message): Promise<Message | Message[]> {
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

    isHandled(message: Message): boolean {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_VERSION:
            case COMMAND_CHANGELOG:
            case COMMAND_HISTORY:
                return true;
            default:
                return false
        }
    }

    private handleVersion(message: Message): Promise<Message | Message[]> {
        return message.channel.send("Version : " + this.changelogHistory.currentVersion)
    }

    private displayVersion(versionToDisplay: IVersion, embed: MoussaillonMessageEmbed, isLong = false) {
        if (isLong) {
            if (versionToDisplay.changelog.long && Array.isArray(versionToDisplay.changelog.long)) {
                for (let i = 0; i < versionToDisplay.changelog.long.length; i++) {
                    let changelogpart = versionToDisplay.changelog.long[i];
                    embed.addField("Version " + versionToDisplay.version + " part " +
                        (i + 1), changelogpart)
                }
            } else {
                let changelog;
                if (versionToDisplay.changelog.long)
                    changelog = versionToDisplay.changelog.long;
                else
                    changelog = versionToDisplay.changelog.short;
                embed.addField("Version " + versionToDisplay.version, changelog)
            }
        } else {
            let changelog = versionToDisplay.changelog.short;
            embed.addField("Version " + versionToDisplay.version, changelog)
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
        }

        let versionToDisplay: IVersion = this.changelogHistory.history[selectedVersion];

        if (versionToDisplay) {
            let avatarURL = message.author.avatarURL();
            if (avatarURL == null) {
                avatarURL = "";
            }
            const embed = new MoussaillonMessageEmbed()
                .setAuthor("Commande par " + message.author.username, avatarURL)
                .setTitle("Changelog de Moussaisson")
                .setThumbnail(moussaillonBotPPUrl)
            this.displayVersion(versionToDisplay, embed, true);
            return message.channel.send(embed);
        } else {
            return message.channel.send("Il n'y a pas de changelog...")
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

        for (let i = 0; i < nbVersion && i < this.changelogHistory.history.length; i++) {
            this.displayVersion(this.changelogHistory.history[i], embed)
            //embed.addField(version.history[i].version, this.changelogHistory.history[i].changelog)
        }

        return message.channel.send(embed);

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
    long: string | string[]
}