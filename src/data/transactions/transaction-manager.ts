import {PersistantDataManager} from "../persistant/persistant-data-manager";
import {UserAccount} from "../user-accounts/user-account";

export class TransactionManager {

    private static instance: TransactionManager;

    public static getInstance(): TransactionManager {
        if (!TransactionManager.instance) {
            TransactionManager.instance = new TransactionManager();
        }

        return TransactionManager.instance;
    }

    private constructor() {
    }

    newTransaction(amount: number, user: UserAccount) {
        return PersistantDataManager.getInstance().getTransactionDAO().newTransaction(amount, user);
    }

}