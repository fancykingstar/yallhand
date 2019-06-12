import { observable, action, computed } from "mobx";
import { generateID } from "../SharedCalculations/GenerateID";
import _ from "lodash";

class Store {
  ///This type of referencing only works using OBJECTS, not primitives
  keys = {
    teamEditFields: this.teamEditFields,
    userEditFields: this.userEditFields,
    selectedTag: this.selectedTag,
    currentLabel: this.currentLabel,
    isSaveDisabled: this.isSaveDisabled,
    commonFields: this.commonFields,
    onOffBoarding: this.onOffBoarding,
    resources: this.resources,
    featuredImage: this.featuredImage,
    urlForUpload: this.urlForUpload,
    fileForUpload: this.fileForUpload,
    search: this.search,
    baseSettings: this.baseSettings,
    userSettings: this.userSettings,
    emailCampaign: this.emailCampaign,
    channel: this.channel,
    tempContent: this.tempContent,
    content: this.content,
    contentmgmt: this.contentmgmt,
    api: this.api,
    superAdmin: this.superAdmin,
    ask: this.ask
    
  }; 

  //SHARED DRAFT JS FIELDS (need to be global and not wrapped in object)
  @observable draftContentRAW = {};
  @observable draftContentHTML = "";
  @observable draft = {};

  @observable api = {
    payload: {}
  }

  @observable content = {
    variationID: "",
    label: "",
    teamID: "",
    tagID: "",
    stage: "draft",
    isNew: false
  }

  @observable contentmgmt = {
    label: "",
    variationID: "",
    img: "",
    imgData: {},
    campaign: "",
    keywordInput: "",
    keywords: [],
    reviewAlert: 0,
    schedAlert: 0,
    eventType: "",
    eventDateTime: "",
    settingsLabel: "",
    settingsChannel: "",
    everPublished: ""
  }

  @observable teamEditFields = {
    //Teams > Teams/Tags Parent Screens to add/edit
    tagsLabel: "",
    tagsDropdown: "",
    tagsSaveDisabled: false,
    teamsLabel: "",
    teamsDropdown: "",
    teamsSaveDisabled: false,
   

    //Teams > Teams/Tags modal to edit/delete
    selectedTag: "",
    selectedTagLabel: "",
    _selectedTagLabel: "",
    tagEditDropdownVal: "",
    tagEditSaveDisabled: false,
    // ----more----
    selectedTeam: "",
    selectedTeamLabel: "",
    _selectedTeamLabel: "",
    teamEditDropdownVal: "",
    teamEditSaveDisabled: false,
    preventDelete: false
  };

  @observable userEditFields = {
    //Users and User Edit Fields
    userEdit: {},

    displayName_full: "",
    displayName: "",
    email: "",
    teamID: "",
    tagID: "",
    isAdmin: false,
    //if isAdmin ...
    adminConfig: "all",
    adminSelectedTeam: "",
    adminTeams: [],
    adminSelectedTag: "",
    adminTags: [],
    adminSelectedChannel: "",
    adminChannels: []
  };

@observable onOffBoarding = {
    //offboard
    offBoardingDate: "",
    //onboarding
    email: "",
    teamID: "global",
    tagID: "none",
    onBoardingDate: "",
     // ----if admin...----
    adminEmail: "",
    adminTeamID: "global",
    adminTagID: "none",
    adminConfig: "all",
    adminSelectedTeam: "",
    adminTeams: [],
    adminSelectedTag: "",
    adminTags: [],
    adminSelectedChannel: "",
    adminChannels: [],
    adminOnBoardingDate: ""
};
  @observable resources= {
    addUrlTeam: "global",
    addUrlTag: "none",
    addUrlLabel: "",
    addFileTeam: "",
    addFileTag: [],
    addFileLabel: ""
  };
 
   @observable
   preventSave = false;

  @observable featuredImage = {
    file: "",
    url: "",
    disabled: false,
    filename: ""
  };
  @observable fileForUpload = {
    isNew: false,
    file: "",
    type: "",
    url: "",
    disabled: false,
    filename: "",
    label: "",
    teamID: "",
    tagID: "",
    associations: {"policies": [], "announcements": []},

  };
  @observable urlForUpload = {
    isNew: false,
    url: "",
    disabled: false,
    label: "",
    prefix: "https://",
    teamID: "",
    tagID: "",
    associations: {"policies": [], "announcements": []},
    resourceID: ""
  };

  @observable search = {
    //content search 
    contentResults: [],
    contentValue: ""
  }

  @observable channel = {
    label: ""
  }

  @observable emailCampaign = {
    //temp draft storage
    draftRAW: {},
    draftHTML: "",
    //Send Email
    img: "",
    sendTargetType: "all",
    sendToUsers: [],
    sendToTeamID: "global",
    sendToTagID: "none",
    sendContent: [],
    sendSubject: "",
    sendSaveTemplate: false,
    loadedTemplateSubject: "",
    //Send Options
    previewUser: "",
    previewUsers: [],
    sendNext: 0,
    sendAutomationEvent: "firstLogin",
    sendAutomationDelay: 0,
  }

  @observable baseSettings = {
    label: "",
    imgFile: "",
    img: "",
    userID: "",
    timezone: "",
    reviewAlert: "",
    generalEmail: "",
  }

  @observable userSettings = {
    timezone: "",
    img: "",
    displayName_full: "",
    displayName: "",
    Title: "",
    Department: "",
    Location: "",
    "Phone or Extension": "",
    Mobile: "",
    "About Me": "",
    Twitter: "",
    Medium: "",
    Github: "",
    LinkedIn: "" 
  }

  @observable
  isSaveDisabled = {
    tags: false,
    teams: false,
    tagteamedit: false
  };

  @observable ask = {
    content: {},
    type: "general"
  }

  @observable
  superAdmin = {
    allAccounts: [],
    allUsers:[],
    userSelected: "",
    previewAccount: "",
    accountArmed: false,
    accountLabel: "",
    accountTimezone: 0,
    accountReviewAlert: 0,
    accountEmail: "",
    accountImg: "",
    analyticsLoading: false,
    analyticsAccount: "",
    analyticsType: "both",
    analyticsAction: "all",
    analyticsSort: "new",
    analyticsLogs: [],
    analyticsCurrentDisplay: [],
  }

  @action
  loadObj(obj, key) {
    return { editUser: (this.editUser = key) }[obj];
  }
  loadStr(obj, key, val) {
    return {
      editUser: (this.editUser[key] = val),
      teamEditFields: (this.teamEditFields[key] = val)
    }[obj];
  }

  set(target, key, val, deepval = null) {
    try {
      deepval === null
        ? (this.keys[target][key] = val)
        : (this.keys[target][key][val] = deepval);
    } catch (error) {
      console.log("Is the request value set in DataStore Keys?..targeting " + target, error);
    }
  }

  reset(target, overide = {}) {
    const overideKeys =
     !_.isEmpty(overide) ? Object.keys(overide) : []
      Object.keys(this.keys[target]).forEach(key => {
        if (overideKeys.length !== 0 && overideKeys.includes(key)) {
          this.keys[target][key] = overide[key]
        } else {
        switch (typeof this.keys[target][key]) {
          case "boolean":
            this.keys[target][key] = false;
            break;
          case "string":
            this.keys[target][key] = "";
            break;
          case "number":
            this.keys[target][key] = 0;
            break;
          case "object":
            Array.isArray(this.keys[target][key])
              ? (this.keys[target][key] = [])
              : (this.keys[target][key] = {});
            break;
          default:
            this.keys[target][key] = "";
            break;
        }
      }
      });
      // this.resetDraft()
    }
  _isReset(target) {
    let reset = true
    Object.values(this.keys[target]).forEach(val => {
      switch (typeof val) {
        case "boolean":
          val !== false ? reset = false : null
          break;
        case "string":
        val !== "" ? reset = false : null
          break;
        case "number":
        val !== 0 ? reset = false : null
          break;
        case "object":
          Array.isArray(val)
            ? val.length !== 0 ? reset = false : null
            : !_.isEmpty(val)? reset = false : null
          break;
        default:
            reset = false
          break;
      }
    })
    return reset
  }


  toggleDraftContentRAW(val) {
    this.draftContentRAW = val;
  }
  toggleDraftContentHTML(val) {
    this.draftContentHTML = val;
  }


  togglePreventSave(val) {
    this.preventSave = val;
  }

  ///Draft Exclusive Calls
  setDraft(key, val) {
    this.draft[key] = val;
  }

  resetDraft(){
    this.draftContentRAW = {};
    this.draftContentHTML = "";
    // this.draft = {};
  }

  setDraftRAW(val){
    this.draftContentRAW = val;
  }

}

export const DataEntryStore = new Store();
