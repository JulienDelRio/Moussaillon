import {MoussaillonBot} from "./moussaillon-bot";
import container from "../../inversify.config";
import {TYPES} from "../types";
import {Message} from "discord.js";
import {MoussaillonRights} from "../services/data/i-moussaillon-data";

export class MoussaillonRightsManager {
    private static instance: MoussaillonRightsManager;

    public static getInstance(): MoussaillonRightsManager {
        if (!MoussaillonRightsManager.instance) {
            MoussaillonRightsManager.instance = new MoussaillonRightsManager();
        }

        return MoussaillonRightsManager.instance;
    }

    private constructor() {
    }

    private getBot(): MoussaillonBot {
        const bot = container.get<MoussaillonBot>(TYPES.MoussaillonBot);
        if (bot === undefined) {
            throw new Error("Bot should be initialized")
        }
        return bot;
    }

    isTheServerAllowed(message: Message): boolean {
        let rights: MoussaillonRights = this.getBot().data.rights;
        let isTheServerAllowed = false;
        for (let i = 0; i < rights.allowedServers.length; i++) {
            //console.log(`Test ${rights.allowedServers[i]} on ${message.guild?.id}`)
            if (rights.allowedServers[i] === message.guild?.id) {
                isTheServerAllowed = true;
            }
        }
        return isTheServerAllowed
    }

    isTheChanAllowed(message: Message): boolean {
        let rights: MoussaillonRights = this.getBot().data.rights;
        let isTheChansAllowed = false;
        for (let i = 0; i < rights.allowedChannels.length; i++) {
            //console.log(`Test ${rights.allowedChannels[i]} on ${message.channel.id}`)
            if (rights.allowedChannels[i] === message.channel.id) {
                isTheChansAllowed = true;
            }
        }
        for (let i = 0; i < rights.testChannels.length; i++) {
            //console.log(`Test ${rights.testChannels[i]} on ${message.channel.id}`)
            if (rights.testChannels[i] === message.channel.id) {
                isTheChansAllowed = true;
            }
        }
        return isTheChansAllowed
    }

    isTheChanForTest(message: Message): boolean {
        let rights: MoussaillonRights = this.getBot().data.rights;
        let isTheChanForTest = false;
        for (let i = 0; i < rights.testChannels.length; i++) {
            //console.log(`Test ${rights.testChannels[i]} on ${message.channel.id}`)
            if (rights.testChannels[i] === message.channel.id) {
                isTheChanForTest = true;
            }
        }
        return isTheChanForTest
    }

    isTheAuthorModerator(message: Message): boolean {
        let member = message.member;
        if (member == null) {
            throw new Error("Need a member");
        }
        let roles = member.roles.cache;
        let isAllowed = false;
        let data = this.getBot().data;
        let rolesAllowed = data.rights.moderatorsRoles;
        rolesAllowed.forEach((role: string) => {
            if (roles.has(role))
                isAllowed = true
        })
        return isAllowed;
    }
}