import {PersistantDataProvider} from "./persistant-data-provider";
import {GoogleCloudFirestoreDataProvider} from "./firestore/google-cloud-firestore-data-provider";
import {UserAccountDao} from "./dao/user-account-dao";
import {TransactionDao} from "./dao/transaction-dao";


export class PersistantDataManager implements PersistantDataProvider {

    private static instance: PersistantDataManager;
    private readonly _persistantDataProvider: PersistantDataProvider;

    public static getInstance(): PersistantDataManager {
        if (!PersistantDataManager.instance) {
            PersistantDataManager.instance = new PersistantDataManager();
        }

        return PersistantDataManager.instance;
    }

    private constructor() {
        this._persistantDataProvider = new GoogleCloudFirestoreDataProvider();
    }

    init() {
        // Do nothing it's just to call the constructor for now.
    }

    getUserAccountDAO(): UserAccountDao {
        return this._persistantDataProvider.getUserAccountDAO();
    }

    getTransactionDAO(): TransactionDao {
        return this._persistantDataProvider.getTransactionDAO();
    }
}