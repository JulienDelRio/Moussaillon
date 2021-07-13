import {IMoussaillonData} from "./i-moussaillon-data";

export interface IDataLoader {
    loadData(): Promise<IMoussaillonData>;
}