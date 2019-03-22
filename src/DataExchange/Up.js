import { apiCall, apiCall_noBody, apiCall_del } from "./Fetch"
import { UIStore } from "../Stores/UIStore";
import { AccountStore } from "../Stores/AccountStore"
import { UserStore } from "../Stores/UserStore"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ItsLog } from "../DataExchange/PayloadBuilder"
import * as reload from "../DataExchange/Down"
import _ from "lodash";


const accountID = () => AccountStore.account.accountID.slice()
const userID = () => UserStore.user.userID.slice()

const refresh = {
  schedule: () => reload.scheduled(accountID()),
  teams: () => reload.structure(accountID()),
  tags: () => reload.tags(accountID()),
  users: () => reload.users(accountID(), userID()),
  channels: () => reload.channels(accountID()),
  urlResources: () => reload.urls(accountID()),
  policies: () => reload.policies(accountID()),
  announcements: () => reload.announcements(accountID()),
  files: () => reload.files(accountID()),
  bundles: () => reload.bundles(accountID()),
  campaigns: () => reload.campaigns(accountID()),
  account: () => reload.account(accountID())
}

const processTemplate = (useBody, endpoint, meth, payload, key, success_text, isAction, data, toastEnabled=true) => {
  const callApi = meth === "DELETE" ? apiCall_del : useBody ? apiCall : apiCall_noBody
  return new Promise((resolve, reject) => {
    log(ItsLog(isAction, data))
    callApi(endpoint, meth, payload).then((result) => {
      if(result.ok){
        refresh[key]().then(() => toastEnabled? toast.success(success_text, {hideProgressBar: true}): ()=>{}).catch(e => {})
        if (key === 'users') reload.users_and_teams(accountID(), userID());
        resolve(result);
      } else {
        toast.error(result.statusText, {hideProgressBar: true})
        reject(result);
      }
    })
  })
}

///LOGS (event type options: create, update, delete)
export const log = (payload) => {apiCall("itslogs", "POST", payload)} 

///Sentiment
export const createSentiment = (payload) => {apiCall("/sentiments", "POST", payload)} 

///History
export const createHistory = (payload) => {
    apiCall("/histories", "POST", payload)
} 

///Notfications
export const clearNotification = (payload) => {
   const id = {"Policy": "policyID", "Announcement": "announcementID", "File": "resourceID", "URL": "resourceID"}[payload.type]
   const route = {"Policy": "policies/", "Announcement": "announcements/", "File":"fileresources/", "URL": "urls/"}[payload.type]
   const reloadKey = {"Policy": "policies", "Announcement": "announcements", "File":"files", "URL": "urlResources"}[payload.type]
   const updateVaris = (varis) => 
    {
     let newVaris = varis.slice();
     newVaris.forEach(i => i.updated = Date.now());
     return newVaris;
    }
   let newPayload = {}
   newPayload[id] = payload[id]
   newPayload.accountID = payload.accountID
   payload.type === "File" || payload.type === "URL"? newPayload.updated = Date.now() : newPayload.variations = updateVaris(payload.variations)
   return apiCall(route + payload[id], "PATCH", newPayload)
    .then(() => refresh[reloadKey]())
}

///Account
export const createAccount = (payload) => {
    return processTemplate(true, "accounts", "POST", payload, "account", 
    "A new account has been created", 
    true,{"event": "create", "type":"schedule"}, true
)
} 
export const deleteAccount = (accountID) => {
    return processTemplate(false, "accounts/" + accountID, "DELETE", {}, "account", 
    "Selected account deleted 👋", 
    true,{"event": "delete", "type":"account"})
}

///SCHEDULE 
export const createSchedule = (payload, toastEnabled) => {
    return processTemplate(true, "schedules", "POST", payload, "schedule", 
        `Your ${payload.task} task is scheduled! ⏳`, 
        true,{"event": "create", "type":"schedule"}, toastEnabled
    )
}

export const deleteSchedule = (scheduleID) => {
    processTemplate(false, "schedules/" + scheduleID, "DELETE", {}, "schedule", 
    "Selected schedule deleted 👋", 
    true,{"event": "delete", "type":"schedule"})
}

///TEAMS (STRUCTURE)
export const createTeam = (payload) => {
    return processTemplate(true, "teams", "POST", payload, "teams", 
        "Your new tag has been created 🙌", 
        true,{"event": "create", "type":"team"}
    )
}

export const modifyTeam = (payload) => {
    processTemplate(true, "teams/" + payload.teamID, "PATCH", payload, "teams", 
    "Your team has been updated 🛠", 
    true,{"event": "update", "type":"team"}
)
}

export const deleteTeam = (teamID) => {
    processTemplate(false, "teams/" + teamID, "DELETE", {}, "teams", 
    "Selected team deleted 👋", 
    true,{"event": "delete", "type":"team"})
}

///TAGS 
export const createTag = (payload) => {
    return processTemplate(true, "tags", "POST", payload, "tags", 
        "Your new tag has been created 🙌", 
        true,{"event": "create", "type":"tag"}
    )
}

export const modifyTag = (payload) => {
    processTemplate(true, "tags/" + payload.tagID, "PATCH", payload, "tags", 
    "Your tag has been updated 🛠", 
    true,{"event": "update", "type":"tag"}
)
}

export const deleteTag = (tagID) => {
    processTemplate(false, "tags/" + tagID, "DELETE", {}, "tags", 
    "Selected tag deleted 👋", 
    true,{"event": "delete", "type": "tag"})
}

///USERS
export const sendInviteEmail = (data) => {
    const inviteURL = process.env.REACT_APP_INVITE_URL;
    return new Promise((resolve, reject) => {
          fetch(inviteURL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
          })
    })
}

export const createUser = (payload, toastEnabled) => {
    return processTemplate(true, "users", "POST", payload, "users", 
    `🎉 ${payload.email} has been invited to Join ✉️`, 
    true,{"event": "create", "type":"user"}, toastEnabled
)
// .then(()=> sendInviteEmail({"inviteEmails": [payload.email],"workspace": AccountStore.account.label, "password": "M@rkAubry", "userName":"mark"}))
}

export const modifyUser = (payload) => {
    return processTemplate(true, "users/" + payload.userID, "PATCH", payload, "users", 
    `Profile has been updated 🛠`, 
    true,{"event": "update", "type":"user"}
)
}

export const offBoardUser = (userID) => {
    return processTemplate(true, "users/" + userID, "PATCH", {"userID": userID, "accountID": accountID(), "isActive": false}, "users", 
    `User offboarded ✌️`, 
    true,{"event": "offboard", "type":"user"}
)
}

export const deleteUser = (userID) => {
    return processTemplate(false, "users/" + userID, "DELETE", {}, "users", 
    "Selected user deleted 👋", 
    true,{"event": "delete", "type": "user"})
}

///CHANNEL
export const createChannel = (payload) => {
    processTemplate(true, "channels", "POST", payload, "channels", 
        "Your new channel has been created 🙌", 
        true,{"event": "create", "type":"channel"}
    )
}

export const modifyChannel = (payload) => {
    return processTemplate(true, "channels/" + payload.chanID, "PATCH", payload, "channels", 
    "Your channel has been updated 🛠", 
    true,{"event": "update", "type":"channel"}
)
}

export const deleteChannel = (chanID) => {
    return processTemplate(false, "channels/" + chanID, "DELETE", {}, "channels", 
    "Selected channel deleted 👋", 
    true,{"event": "delete", "type": "channel"})
}

///URL Resources
export const createUrlResource = (payload) => {
    return processTemplate(true, "urls", "POST", payload, "urlResources", 
    `Your new URL has been created 🙌`, 
    true,{"event": "create", "type":"url"}
)
}

export const modifyUrlResource = (payload, toast=true) => {
    processTemplate(true, "urls/" + payload.resourceID, "PATCH", payload, "urlResources", 
        "Your URL as been updated 🛠☁️", 
        true,{"event": "update", "type":"url"}, toast
    )
}

export const deleteUrlResource = (resourceID) => {
    processTemplate(false, "urls/" + resourceID, "DELETE", {}, "urlResources", 
    "Selected URL deleted 👋", 
    true,{"event": "delete", "type":"url"})
}

///FILE RESOURCES
export const createFile = (payload) => {
    return processTemplate(true, "fileresources", "POST", payload, "files", 
        "Your file has been uploaded ☁️", 
        true,{"event": "create", "type":"file"}
    )
}

export const modifyFile = (payload, toast=true) => {
    processTemplate(true, "fileresources/" + payload.resourceID, "PATCH", payload, "files", 
        "Your file has been updated 🛠☁️", 
        true,{"event": "update", "type":"file"}, toast
    )
}

export const deleteFileresource = (resourceID) => {
    processTemplate(false, "fileresources/" + resourceID, "DELETE", {}, "files", 
    "Selected file deleted 👋", 
    true,{"event": "delete", "type":"file"}), false
}

///POLICIES AND ANNOUNCEMENTS (SAME DATA SCHEMA)
export const createPolicy = (payload) => {
    return processTemplate(true, "policies", "POST", payload, "policies", 
        "Your new FAQ has been created 🙌", 
        true,{"event": "create", "type":"policy"}
    )
}

export const createAnnouncement = (payload) => {
  const responseText = "Your new Announcement has been created 🙌";
  const data = { "event": "create", "type": "announcement" };
  const type = "announcements";
  delete payload.announcementID
  return new Promise((resolve, reject) => {
    processTemplate(true, type, "POST", payload, type,  responseText,  true, data)
      .then(res => res.json())
      .then(res => {
        UIStore.set("content", "announcementID", res.announcementID);
        resolve(res);
      })
  })
}

export const modifyPolicy = (payload) => {
  return processTemplate(true, "policies/" + payload.policyID, "PATCH", payload, "policies", 
    "Your policy has been updated 🛠", 
    true,{"event": "update", "type":"policy"}
  )
}

export const modifyAnnouncement = (payload) => {
    return processTemplate(true, "announcements/" + payload.announcementID, "PATCH", payload, "announcements", 
    "Your policy has been updated 🛠", 
    true,{"event": "update", "type":"policy"}
)
}

export const deletePolicy = (policyID) => {
    return processTemplate(false, "policies/" + policyID, "DELETE", {}, "policies", 
    "Selected policy deleted 👋", 
    true,{"event": "delete", "type":"policy"}), false
}

export const deleteAnnouncement = (announcementID) => {
    return processTemplate(false, "announcements/" + announcementID, "DELETE", {}, "announcements", 
    "Selected announcement deleted 👋", 
    true,{"event": "delete", "type":"announcement"}), false
}

///EMAIL CAMPAIGN --- BUNDLE
export const modifyBundle = (payload, toastEnabled) => {
    const msg = payload.isQueue? "Your email queue has been updated ✉️🛠" : "Your email bundle has been updated ✉️🛠"
    return processTemplate(true, "emailbundles/" + payload.bundleID, "PATCH", payload, "bundles", 
    msg,
    true,{"event": "update", "type":"bundle"}, toastEnabled
)
}

export const createBundle = (payload, toastEnabled) => {
    return processTemplate(true, "emailbundles", "POST", payload, "bundles", 
        "Your new bundle has been created 🙌", 
        true,{"event": "create", "type":"bundle"}, toastEnabled
    )
}

export const deleteBundle = (bundleID) => {
    return processTemplate(false, "emailbundles/" + bundleID, "DELETE", {}, "bundles", 
    "Selected bundle deleted 👋", 
    true,{"event": "delete", "type":"bundle"})
}

export const createCampaign = (payload, toastEnabled) => {
    return processTemplate(true, "emailcampaigns", "POST", payload, "campaigns", 
        payload.isTriggered ? "Your email trigger is set and sending will be automated to eligible users 🤖✉️"   :`Your campaign is being built and will send momentarily 🚀✉️` , 
        true,{"event": "create", "type":"campaign"}, toastEnabled
    )
}

export const modifyCampaign = (payload) => {
    const msg = payload.completed? "The selected campaign has been discontinued 🛑" :"Your campaign has been updated 🛠"
    return processTemplate(true, "emailcampaigns/" + payload.campaignID, "PATCH", payload, "campaigns", 
    msg,
    true,{"event": "update", "type":"campaign"}
)
}

///SETTINGS
export const modifyAccount = (payload) => {
    return processTemplate(true, "accounts/" + payload.accountID, "PATCH", payload, "account", 
    "Your account settings have been updated 🛠", 
    true,{"event": "update", "type":"account"}
)
}

////////////////////////WASTELANDS OF TEMPORARY GARBAGE//////////////////


// export const modifyQueue = (val) => {
//     setTimeout(() => {console.log("Base settings modified", val)}, 1000)
// }


// export const modifyBaseSettings = (val) => {
//     setTimeout(() => {console.log("Base settings modified", val)}, 1000)
// }


// export const deleteBaseAccount = (val) => {
//     setTimeout(() => {console.log("account queued for deletion", val)}, 1000)
// }

// export const modifyUserSettings = (val) => {
//     setTimeout(() => {console.log("User settings modified", val)}, 1000)
// }

export const deactivateUser = (val) => {
    setTimeout(() => {console.log("user deactivated", val)}, 1000)
}

export const sendEmailPreview = (val) => {
    setTimeout(() => {console.log("Preview Sent", val)}, 1000)
}

// export const sendEmailNow = (val) => {
//     setTimeout(() => {
//         console.log("Preview Sent", val)
//         return new Promise((resolve, reject) => {
//             resolve(true)
//     }, 3000)
//     })
// }

