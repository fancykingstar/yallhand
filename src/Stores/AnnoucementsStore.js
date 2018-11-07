import { observable, action } from "mobx";

class Store {
  @observable
  allAnnoucements = [];

  @action
    loadAnnoucements() {
    const Annoucements = require("../MockData/Annoucements.json");
    this.allAnnoucements  = Annoucements
  };


  
  
}

export const AnnoucementsStore = new Store();