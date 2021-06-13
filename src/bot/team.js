'use strict';

const config = require('./config.json');
const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");
const {team} = require("../data/team.json");

const bountyFormatter = new Intl.NumberFormat('fr-FR', {  })

exports.isHandled = function (command) {
    switch (command) {
        case "membres":
        case "membre":
        case "user":
        case "users":
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
        case "users":
            handleUsers(message)
            break
        default:
            console.error("Not a good command : " + command)
            return
    }
}

function getTargetedMemberId(message) {
    let isMention = message.mentions.users.size > 0;
    if (isMention) {
        return message.mentions.users.first().id;
    } else {
        return message.author.id;
    }
}

function handleUser(message) {

    let memberId = getTargetedMemberId(message);

    message.guild.members.fetch(memberId).then(
        function onSuccess(member) {
            displayUser(message, member)
        },
        function onError(reason) {
            console.error("Error on fetching member : " + reason.message);
        }
    )
}

function displayUser(message, user) {

    // Prepare data
    let userID = 0;
    let userUsername = "Inconnu";
    let userRoles = "Inconnu";
    let userThumbnail = "";

    if (user) {
        userID = user.id
        userUsername = user.displayName
        userRoles = getRolesInline(user)
        userThumbnail = user.user.avatarURL()
    }

    let fieldsName = "🆔 ID\n" +
        "😀 Username\n" +
        "👼 Roles";
    let fieldsValue = userID + "\n" +
        "<@!" + userID + ">\n" +
        userRoles + "";

    // Create message
    const embed = new MoussaillonMessageEmbed()
        .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
        .setTitle("Utilisateur " + userUsername)
        .setThumbnail(userThumbnail)
        .addField("Champs", fieldsName, true)
        .addField("Valeurs", fieldsValue, true)

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
    let memberId = getTargetedMemberId(message);
    let member = getMemberById(memberId);

    if (member) {
        displayMember(message, member);
    } else {
        message.channel.send("Membre inconnu");
    }
}

function handleMembers(message) {
    team.sort(sortMembersById);
    console.log("*** Sort members by ID ***")
    team.forEach(member => {
        console.log(member.userid + " " + member.user);
    })
    message.channel.send("En cours de développement...");
}

function displayMember(message, member) {

    // Prepare data
    let memberID = 0;
    let username = "Inconnu";
    let bounty = "Inconnue";
    let rank = "Inconnu"
    let position = "Inconnu"
    let affiliation = "Inconnue"
    let boat = "Inconnu"

    if (member) {
        memberID = member.userid ?? memberID;
        username = member.user ?? username;
        bounty = member.bounty ?? bounty;
        if(Number.isInteger(bounty)){
            bounty = bountyFormatter.format(bounty)
        }
        rank = member.rank ?? rank;
        position = member.position ?? position;
        affiliation = member.affiliation ?? affiliation;
        boat = member.boat ?? boat;
    }

    let fieldsName = "💰 Prime\n" +
        "🔺 Rang\n" +
        "⛵ Bateau\n" +
        "🗺 Position\n" +
        "💼 Affiliation";
    let fieldsValue = bounty + "\n" +
        rank + "\n" +
        boat + "\n" +
        position + "\n" +
        affiliation

    // Create message
    const embed = new MoussaillonMessageEmbed()
        .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
        .setTitle("Membre " + username)
        .addField("Champs", fieldsName, true)
        .addField("Valeurs", fieldsValue, true)

    // Send message
    message.channel.send(embed);

}

function displayUsers(message, members) {
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
}

function handleUsers(message) {
    message.guild.members.fetch()
        .then(function (members) {
            displayUsers(message, members);
        })
        .catch(console.error);
}

function sortMembersById(a, b) {
    return a.userid.localeCompare(b.userid)
}

function sortMembersByBounty(a, b) {
    if (!Number.isInteger(a))
        return -1
    if (!Number.isInteger(b))
        return 1
    return Number.parseInt(a) - Number.parseInt(b)
}

function getMemberById(id) {
    let foundMember = null
    team.forEach(member => {
        if (member.userid == id) {
            foundMember = member;
        }
    })
    return foundMember
}