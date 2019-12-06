import { DataEntryStore } from "../Stores/DataEntryStore";
import { AccountStore } from "../Stores/AccountStore";
import { PoliciesStore } from "../Stores/PoliciesStore";
import { UIStore } from "../Stores/UIStore"
import { UserStore } from "../Stores/UserStore";
import { TeamStore } from "../Stores/TeamStore"
import { AnnouncementsStore } from "../Stores/AnnouncementsStore";
import { generateID } from "../SharedCalculations/GenerateID";
import _ from "lodash";
import { EligibleUsersByTeamTag } from "../SharedCalculations/EligibleUsersByTeamTag";



const accountID = () => AccountStore.account && AccountStore.account.accountID ? AccountStore.account.accountID : '';
const userID = () => UserStore.user.isSuperAdmin? "*" : UserStore.user.userID;
const now = () => Date.now();
const formatTag = (val) => val === "" || val === "none" ? [] : [val]

const base = () => {return {"accountID": accountID(), "userID": userID(), "updated": now()}}

//Template ONLY
export const UNTITLED = () => {
  const buildObj = {
  
  };
  return _.extend({}, base(), buildObj)
}


///LOGGING
export const ItsLog = (action, data) => {
  //action (true/false (view only)) data = {"event":, "type":,} or {"location": "location label"}
  let buildObj = {
    isAction: action,
  }
  buildObj = _.extend(data, buildObj)
  return _.extend({}, base(), buildObj)
}

//
export const contentHistory = (type, id, data) => {
  const buildObj = {
    accountID: accountID(),
    updated: now(),
    type,
    id,
    data
  };
  return buildObj
}



///SENTIMENT
export const sentiment = (sentiment, type, ID, variationID=null) => {
  const buildObj = {
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
    when,
    executed: false,
    task,
    data,
  };
  return _.extend({}, base(), buildObj)
}


///ACCOUNTS (SUPERADMIN ONLY)
export const account = () => {
  const buildObj = {
      "label": DataEntryStore.superAdmin.accountLabel,
      "img": DataEntryStore.superAdmin.accountImg,
      "reviewAlert": DataEntryStore.superAdmin.accountReviewAlert,
      "created": now(),
      // "timezone": DataEntryStore.superAdmin.accountTimezone,
      "generalEmail": DataEntryStore.superAdmin.accountEmail,
      "data": {trialExp: DataEntryStore.superAdmin.accountTrial},
      "isActive": true
  };
  return _.extend({}, {"userID": userID(), "updated": now()}, buildObj)
}



///TEAMS (STRUCTURE)
export const team = () => {
  const buildObj = {
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
      "accountID": accountID(),
      "invitedBy": userID(),
      "isActive": true,
      "updated": now(),
      "displayName_full": "",
      "displayName": "",
      "isAdmin": isAdmin,
      "adminLimits": {},
      // "adminLimits": x.adminConfig === "all" ? {} : {"teams": x.adminTeams,"tags":x.adminTags, "channels":x.adminChannels},
      "teamID": isAdmin ? x.teamID : x.adminTeamID ,
      "tags": isAdmin ? x.adminTagID === "none" ? [] : [x.adminTagID] : x.tagID === "none" ? [] :[x.tagID],
      "email": isAdmin ? x.adminEmail: x.email,
      "img": "",
      "timezone": AccountStore.account.timezone,
      "profile": {"About Me":"","Department":"","Github":"","LinkedIn":"","Location":"","Medium":"","Mobile":"","Phone or Extension":"","Title":"","Twitter":""},
      "phone": "string",
      "password": "string",
      "now": true,
      "date": "string",
      "googleId": "string"
    };
  return buildObj
}






///CHANNELS
export const channel = (label) => {
  const buildObj = {
    label
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
  "associations": obj.associations,
  "label": obj.label,
  "url": obj.url,
  "prefix": obj.prefix,
  "teamID": obj.teamID,
  "tags": obj.tagID === "none" ? [] : [obj.tagID],
  };
  if(id !== null){buildObj.resourceID = obj.resourceID}
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
export const newFile = (label, assoc=null, hideFromFeed=false) => {
 const buildObj = {
  label,
  S3Key: "",
  url: "", 
  // filename: DataEntryStore.fileForUpload.filename,
  type: "",
  size: "", 
  teamID: "global",
  hideFromFeed,
  tags: []
  };
  assoc !== null? buildObj.associations = Object.assign({policies:[], announcements:[], tickets: []}, assoc) : {policies:[], announcements:[], tickets: []};
  return _.extend({}, base(), buildObj)
}



export const fileResource = (assoc=null) => {
  const buildObj = {
  associations: DataEntryStore.fileForUpload.associations,
  label: DataEntryStore.fileForUpload.label,
  S3Key: DataEntryStore.fileForUpload.S3Key,
  url: DataEntryStore.fileForUpload.url, 
  // filename: DataEntryStore.fileForUpload.filename,
  type: DataEntryStore.fileForUpload.type,
  size: DataEntryStore.fileForUpload.file.size, 
  teamID: DataEntryStore.fileForUpload.teamID,
  tags: DataEntryStore.fileForUpload.tagID === "none" || DataEntryStore.fileForUpload.tagID === ""? [] : [DataEntryStore.fileForUpload.tagID]
  };
  assoc !== null? buildObj.associations = assoc : {policies:[], announcements:[]};
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


///EMAIL CAMPAIGN
export const emailPreview = () => {
  let tags = formatTag(DataEntryStore.emailCampaign.sendToTagID);
  if (JSON.stringify(tags) === "[null]") tags = [];
  const buildObj = {
    accountID: accountID(),
    bundleID: DataEntryStore.emailCampaign.selectedContentBundle,
    teamID: DataEntryStore.emailCampaign.sendToTeamID,
    tags: tags,
    targetUsers: DataEntryStore.emailCampaign.selectedUsers,
    previewUsers: DataEntryStore.emailCampaign.previewUsers,
    updated: now(),
    userID: userID(),
    subject: DataEntryStore.emailCampaign.sendSubject,
    content: DataEntryStore.emailCampaign.sendContent,
    draftContentHTML: DataEntryStore.draftContentHTML,
    draftContentRAW: DataEntryStore.draftContentRAW,
    img: DataEntryStore.contentmgmt && DataEntryStore.contentmgmt.img ? DataEntryStore.contentmgmt.img : ''
  };
  return buildObj
};

export const emailCampaign = (isSendNow, isScheduled) => {
    const eventTrigger = UIStore.menuItem.sendEmailOption === "automate" ? {"event": DataEntryStore.emailCampaign.sendAutomationEvent, "delay": DataEntryStore.emailCampaign.sendAutomationDelay} : {} 
    let tags = formatTag(DataEntryStore.emailCampaign.sendToTagID);
    if (JSON.stringify(tags) === "[null]") tags = [];
    const buildObj = {
      //content
      draftContentRAW: UIStore.menuItem.sendEmailBody.includes("message")? DataEntryStore.draftContentRAW : {},
      draftContentHTML:  UIStore.menuItem.sendEmailBody.includes("message")? DataEntryStore.draftContentHTML: "",
      subject: DataEntryStore.emailCampaign.sendSubject,
      content: UIStore.menuItem.sendEmailBody.includes("content")? DataEntryStore.emailCampaign.sendContent : [],
      //recipiants
      recipientType: DataEntryStore.emailCampaign.sendTargetType,
      teamID: DataEntryStore.emailCampaign.sendToTeamID,
      tags: tags,
      targetUsers: DataEntryStore.emailCampaign.sendToUsers,
      //config
      isSendNow,
      isScheduled,
      isTriggered: isSendNow === false && isScheduled === false,
      isTemplate: DataEntryStore.emailCampaign.sendSaveTemplate,
      completed: false,
      //trigger 
      eventTrigger,
      //schedule
      sendNext: DataEntryStore.emailCampaign.sendNext,
      img: DataEntryStore.contentmgmt && DataEntryStore.contentmgmt.img ? DataEntryStore.contentmgmt.img : ''
    };
    return _.extend({}, base(), buildObj)
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

  export const content = (obj) => {
    const {label, contentRAW, contentHTML, teamID, tagID, stage, img, chanID} = obj;
    return {
      chanID: !chanID? "All": chanID,
      label,
      accountID: accountID(),
      img,
      everPublished: stage === "published",
      reviewAlert: 0,
      keywords: [],
      variations: [
        {
        variationID: generateID(),
        stage: !stage? "draft": stage,
        teamID: !teamID? "global": teamID,
        label: teamID === !teamID && !tagID? "": label,
        tags: tagID? [tagID]:[],
        contentRAW,
        contentHTML,
        userID: userID(),
        updated: now()
        }
      ]      
    };
  }

  export const contentEdit = (obj, mode, contentID, variID) => {
    // const {label, contentRAW, contentHTML, teamID, tagID, stage, img, chanID} = obj;

    const newVariTemplate = { variationID: generateID(), stage: "draft", teamID: "global", label: "",tags: [], contentRAW:"", contentHTML:""}

    let updatedFields = {};
    Object.keys(obj).forEach((key, i) => { if(key[0]!=="_") updatedFields[key] = obj[key]});

    let newContentValues = {}
    if (updatedFields.img) newContentValues.img = updatedFields.img;
    if (updatedFields.chanID) newContentValues.chanID = updatedFields.chanID;
    if (mode === "announcement") {newContentValues.announcementID = contentID}
    else newContentValues.policyID = contentID;
    newContentValues.accountID = accountID();
    newContentValues.updated = Date.now();

    let newVariValues = {};
    if (updatedFields.label) newVariValues.label = updatedFields.label;
    if (updatedFields.contentRAW) newVariValues.contentRAW = updatedFields.contentRAW;
    if (updatedFields.contentHTML) newVariValues.contentHTML = updatedFields.contentHTML;
    if (updatedFields.teamID) newVariValues.teamID = updatedFields.teamID;
    if (updatedFields.tags) newVariValues.tags = updatedFields.tags;
    if (updatedFields.stage) newVariValues.stage = updatedFields.stage;
    if (updatedFields.qanda) newVariValues.qanda = updatedFields.qanda;
    newVariValues.updated = Date.now();
    newVariValues.userID = userID();
    newVariValues.variationID = variID? variID : generateID();

    //Correct for Nasty MOBX bug --- stringify/parse will release from Observer
    let parent = mode === "policy" ? JSON.stringify(PoliciesStore._getPolicy(contentID)) : JSON.stringify(AnnouncementsStore._getAnnouncement(contentID));
    parent = JSON.parse(parent);
 
    const variations = parent.variations.slice();
    const editedVari = variID? variations.filter(i=>i.variationID === variID) : [newVariTemplate];
    const otherVaris = variations.filter(i=> i.variationID !== variID);
    const combinedVaris = [...otherVaris, Object.assign(editedVari.length? editedVari[0]: {}, newVariValues)];
    newContentValues.variations = combinedVaris;
    if(updatedFields === "published") newContentValues.everPublished = true;
    return _.extend({}, base(), newContentValues);
  }
  
  export const contentPatch = (newObj) => {
    return _.extend({}, base(), newObj)
  }


  export const featuredImgEdit = (type) => {

    const buildObj = {
        img: DataEntryStore.contentmgmt.img,    
        imgData: {}
    }
    if(buildObj.img.includes("unsplash")) buildObj.imgData = DataEntryStore.contentmgmt.imgData;
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

  ///SURVEYS AND TASKS
  const generateInstances = (data) => {
    const {sendTargetType, deadline, sendToTagID, sendToTeamID} = data;
    if(data.sendTargetType === "all") return AccountStore._allActiveUsers.filter(user => !user.isAdmin).map(user => ({instanceID: generateID(), sent: Date.now(), userID: user.userID, deadline}) )
    else if(data.sendTargetType === "users") return data.sendToUsers.map(userID => ({instanceID: generateID(), sent: Date.now(), userID, deadline}) )
    else if (data.sendTargetType === "teams") return EligibleUsersByTeamTag(sendToTeamID, sendToTagID==="none"? "": sendToTagID).filter(user => !user.isAdmin).map(userID => ({instanceID: generateID(), sent: Date.now(), userID, deadline}) )
  }

  export const survey = ( type, data ) => {
    const {surveyItems, active, label, anonymous, deadline, sendToTeamID, sendToTagID, sendTargetType, sendToUsers } = data;

    const buildObj = {
      surveyItems, 
      type,
      label,
      sendTargetType,
      anonymous,
      deadline,
      sendToTeamID,
      sendToTagID,
      sendToUsers,
      instances: active? generateInstances(data):[],
      responses_by_instance: [],
      active,
    };
    return _.extend({}, base(), buildObj)
  };

  export const surveyEdit = ( type, data ) => { 
    let instances = data.instances.length? data.instances : [];
    if (data.active) instances = [...instances, ...generateInstances(data)];
    let buildObj = Object.assign(data, {instances, type});
    Object.keys(data).forEach(key => {if(key[0] == "_") delete buildObj[key]}) 
    return _.extend({}, base(), buildObj)

  }

 
  ///TICKETING AND SERVICE DESK
  export const ticket = ( data ) => {
    let payload = data;
    if (payload._iconOptions !== undefined) delete payload._iconOptions;
    if (data.type === "simple") {
      payload.ticketItems.splice(0, 1, Object.assign(payload.ticketItems[0], data.config.simpleDesc? {defaultAssignee: userID(), data: [{type: "text", label: "Description", options: []}]} : {defaultAssignee: userID()} ));
    };

    if (payload.assoc.length) payload.assoc = data.assoc.map(i=> i.type === "policy"? ({policyID: i.value}):({announcementID: i.value}))

    payload.teamID = payload.sendToTeamID?  payload.sendToTeamID : "global";
    delete payload.sendToTeamID;
    payload.tags = payload.sendToTagID && payload.sendToTagID !== "none"? [payload.sendToTagID] : [];
    delete payload.sendToTagID;

    return _.extend({}, base(), payload)
  }

  export const ticketEdit = ( data ) => {
    return _.extend({}, base(), data); 
  }

  export const addTicketActivity = (state, props) => {
    let newVals = Object.assign({}, state);
    delete newVals.contactExpanded
    delete newVals.addlFieldsSource

    
    let buildObj = {
      ticketID: props.ticketID,
      accountID: props.accountID,
    };

    if (state.stage) buildObj.stage = state.stage;
    if (state.assignee) buildObj.currentAssignee = state.assignee;
    delete newVals.stage;
    delete newVals.assignee;
    Object.keys(newVals).filter(i => !newVals[i]).forEach(i => delete newVals[i]);

    let activity = {updated: Date.now(), userID: userID(), data: newVals};
 

    buildObj.activity = [...props.activity, activity];
    buildObj.update = Date.now();

    return buildObj;

  }

  export const ticketOpen = ( data ) => {
    let payload = data;
    if (payload.id) delete payload.id
    return _.extend({}, base(), payload);
  }

  export const addView = ( data ) => {
    let newTicket = {};
    Object.keys(data).forEach(key => {if (key[0] !== "_") newTicket[key] = data[key]})
    let latestViews = newTicket.activity[0].views.slice();
    latestViews.push(userID());
    const newActivity = newTicket.activity.slice().splice(0, 1, Object.assign(newTicket.activity[0], {views: latestViews}))
    return Object.assign(newTicket, {activity: newActivity});
  }




  
  
  
