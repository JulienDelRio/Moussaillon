export class Sea {
    readonly name: string;
    readonly id: number;


    constructor(id: number, name: string) {
        if (isNaN(id))
            throw Error("Not a valid ID");
        this.name = name;
        this.id = id;
    }
}