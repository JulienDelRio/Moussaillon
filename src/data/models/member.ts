export class Member {
    readonly id: number;
    readonly username: string;
    bounty: string | undefined;
    boat: string | undefined;
    position: string | undefined;
    affiliation: string | undefined;
    rank: string | undefined;
    epithet: string | undefined;

    constructor(id: number, username: string) {
        if (isNaN(id))
            throw Error("Not a valid ID");
        this.id = id;
        this.username = username;
    }

    getNumberBounty(): number {
        let bountyNumber = Number(this.bounty);
        if (isNaN(bountyNumber)) {
            let bountyString: string = <string>this.bounty;
            return Number.parseInt(bountyString.split(' ').join(''));
        } else
            return bountyNumber;
    }

    isAlly(): boolean {
        return "Allié" === this.rank;
    }
}