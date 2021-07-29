import {UserAccount} from "../../models/user-account";

export interface UserAccountDao {

    getUser(userId: number): Promise<UserAccount | undefined>;

    newUser(userId: number): Promise<UserAccount>;
}

export class ErrorUserAlreadyExists extends Error {
}