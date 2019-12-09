import { observable, action, computed } from "mobx";

class Store {
  @observable
  fileResources = [];


  @action
  loadFiles(allFiles) {
    return new Promise((resolve, reject) => {
    this.fileResources = allFiles
    resolve(true)
}) 
  };



  _getFile(ID) {
    return Object.assign({}, this.fileResources.filter(file => file.resourceID === ID)[0])
  }

   matchedResources(resource_type, source_type, ID, variID) {
    const resources = {"file": this.fileResources, "url": this.urlResources}
    const assocLabels = {"policy": "policies", "announcement": "announcements"}
    const idNames = {"policy": "policyID", "announcement": "announcementID"}
    let matchedResources = []
    resources[resource_type].forEach(resource => {
      if(resource.associations[assocLabels[source_type]].length > 0) {
        const parent = resource.associations[assocLabels[source_type]].filter(item => item[idNames[source_type]] === ID)
        if(parent.length > 0) {
          parent.forEach(child => {if(child.variations.filter(vari => vari === variID).length > 0){
            matchedResources.push(resource)}
          })
        }  
      }
      

      })
      return matchedResources
      }

  @computed
  get _fileResourcesNoHidden() {
    return this.fileResources.filter(file => !file.hideFromFeed);
  }

  
}

export const ResourcesStore = new Store();
