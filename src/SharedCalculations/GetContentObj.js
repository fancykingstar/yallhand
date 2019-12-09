import {PoliciesStore} from "../Stores/PoliciesStore"
import {AnnouncementsStore} from "../Stores/AnnouncementsStore"

export const getContentObj = (obj, vari = false) => {
    let content =  Object.keys(obj).includes("policyID")
      ? PoliciesStore._getPolicy(obj.policyID)
      : AnnouncementsStore._getAnnouncement(obj.announcementID);

    if (vari) {
      let variation = content.variations.filter(i => i.variationID === obj.variationID);
      content.variations = variation;
    }
    return content
  };