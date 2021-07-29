import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;

export class BaseDAO {
    private readonly _db: Firestore;

    constructor(db: Firestore) {
        this._db = db;
    }

    protected get db(): FirebaseFirestore.Firestore {
        return this._db;
    }
}