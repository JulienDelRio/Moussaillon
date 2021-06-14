'use strict';

const config = require('./config.json');
const MoussaillonMessageEmbed = require("./MoussaillonMessageEmbed.js");

const bountyFormatter = new Intl.NumberFormat('fr-FR', {})
const wayzenLogoUrl = "https://media.discordapp.net/attachments/845220603971239944/851924163723526164/20210429_223145_0000.png"
let team = null

exports.isHandled = function (command) {
    switch (command) {
        case "membres":
        case "membre":
        case "user":
        case "users":
        case "classement":
            return true;
        default:
            return false
    }
}

exports.handle = function (message, data) {
    team = data.members
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
        case "classement":
            handleClassement(message)
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
    console.log("Member ID : " + memberId)
    let member = getMemberById(memberId);

    if (member) {
        displayMember(message, member);
    } else {
        message.channel.send("Membre inconnu");
    }
}

function handleMembers(message) {
    team.sort(sortMembersByUsername);
    displayMembers(message, team)
}

function displayMembers(message, members) {
    // Create message
    const embed = new MoussaillonMessageEmbed()
        .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
        .setTitle("Liste des membres des wayzen")
        .setThumbnail(wayzenLogoUrl)

    if (!members || members.length == 0) {
        embed.addField("Pas de membre", "Nous n'avons pas trouvé de membre")
    } else {
        let usernames = ""
        let userbounties = ""
        let userboats = ""
        members.forEach((member, id) => {
            if (member.user)
                usernames = usernames + member.user + "\n"
            else
                usernames = usernames + "Inconnu\n"

            if (member.bounty)
                userbounties = userbounties + getFormatterBounty(member.bounty) + "\n"
            else
                userbounties = userbounties + "Inconnu\n"

            if (member.boat)
                userboats = userboats + member.boat + "\n"
            else
                userboats = userboats + "Inconnu\n"
        })
        embed.addField("Membre", usernames, true)
        embed.addField("Prime", userbounties, true)
        embed.addField("Bateaux", userboats, true)
    }

    // Send message
    message.channel.send(embed);
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
        bounty = getFormatterBounty(bounty)

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
        .setTitle("Liste des utilisateurs des wayzen")
        .setThumbnail(wayzenLogoUrl)

    if (!members || members.length == 0) {
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

function sortMembersByUsername(a, b) {
    return a.user.localeCompare(b.user)
}

function sortMembersByBounty(a, b) {
    if (!a || !Number.isInteger(a.bounty)) {
        return -1
    } else if (!b || !Number.isInteger(b.bounty)) {
        return 1
    } else {
        let result = Number.parseInt(b.bounty) - Number.parseInt(a.bounty)
        return result
    }
}

function getMemberById(id) {
    let foundMember = null
    if (team)
        team.forEach(member => {
            if (member.userid == id) {
                foundMember = member;
            }
        })
    else
        console.error("Team should not be null")
    return foundMember
}

function handleClassement(message) {
    let commandElements = message.content.split(" ")
    let nbRanks = 10
    if (commandElements.length <= 1) {
        // No param
    } else {
        let parsedNbRanks = Number.parseInt(commandElements[1])
        if (!Number.isNaN(parsedNbRanks) && parsedNbRanks > 0) {
            nbRanks = parsedNbRanks
        }
    }

    team.sort(sortMembersByBounty);
    displayClassement(message, team, nbRanks)
}


function displayClassement(message, members, pNbDisplay) {
    let nbDisplay = pNbDisplay
    if (!nbDisplay)
        nbDisplay = 10
    // Create message
    const embed = new MoussaillonMessageEmbed()
        .setAuthor("Commande par " + message.author.username, message.author.avatarURL())
        .setTitle("Tableau du TOP " + nbDisplay + " des wayzens")
        .setThumbnail(wayzenLogoUrl)

    if (!members || members.length == 0) {
        embed.addField("Pas de membre", "Nous n'avons pas trouvé de membre")
    } else {
        let usernames = ""
        let userbounties = ""
        let userlevels = ""
        let totalBounty = 0

        for (let i = 0; i < members.length; i++) {
            let currentMember = members[i]

            totalBounty = totalBounty + getNumberBounty(currentMember.bounty)

            if (i < nbDisplay) {
                let preUsername = ""
                if (i == 0)
                    preUsername = "🥇 "
                else if (i == 1)
                    preUsername = "🥈 "
                else if (i == 2)
                    preUsername = "🥉 "
                else
                    preUsername = "▫️ "

                if (currentMember.user)
                    usernames = usernames + preUsername + currentMember.user + "\n"
                else
                    usernames = usernames + "Inconnu\n"

                if (currentMember.boat) {
                    let userlevel = currentMember.boat.split("Niv.")[1]
                    userlevels = userlevels + userlevel + "\n"
                } else
                    userlevels = userlevels + "Inconnu\n"

                if (currentMember.bounty)
                    userbounties = userbounties + getFormatterBounty(currentMember.bounty) + "\n"
                else
                    userbounties = userbounties + "Inconnu\n"
            }
        }

        embed.addField("Total primes", bountyFormatter.format(totalBounty))
        embed.addField("Membre", usernames, true)
        embed.addField("Prime", userbounties, true)
        embed.addField("Niveau", userlevels, true)
    }

    // Send message
    message.channel.send(embed);
}

function getFormatterBounty(bounty) {
    let formattedBounty = getNumberBounty(bounty);
    return bountyFormatter.format(formattedBounty)
}

function getNumberBounty(bounty) {
    if (Number.isInteger(bounty))
        return bounty
    else
        return Number.parseInt(bounty.split(' ').join(''))
}