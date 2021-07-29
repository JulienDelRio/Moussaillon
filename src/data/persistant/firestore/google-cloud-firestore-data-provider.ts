import {IPersistantDataProvider} from "../ipersistant-data-provider";
import {firestore} from "firebase-admin/lib/firestore";
import serviceAccount from "../../../tools/firestore-service-account-key.json";
import {UserAccount} from "../../models/user-account";
import {GoogleCloudFirestoreDataUtils} from "./google-cloud-firestore-data-utils";
import {ErrorUserAlreadyExists} from "../persistant-data-manager";
import Firestore = firestore.Firestore;

const admin = require('firebase-admin');

export class GoogleCloudFirestoreDataProvider implements IPersistantDataProvider {

    private readonly _db: Firestore | undefined;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this._db = admin.firestore();
    }


    private get db(): FirebaseFirestore.Firestore {
        if (this._db == undefined)
            throw Error("Database not connected");
        return this._db;
    }

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
        return this.db.collection(UserAccount.DB_COLLECTION_NAME).doc(String(userId));
    }
}