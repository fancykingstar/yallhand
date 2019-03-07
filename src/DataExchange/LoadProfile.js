
import { UIStore } from "../Stores/UIStore"
import { UserStore } from "../Stores/UserStore"
import * as load from "./Down"
import { apiCall_noBody, deleteUser, getUser } from "../DataExchange/Fetch"
import { observer, inject } from "mobx-react";

export const loadAdmin = () => {
  UIStore.toggleScreenLoading();

  if (!getUser()) return UIStore.toggleScreenLoading();

  apiCall_noBody('users/me', 'GET').then(res => {
    if(res.error) {
      deleteUser()
      return
    }

    apiCall_noBody(`users/all?filter={"where":{"email":"${res.email}"}}`, 'GET')
    .then(res => {
      const user = res[0];
      let promises = []

      const {accountID, userID} = user
      promises.push(load.account(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "account", true)
      }))
      promises.push(load.channels(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "channels", true)
      }))
      promises.push(load.users_and_teams(accountID, userID).then(() => {
        UIStore.set("adminLoadingComplete", "user", true)
        UIStore.set("adminLoadingComplete", "users", true)
        UIStore.set("adminLoadingComplete", "structure", true)
        UIStore.set("adminLoadingComplete", "tags", true)
      }))
      promises.push(load.policies(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "policies", true)
      }))
      promises.push(load.announcements(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "announcements", true)
      }))
      promises.push(load.files(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "files", true)
      }))
      promises.push(load.urls(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "urls", true)
      }))
      promises.push(load.bundles(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "bundles", true)
      }))
      promises.push(load.campaigns(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "campaigns", true)
      }))
      promises.push(load.scheduled(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "scheduled", true)
      }))
      promises.push(load.logs(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "logs", true)
      }))
      promises.push(load.sentiments(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "sentiments", true)
      }))

      Promise.all(promises).then(() => {
        UIStore.toggleScreenLoading()
        if(user) UserStore.isAuthenticated = true;
      })
    })
  })
}