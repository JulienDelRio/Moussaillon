import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {inject} from "inversify";
import {TYPES} from "../../types";
import {MoussaillonBot} from "../../bot/moussaillon-bot";
import {IDataLoader} from "../data/idata-loader";
import container from "../../../inversify.config";

const COMMAND_RELOAD: String = "recharge";


export class ReloadDataCommand extends AbstractCommandInterpreter {

    handle(message: Message): Promise<Message | Message[]> {
        switch (this.getCommand(message)) {
            case COMMAND_RELOAD:
                return this.handleReload(message);
            default :
                return Promise.reject();
        }
    }

    isHandled(message: Message): boolean {
        switch (this.getCommand(message)) {
            case COMMAND_RELOAD:
                return true;
            default :
                return false;
        }
    }

    private handleReload(message: Message): Promise<Message | Message[]> {
        let member = message.member;
        if (member == null) {
            throw new Error("Need a member");
        }
        let roles = member.roles.cache;
        let isAllowed = false;
        // let rolesAllower = [
        //     "842089797254119434", // Lieutenant
        //     "835171890142249012", // Commandant
        //     "835165337535512627" // Chef
        // ]
        let data = this.getBot().data;
        let rolesAllowed = data.rights.moderatorsRoles;
        rolesAllowed.forEach((role: string) => {
            if (roles.has(role))
                isAllowed = true
        })

        if (isAllowed) {
            message.channel.send("Mise à jour lancée...")
            return message.channel.send("Mise à jour pas implémentée en fait...")
            //return this.getDataLoader().loadData(message);
            /*this._googleDataHelper.loadData(data, function () {
                message.channel.send("Mise à jour effectuée...")
            }, function () {
                message.channel.send("Mise à jour échouée...")
            }, function () {
            })*/
        } else {
            return message.channel.send("Non autorisé... demande à un grand.")
        }

    }

    private getBot(): MoussaillonBot {
        const bot = container.get<MoussaillonBot>(TYPES.MoussaillonBot);
        if (bot === undefined) {
            throw new Error("Bot should be initialized")
        }
        return bot;
    }

    private getDataLoader(): IDataLoader {
        const dataLoader = container.get<IDataLoader>(TYPES.DataLoader);
        if (dataLoader === undefined) {
            throw new Error("DataLoader should be initialized")
        }
        return dataLoader;
    }
}

