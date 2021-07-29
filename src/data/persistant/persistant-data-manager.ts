import {IPersistantDataProvider} from "./ipersistant-data-provider";
import {GoogleCloudFirestoreDataProvider} from "./firestore/google-cloud-firestore-data-provider";
import {UserAccount} from "../accounts/user-account";


export class PersistantDataManager implements IPersistantDataProvider {

    private static instance: PersistantDataManager;
    private persistantDataProvider: IPersistantDataProvider;

    public static getInstance(): PersistantDataManager {
        if (!PersistantDataManager.instance) {
            PersistantDataManager.instance = new PersistantDataManager();
        }

        return PersistantDataManager.instance;
    }

    private constructor() {
        this.persistantDataProvider = new GoogleCloudFirestoreDataProvider();
    }

    init() {
        // Do nothing it's just to call the constructor for now.
    }

    getUser(userId: number): Promise<UserAccount | undefined> {
        return this.persistantDataProvider.getUser(userId);
    }

    newUser(userId: number): Promise<UserAccount> {
        return this.persistantDataProvider.newUser(userId)
    }
}

export class ErrorUserAlreadyExists extends Error {
}