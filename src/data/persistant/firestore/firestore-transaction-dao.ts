import {TransactionDao} from "../dao/transaction-dao";
import {BaseDAO} from "../dao/base-dao";
import {UserAccount} from "../../user-accounts/user-account";
import {Transaction} from "../../transactions/transaction";
import {GoogleCloudFirestoreDataUtils} from "./google-cloud-firestore-data-utils";

export class FirestoreTransactionDao extends BaseDAO implements TransactionDao {
    static readonly TRANSACTIONS_COLLECTION_NAME = "transactions";

    async newTransaction(amount: number, user: UserAccount): Promise<Transaction> {
        const transaction = new Transaction(amount, user.userId, new Date());
        const data = await this.db.collection(FirestoreTransactionDao.TRANSACTIONS_COLLECTION_NAME).add(transaction.serialize());
        console.log("data", data);
        GoogleCloudFirestoreDataUtils.fillTransactionFromData(transaction, data);
        return transaction;
    }

}