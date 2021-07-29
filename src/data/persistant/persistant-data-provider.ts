import {UserAccountDao} from "./dao/user-account-dao";

export interface PersistantDataProvider {

    getUserAccountDAO():UserAccountDao;
}