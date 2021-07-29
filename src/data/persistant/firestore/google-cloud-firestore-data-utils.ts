import {UserAccount} from "../../models/user-account";

export class GoogleCloudFirestoreDataUtils {
    private constructor() {
    }

    static fillUserAccountFromData(userAccount: UserAccount, data: FirebaseFirestore.DocumentData) {
        userAccount.availableAmount = data.availableAmount;
    }
}