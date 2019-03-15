import {ResourcesStore} from "../../Stores/ResourcesStore"
import {DataEntryStore} from "../../Stores/DataEntryStore"
import {UIStore} from "../../Stores/UIStore"
import {addAssociation} from "../../SharedCalculations/AddAssociation"
import {removeAssociation} from "../../SharedCalculations/RemoveAssociation"
import {urlResource, urlResourceAssociate} from "../../DataExchange/PayloadBuilder"
import {createUrlResource, modifyUrlResource} from "../../DataExchange/Up"
import _ from "lodash";


const newUrlResource = (link, mode) => {
  const associations = mode === "policy"? 
    {"policies":[{"policyID": UIStore.content.policyID, "variations":[UIStore.content.variationID]}], "announcements": []} :
    {"announcements":[{"announcementID": UIStore.content.announcementID, "variations":[UIStore.content.variationID]}], "policies": []}
  const payload = urlResource({
    "associations": associations,
    "label": link._label,
    "url": link._url,
    "prefix": link._prefix,
    "teamID": "global",
    "tagID": "none"
  })
  createUrlResource(payload,false)
  
  const newRAWvals = Object.values(DataEntryStore.draftContentRAW.entityMap)
  newRAWvals
    .filter(obj => obj.type === "LINK")
    .filter(obj => obj.data._url === link._url)
    [0].data._resourceID = payload.resourceID
  let newRAW = Object.assign({}, DataEntryStore.draftContentRAW)
  newRAW.entityMap = newRAWvals
  DataEntryStore.setDraftRAW(newRAW)

}
  const updateAssoc = (resourceID, mode) => {
    const assoc = addAssociation(ResourcesStore._getUrl(resourceID).associations, mode, UIStore.content[mode + "ID"], UIStore.content.variationID)
    modifyUrlResource (urlResourceAssociate(resourceID, assoc), false)
  }
  const removeObsoleteUrls = (matched, current, mode) => {
    const orig = matched.map(item => item.resourceID)
    const curr = current.map(item => item._resourceID)
    orig.forEach(id => {
      if(!curr.includes("id")){
       const assoc = removeAssociation(ResourcesStore._getUrl(id).associations, mode, UIStore.content[mode + "ID"], UIStore.content.variationID)
       modifyUrlResource (urlResourceAssociate(id, assoc), false)
      }
    })
  }

export const validateURLs = (mode) => {
    const currentUrls = ResourcesStore.matchedResources("url", mode, UIStore.content[mode + "ID"], UIStore.content.variationID)
    const links = _.isEmpty(DataEntryStore.draftContentRAW.entityMap)? [] 
      : Object.values(DataEntryStore.draftContentRAW.entityMap)
        .filter(obj => obj.type === "LINK")
        .map(obj => obj.data)
    removeObsoleteUrls(currentUrls, links, mode)

    if(links.length > 0){
      links.forEach(link => {
        const newUrl = link._resourceID === "" 
        const newToVari = newUrl? false: currentUrls
          .filter(url => url.resourceID === link._resourceID)
          .length === 0
        if(newUrl){newUrlResource(link, mode)}
        else if(newToVari){updateAssoc(link._resourceID, mode)}
      })
      
        
    }  
  
  }

  // _label: "www.google.com"
  // _prefix: "https://"
  // _resourceID: "JS7O04BE"
  // _url: "www.google.com"