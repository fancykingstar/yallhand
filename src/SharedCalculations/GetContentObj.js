import {PoliciesStore} from "../Stores/PoliciesStore"
import {AnnouncementsStore} from "../Stores/AnnouncementsStore"

///obj =  {policyID/announcementID: string}

export const getContentObj = (obj, vari = false) => {
    let content =  Object.keys(obj).includes("policyID")
      ? PoliciesStore._getPolicy(obj.policyID)
      : AnnouncementsStore._getAnnouncement(obj.announcementID);

    if (vari) {
      let variation = content.variations.filter(i => i.variationID === vari);
      content.variations = variation.length? variation : [content.variations[0]];
    }
    return content
  };

export const getGlobalVari = (obj) => {
  let content =  Object.keys(obj).includes("policyID") ? PoliciesStore._getPolicy(obj.policyID) : AnnouncementsStore._getAnnouncement(obj.announcementID);
  const globalVari =  content.variations.filter(v=>v.teamID === "global");
  if (globalVari.length) return globalVari[0].variationID;
  else return content.variations[0].variationID;
}