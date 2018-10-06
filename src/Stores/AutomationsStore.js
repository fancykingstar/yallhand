import { observable, action, computed } from "mobx";

class Store {
  @observable
  allAutomations = [];


  @observable
  automationMenuSelect = "shared"

  @observable
  active = ''

  @observable
  selectedAutomation = {}

  @observable
  modal=false

  @action
    loadAutomations() {
    const automations = require("../MockData/Automations.json");
    this.allAutomations  = automations
  };


  toggleMenu(val) {
    this.automationMenuSelect = val
  }

  makeActive(val) {
      this.active = val
  }

  selectAutomation(val) {
      this.selectAutomation = val
  }

 setModal(val) {
      this.modal = val
  }



  @computed
  get publicAutos() {return this.allAutomations.filter(auto => auto.public === true)}
  
  @computed
  get privateAutos() {return this.allAutomations.filter(auto => auto.public === false)}
  
}

export const AutomationsStore = new Store();
