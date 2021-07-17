import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {DataLoaderManager} from "../data/idata-loader";

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
            return this.reloadData(message);
        } else {
            return message.channel.send("Non autorisé... demande à un grand.")
        }

    }

    private async reloadData(message: Message): Promise<Message | Message[]> {
        let dataloader = DataLoaderManager.getNewDataLoader();
        try {
            let data = await dataloader.loadData();
            this.getBot().updateData(data)
            return await message.channel.send("Données rechargées");
        } catch (e) {
            return await message.channel.send("Données impossibles à recharger");
        }
    }
}

