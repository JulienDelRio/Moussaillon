'use strict';

const config = require('./config.json');
const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");
const team = require("../data/team.json");

exports.isHandled = function (command) {
    switch (command) {
        case "membres":
        case "membre":
        case "user":
            return true;
        default:
            return false
    }
}

exports.handle = function (message) {
    let command = message.content.substring(1).split(" ")[0].toLowerCase();
    switch (command) {
        case "user":
            handleUser(message)
            break
        case "membre":
            handleMember(message)
            break
        case "membres":
            handleMembers(message)
            break
        default:
            console.error("Not a good command : " + command)
            return
    }
}

function handleUser(message) {

    let isMention = message.mentions.users.size > 0;
    let memberId;
    if (isMention) {
        memberId = message.mentions.users.first().id;
    } else {
        memberId = message.author.id;
    }

    message.guild.members.fetch(memberId).then(
        function onSuccess(member) {
            answerMemberInfo(message, member)
        },
        function onError(reason) {
            console.error("Error on fetching member : " + reason.message);
        }
    )
}

function answerMemberInfo(message, member) {

    // Prepare data
    let userID = 0;
    let userUsername = "Inconnu";
    let userRoles = "Inconnu";

    if (member) {
        userID = member.id
        userUsername = member.username
        userRoles = getRolesInline(member)
    }

    // Create message
    const embed = new MoussaillonMessageEmbed()
        .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
        .setTitle("Informations sur le user " + userUsername)
        .addField("ID", userID)
        .addField("Username", "<@!" + userID + ">")
        .addField("Roles", userRoles);

    // Send message
    message.channel.send(embed);

}

function getRolesInline(member) {
    let userRoles = "Inconnu"

    if (member.roles && member.roles.cache) {
        let roles = member.roles.cache
        if (roles && roles.size > 0) {
            userRoles = ""
            roles.forEach((role, roleId) => {
                userRoles = userRoles + role.name + "<" + roleId + ">, "
            })
            userRoles = userRoles.slice(0, -2)
        }
    }

    return userRoles
}

function handleMember(message) {

}

function handleMembers(message) {
    console.log("List members")

    message.guild.members.fetch()
        .then(function (members) {
            // Create message
            const embed = new MoussaillonMessageEmbed()
                .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
                .setTitle("Liste des membres des wayzen");

            if (!members || members.size == 0) {
                embed.addField("Pas de membre", "Nous n'avons pas trouvé de membre")
            } else {
                members.forEach((member, id) => {
                    if (!member.user.bot) {
                        let userRoles = getRolesInline(member)
                        let userDescription = " id : " + id + "\n" +
                            "username : " + member.user.username + "\n" +
                            "nickname : " + member.nickname + "\n" +
                            "roles : " + userRoles;
                        embed.addField(member.displayName, userDescription)
                    }
                })
            }

            // Send message
            message.channel.send(embed);

        })
        .catch(console.error);

}

async function getMember(membersManager, id) {
    let promise = membersManager.fetch(id).then(
        function onSuccess(member) {
            console.log("Found : " + member.displayName)
            return member;
        },
        function onError(reason) {
            console.error("Error geting member : " + reason)
        }
    )
    return await promise;
}