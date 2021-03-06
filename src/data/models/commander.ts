import {Island} from "./island";

export class Commander {
    readonly name: string;
    readonly id: number;
    type: string | undefined;
    island: Island | undefined;


    constructor(id: number, name: string) {
        if (isNaN(id))
            throw Error("Not a valid ID");
        this.name = name;
        this.id = id;
    }
}