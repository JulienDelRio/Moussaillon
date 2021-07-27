import {Island} from "./island";

export class Sea {
    readonly name: string;
    readonly id: number;
    readonly islandsSections: Map<number, Map<number, Island>> = new Map<number, Map<number, Island>>();


    constructor(id: number, name: string) {
        if (isNaN(id))
            throw Error("Not a valid ID");
        this.name = name;
        this.id = id;

        this.islandsSections.set(0, new Map<number, Island>());
        switch (id) {
            case SeasList.EastBlue.valueOf():
            case SeasList.WestBlue.valueOf():
            case SeasList.NorthBlue.valueOf():
            case SeasList.SouthBlue.valueOf():
            case SeasList.CalmBelt.valueOf():
            case SeasList.FondsMarins.valueOf():
            case SeasList.IleCeleste.valueOf():
            case SeasList.RedLine.valueOf():
                break;
            case SeasList.NouveauMonde.valueOf():
                this.islandsSections.set(6, new Map<number, Island>());
                this.islandsSections.set(7, new Map<number, Island>());
                this.islandsSections.set(8, new Map<number, Island>());
                this.islandsSections.set(9, new Map<number, Island>());
                this.islandsSections.set(10, new Map<number, Island>());
                this.islandsSections.set(11, new Map<number, Island>());
            case SeasList.Paradis.valueOf():
                this.islandsSections.set(1, new Map<number, Island>());
                this.islandsSections.set(2, new Map<number, Island>());
                this.islandsSections.set(3, new Map<number, Island>());
                this.islandsSections.set(4, new Map<number, Island>());
                this.islandsSections.set(5, new Map<number, Island>());
                break;
            default :
                throw new Error("Mer inexistante");
        }
    }


    addIsland(island: Island) {
        if (!island.seaInfo || island.seaInfo === "") {
            const islandSection = this.islandsSections.get(0);
            if (islandSection == undefined) {
                console.error("Section not found for island :", island);
                throw new Error("Section d'ile inconnue : 0");
            }
            islandSection.set(island.seaOrder, island);
        } else {
            let sectionNumber: number = parseInt(island.seaInfo.split(' ')[1]);
            const islandSection = this.islandsSections.get(sectionNumber);
            if (islandSection == undefined) {
                console.error("Section not found for island :", island);
                throw new Error("Section d'ile inconnue : " + sectionNumber);
            }
            islandSection.set(island.seaOrder, island);
        }
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