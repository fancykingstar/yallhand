import { observable, action } from "mobx";

class Store {
    @observable
    toggledTeam = {};
  
    @observable
    toggledTag = {};

    @observable
    draftContent = [];

  @action
    toggleTeam(val) {
      this.toggledTeam = val
    }

    toggleTag(val) {
      this.toggledTag = val
    }

    toggleDraftContent(val) {
      this.draftContent = val
    }


  
  
}

export const DataEntryStore = new Store();
