import {Transaction} from "../../transactions/transaction";
import {UserAccount} from "../../user-accounts/user-account";

export interface TransactionDao {

    newTransaction(amount:number, user: UserAccount): Promise<Transaction>
}