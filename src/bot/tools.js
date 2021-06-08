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

    let isMention = message.mentions.users.size > 0;

    if (isMention) {
        let user = message.mentions.users.first();
        let member = message.guild.member(user);
        if (member) {
            console.log("Member : \n" +
                JSON.stringify(member, null, 1))
            userID = member.id
            userUsername = member.username
        }
    } else {
        userID = message.author.id
        userUsername = message.author.username
    }

    // Create message
    const embed = new MoussaillonMessageEmbed()
        .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
        .setTitle("Informations sur le user " + userUsername)
        .addField("ID", userID)
        .addField("Username", "<@!" + userID + ">");

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