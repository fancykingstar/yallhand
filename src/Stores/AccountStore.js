import { observable, action, computed } from "mobx";
import { getDefaultWorkspaceImg } from "../SharedCalculations/GetDefaultWorkspaceImg";
import { getDefaultUserImg } from "../SharedCalculations/GetDefaultUserImg";
import {UserStore} from "../Stores/UserStore"
import _ from "lodash";

class Store {
  keys = {
    "account": this.account,
    "stripe": this.stripe,
  }

  @observable account = {}
  @observable allUsers = []
  @observable activeUsers = []
  @observable inactiveUsers = []
  @observable invitedUsers = []

  @observable logs = []
  @observable analyticData_portal = []
  @observable analyticData_campaigns = []
  @observable analyticData_ticketing = []
  @observable dashboardData = []
  @observable sentiments = []
  @observable reviewQueue = []

  @observable stripe = {
    data: {},
    plans: {},
    invoice: {}
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
    const overideKeys = !_.isEmpty(overide) ? Object.keys(overide) : []
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

  _defaultImg(userarry) {
    return userarry.map(user => {
      if (user.img) return user 
      const img = getDefaultUserImg(user.id? user.id :user.userID);
      return Object.assign(user, {img});
    });
  }

  loadAccount(account) {
    return new Promise((resolve, reject) => {
      let accountLoad = Object.assign({}, account)
      accountLoad.img === "" || accountLoad.img === undefined ? accountLoad.img = getDefaultWorkspaceImg(accountLoad.accountID) : null
      this.account = accountLoad
      _.isEmpty(this.account) ? reject(false) : resolve(true)
    })
  }

  loadAccountUsers(usersObj) {
    return new Promise((resolve, reject) => {
      if (usersObj.activeusers.length) this.activeUsers = this._defaultImg(usersObj.activeusers);
      if (usersObj.inactiveusers.length) this.inactiveUsers = this._defaultImg(usersObj.inactiveusers);
      if (usersObj.invitedusers.length) this.invitedUsers = this._defaultImg(usersObj.invitedusers); 
      this.allUsers = [...this.activeUsers, ...this.inactiveUsers, ...this.invitedUsers];
      resolve(true);
    });
  }

  loadUsers(allUsers) {
    return new Promise((resolve, reject) => {
      const usersDefaultImg = allUsers.map(user => {
        if (user.img) return user 
        const img = getDefaultUserImg(user.id? user.id :user.userID);
        return Object.assign(user, {img});
      });
      this.allUsers = usersDefaultImg;
      this.allUsers.length === 0 ? reject(false) : resolve(true)
    })
  }

  loadLogs(allLogs) {
    this.logs = allLogs
  }

  loadAnalyticData_portal(allLogs) { 
    this.analyticData_portal = allLogs
  }
  
  loadAnalyticData_campaigns(allLogs) { 
    this.analyticData_campaigns = allLogs
  }

  loadAnalyticData_ticketing(allLogs) { 
    this.analyticData_ticketing = allLogs
  }


  loadDashboardData(allLogs) { 
    this.dashboardData = allLogs
  }

  loadSentiments(allSentiments) {
    this.sentiments = allSentiments
  }

  

  loadReviewQueue(all) {
    this.reviewQueue = all
  }

  _getUsersSelectOptions(arry=false) {
      const selectedUsers = !arry ? this.allUsers : this.allUsers.filter(i=>i.userID && arry.includes(i.userID))
      return selectedUsers.filter(user => user.displayName_full !== "" && user.isActive)
        .map(user => ({"value": user.userID, "text": user.userID === UserStore.user.userID? user.displayName + " (me) ":user.displayName }))
  }

  _getAdminSelectOptions(arry=false) {
    const selectedUsers = !arry ? this.allUsers.filter(i=>i.isAdmin) : this.allUsers.filter(i=>i.isAdmin).filter(i=>i.userID && arry.includes(i.userID))
    return selectedUsers.filter(user => !user.code && user.isActive)
      .map(user => ({"value": user.userID, "text": user.userID === UserStore.user.userID? user.displayName + " (me) ":user.displayName }))
}

  _getUser(ID) {
    const superadmin = {
      userID: "*",
      displayName_full: "Yallhands Admin",
      displayName: "Yallhands",
      img: "https://yallhandsgeneral.s3.amazonaws.com/yh-avatar.png",
      email: "support@yallhands.com",
      profile: { Title: "",
      Department: "",
      Location: "",
      "Phone or Extension": "",
      Mobile: "",
      "About Me": "",
      Twitter: "",
      Medium: "",
      Github: "",
      LinkedIn: "" }
      
    }
    return ID === "*" ? superadmin : this.allUsers.filter(user => user.userID === ID)[0]
  }

  _getDisplayName(ID) {
      const name = this._getUser(ID).displayName
      return name? name : "Invalid User"
  }


  @computed
  get _allActiveUsers() {
    return this.allUsers.filter(user => user.isActive || user.now === "false")
  }
}

export const AccountStore = new Store()