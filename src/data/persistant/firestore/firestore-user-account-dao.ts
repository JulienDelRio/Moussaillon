import {BaseDAO} from "../dao/base-dao";
import {ErrorUserAlreadyExists, UserAccountDao} from "../dao/user-account-dao";
import {UserAccount} from "../../user-accounts/user-account";
import {GoogleCloudFirestoreDataUtils} from "./google-cloud-firestore-data-utils";

export class FirestoreUserAccountDao extends BaseDAO implements UserAccountDao {
    static readonly USERACCOUNT_COLLECTION_NAME = "users";

    async newUser(userId: number): Promise<UserAccount> {
        const userRef = this.getUserRef(userId);
        const user = await userRef.get();
        if (user.exists) {
            throw new ErrorUserAlreadyExists("L'utilisateur existe déjà");
        }
        const userAccount = new UserAccount(userId);
        await userRef.set(userAccount.serialize());
        return userAccount;
    }

    async getUser(userId: number): Promise<UserAccount | undefined> {
        const userRef = this.getUserRef(userId);
        const user = await userRef.get();
        if (!user.exists) {
            return undefined;
        } else {
            const userAccount = new UserAccount(userId);
            const data = user.data();
            if (data)
                GoogleCloudFirestoreDataUtils.fillUserAccountFromData(userAccount, data);
            return userAccount;
        }
    }

    private getUserRef(userId: number) {
        return this.db.collection(FirestoreUserAccountDao.USERACCOUNT_COLLECTION_NAME).doc(String(userId));
    }

}