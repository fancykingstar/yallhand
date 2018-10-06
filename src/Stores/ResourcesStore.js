import { observable, action } from "mobx";

class Store {
  @observable
  fileResources = [];

  @observable
  urlResources = [];

  @action
  loadFiles() {
    const files = require("../MockData/FileResources.json");
    this.fileResources = files
  };

  loadUrls() {
    const urls = require("../MockData/UrlResources.json");
    this.urlResources = urls
  }
    

  
}

export const ResourcesStore = new Store();
