import {PersistantDataManager} from "../persistant/persistant-data-manager";
import {CommandDescriptor} from "../transactions/command-descriptor";
import {User} from "discord.js";

export class UserAccountManager {

    private static instance: UserAccountManager;

    public static getInstance(): UserAccountManager {
        if (!UserAccountManager.instance) {
            UserAccountManager.instance = new UserAccountManager();
        }

        return UserAccountManager.instance;
    }

    private constructor() {
    }

    newUser(userId: number) {
        return PersistantDataManager.getInstance().getUserAccountDAO().newUser(userId);
    }

    getUser(userId: number) {
        return PersistantDataManager.getInstance().getUserAccountDAO().getUser(userId);
    }

    countCommand(userId: number, commandDescriptor: CommandDescriptor): Promise<boolean> {
        return PersistantDataManager.getInstance().getUserAccountDAO().countCommand(userId, commandDescriptor);
    }

    isAKnownUser(author: User) {
        // TODO
        return true;
    }

    isAKnownAccount(author: User) {
        // TODO check is he is a wayzen
        // TODO if not, check it's a registered user
        return false;
    }
}