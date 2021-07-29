import {PersistantDataProvider} from "../persistant-data-provider";
import {firestore} from "firebase-admin/lib/firestore";
import serviceAccount from "../../../tools/firestore-service-account-key.json";
import {UserAccountDao} from "../dao/user-account-dao";
import {FirestoreUserAccountDao} from "./firestore-user-account-dao";
import Firestore = firestore.Firestore;
import {TransactionDao} from "../dao/transaction-dao";
import {FirestoreTransactionDao} from "./firestore-transaction-dao";

const admin = require('firebase-admin');

export class GoogleCloudFirestoreDataProvider implements PersistantDataProvider {

    private readonly _db: Firestore;
    private readonly _userAccountDAO: UserAccountDao;
    private readonly _transactionDAO: TransactionDao;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this._db = admin.firestore();
        this._userAccountDAO = new FirestoreUserAccountDao(this._db);
        this._transactionDAO = new FirestoreTransactionDao(this._db);
    }

    getUserAccountDAO(): UserAccountDao {
        return this._userAccountDAO;
    }

    getTransactionDAO(): TransactionDao {
        return this._transactionDAO;
    }
}