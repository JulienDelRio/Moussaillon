export interface IMoussaillonData {
    islands: Island[],
    rights: MoussaillonRights
    members: Member[]
}

export interface Island {
    name: string;
    id: string;
    sea: string;
    npc: string;
    commander: string;
    cardCode: string;
    cardName: string;
    claimed: string;
    poneglyphe: string;
    boat: string;
    routeFrom: string;
    routeTo: string;
    moreInfo: string;
}

export interface MoussaillonRights {
    moderatorsRoles: string[];
    allowedChannels: string[];
    testChannels: string[];
}

export class Member {
    user: string | undefined;
    userid: string | undefined;
    bounty: string | undefined;
    boat: string | undefined;
    position: string | undefined;
    affiliation: string | undefined;
    rank: string | undefined;
    epithet: string | undefined;


    getNumberBounty(): number {
        let bountyNumber = Number(this.bounty);
        if (isNaN(bountyNumber)) {
            let bountyString: string = <string>this.bounty;
            return Number.parseInt(bountyString.split(' ').join(''));
        } else
            return bountyNumber;
    }
}