import {IMoussaillonData} from "./i-moussaillon-data";
import {GoogleSheetDataLoader} from "./google-sheet-data-loader";

export interface IDataLoader {
    loadData(): Promise<IMoussaillonData>;
}

export class DataLoaderManager {
    static getNewDataLoader():IDataLoader{
        return new GoogleSheetDataLoader();
    }
}