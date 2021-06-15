const axios = require('axios').default;
const Papa = require('papaparse')
const config = require('./config.json');


exports.isHandled = function (command) {
    switch (command) {
        case "recharge":
            return true;
        default:
            return false
    }
}

function handleRecharge(message) {
    let roles = message.member.roles.cache;
    let isAllowed = false;
    // let rolesAllower = [
    //     "842089797254119434", // Lieutenant
    //     "835171890142249012", // Commandant
    //     "835165337535512627" // Chef
    // ]
    let rolesAllowed = data.rights.moderatorsRoles;
    rolesAllowed.forEach(role => {
        if (roles.has(role))
            isAllowed = true
    })

    if (isAllowed) {
        message.channel.send("Mise à jour lancée...")
        exports.loadData(data, function () {
            message.channel.send("Mise à jour effectuée...")
        }, function () {
            message.channel.send("Mise à jour échouée...")
        }, function () {
        })
    } else {
        message.channel.send("Non autorisé... demande à un grand.")
    }

}

exports.handle = function (message) {
    let command = message.content.substring(1).split(" ")[0].toLowerCase();
    switch (command) {
        case "recharge":
            handleRecharge(message)
            break
        default:
            console.error("Not a good command : " + command)
            return
    }
}

exports.loadData = function (data, success, error) {
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
    loadIslands(data, function () {
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

function loadIslands(data, success, error, then) {
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

function loadMembers(data, success, error, then) {
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

function loadRights(data, success, error, then) {
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
                    else
                        if (currentRights[j])
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
}