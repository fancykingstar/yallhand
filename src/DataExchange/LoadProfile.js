
import { UIStore } from "../Stores/UIStore"
import { UserStore } from "../Stores/UserStore"
import * as load from "./Down"
import { apiCall_noBody, deleteUser, getUser } from "../DataExchange/Fetch"
import { reviewAlertCheck } from "../SharedCalculations/ReviewAlertCheck";
import { AccountStore } from "../Stores/AccountStore";

export const loadAdmin = async (superStatus=false, superUser={}) => {
  return new Promise(function (resolve, reject) {
    UIStore.toggleScreenLoading();

    if (!getUser()) return UIStore.toggleScreenLoading();
  
    apiCall_noBody('users/me', 'GET').then(res => {
      if(res.error) {
        deleteUser();
      };
  
      apiCall_noBody(`users/all?filter={"where":{"email":"${encodeURIComponent(res.email)}"}}`, 'GET').then(async (res) => {
        if(res.length === 0) {
          deleteUser();
        };
        
        if(getUser()){

        const { accountID, userID } = superStatus ? superUser : res[0]
  
        const account = await load.account(accountID);
        UIStore.set("adminLoadingComplete", "account", true);
  
        const channels = await load.channels(accountID);
        UIStore.set("adminLoadingComplete", "channels", true)
  
        const users_and_teams = await load.users_and_teams(accountID, userID);
        UIStore.set("adminLoadingComplete", "user", true)
        UIStore.set("adminLoadingComplete", "users", true)
        UIStore.set("adminLoadingComplete", "structure", true)
        UIStore.set("adminLoadingComplete", "tags", true)
  
        const content = await load.allContent(accountID)
        UIStore.set("adminLoadingComplete", "policies", true)
        UIStore.set("adminLoadingComplete", "announcements", true)
        UIStore.set("adminLoadingComplete", "files", true)
        UIStore.set("adminLoadingComplete", "urls", true)
  
        const policies = await load.policies(accountID);
        UIStore.set("adminLoadingComplete", "policies", true)
  
        const announcements = await load.announcements(accountID);
        UIStore.set("adminLoadingComplete", "announcements", true)
  
        const files = await load.files(accountID);
        UIStore.set("adminLoadingComplete", "files", true)
  
        const urls = await load.urls(accountID);
        UIStore.set("adminLoadingComplete", "urls", true)
  
        const campaigns = await load.campaigns(accountID);
        UIStore.set("adminLoadingComplete", "campaigns", true)
  
        const scheduled = await load.scheduled(accountID);
        UIStore.set("adminLoadingComplete", "scheduled", true)
  
        const logs = await load.logs(accountID, userID);
        UIStore.set("adminLoadingComplete", "logs", true)
  
        const a = await load.sentiments(accountID);
        UIStore.set("adminLoadingComplete", "sentiments", true)

        const surveys = await load.surveys(accountID);
        UIStore.set("adminLoadingComplete", "surveys", true)

        const tasks = await load.tasks(accountID);
        UIStore.set("adminLoadingComplete", "tasks", true)
  
        AccountStore.loadReviewQueue(reviewAlertCheck())
  
        UIStore.toggleScreenLoading()
        const authd = await res[0]? UserStore.isAuthenticated = true : UserStore.isAuthenticated = false;
        };
        resolve(true)
      })
    })
  }
  );
  
}