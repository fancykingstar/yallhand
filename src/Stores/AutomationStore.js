import { observable, action, computed } from "mobx";

class Store {
  @observable
  allAutomations = [];


  @action
    loadAutomations(ary) {
    this.allAutomations = ary;
  };

  _getAutomation(id){
    if(this.allAutomations.filter(a => a.automationID === id).length > 0){
      return Object.assign({}, this.allAutomations.filter(a => a.announcementID === id)[0])
    }
    else{return {}}
  }
 

  @computed
  get publicAutos() {return this.allAutomations.filter(auto => auto.public === true)}
  
  @computed
  get privateAutos() {return this.allAutomations.filter(auto => auto.public === false)}
  
}

export const AutomationStore = new Store();
