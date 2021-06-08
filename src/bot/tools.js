'use strict';

const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");

exports.isHandled = function (command) {
    switch (command) {
        case "user":
            return true;
        default:
            return false
    }
}

function handleUser(message) {

    // Prepare data
    let userID = 0;
    let userUsername = "Inconnu";
    let userRoles = "Inconnu"

    let isMention = message.mentions.users.size > 0;

    let member;
    if (isMention) {
        let user = message.mentions.users.first();
        member = message.guild.member(user);
    } else {
        member = message.author
    }

    if (member) {
        userID = member.id
        userUsername = member.username
        let roles = member.roles.cache
        if (roles && roles.size > 0) {
            userRoles = ""
            roles.forEach((role, roleId) => {
                userRoles = userRoles + role.name + "<" + roleId + ">, "
            })
            userRoles = userRoles.slice(0, -2)
        }
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

exports.handle = function (message, commandParams, discord) {
    let command = message.content.substring(1).split(" ")[0].toLowerCase();
    switch (command) {
        case "user":
            handleUser(message, discord);
            break
        default:
            console.error("Not a good command : " + commandParams)
            return
    }
}