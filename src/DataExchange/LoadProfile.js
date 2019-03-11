
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

    apiCall_noBody(`users/all?filter={"where":{"email":"${encodeURIComponent(res.email)}"}}`, 'GET')
    .then(res => {
      const user = res[0];
      let promises = []

      const {accountID, userID} = user
      promises.push(load.account(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "account", true)
      }).catch(e => {
        console.log('Error in promise account')
      }))
      promises.push(load.channels(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "channels", true)
      }).catch(e => {
        console.log('Error in promise channels')
      }))
      promises.push(load.users_and_teams(accountID, userID).then(() => {
        UIStore.set("adminLoadingComplete", "user", true)
        UIStore.set("adminLoadingComplete", "users", true)
        UIStore.set("adminLoadingComplete", "structure", true)
        UIStore.set("adminLoadingComplete", "tags", true)
      }).catch(e => {
        UIStore.set("adminLoadingComplete", "user", true)
        UIStore.set("adminLoadingComplete", "users", true)
        UIStore.set("adminLoadingComplete", "structure", true)
        UIStore.set("adminLoadingComplete", "tags", true)
        console.log('Error in promise users_and_teams')
      }))
      promises.push(load.policies(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "policies", true)
      }).catch(e => {
        console.log('Error in promise policies')
      }))
      promises.push(load.announcements(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "announcements", true)
      }).catch(e => {
        console.log('Error in promise announcements')
      }))
      promises.push(load.files(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "files", true)
      }).catch(e => {
        console.log('Error in promise files')
      }))
      promises.push(load.urls(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "urls", true)
      }).catch(e => {
        console.log('Error in promise urls')
      }))
      promises.push(load.bundles(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "bundles", true)
      }).catch(e => {
        console.log('Error in promise bundles')
        UIStore.set("adminLoadingComplete", "bundles", true)
      }))
      promises.push(load.campaigns(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "campaigns", true)
      }).catch(e => {
        console.log('Error in promise campaigns')
      }))
      promises.push(load.scheduled(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "scheduled", true)
      }).catch(e => {
        console.log('Error in promise scheduled')
      }))
      promises.push(load.logs(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "logs", true)
      }).catch(e => {
        console.log('Error in promise logs')
      }))
      promises.push(load.sentiments(accountID).then(() => {
        UIStore.set("adminLoadingComplete", "sentiments", true)
      }).catch(e => {
        console.log('Error in promise sentiments')
      }))

      Promise.all(promises).then(() => {
        UIStore.toggleScreenLoading()
        if(user) UserStore.isAuthenticated = true;
      })
    })
  })
}