import { DataEntryStore } from "../Stores/DataEntryStore";
import { AccountStore } from "../Stores/AccountStore";
import { PoliciesStore } from "../Stores/PoliciesStore";
import { UIStore } from "../Stores/UIStore"
import { UserStore } from "../Stores/UserStore";
import { TeamStore } from "../Stores/TeamStore"
import { EmailStore } from "../Stores/EmailStore"
import { generateID } from "../SharedCalculations/GenerateID"
import { AnnouncementsStore } from "../Stores/AnnouncementsStore";
import _ from "lodash";
const uuidv4 = require('uuid/v4')

const accountID = () => AccountStore.account.accountID;
const userID = () => UserStore.user.userID;
const now = () => Date.now();
const formatTag = (val) => val === "" ? [] : [val]

const base = () => {return {"accountID": accountID(), "userID": userID(), "updated": now()}}

export const UNTITLED = () => {
  const buildObj = {
  
  };
  return _.extend({}, base(), buildObj)
}


///LOGGING
export const ItsLog = (action, data) => {
  //action (true/false (view only)) data = {"event":, "type":,} or {"location": "location label"}
  let buildObj = {
    logID: uuidv4(),
    isAction: action,
    data: data
  }
  return _.extend({}, base(), buildObj)
}


///SENTIMENT
export const sentiment = (sentiment, type, ID, variationID=null) => {
  const buildObj = {
    sentimentID: uuidv4(),
    type,
    ID, 
    variationID,
    sentiment
  };
  return _.extend({}, base(), buildObj)
}




///SCHEDULE
export const schedule = (when, task, data) => {
  const buildObj = {
    scheduleID: uuidv4(),
    when,
    executed: false,
    task,
    data,
  };
  return _.extend({}, base(), buildObj)
}





///TEAMS (STRUCTURE)
export const team = () => {
  const buildObj = {
    teamID: generateID(),
    label: DataEntryStore.teamEditFields.teamsLabel,
    parent: DataEntryStore.teamEditFields.teamsDropdown,
    depth:
      TeamStore._getTeam(DataEntryStore.teamEditFields.teamsDropdown)
        .depth + 1
  };
  return _.extend({}, base(), buildObj)
}

export const teamUpdate = () => {
  const buildObj = {
  teamID: DataEntryStore.teamEditFields.selectedTeam,
  label: DataEntryStore.teamEditFields.selectedTeamLabel,
  parent: DataEntryStore.teamEditFields.teamEditDropdownVal,
  depth:
    TeamStore._getTeam(
      DataEntryStore.teamEditFields.teamEditDropdownVal
    ).depth + 1
  };
  return _.extend({}, base(), buildObj)
}






///TAGS
export const tag = () => {
  const buildObj = {
    accountID: AccountStore.account.accountID,
    tagID: generateID(),
    label: DataEntryStore.teamEditFields.tagsLabel,
    parent: DataEntryStore.teamEditFields.tagsDropdown,
    depth:
      TeamStore._getTag(DataEntryStore.teamEditFields.tagsDropdown)
        .depth + 1
  }
  return _.extend({}, base(), buildObj)
}

export const tagUpdate = () => {
  const buildObj = {
    tagID: DataEntryStore.teamEditFields.selectedTag,
    label: DataEntryStore.teamEditFields.selectedTagLabel,
    parent: DataEntryStore.teamEditFields.tagEditDropdownVal,
    depth:
      TeamStore._getTag(
        DataEntryStore.teamEditFields.tagEditDropdownVal
      ).depth + 1
  }
  return _.extend({}, base(), buildObj)
}






///USERS
export const user = () => {
  const x = DataEntryStore.onOffBoarding
  const isAdmin = x.adminEmail !== ""
  const buildObj = {
      "userID": generateID(),
      "accountID": accountID(),
      "invitedBy": userID(),
      "isActive": true,
      "updated": now(),
      "displayName_full": "",
      "displayName": "",
      "isAdmin": isAdmin,
      "adminLimits": x.adminConfig === "all" ? {} : {"teams": x.adminTeams,"tags":x.adminTags, "channels":x.adminChannels},
      "teamID": isAdmin ? x.teamID : x.adminTeamID ,
      "tags": isAdmin ? x.adminTagID === "none" ? [] : [x.adminTagID] : x.tagID === "none" ? [] :[x.tagID],
      "email": isAdmin ? x.adminEmail: x.email,
      "img": "",
      "timezone": AccountStore.account.timezone,
      "profile": {"About Me":"","Department":"","Github":"","LinkedIn":"","Location":"","Medium":"","Mobile":"","Phone or Extension":"","Title":"","Twitter":""}
  };
  return buildObj
}

export const userUpdate = () => {
  const x = DataEntryStore.userEditFields
  const buildObj = {userID: x.userEdit.userID,adminLimits: {}};
  if(x.adminChannels.length > 0){buildObj.adminLimits.channels = x.adminChannels}
  if(x.adminTeams.length > 0){buildObj.adminLimits.teams = x.adminTeams}
  if(x.adminTags.length > 0){buildObj.adminLimits.tags = x.adminTags}
  if(x.adminConfig === "all"){buildObj.adminLimits = {}}
  if(x.displayName_full !== ""){buildObj.displayName_full = x.displayName_full}
  if(x.displayName !== ""){buildObj.displayName_full = x.displayName}
  if(x.email !== ""){buildObj.email = x.email}
  if(x.isAdmin !== x.userEdit.isAdmin){buildObj.isAdmin = x.isAdmin}
  if(x.teamID !== ""){buildObj.teamID = x.teamID}
  if(x.tagID !== ""){buildObj.tags = [x.tagID]}
  return _.extend({}, {"accountID": accountID()}, buildObj)
}





///CHANNELS
export const channel = () => {
  const buildObj = {
    "chanID": generateID(),
    "label": DataEntryStore.channel.label
  }
  return _.extend({}, base(), buildObj)
}

export const channelUpdate = () => {
  const buildObj = {
    "chanID": UIStore.sideNav.activeChannel,
    "label": DataEntryStore.channel.label
  }
  return _.extend({}, base(), buildObj)
}





///URL RESOURCES
export const urlResource = (obj, id=null) => {
  const buildObj = {
  "resourceID": id === null? generateID() : obj.resourceID,
  "associations": obj.associations,
  "label": obj.label,
  "url": obj.url,
  "prefix": obj.prefix,
  "teamID": obj.teamID,
  "tags": obj.tagID === "none" ? [] : [obj.tagID],
  };
  return _.extend({}, base(), buildObj)
}

export const urlResourceAssociate = (resourceID, associations) => {
  const buildObj = {
    resourceID,
    associations,
  };
  return _.extend({}, base(), buildObj)
}



///FILE RESOURCES
export const fileResource = (assoc=null) => {
  const buildObj = {
  resourceID: generateID(),
  associations: DataEntryStore.fileForUpload.associations,
  label: DataEntryStore.fileForUpload.label,
  S3Key: DataEntryStore.fileForUpload.S3Key,
  url: DataEntryStore.fileForUpload.url, 
  filename: DataEntryStore.fileForUpload.filename,
  type: DataEntryStore.fileForUpload.type,
  size: DataEntryStore.fileForUpload.file.size, 
  teamID: DataEntryStore.fileForUpload.teamID,
  tags: DataEntryStore.fileForUpload.tagID === "none" ? [] : [DataEntryStore.fileForUpload.tagID]
  };
  assoc !== null? buildObj.associations = assoc : null
  return _.extend({}, base(), buildObj)
}

export const fileResourceEdit = () => {
  const buildObj = {
    resourceID: DataEntryStore.fileForUpload.resourceID,
    associations: DataEntryStore.fileForUpload.associations,
    label: DataEntryStore.fileForUpload.label,
    S3Key: DataEntryStore.fileForUpload.S3Key,
    teamID: DataEntryStore.fileForUpload.teamID,
    tags: DataEntryStore.fileForUpload.tagID === "none" ? [] : [DataEntryStore.fileForUpload.tagID]
    };
  if(DataEntryStore.fileForUpload.file !== ""){
    buildObj.url = DataEntryStore.fileForUpload.url, 
    buildObj.filename = DataEntryStore.fileForUpload.filename,
    buildObj.type = DataEntryStore.fileForUpload.type,
    buildObj.size = DataEntryStore.fileForUpload.file.size 
  }
  return _.extend({}, base(), buildObj)
}

export const fileResourceAssociate = (resourceID, associations) => {
  const buildObj = {
    resourceID,
    associations,
  };
  return _.extend({}, base(), buildObj)
}





///EMAIL BUNDLES
export const queueEdit = () => {
  const buildObj = {
    bundleID: "queue",
    bundle: DataEntryStore.emailCampaign.queue,
    label: DataEntryStore.emailCampaign.queueLabel,
    subject: DataEntryStore.emailCampaign.queueSubject,
    body: DataEntryStore.draft,
    bodyContentHTML: DataEntryStore.draftContentHTML,
    bodyContentRAW: DataEntryStore.draftContentRAW
  };
  return _.extend({}, base(), buildObj)
}

export const bundle = (queue=false) => {
  const buildObj = {
    bundleID: queue? "queue":generateID(),
    bundle: DataEntryStore.emailCampaign.queue,
    label: DataEntryStore.emailCampaign.queueLabel,
    subject: DataEntryStore.emailCampaign.queueSubject,
    body: DataEntryStore.draft,
    bodyContentHTML: DataEntryStore.draftContentHTML,
    bodyContentRAW: DataEntryStore.draftContentRAW,
    stage: "active",
    lastUsed: 0
  }
  return _.extend({}, base(), buildObj)
}

export const bundleEdit = () => {
  const buildObj = {
      bundleID: DataEntryStore.emailCampaign.editBundleID,
      bundle: DataEntryStore.emailCampaign.editBundleBundle,
      label: DataEntryStore.emailCampaign.editBundleLabel,
      subject: DataEntryStore.emailCampaign.editBundleSubject,
      body: DataEntryStore.emailCampaign.editBundleDraft,
      stage: DataEntryStore.emailCampaign.editBundleStage,
      draft: DataEntryStore.draft,
      draftContentHTML: DataEntryStore.draftContentHTML,
      draftContentRAW: DataEntryStore.draftContentRAW
  }
  return _.extend({}, base(), buildObj)
}


export const bundleMerged = (targetBundle) => {
  let currentQueue = DataEntryStore.emailCampaign.queue
  let target =  targetBundle.bundle
  currentQueue = currentQueue.filter(content => !EmailStore._doesBundleContain(Object.values(content)[0], targetBundle.bundleID))
  const newBundle = [...currentQueue, ...target]
  const buildObj = {
    bundleID: targetBundle.bundleID,
    bundle: newBundle,
  }
  return _.extend({}, base(), buildObj)
  
}





///EMAIL CAMPAIGN
export const emailPreview = () => {
  const buildObj = {
    accountID: accountID(),
    bundleID: DataEntryStore.emailCampaign.selectedContentBundle,
    teamID: DataEntryStore.emailCampaign.selectedTeamID,
    tags: formatTag(DataEntryStore.emailCampaign.selectedTag),
    targetUsers: DataEntryStore.emailCampaign.selectedUsers,
    previewUsers: DataEntryStore.emailCampaign.previewUsers,
    updated: now(),
    userID:  userID()
  };
  return buildObj
};

export const emailCampaign = (completed=false) => {
    const trigger = DataEntryStore.emailCampaign.sendEmailsConfig === "trigger" ? 
    {"event": DataEntryStore.emailCampaign.sendTriggerEvent, "delay": DataEntryStore.emailCampaign.sendTriggerDelay}
    : {} 
    const buildObj = {
      //general
      accountID: accountID(),
      campaignID: generateID(), //generated every time even if bundle is reused
      updated: now(),
      userID:  userID(),
      //content
      bundleID: DataEntryStore.emailCampaign.selectedContentBundle,
      //targets
      teamID: DataEntryStore.emailCampaign.selectedTeamID,
      tags: formatTag(DataEntryStore.emailCampaign.selectedTag),
      targetUsers: DataEntryStore.emailCampaign.selectedUsers,
      //config
      isSendNow: DataEntryStore.emailCampaign.sendEmailsConfig === "now",
      isScheduled: DataEntryStore.emailCampaign.sendEmailsConfig === "schedule" || DataEntryStore.emailCampaign.sendEmailsConfig === "recur",
      isRecurring: DataEntryStore.emailCampaign.sendEmailsConfig === "recur" || DataEntryStore.emailCampaign.sendEmailsConfig === "trigger",
      isTriggered: DataEntryStore.emailCampaign.sendEmailsConfig === "trigger",
      archiveAfter: DataEntryStore.emailCampaign.archiveAfter,
      completed: completed,
      //trigger
      eventTrigger: trigger, 
      //schedule
      sendNext: DataEntryStore.emailCampaign.sendNext, 
    };
    return buildObj
  };

  export const emailCampaignEdit = (patchObj) => {
    const buildObj = {
      accountID: accountID(),
      updated: now(),
      userID:  userID(),
    };
    return _.extend({}, patchObj, buildObj)
  };




  ///POLICIES (FAQs) & ANNOUNCEMENT
  export const content = (type) => {
    const buildObj = {
      chanID: UIStore.sideNav.activeChannel,
      label: DataEntryStore.contentmgmt.label,
      img: "",
      everPublished: DataEntryStore.content.stage === "published" ? true : false,
      reviewAlert: AccountStore.account.reviewAlert,
      keywords: [],
      accountID: accountID(),
      variations: [
        {
        variationID: UIStore.content.variationID,
        stage: DataEntryStore.content.stage,
        teamID: DataEntryStore.content.teamID,
        label: "",
        userID: userID(),
        updated: now(),
        tags: DataEntryStore.content.tagID === "" || DataEntryStore.content.tagID === "none" ? [] : [DataEntryStore.content.tagID],
        contentRAW: DataEntryStore.draftContentRAW,
        contentHTML: DataEntryStore.draftContentHTML
        }
      ]      
    };
    buildObj[type + "ID"] = UIStore.content[type + "ID"]

    return buildObj
  }

  export const contentEdit = (type) => {
    const parent = type === "policy" ? Object.assign({}, PoliciesStore._getPolicy(UIStore.content.policyID)) : Object.assign({}, AnnouncementsStore._getAnnouncement(UIStore.content.announcementID))
    const buildObj = {
        variationID: UIStore.content.variationID,
        stage: DataEntryStore.content.stage,
        teamID: DataEntryStore.content.teamID,
        label: DataEntryStore.content.label,
        userID: userID(),
        updated: now(),
        tags: DataEntryStore.content.tagID === ""  || DataEntryStore.content.tagID === "none"? [] : [DataEntryStore.content.tagID],
        contentRAW: DataEntryStore.draftContentRAW,
        contentHTML: DataEntryStore.draftContentHTML   
    }
    const newVariations = parent.variations.filter(vari => vari.variationID !== UIStore.content.variationID)
    newVariations.push(buildObj)
    const patchObj = {accountID: accountID(), variations: newVariations}
    patchObj[type + "ID"] = UIStore.content[type + "ID"]
    if(DataEntryStore.content.stage === "published"){patchObj.everPublished = true}
    return patchObj
  }
  
  export const contentPatch = (newObj) => {
    return _.extend({}, base(), newObj)
  }


  export const featuredImgEdit = (type) => {
 
    const buildObj = {
        img: DataEntryStore.contentmgmt.img,
    }
    type === "policy" ? buildObj.policyID = UIStore.content.policyID : buildObj.announcementID = UIStore.content.announcementID
    return _.extend({}, base(), buildObj)
  }

 
  ///SETTINGS
  export const baseSettingsEdit = () => {
    const buildObj = {
      accountID: accountID(),
      label: DataEntryStore.baseSettings.label,
      img: DataEntryStore.baseSettings.img,
      userID: DataEntryStore.baseSettings.userID,
      timezone: DataEntryStore.baseSettings.timezone,
      reviewAlert: DataEntryStore.baseSettings.reviewAlert,
      generalEmail: DataEntryStore.baseSettings.generalEmail
    };
    return buildObj
  }

  export const userSettingsEdit = () => {
    const buildObj = {
      accountID: accountID(),
      userID: userID(),
      updated: now(),
      displayName_full: DataEntryStore.userSettings.displayName_full,
      displayName: DataEntryStore.userSettings.displayName,
      img: DataEntryStore.userSettings.img,
      timezone: DataEntryStore.userSettings.timezone,
      profile: 
        {"About Me": DataEntryStore.userSettings["About Me"],
        Department: DataEntryStore.userSettings.Department,
        Github: DataEntryStore.userSettings.Github,
        LinkedIn: DataEntryStore.userSettings.LinkedIn,
        Location: DataEntryStore.userSettings.Location,
        Medium: DataEntryStore.userSettings.Medium,
        Mobile: DataEntryStore.userSettings.Mobile,
        "Phone or Extension": DataEntryStore.userSettings["Phone or Extension"],
        Title: DataEntryStore.userSettings.Title,
        Twitter: DataEntryStore.userSettings.Twitter
      }
    };

    
    return buildObj
  }


  
  
  
