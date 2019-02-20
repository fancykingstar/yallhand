import {PoliciesStore} from "../Stores/PoliciesStore"
import {AnnouncementsStore} from "../Stores/AnnouncementsStore"

export const getContentObj = obj => {
    return Object.keys(obj)[0] === "policyID"
      ? PoliciesStore._getPolicy(Object.values(obj)[0])
      : AnnouncementsStore._getAnnouncement(Object.values(obj)[0]);
  };