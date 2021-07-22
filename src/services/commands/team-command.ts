import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {GuildMember, Message} from "discord.js";
import {Member} from "../data/i-moussaillon-data";

import {MoussaillonMessageEmbed} from "../../tools/discord/moussaillon-message-embed";

const bountyFormatter = new Intl.NumberFormat('fr-FR', {})
const wayzenLogoUrl = "https://media.discordapp.net/attachments/845220603971239944/851924163723526164/20210429_223145_0000.png"
const COMMAND_MEMBRES = "membres";
const COMMAND_MEMBRE = "membre";
const COMMAND_USER = "user";
const COMMAND_USERS = "users";
const COMMAND_CLASSEMENT = "classement";
const COMMAND_TOP = "top";

export class TeamCommand extends AbstractCommandInterpreter {

    isHandled(message: Message): boolean {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_MEMBRES:
            case COMMAND_MEMBRE:
            case COMMAND_USER:
            case COMMAND_USERS:
            case COMMAND_CLASSEMENT:
            case COMMAND_TOP:
                return true;
            default:
                return false
        }
    }

    handle(message: Message): Promise<Message | Message[]> {
        let command = this.getCommand(message);
        switch (command) {
            case COMMAND_USER:
                return this.handleUser(message)
            case COMMAND_MEMBRE:
                return this.handleMember(message)
            case COMMAND_MEMBRES:
                return this.handleMembers(message)
            case COMMAND_USERS:
                return this.handleUsers(message)
            case COMMAND_CLASSEMENT:
            case COMMAND_TOP:
                return this.handleClassement(message)
            default:
                return Promise.reject();
        }
    }

    private getTargetedMemberId(message: Message) {
        let isMention = message.mentions.users.size > 0;
        let firstUser = message.mentions.users.first();
        if (isMention && firstUser != undefined) {
            return firstUser.id;
        } else {
            return message.author.id;
        }
    }

    private async handleUser(message: Message): Promise<Message | Message[]> {

        let memberId = this.getTargetedMemberId(message);

        let guild = message.guild;
        if (guild == null) {
            throw new Error("Guild not found")
        }
        let member = await guild.members.fetch(memberId);
        return this.displayUser(message, member);
    }

    private displayUser(message: Message, user: GuildMember): Promise<Message | Message[]> {

        // Prepare data
        let userID: number = 0;
        let userUsername: string = "Inconnu";
        let userRoles: string = "Inconnu";
        let userThumbnail: string = "";

        if (user) {
            userID = Number(user.id);
            userUsername = user.displayName;
            userRoles = this.getRolesInline(user);
            userThumbnail = user.user.avatarURL() ?? "";
        }

        let fieldsName = "🆔 ID\n" +
            "😀 Username\n" +
            "👼 Roles";
        let fieldsValue = userID + "\n" +
            "<@!" + userID + ">\n" +
            userRoles + "";

        // Create message
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL() ?? "")
            .setTitle("Utilisateur " + userUsername)
            .setThumbnail(userThumbnail)
            .addField("Champs", fieldsName, true)
            .addField("Valeurs", fieldsValue, true)

        // Send message
        return message.channel.send(embed);

    }

    private getRolesInline(member: GuildMember) {
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

    private handleMember(message: Message): Promise<Message | Message[]> {
        let memberId = this.getTargetedMemberId(message);
        console.log("Member ID : " + memberId)
        let member = this.getMemberById(memberId);

        if (member) {
            return this.displayMember(message, member);
        } else {
            return message.channel.send("Membre inconnu");
        }
    }

    private handleMembers(message: Message): Promise<Message | Message[]> {
        this.getMembers().sort(this.sortMembersByUsername);
        return this.displayMembers(message, this.getMembers())
    }

    private displayMembers(message: Message, members: Member[]): Promise<Message | Message[]> {
        // Create message
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL() ?? "")
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
                    userbounties = userbounties + this.getFormattedBounty(member.getNumberBounty()) + "\n"
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
        return message.channel.send(embed);
    }

    private displayMember(message: Message, member: Member): Promise<Message | Message[]> {

        // Prepare data
        let memberID = NaN;
        let username = "Inconnu";
        let bounty = "";
        let rank = "Inconnu"
        let position = "Inconnu"
        let affiliation = "Inconnue"
        let boat = "Inconnu"

        if (member) {
            memberID = Number(member.userid) ?? memberID;
            username = member.user ?? username;
            bounty = this.getFormattedBounty(member.getNumberBounty());

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
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL() ?? "")
            .setTitle("Membre " + username)
            .addField("Champs", fieldsName, true)
            .addField("Valeurs", fieldsValue, true)

        // Send message
        return message.channel.send(embed);

    }

    private displayUsers(message: Message, members: GuildMember[]): Promise<Message | Message[]> {
        // Create message
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL() ?? "")
            .setTitle("Liste des utilisateurs des wayzen")
            .setThumbnail(wayzenLogoUrl)

        if (!members || members.length == 0) {
            embed.addField("Pas de membre", "Nous n'avons pas trouvé de membre")
        } else {
            members.forEach((member, id) => {
                if (!member.user.bot) {
                    let userRoles = this.getRolesInline(member)
                    let userDescription = " id : " + id + "\n" +
                        "username : " + member.user.username + "\n" +
                        "nickname : " + member.nickname + "\n" +
                        "roles : " + userRoles;
                    embed.addField(member.displayName, userDescription)
                }
            })
        }

        // Send message
        return message.channel.send(embed);
    }

    private async handleUsers(message: Message): Promise<Message | Message[]> {
        let guild = message.guild;
        if (guild == null)
            throw new Error("Guild not found");
        let members = await guild.members.fetch();
        return this.displayUsers(message, members.array());
    }

    private sortMembersById(a: Member, b: Member): number {
        let aUserid = a.userid;
        let bUserid = b.userid;
        if (!aUserid) {
            return -1;
        } else if (!bUserid) {
            return 1
        } else
            return aUserid.localeCompare(bUserid)
    }

    private sortMembersByUsername(a: Member, b: Member): number {
        console.log(a);
        let aUser = a.user;
        let bUser = b.user;
        if (!aUser) {
            return -1;
        } else if (!bUser) {
            return 1
        } else
            return aUser.localeCompare(bUser)
    }

    private sortMembersByBounty(a: Member, b: Member): number {
        if (!a || isNaN(a.getNumberBounty())) {
            return -1;
        } else if (!b || isNaN(b.getNumberBounty())) {
            return 1;
        } else {
            let result = b.getNumberBounty() - a.getNumberBounty();
                return result
        }
    }

    private getMemberById(id: string) {
        let foundMember = null
        let team = this.getMembers();
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

    private handleClassement(message: Message) {
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

        let team = this.getMembers();
        team.sort(this.sortMembersByBounty);
        return this.displayRanking(message, team, nbRanks)
    }


    private displayRanking(message: Message, members: Member[], pNbDisplay: number): Promise<Message | Message[]> {
        let nbDisplay = pNbDisplay
        if (!nbDisplay)
            nbDisplay = 10
        // Create message
        const embed = new MoussaillonMessageEmbed()
            .setAuthor("Commande par " + message.author.username, message.author.avatarURL() ?? "")
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

                totalBounty = totalBounty + currentMember.getNumberBounty();

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
                        userbounties = userbounties + this.getFormattedBounty(currentMember.getNumberBounty()) + "\n"
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
        return message.channel.send(embed);
    }

    private getFormattedBounty(bounty: number): string {
        // let formattedBounty = this.getNumberBounty(bounty);
        if (isNaN(bounty)) {
            return "";
        } else {
            return bountyFormatter.format(bounty)
        }
    }

    private getMembers(): Member[] {
        let team: Member[] = this.getBot().data.members;
        return team;
    }

}