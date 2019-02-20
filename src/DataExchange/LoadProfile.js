
import { UIStore } from "../Stores/UIStore"
import * as load from "./Down"

export const loadAdmin = () => {
    try{

        UIStore.toggleScreenLoading();
   
        setTimeout(()=> {
            let accountID = "A1"
            let userID = "userID"
            const account = load.account(accountID).then((res) => {UIStore.set("adminLoadingComplete", "account", true)})
            const channels = load.channels(accountID).then((res) => {UIStore.set("adminLoadingComplete", "channels", true)})
            const users_and_teams = load.users_and_teams(accountID, userID).then((res) => {
                UIStore.set("adminLoadingComplete", "user", true)
                UIStore.set("adminLoadingComplete", "users", true)
                UIStore.set("adminLoadingComplete", "structure", true)
                UIStore.set("adminLoadingComplete", "tags", true)
            })
            const policies = load.policies(accountID).then((res) => {UIStore.set("adminLoadingComplete", "policies", true)})
            const announcements = load.announcements(accountID).then((res) => {UIStore.set("adminLoadingComplete", "announcements", true)})
            const files = load.files(accountID).then((res) => {UIStore.set("adminLoadingComplete", "files", true)})
            const urls = load.urls(accountID).then((res) => {UIStore.set("adminLoadingComplete", "urls", true)})
            const bundles = load.bundles(accountID).then((res) => {UIStore.set("adminLoadingComplete", "bundles", true)})
            const campaigns = load.campaigns(accountID).then((res) => {UIStore.set("adminLoadingComplete", "campaigns", true)})
            const scheduled = load.scheduled(accountID).then((res) => {UIStore.set("adminLoadingComplete", "scheduled", true)})
            
            Promise.all([account, policies, 
                users_and_teams, channels, files, urls, announcements, bundles, campaigns, scheduled]).then(() => {
                UIStore.toggleScreenLoading()
            })  
    }, 0)
    }
    catch(error){
        console.log(error)
    }}




