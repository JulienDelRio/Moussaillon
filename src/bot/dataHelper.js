const axios = require('axios').default;
const Papa = require('papaparse')

exports.loadData = function (data, success, error, then) {
    loadIslands(data, function () {
            console.log("Islands data loaded")
        },
        function (e) {
            console.log("Islands data loading error")
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