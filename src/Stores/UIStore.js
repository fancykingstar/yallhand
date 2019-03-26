import { observable, action, computed } from "mobx";
import _ from 'lodash'

class Store {
      ///This type of referencing only works using OBJECTS, not primitives
    keys = { 
        "modal": this.modal,
        "dropdown": this.dropdown,
        "search": this.search,
        "menuItem": this.menuItem,
        "accordion": this.accordion,
        "adminLoadingComplete": this.adminLoadingComplete,
        "button": this.button,
        "sideNav": this.sideNav,
        "filter": this.filter,
        "content": this.content,
        "dateTimeSelect": this.dateTimeSelect,
        "responsive": this.responsive,
        "portal": this.portal
    } 

    @observable filter = {
        cardFilterPublished: true, 
        cardFilterDrafts: true, 
        cardFilterArchived: false,
        anncFilterPublished: true, 
        anncFilterDrafts: true, 
        anncFilterArchived: false,
        
    }
  
    @observable
    isScreenLoading = false;

    @observable
    responsive = {
        isMobile: false,
        mobileNav: false
    }

    
    @observable
    dropdown = {
        policySort: "Newest",
        announcementSort: "Newest",
        reviewAlerts: "recur",
        onBoardUser: "today",
        onBoardAdmin: "today",
        usersFilter: "active",
        uploadConfig: "content",
        bundles: "active",
        portalannouncementSort: "Newest",
        portalPolicySort: "Newest"
    }
    @observable
    modal = {
        uploadFile: false,
        uploadURL: false,
        uploadURLResource: false,
        editTeam: false,
        editTag: false,
        confirmDelete: false,
        editUser: false,
        offboard: false,
        uploadAssocEdit: false,
        createContent: false,
        createChannel: false,
        modifyChannel: false,
        historyView: false
    }

    @observable
    button = {
        sendOptionConfig: false
    }

    @observable
    search = {
        channel: "",
        contentResults: {},
        contentValue: "",
        contentSearchLoading: false,
        fileResults: {},
        fileValue: "",
        URLSearchLoading: false,
        URLResults: {},
        URLValue: "",
        fileSearchLoading: false,
        searchUsers: "",
        searchUsersData: [],
        searchUrls: "",
        searchUrlsData: [],
        searchFiles: "",
        searchFilesData: [],
        searchPolicies: "",
        searchPoliciesData: [],
        searchAnnouncements: "",
        searchAnnouncementsData: [],
        searchBundles: "",
        searchBundlesData: [],
        searchPeople: "",
        searchPeopleData: [],
        searchPortalannouncementValue: "",
        portalSearchValue: ""
    }

    @observable
    accordion = {
        editBundle: false,
        bundleConfig: false
    }

    @observable
    transition = {
        urlAutoFormat: true
    }

    @observable
    menuItem = {
        teamFrame: "onboard",
        resourcesFrame: "URL",
        emailFrame: "send email",
        sendEmailBody: "message",
        analyticsHeader: "announcements",
        superAdminFrame: "edit account"
    }

    @observable
    radio = {
        userAdminSettings: false
    }

    @observable
    dateTimeSelect = {
        date: "",
        time: "",

    }

    @observable adminLoadingComplete = {
        account: false,
        users: false,
        user: false,
        policies: false,
        channels: false,
        files: false,
        urls: false,
        structure: false,
        tags: false,
        announcements: false,
        bundles: false,
        campaigns: false,
        scheduled: false,
        logs: false,
        sentiments: false
    }

    @observable sideNav = {
        activePrimary: "",
        activeChannel: "All"
    }

    //previewing in display
    @observable content = {
        policyID: "",
        // announcementID: "",
        variationID: "",
        history: []
    }

    @observable portal = {
        sentimentComplete: false,
        sentimentAvailable: []
    }

    @action
    set(target, key, val){
        try {
        this.keys[target][key] = val
        }
        catch (error) {
            console.log("Is the request value set in UIStore Keys?", error);
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
              case "object":
                Array.isArray(this.keys[target][key])
                  ? (this.keys[target][key] = [])
                  : (this.keys[target][key] = {});
                break;
              default:
                this.keys[target][key] = "";
                break;
            }}
          });
        }
      


    toggleScreenLoading() {
        this.isScreenLoading = !this.isScreenLoading
    }


    toggleTransition(key) {
        this.transition[key] = !this.transition[key]
    }


    @computed
    get _adminLoadingComplete() {
       return !Object.values(this.adminLoadingComplete).includes(false)
    }


 
   
}

export const UIStore = new Store()