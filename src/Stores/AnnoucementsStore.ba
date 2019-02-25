import { observable, action } from "mobx";
import {addCalculatedAttributes} from "../SharedCalculations/ContentCalculatedAttributes"
class Store {
  @observable
  allAnnoucements = [];

  @action
  loadAnnouncements(val) {
    return new Promise((resolve, reject) => {
    this.allAnnoucements = addCalculatedAttributes(val);
      resolve(true)
    })

  }


  
  
}

export const AnnoucementsStore = new Store();