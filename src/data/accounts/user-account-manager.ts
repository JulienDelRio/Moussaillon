import {UserAccount} from "./user-account";
import {PersistantDataManager} from "../persistant/persistant-data-manager";
import {anyNumber} from "ts-mockito";

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
        return PersistantDataManager.getInstance().newUser(userId);
    }

}