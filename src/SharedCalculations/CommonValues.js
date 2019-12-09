import {AccountStore} from "../Stores/AccountStore";
import {UserStore} from "../Stores/UserStore";

export const userID = () => UserStore.user.userID;
export const accountID = () => AccountStore.account.accountID;