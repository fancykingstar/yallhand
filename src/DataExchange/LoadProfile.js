
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
       
  
        const channels = await load.channels(accountID);

  
        const users_and_teams = await load.users_and_teams(accountID, userID);
  
  
        const content = await load.allContent(accountID)
   
        const policies = await load.policies(accountID);
  
  
        const announcements = await load.announcements(accountID);

  
        const files = await load.files(accountID);

  
        const urls = await load.urls(accountID);
  
  
        const campaigns = await load.campaigns(accountID);

  
        const scheduled = await load.scheduled(accountID);
   
  
        const logs = await load.logs(accountID, userID);
  
  
        const a = await load.sentiments(accountID);


        const surveys = await load.surveys(accountID, userID);


        // const tasks = await load.tasks(accountID);
        UIStore.set("adminLoadingComplete", "all", true)
  
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