import {injectable} from "inversify";
import {IDataLoader} from "./idata-loader";
import {IMoussaillonData, Island, Member, MoussaillonRights} from "./i-moussaillon-data";
import axios from "axios";
import Papa from "papaparse";
import {Environment} from "../../tools/environment";

@injectable()
export class GoogleSheetDataLoader implements IDataLoader {

    loadData(): Promise<IMoussaillonData> {
        return this._loadData();
    }

    private async _loadData(): Promise<IMoussaillonData> {
        let res: IMoussaillonData = {
            islands: [],
            rights: {
                moderatorsRoles: [],
                allowedChannels: [],
                testChannels: [],
                allowedServers: [],
            },
            members: []
        };
        res.islands = await this.loadIslands();
        res.rights = await this.loadRights();
        res.members = await this.loadMembers();
        return res;
    }

    private async loadIslands(): Promise<Island[]> {
        let islandsFileUrl = Environment.getInstance().getIslandCSVUrl();
        let response = await axios.get(islandsFileUrl);

        let parsed = Papa.parse(response.data, {
            header: true
        })
        let islands: Island[] = <Island[]>parsed.data;
        return islands;
    }

    private async loadMembers(): Promise<Member[]> {
        let membersFileUrl = Environment.getInstance().getMembersCSVUrl();
        let response = await axios.get(membersFileUrl);
        let parsed = Papa.parse(response.data, {
            header: true
        })
        // let members: Member[] = <Member[]>parsed.data
        let members: Member[] = [];
        let parsedMembers: unknown[] = parsed.data;
        for (let i = 0; i < parsedMembers.length; i++) {
            let current :any = parsedMembers[i];
            let member = new Member();
            member.user = current.user;
            member.userid = current.userid;
            member.bounty = current.bounty;
            member.boat = current.boat;
            member.position = current.position;
            member.affiliation = current.affiliation;
            member.rank = current.rank;
            member.epithet = current.epithet;
            members.push(member);
        }
        return members;
    }

    private async loadRights(): Promise<MoussaillonRights> {
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
        return rights;
    }
}