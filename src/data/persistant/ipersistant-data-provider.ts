import {UserAccount} from "../accounts/user-account";

export interface IPersistantDataProvider {
    getUser(userId: number): Promise<UserAccount | undefined>;

    newUser(userId: number): Promise<UserAccount>;
}