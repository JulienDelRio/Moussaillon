export interface IMoussaillonData {
    islands: Island[],
    rights: MoussaillonRights
    Wayzen: Wayzen[]
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

export interface Wayzen {
    user: string;
    userid: string;
    bounty: string;
    boat: string;
    position: string;
    affiliation: string;
    rank: string;
    epithet: string;
}