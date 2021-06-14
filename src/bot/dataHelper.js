const axios = require('axios').default;
const Papa = require('papaparse')


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
    let rolesAllower = [
        "842089797254119434", // Lieutenant
        "835171890142249012", // Commandant
        "835165337535512627" // Chef
    ]
    rolesAllower.forEach(role => {
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

exports.loadData = function (data, success, error, then) {
    loadIslands(data, function () {
            success()
        },
        function (e) {
            error(e)
        }, function () {
            then();
        }
    )
}

function loadIslands(data, success, error, then) {
    let islandsFileUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQan4pzKjxpNyvmktnHGbx6Zw0U7xrMeAxBvC2sdHXdqWZZs0Bl-HcwoBL9epdNHKipFi3bNalIizM1/pub?gid=0&single=true&output=csv";
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
        .then(then());
}