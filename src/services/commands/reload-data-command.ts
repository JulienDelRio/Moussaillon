import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {DataLoaderManager} from "../../data/idata-loader";
import {MoussaillonRightsManager} from "../../bot/moussaillon-rights-manager";

const COMMAND_RELOAD: string = "recharge";


export class ReloadDataCommand extends AbstractCommandInterpreter {

    getCommandsCategoryName(): string {
        return "Administration du bot";
    }

    handleMessage(message: Message): Promise<Message | Message[]> {
        switch (this.getCommand(message)) {
            case COMMAND_RELOAD:
                return this.handleReload(message);
            default :
                return Promise.reject();
        }
    }

    isCommandHandled(command: string): boolean {
        switch (command) {
            case COMMAND_RELOAD:
                return true;
            default :
                return false;
        }
    }

    getCommandsList(): string[] {
        return [COMMAND_RELOAD];
    }

    getCommandHelp(command: string): string {
        switch (command) {
            case COMMAND_RELOAD:
                return "Recharge les données du bot. Uniquement accessible à certains roles.";
            default :
                throw new Error("Commande inconnue");
        }
    }

    private handleReload(message: Message): Promise<Message | Message[]> {
        let isAllowed = MoussaillonRightsManager.getInstance().isTheAuthorModerator(message);

        if (isAllowed) {
            message.channel.send("Mise à jour lancée...")
            return this.reloadData(message);
        } else {
            return message.reply("Non autorisé... demande à un grand.")
        }

    }

    private async reloadData(message: Message): Promise<Message | Message[]> {
        let dataloader = DataLoaderManager.getInstance().dataLoader;
        try {
            let data = await dataloader.loadData(this.isATestChan(message));
            this.getBot().updateData(data)
            return await message.channel.send("Données rechargées");
        } catch (e) {
            return await message.reply("Données impossibles à recharger");
        }
    }
}

