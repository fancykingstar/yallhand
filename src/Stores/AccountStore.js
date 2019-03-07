import { observable, action, computed } from "mobx";
import _ from "lodash";
class Store {
      keys = {
      "account": this.account
    }
    
    @observable account = {}
    @observable allUsers = []
    @observable logs = []
    @observable sentiments = []

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

    loadAccount(account) {
      return new Promise((resolve, reject) => {
        this.account = account
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

    loadSentiments(allSentiments) {
      this.sentiments = allSentiments
    }

    _getUsersSelectOptions() {
        return this.allUsers
          .filter(user => user.displayName_full !== "" && user.isActive)
          .map(user => ({"text": user.displayName_full, "value": user.userID}))
    }

    _getUser(ID) {
      return this.allUsers.filter(user => user.userID === ID)[0]
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