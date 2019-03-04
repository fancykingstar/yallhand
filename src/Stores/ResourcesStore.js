import { observable, action } from "mobx";

class Store {
  @observable
  fileResources = [];

  @observable
  urlResources = [];
 
  @action
  loadFiles(allFiles) {
    return new Promise((resolve, reject) => {
    this.fileResources = allFiles
    resolve(true)
}) 
  };

  loadUrls(allUrls) {
    return new Promise((resolve, reject) => {
    this.urlResources = allUrls
      resolve(true)
  }) 
  }; 

  _getFile(ID) {
    return Object.assign({}, this.fileResources.filter(file => file.resourceID === ID)[0])
  }

  _getUrl(ID) {
    return this.urlResources.filter(url => url.resourceID === ID)[0]
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
          // parent.forEach(child => console.log(variID, child.variations, child.variations.filter(vari => vari === variID)))
          parent.forEach(child => {if(child.variations.filter(vari => vari === variID).length > 0){
            matchedResources.push(resource)}
          })
        }  
      }
      

      })
      return matchedResources
      }

    
    // const parentMatch = (list, idtype, id) => {
    //   return list.filter(item => item[idtype] === id).length > 0 ? true : false;
    // }
    // const childMatch = (list, id) => {
    //   return list.filter(item => item === id)
    // }
    // const parents = parentMatch(resources[resource_type], idNames[source_type], ID)
    

  

  
}

export const ResourcesStore = new Store();
