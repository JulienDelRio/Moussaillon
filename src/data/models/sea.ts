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

export enum SeasList {
    EastBlue = 1,
    SouthBlue = 2,
    WestBlue = 3,
    NorthBlue = 4,
    Paradis = 5,
    IleCeleste = 6,
    FondsMarins = 7,
    RedLine = 8,
    NouveauMonde = 9,
    CalmBelt = 10
}