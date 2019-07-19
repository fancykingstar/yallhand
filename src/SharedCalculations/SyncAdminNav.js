import {UIStore} from "../Stores/UIStore"

export const syncAdminNav = (loc) => {
    const location = loc.pathname
    if(location.slice(-6) === "/panel"){UIStore.set("sideNav", "activePrimary", "dashboard")}
    else if(location.includes("/panel/superadmin")){UIStore.set("sideNav", "activePrimary", "superadmin")}
    else if(location.includes("/panel/teams")){UIStore.set("sideNav", "activePrimary", "teams")}
    else if(location.includes("/panel/faqs")){UIStore.set("sideNav", "activePrimary", "faqs")}
    else if(location.includes("/panel/announcements")){UIStore.set("sideNav", "activePrimary", "announcements")}
    else if(location.includes("/panel/email")){UIStore.set("sideNav", "activePrimary", "email")}
    else if(location.includes("/panel/analytics")){UIStore.set("sideNav", "activePrimary", "analytics")}
    else if(location.includes("/panel/resources")){UIStore.set("sideNav", "activePrimary", "resources")}
    else{UIStore.set("sideNav", "activePrimary", "")}
    UIStore.set("sideNav", "activeChannel", "All")
}

