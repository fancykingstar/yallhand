import { ChannelStore } from "../Stores/ChannelStore";
import { PoliciesStore } from "../Stores/PoliciesStore";
import { UserStore } from "../Stores/UserStore";
import { ResourcesStore } from "../Stores/ResourcesStore";
import { TeamStore } from "../Stores/TeamStore";
import { AnnouncementsStore } from "../Stores/AnnouncementsStore";
import { AccountStore } from "../Stores/AccountStore"
import { EmailStore } from "../Stores/EmailStore"
import { ScheduleStore } from "../Stores/ScheduleStore"
import { DataEntryStore } from "../Stores/DataEntryStore"
import { validContent} from "../SharedCalculations/ValidContent"
import { validResources } from "../SharedCalculations/ValidResource"
import {apiCall_noBody} from "./Fetch"

//get team, tag, channel limits
const contentFilter = () => UserStore.previewTeam !== "" || UserStore.previewTag !== ""

export const account = async (accountID) => {
  const result = await apiCall_noBody("accounts/" + accountID, "GET")
  AccountStore.loadAccount(result.length>0? result[0]: {accountID: "*", img: ""})
  return result
}

export const users_and_teams = async (accountID, userID) => {
  const me = await apiCall_noBody(`user/${userID}`, "GET");
  const users = await apiCall_noBody(`users/all?filter={"where":{"accountID":"${accountID}"}}`, "GET");
  // const users = await apiCall_noBody(`users/all?filter={"where":{"teamID":"${users[0].teamID}"}}`, "GET");
  const inactiveUsers = await apiCall_noBody(`validations?filter={"where":{"userId":"","accountID":"${accountID}"}}`, "GET");
  AccountStore.loadUsers([...users, ...inactiveUsers]);
  DataEntryStore.superAdmin.previewAccount === "" ? UserStore.loadUser(AccountStore._getUser(userID)) : null;
  const teams = await apiCall_noBody(`teams/${accountID}`, "GET");
  TeamStore.loadStructure(teams, AccountStore.allUsers);
  const tags = await apiCall_noBody(`tags/all?filter={"where":{"accountID":"${accountID}"}}`, "GET");
  TeamStore.loadTags(tags, AccountStore.allUsers);
  if(!UserStore.user.isAdmin){
    UserStore.setPreviewTeam(UserStore.user.teamID);
    UserStore.setPreviewTag(UserStore.user.tags.length === 0? "none" : UserStore.user.tags[0]);
    UserStore.setPreviewTeamPath(TeamStore.previewValidPath(UserStore.user.teamID, "team") );
    UserStore.setPreviewTagPath(TeamStore.previewValidPath(UserStore.user.tags.length === 0? "none" : UserStore.user.tags[0], "tag"));
  }
  return users
}

export const users = async (accountID, userID) => {
  const result = await apiCall_noBody("users/" + accountID, "GET");
  await AccountStore.loadUsers(result);
  await UserStore.loadUser(AccountStore._getUser(userID));

  return result
}

export const channels = async (accountID) => {
  const result = await apiCall_noBody("channels/" + accountID, "GET")
  ChannelStore.loadChannels(result)

  return result
}

export const allContent = async (accountID) => 
     await apiCall_noBody("policies/" + accountID, "GET").then((result) => PoliciesStore.loadPolicies(contentFilter()? validContent(result, UserStore.previewTeamPath, UserStore.previewTagPath) : result))
     .then(()=> apiCall_noBody(`announcements/all?filter={"where":{"accountID":"${accountID}"}}`, "GET").then((result) => AnnouncementsStore.loadAnnouncements(contentFilter()? validContent(result, UserStore.previewTeamPath, UserStore.previewTagPath) : result)))
     .then(()=> apiCall_noBody("fileresources/" + accountID, "GET").then((result) => ResourcesStore.loadFiles(contentFilter()? validResources(result, UserStore.previewTeamPath, UserStore.previewTagPath): result))
     .then(()=> apiCall_noBody("urls/" + accountID, "GET").then((result) => ResourcesStore.loadUrls(contentFilter()? validResources(result, UserStore.previewTeamPath, UserStore.previewTagPath): result)) ) )

export const structure = async (accountID) => {
  const result = await apiCall_noBody("teams/" + accountID, "GET")
  TeamStore.loadStructure(result, AccountStore.allUsers)

  return result
}

export const tags = async (accountID) => {
  const result = await apiCall_noBody(`tags/all?filter={"where":{"accountID":"${accountID}"}}`, "GET")
  TeamStore.loadTags(result, AccountStore.allUsers)

  return result
}

export const urls = async (accountID) => 
      await apiCall_noBody("urls/" + accountID, "GET").then((result) => 
      ResourcesStore.loadUrls(contentFilter()? validResources(result, UserStore.previewTeamPath, UserStore.previewTagPath): result))

export const policies = async (accountID) => {
  const result = await apiCall_noBody("policies/" + accountID, "GET")
  PoliciesStore.loadPolicies(contentFilter() ? validContent(result, UserStore.previewTeamPath, UserStore.previewTagPath) : result)

  return result
}

export const announcements = async (accountID) => {
  const result = await apiCall_noBody(`announcements/all?filter={"where":{"accountID":"${accountID}"}}`, "GET")
  AnnouncementsStore.loadAnnouncements(contentFilter() ? validContent(result, UserStore.previewTeamPath, UserStore.previewTagPath) : result)

  return result
}

export const files = async (accountID) => {
  const result = await apiCall_noBody("fileresources/" + accountID, "GET")
  ResourcesStore.loadFiles(contentFilter() ? validResources(result, UserStore.previewTeamPath, UserStore.previewTagPath): result)

  return result
}

export const logs = async (accountID) => {
  const result = await apiCall_noBody("itslogs/" + accountID, "GET")
  AccountStore.loadLogs(result.filter(log => !log.isAction))

  return result
}

export const sentiments = async (accountID) => {
  const result = await apiCall_noBody("sentiments/" + accountID, "GET")
  AccountStore.loadSentiments(result)

  return result
}

export const campaigns= async (accountID) => {
  const result = await apiCall_noBody("emailcampaigns/" + accountID, "GET")
  EmailStore.loadCampaigns(result)

  return result
}

export const scheduled= async (accountID) => {
  const result = await apiCall_noBody("schedules/" + accountID, "GET")
  ScheduleStore.loadScheduled(result)

  return result
}

export const history = async () => {
  const result = await apiCall_noBody("histories/" + AccountStore.account.accountID, "GET")

  return result
}
