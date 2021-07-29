import {UserAccountDao} from "./dao/user-account-dao";
import {TransactionDao} from "./dao/transaction-dao";

export interface PersistantDataProvider {

    getUserAccountDAO():UserAccountDao;

    getTransactionDAO():TransactionDao;
}