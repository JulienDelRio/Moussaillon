import {inject, injectable} from "inversify";
import {MoussaillonBot} from "../../bot/moussaillon-bot";
import {TYPES} from "../../types";
import {Message} from "discord.js";
import {IDataLoader} from "./idata-loader";
import container from "../../../inversify.config";
import {IMoussaillonData, Island, MoussaillonRights} from "./i-moussaillon-data";

@injectable()
export class GoogleSheetDataLoader implements IDataLoader {

    private get getBot(): MoussaillonBot {
        const bot = container.get<MoussaillonBot>(TYPES.MoussaillonBot);
        if (bot === undefined) {
            throw new Error("Bot should be initialized")
        }
        return bot;
    }

    _loadData(message: Message): Promise<Message> {
        let success = Math.random() > 0.25 ? true : false;

        if (success) {
            return message.channel.send("Mise à jour effectuée...")
        } else {
            return message.channel.send("Mise à jour échouée...")
        }
    }

    loadData(): Promise<IMoussaillonData> {
        return new Promise<IMoussaillonData>((resolve, reject) => {
            console.log("On dev loadData()")
            if (Math.random() > 0.5) {
                resolve({
                    islands: [],
                    rights: {
                        moderatorsRoles: ["a","b"],
                        allowedChannels: ["y","z"],
                        testChannels: ["1","2"],
                    },
                    Wayzen: []
                });
            } else {
                reject(new Error("Bad random"));
            }
        });
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