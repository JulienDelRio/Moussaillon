import {IPersistantDataProvider} from "./ipersistant-data-provider";
import {firestore} from "firebase-admin/lib/firestore";
import Firestore = firestore.Firestore;

const admin = require('firebase-admin');
import serviceAccount from "../../tools/firestore-service-account-key.json";

export class GoogleCloudFirestoreDataProvider implements IPersistantDataProvider {

    private _db: Firestore | undefined;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this._db = admin.firestore();
        this.testDb();
    }

    private async testDb() {
        const docRef = this.db.collection('users').doc('alovelace');

        await docRef.set({
            first: 'Ada',
            last: 'Lovelace',
            born: 1815
        });
        console.log("Ada added");

        const aTuringRef = this.db.collection('users').doc('aturing');

        await aTuringRef.set({
            'first': 'Alan',
            'middle': 'Mathison',
            'last': 'Turing',
            'born': 1912
        });
        console.log("Alan added");

        console.log("Display users :");
        const snapshot = await this.db.collection('users').get();
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    }


    private get db(): FirebaseFirestore.Firestore {
        if (this._db == undefined)
            throw Error("Database not connected");
        return this._db;
    }
}