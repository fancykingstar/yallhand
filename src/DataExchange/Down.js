import { ChannelStore } from "../Stores/ChannelStore";
import { PoliciesStore } from "../Stores/PoliciesStore";
import { UserStore } from "../Stores/UserStore";
import { ResourcesStore } from "../Stores/ResourcesStore";
import { TeamStore } from "../Stores/TeamStore";
import { AnnouncementsStore } from "../Stores/AnnouncementsStore";
import { AccountStore } from "../Stores/AccountStore"
import { EmailStore } from "../Stores/EmailStore"
import { ScheduleStore } from "../Stores/ScheduleStore"
import {apiCall_noBody} from "./Fetch"

export const account = async (accountID) => 
     await apiCall_noBody("accounts/" + accountID, "GET").then((result) => AccountStore.loadAccount(result[0]))

export const users_and_teams = async (accountID, userID) => 
     await apiCall_noBody("users/" + accountID, "GET")
     .then((result) => AccountStore.loadUsers(result))
     .then(() => UserStore.loadUser(AccountStore._getUser(userID)))
     .then(() => apiCall_noBody("teams/" + accountID, "GET").then((result) => TeamStore.loadStructure(result, AccountStore.allUsers)))
     .then(() => apiCall_noBody("tags/" + accountID, "GET").then((result) => TeamStore.loadTags(result, AccountStore.allUsers)))

export const users = async (accountID) => 
     await apiCall_noBody("users/" + accountID, "GET").then((result) => AccountStore.loadUsers(result))

export const channels = async (accountID) => 
     await apiCall_noBody("channels/" + accountID, "GET").then((result) => ChannelStore.loadChannels(result))

export const structure = async (accountID) => 
     await apiCall_noBody("teams/" + accountID, "GET").then((result) => TeamStore.loadStructure(result, AccountStore.allUsers))

export const tags = async (accountID) => 
     await apiCall_noBody("tags/" + accountID, "GET").then((result) => TeamStore.loadTags(result, AccountStore.allUsers))

export const policies = async (accountID) => 
     await apiCall_noBody("policies/" + accountID, "GET").then((result) => PoliciesStore.loadPolicies(result))

export const announcements = async (accountID) => 
     await apiCall_noBody("announcements/" + accountID, "GET").then((result) => AnnouncementsStore.loadAnnouncements(result))

export const files = async (accountID) => 
     await apiCall_noBody("fileresources/" + accountID, "GET").then((result) => ResourcesStore.loadFiles(result))

export const urls = async (accountID) => 
     await apiCall_noBody("urls/" + accountID, "GET").then((result) => ResourcesStore.loadUrls(result)) 

export const bundles = async (accountID) => 
     await apiCall_noBody("emailbundles/" + accountID, "GET").then((result) => EmailStore.loadBundles(result))

export const campaigns= async (accountID) => 
     await apiCall_noBody("emailcampaigns/" + accountID, "GET").then((result) => EmailStore.loadCampaigns(result))

export const scheduled= async (accountID) => 
     await apiCall_noBody("schedules/" + accountID, "GET").then((result) => ScheduleStore.loadScheduled(result))

