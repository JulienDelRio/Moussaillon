import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {Message} from "discord.js";
import {PersistantDataManager} from "../../data/persistant/persistant-data-manager";
import {UserAccountManager} from "../../data/accounts/user-account-manager";

const COMMAND_NEW: string = "nouveau";
const COMMAND_CREDIT: string = "credite";

export class AccountCommand extends AbstractCommandInterpreter {

    handle(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message)
        switch (command) {
            case COMMAND_NEW:
                return this.handleNew(message)
                break
            case COMMAND_CREDIT:
                return this.handleCredit(message)
                break
            default :
                return Promise.reject();
        }
    }

    isHandled(message: Message): boolean {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_NEW:
            case COMMAND_CREDIT:
                return true;
            default:
                return false
        }
    }

    private async handleNew(message: Message): Promise<Message | Message[]> {
        try {
            var userId = parseInt(message.author.id);
            const user = await UserAccountManager.getInstance().newUser(userId);
            return message.channel.send("Utilisateur créé : " + userId);
        } catch (e) {
            return message.channel.send(e.message);
        }
    }


    private async handleCredit(message: Message): Promise<Message | Message[]> {
        return Promise.reject();
    }
}