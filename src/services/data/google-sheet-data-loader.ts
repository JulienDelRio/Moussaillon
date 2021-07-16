import {injectable} from "inversify";
import {MoussaillonBot} from "../../bot/moussaillon-bot";
import {TYPES} from "../../types";
import {IDataLoader} from "./idata-loader";
import container from "../../../inversify.config";
import {IMoussaillonData} from "./i-moussaillon-data";

@injectable()
export class GoogleSheetDataLoader implements IDataLoader {

    private get getBot(): MoussaillonBot {
        const bot = container.get<MoussaillonBot>(TYPES.MoussaillonBot);
        if (bot === undefined) {
            throw new Error("Bot should be initialized")
        }
        return bot;
    }

    loadData(): Promise<IMoussaillonData> {
        console.log("GoogleSheetDataLoader loadData")
        return new Promise<IMoussaillonData>((resolve, reject) => {
            console.log("GoogleSheetDataLoader _loadData")
            this._loadData(resolve, reject);
        });
    }

    private _loadData(resolve: (value: (IMoussaillonData | PromiseLike<IMoussaillonData>)) => void, reject: (reason?: any) => void) {
        console.log("On dev loadData()")
        if (Math.random() > 0.1) {
            resolve({
                islands: [],
                rights: {
                    moderatorsRoles: ["a", "b"],
                    allowedChannels: ["y", "z"],
                    testChannels: ["1", "2"],
                },
                Wayzen: []
            });
        } else {
            reject(new Error("Bad random"));
        }
    }


    /*
    loadDataOld(success, error) {
        if (this._bot === undefined) {
            throw new Error("Bot should be initialized")
        }
        let data: ImoussaillonData = this._bot.data();
        let isSuccess = false;
        let errors = []
        let finish = function () {
            console.log("Data loading finished")
            if (isSuccess) {
                success(errors)
            } else {
                error(errors)
            }
        }
        this.loadIslands(data, function () {
                isSuccess = true;
            },
            function (e) {
                errors.push(e)
            }, function () {
                loadMembers(data, function () {
                        isSuccess = true;
                    },
                    function (e) {
                        errors.push(e)
                    }, function () {
                        loadRights(data, function () {
                                isSuccess = true;
                            },
                            function (e) {
                                errors.push(e)
                            }, function () {
                                finish();
                            }
                        )
                    }
                )
            }
        )
    }

    private loadIslands(data, success, error, then) {
        let islandsFileUrl = config.dataCSVUrls.islandsFileUrl;
        axios.get(islandsFileUrl)
            .then(function (response) {
                // handle success
                let parsed = Papa.parse(response.data, {
                    header: true
                })
                let islands = parsed.data
                data.islands = islands
                success()
            })
            .catch(function (e) {
                error(e)
            })
            .then(then);
    }

    private loadMembers(data, success, error, then) {
        let membersFileUrl = config.dataCSVUrls.teamMembers;
        axios.get(membersFileUrl)
            .then(function (response) {
                // handle success
                let parsed = Papa.parse(response.data, {
                    header: true
                })
                let members = parsed.data
                data.members = members
                success()
            })
            .catch(function (e) {
                error(e)
            })
            .then(then);
    }

    private loadRights(data, success, error, then) {
        let membersFileUrl = config.dataCSVUrls.rights;
        axios.get(membersFileUrl)
            .then(function (response) {
                // handle success
                let parsed = Papa.parse(response.data, {})
                let parsedRights = parsed.data
                let rights = {}
                for (let i = 0; i < parsedRights.length; i++) {
                    let currentRights = parsedRights[i]
                    for (let j = 0; j < currentRights.length; j++) {
                        if (j == 0)
                            rights[currentRights[0]] = []
                        else if (currentRights[j])
                            rights[currentRights[0]].push(currentRights[j])
                    }
                }
                data.rights = rights
                success()
            })
            .catch(function (e) {
                error(e)
            })
            .then(then);
    }*/
}