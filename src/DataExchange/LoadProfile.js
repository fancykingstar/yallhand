import { UIStore } from "../Stores/UIStore";
import { UserStore } from "../Stores/UserStore";
import * as load from "./Down";
import { apiCall_noBody, deleteUser, getUser } from "../DataExchange/Fetch";
import { reviewAlertCheck } from "../SharedCalculations/ReviewAlertCheck";
import { AccountStore } from "../Stores/AccountStore";

export const loadAdmin = async (superStatus = false, superUser = {}) => {
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
          const { accountID, userID } = superStatus ? superUser : res[0];

          await load.account(accountID);

          await load.channels(accountID);

          await load.users_and_teams(accountID, userID);

          await load.allContent(accountID);

          await load.policies(accountID);

          await load.announcements(accountID);

          await load.files(accountID);

          await load.urls(accountID);

          await load.campaigns(accountID);

          await load.scheduled(accountID);

          await load.logs(accountID, userID);

          await load.sentiments(accountID);

          await load.surveys(accountID, userID);

          await load.tickets(accountID);

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
