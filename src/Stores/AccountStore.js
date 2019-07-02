import { observable, action, computed } from "mobx";
import { getDefaultWorkspaceImg } from "../SharedCalculations/GetDefaultWorkspaceImg"
import {UserStore} from "../Stores/UserStore"
import _ from "lodash";

class Store {
  keys = {
    "account": this.account
  }

  @observable account = {}
  @observable allUsers = []
  @observable logs = []
  @observable analyticData_portal = []
  @observable analyticData_campaigns = []
  @observable dashboardData = []
  @observable sentiments = []
  @observable reviewQueue = []
  @observable stripe = {}

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

  loadAccount(account) {
    return new Promise((resolve, reject) => {
      let accountLoad = Object.assign({}, account)
      accountLoad.img === "" || accountLoad.img === undefined ? accountLoad.img = getDefaultWorkspaceImg(accountLoad.accountID) : null
      this.account = accountLoad
      _.isEmpty(this.account) ? reject(false) : resolve(true)
    })
  }

  loadUsers(allUsers) {
    return new Promise((resolve, reject) => {
      this.allUsers = allUsers
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

  loadDashboardData(allLogs) { 
    this.dashboardData = allLogs
  }

  loadSentiments(allSentiments) {
    this.sentiments = allSentiments
  }

  loadReviewQueue(all) {
    this.reviewQueue = all
  }

  loadStripe(data) {
    this.stripe = data
  }

  _getUsersSelectOptions(obj="") {
      const key = obj ? Object.keys(obj)[0] : ""
      const selectedUsers = !key ? this.allUsers : this.allUsers.filter(i=>i[key] === Object.values(obj)[0])
      return selectedUsers.filter(user => user.displayName_full !== "" && user.isActive)
        .map(user => ({"value": user.userID, "text": user.userID === UserStore.user.userID? user.displayName_full + " (me) ":user.displayName_full }))
  }

  _getUser(ID) {
    const superadmin = {
      userID: "*",
      displayName_full: "Yallhands Admin",
      displayName: "Yallhands",
    }
    return ID === "*" ? superadmin : this.allUsers.filter(user => user.userID === ID)[0]
  }

  _getDisplayName(ID) {
      return this._getUser(ID).displayName
  }

  @computed
  get _allActiveUsers() {
    return this.allUsers.filter(user => user.displayName_full !== "" && user.isActive)
  }
}

export const AccountStore = new Store()