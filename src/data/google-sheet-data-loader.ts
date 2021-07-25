import {injectable} from "inversify";
import {IDataLoader} from "./idata-loader";
import axios from "axios";
import Papa from "papaparse";
import {Environment} from "../tools/environment";
import {MoussaillonData} from "./models/moussaillon-data";
import {Island} from "./models/island";
import {Member} from "./models/member";
import {MoussaillonRights} from "./models/moussaillon-rights";
import {Commander} from "./models/commander";
import {Sea} from "./models/sea";

@injectable()
export class GoogleSheetDataLoader implements IDataLoader {

    loadData(isTest?: boolean): Promise<MoussaillonData> {
        return this._loadData(isTest);
    }

    private async _loadData(isTest?: boolean): Promise<MoussaillonData> {
        let moussaillonData: MoussaillonData = new MoussaillonData()
        await this.loadSeas(moussaillonData, isTest);
        await this.loadCommanders(moussaillonData, isTest);
        await this.loadIslands(moussaillonData, isTest);
        await this.loadRights(moussaillonData, isTest);
        await this.loadMembers(moussaillonData, isTest);
        return moussaillonData;
    }

    private async loadIslands(data: MoussaillonData, isTest?: boolean): Promise<void> {
        let islandsFileUrl = Environment.getInstance().getIslandsCSVUrl();
        let response = await axios.get(islandsFileUrl);

        let parsed = Papa.parse(response.data, {
            header: true
        })
        let parsedIslands: unknown[] = parsed.data;
        let islands: Map<number, Island> = new Map<number, Island>();
        for (let i = 0; i < parsedIslands.length; i++) {
            let parsedIsland: any = parsedIslands[i];
            try {
                let island = new Island(parseInt(parsedIsland.id), parsedIsland.name);
                island.npc = parsedIsland.npc;
                island.commander = data.commanders.get(parseInt(parsedIsland.commanderId));
                island.cardCode = parsedIsland.cardCode;
                island.cardName = parsedIsland.cardName;
                island.claimed = parsedIsland.claimed;
                island.poneglyphe = parsedIsland.poneglyphe;
                island.boat = parsedIsland.boat;
                island.routeFrom = parsedIsland.routeFrom;
                island.routeTo = parsedIsland.routeTo;
                island.calmBelt = parsedIsland.calmBelt;
                island.moreInfo = parsedIsland.moreInfo;

                // Sea data
                island.seaInfo = parsedIsland.seaInfo;
                island.seaOrder = parsedIsland.seaOrder;
                island.sea = data.seas.get(parseInt(parsedIsland.seaId));
                if (island.sea == undefined)
                    throw new Error("Mer inconnue");
                else
                    island.sea.addIsland(island);

                islands.set(island.id, island);
            } catch (e) {
                console.error(e);
                console.error("Cannot parse :", parsedIsland);
                throw new Error("Cannot parse : " + parsedIsland.name);
            }
        }
        data.islands = islands;
        if (isTest) console.log("islands", islands);
    }

    private async loadCommanders(data: MoussaillonData, isTest?: boolean): Promise<void> {
        let commandersFileUrl = Environment.getInstance().getCommandersCSVUrl();
        let response = await axios.get(commandersFileUrl);

        let parsed = Papa.parse(response.data, {
            header: true
        })
        let parsedCommanders: unknown[] = parsed.data;
        let commanders: Map<number, Commander> = new Map<number, Commander>();
        for (let i = 0; i < parsedCommanders.length; i++) {
            let parsedCommander: any = parsedCommanders[i];
            try {
                let commander = new Commander(parseInt(parsedCommander.id), parsedCommander.name);
                commander.type = parsedCommander.type;
                commanders.set(commander.id, commander);
            } catch (e) {
                console.error("Cannot parse :", parsedCommander);
            }
        }
        data.commanders = commanders;
        if (isTest) console.log("commanders", commanders);
    }

    private async loadSeas(data: MoussaillonData, isTest?: boolean): Promise<void> {
        let seasFileUrl = Environment.getInstance().getSeasCSVUrl();
        let response = await axios.get(seasFileUrl);

        let parsed = Papa.parse(response.data, {
            header: true
        })
        let parsedSeas: unknown[] = parsed.data;
        let seas: Map<number, Sea> = new Map<number, Sea>();
        for (let i = 0; i < parsedSeas.length; i++) {
            let parsedSea: any = parsedSeas[i];
            try {
                let sea = new Sea(parseInt(parsedSea.id), parsedSea.name);
                seas.set(sea.id, sea);
            } catch (e) {
                console.error("Cannot parse :", parsedSea);
            }
        }
        data.seas = seas;
        if (isTest) console.log("seas", seas);
    }

    private async loadMembers(data: MoussaillonData, isTest?: boolean): Promise<void> {
        let membersFileUrl = Environment.getInstance().getMembersCSVUrl();
        let response = await axios.get(membersFileUrl);
        let parsed = Papa.parse(response.data, {
            header: true
        })
        // let members: Member[] = <Member[]>parsed.data
        let members: Map<number, Member> = new Map<number, Member>();
        let parsedMembers: unknown[] = parsed.data;
        for (let i = 0; i < parsedMembers.length; i++) {
            let parsedMember: any = parsedMembers[i];
            try {
                let member = new Member(parseInt(parsedMember.userid), parsedMember.username);
                member.bounty = parsedMember.bounty;
                member.boat = parsedMember.boat;
                member.position = parsedMember.position;
                member.affiliation = parsedMember.affiliation;
                member.rank = parsedMember.rank;
                member.epithet = parsedMember.epithet;
                members.set(member.id, member);
            } catch (e) {
                console.error("Cannot parse:", parsedMember);
            }
        }
        data.members = members;
        if (isTest) console.log("members", members)
    }

    private async loadRights(data: MoussaillonData, isTest?: boolean): Promise<void> {
        let rightsFileUrl = Environment.getInstance().getRightsCSVUrl();
        let response = await axios.get(rightsFileUrl);

        // handle success
        let parsed = Papa.parse(response.data, {})
        let parsedRights = parsed.data
        let rights: MoussaillonRights = {
            moderatorsRoles: [],
            allowedChannels: [],
            testChannels: [],
            allowedServers: [],
        }
        for (let i = 0; i < parsedRights.length; i++) {
            let currentRights: string[] = <string[]>parsedRights[i]
            let rightsName: string = "";
            for (let j = 0; j < currentRights.length; j++) {
                if (j == 0) {
                    // First element, rights name, do nothing
                    rightsName = currentRights[0];
                } else if (currentRights[j]) {
                    rights[rightsName as keyof MoussaillonRights].push(currentRights[j])
                } else {
                    // Empty right, do nothing
                }
            }
        }
        data.rights = rights;
        if (isTest) console.log("rights", rights)
    }
}