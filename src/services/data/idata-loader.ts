import {IMoussaillonData} from "./i-moussaillon-data";
import {GoogleSheetDataLoader} from "./google-sheet-data-loader";

export interface IDataLoader {
    loadData(): Promise<IMoussaillonData>;
}

export class DataLoaderManager {
    private static instance: DataLoaderManager;

    public static getInstance(): DataLoaderManager {
        if (!DataLoaderManager.instance) {
            DataLoaderManager.instance = new DataLoaderManager();
        }

        return DataLoaderManager.instance;
    }

    private _dataLoader: IDataLoader;

    private constructor() {
        this._dataLoader = new GoogleSheetDataLoader();
    }


    get dataLoader(): IDataLoader {
        return this._dataLoader;
    }
}