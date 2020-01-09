import { UIStore } from "../Stores/UIStore";

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
import { SurveyStore } from "../Stores/SurveyStore";
import { TaskStore } from "../Stores/TaskStore";
import { TicketingStore } from "../Stores/TicketingStore";

// import * as load from "./Down";
import { apiCall_noBody, deleteUser, getUser, apiCall } from "../DataExchange/Fetch";
import { reviewAlertCheck } from "../SharedCalculations/ReviewAlertCheck";


export const loadProfile = async (superStatus = false, superUser = {}) => {
  return new Promise(function(resolve, reject) {
    UIStore.toggleScreenLoading();
    if (!getUser()) return UIStore.toggleScreenLoading();

    apiCall_noBody("users/me", "GET").then(res => {
      if (res.error) {
        deleteUser();
      }

      apiCall_noBody(
        `users/all?filter={"where":{"email":"${encodeURIComponent(
          res.email
        )}"}}`,
        "GET"
      ).then(async res => {
        if (res.length === 0) {
          deleteUser();
        }

        if (getUser()) {
          const { accountID, userID, isAdmin } = superStatus ? superUser : res[0];

          UserStore.loadUser(res[0]);
          if(!isAdmin){

            UserStore.setPreviewTeam(UserStore.user.teamID);
            UserStore.setPreviewTag(UserStore.user.tags.length === 0? "none" : UserStore.user.tags[0]);
            UserStore.setPreviewTeamPath(TeamStore.previewValidPath(UserStore.user.teamID, "team") );
            UserStore.setPreviewTagPath(TeamStore.previewValidPath(UserStore.user.tags.length === 0? "none" : UserStore.user.tags[0], "tag"));
          }

          const user = isAdmin? {userID} : {userID, teamPath: UserStore.previewTeamPath, tagPath: UserStore.previewTagPath}
          
          const loadedUserData = await apiCall(`/user/load`, `POST`, user).then(res => res.json());
          
          if (loadedUserData.channels) await ChannelStore.loadChannels(loadedUserData.channels);
          if (loadedUserData.account) await AccountStore.loadAccount(loadedUserData.account[0]);
          if (loadedUserData.files) await ResourcesStore.loadFiles(loadedUserData.files);
          if (loadedUserData.teams) await TeamStore.loadStructure(loadedUserData.teams); 
          if (loadedUserData.tags) await TeamStore.loadTags(loadedUserData.tags);
          if (loadedUserData.email) await EmailStore.loadCampaigns(loadedUserData.email);
          if (loadedUserData.users) await AccountStore.loadAccountUsers(loadedUserData.users);
          if (loadedUserData.analytics) await AccountStore.loadAnalyticData_portal(loadedUserData.analytics.portal);
          if (loadedUserData.analytics) await AccountStore.loadAnalyticData_campaigns(loadedUserData.analytics.campaigns);
          if (loadedUserData.analytics) await AccountStore.loadAnalyticData_ticketing(loadedUserData.analytics.ticketing);
          if (loadedUserData.announcements) await AnnouncementsStore.loadAnnouncements(loadedUserData.announcements);
          if (loadedUserData.policies) await PoliciesStore.loadPolicies(loadedUserData.policies);
          if (loadedUserData.sentiments) await AccountStore.loadSentiments(loadedUserData.sentiments);
          if (loadedUserData.surveys) await SurveyStore.loadSurveys(loadedUserData.surveys);
          if (loadedUserData.tasks) await TaskStore.loadTasks(loadedUserData.tasks);
          if (loadedUserData.scheduled) await ScheduleStore.loadScheduled(loadedUserData.scheduled);
          if (loadedUserData.tickets) await TicketingStore.loadTickets(loadedUserData.tickets);
          console.log("ticketscheck", TicketingStore.allTickets)
          if (loadedUserData.logs) await AccountStore.loadLogs(loadedUserData.logs);

          UIStore.set("adminLoadingComplete", "all", true);

          AccountStore.loadReviewQueue(reviewAlertCheck());

          UIStore.toggleScreenLoading();
          const authd = (await res[0])
            ? (UserStore.isAuthenticated = true)
            : (UserStore.isAuthenticated = false);
        }
        resolve(true);
      });
    });
  });
};
