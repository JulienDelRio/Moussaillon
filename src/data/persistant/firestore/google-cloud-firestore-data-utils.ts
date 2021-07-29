import {UserAccount} from "../../accounts/user-account";

export class GoogleCloudFirestoreDataUtils {
    private constructor() {
    }

    static fillUserAccountFromData(userAccount: UserAccount, data: FirebaseFirestore.DocumentData) {
        userAccount.availableAmount = data.availableAmount;
    }
}