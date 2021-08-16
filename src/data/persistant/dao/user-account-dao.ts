import {UserAccount} from "../../user-accounts/user-account";
import {GuildMember, User} from "discord.js";
import {CommandDescriptor} from "../../transactions/command-descriptor";

export interface UserAccountDao {

    getUser(userId: number): Promise<UserAccount | undefined>;

    newUser(userId: number): Promise<UserAccount>;

    countCommand(userId: number, commandDescriptor: CommandDescriptor):Promise<boolean>;
}

export class ErrorUserAlreadyExists extends Error {
}