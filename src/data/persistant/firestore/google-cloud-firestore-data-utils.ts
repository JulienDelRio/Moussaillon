import {UserAccount} from "../../user-accounts/user-account";
import {Transaction} from "../../transactions/transaction";

export class GoogleCloudFirestoreDataUtils {
    private constructor() {
    }

    static fillUserAccountFromData(userAccount: UserAccount, data: FirebaseFirestore.DocumentData) {
        userAccount.availableAmount = data.availableAmount;
    }

    static fillTransactionFromData(transaction: Transaction, data: FirebaseFirestore.DocumentData) {
        transaction.id = data.id
    }
}