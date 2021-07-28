import {IPersistantDataProvider} from "./ipersistant-data-provider";
import {GoogleCloudFirestoreDataProvider} from "./google-cloud-firestore-data-provider";


export class PersistantDataManager {

    private static instance: PersistantDataManager;
    private persistantDataProvider: IPersistantDataProvider;

    public static getInstance(): PersistantDataManager {
        if (!PersistantDataManager.instance) {
            PersistantDataManager.instance = new PersistantDataManager();
        }

        return PersistantDataManager.instance;
    }

    private constructor() {
        this.persistantDataProvider = new GoogleCloudFirestoreDataProvider();
    }

    init(){
        // Do nothing it's just to call the constructor for now.
    }
}