'use strict';

const config = require('./config.json');
const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");
const team = require("../data/team.json");

exports.isHandled = function (command) {
    switch (command) {
        case "membres":
            return true;
        default:
            return false
    }
}

exports.handle = function (message, command, commandParams) {
    switch (command) {
        case "membres":
            handleMembers(message)
            break
        default:
            console.error("Not a good command : " + commandParams)
            return
    }
}

function handleMembers(message) {
    console.log("List members")

    message.guild.members.fetch()
        .then(function (members) {
            console.log("Team found")

            // Create message
            const embed = new MoussaillonMessageEmbed()
                .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
                .setTitle("Liste des membres des wayzen");

            if (!members || members.size == 0) {
                embed.addField("Pas de membre", "Nous n'avons pas trouvé de membre")
            } else {
                members.forEach((member, id) => {
                    let userDescription = " id : " + id + "\n" +
                        "nickname : " + member.nickname
                    embed.addField(member.user.username, userDescription)
                })
            }

            // Send message
            message.channel.send(embed);

        })
        .catch(console.error);

}