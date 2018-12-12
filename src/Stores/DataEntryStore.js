import { observable, action } from "mobx";

class Store {
    @observable
    toggledTeam = {};
  
    @observable
    toggledTag = {};

    @observable
    draftContent = [];

    @observable
    searchField = ""

    @observable
    searchResults = []

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

    updateSearchField(val){
      this.searchField = val
    }

    updateSearchResults(val) {
      this.searchResults = val
    }

  
  
}

export const DataEntryStore = new Store();
