import { observable, action, computed } from "mobx";
import {addCalculatedAttributes} from "../SharedCalculations/ContentCalculatedAttributes"
import _ from "lodash";

class Store {
  @observable allAnnouncements = [];
  @observable userAvailableAnnouncements = [];
  @observable selectedAnnouncementID = "";
  @observable selectedAnnouncementVariationID = "";

  @action
  loadAnnouncements(allAnnc) {
    return new Promise((resolve, reject) => {
    this.allAnnouncements = addCalculatedAttributes(allAnnc)
      resolve(true)
}) 
  };

  loadUserPortalAnnouncements(val) {
    this.userAvailableAnnouncements = val;
  }
  pushAnnouncements(val) {
    this.userAvailableAnnouncements.push(val);
    this.allAnnouncements.push(val);
  }
  _getAnnouncement(id){
    if(this.allAnnouncements.filter(annc => annc.announcementID === id).length > 0){
      return Object.assign({}, this.allAnnouncements.filter(annc => annc.announcementID === id)[0])
    }
    else{return {}}
  }
 
  _getVariation(ID, variationID){
    if(_.isEmpty(this._getAnnouncement(ID))){return {}}
    else if(this._getAnnouncement(ID).variations.filter(vari => vari.variationID === variationID).length > 0)
      {return Object.assign({}, this._getAnnouncement(ID).variations.filter(vari => vari.variationID === variationID)[0])}
    else{return {}}
  }

  _SearchVariation(variationID){
    if(!variationID) return {}
    let found = {}
    this.allAnnouncements.forEach(contentmgmt => {
      const vari = contentmgmt.variations.filter(vari => vari.variationID===variationID)
      if(vari.length) found = Object.assign({variations: vari}, contentmgmt);
    })
    return found;
  }

  _getAnnouncementIDfromVariation(variationID){
    const filtered = this.allAnnouncements
      .filter(annc => annc.variations
        .filter(vari => vari.variationID === variationID).length === 1)
    return filtered.length === 0? {} : filtered[0].announcementID
  }

  _toggleGlobalVariation(id) {
    const current = Object.assign({}, this._getAnnouncement(id))
    const globalPolicy = current.variations.filter(
      vari => vari.teamID === "global"
    );
    return globalPolicy.length === 0
      ? current.variations[0].variationID
      : globalPolicy[0].variationID
  }

  
  
}

export const AnnouncementsStore = new Store();