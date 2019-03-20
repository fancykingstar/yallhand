import {PoliciesStore} from "../Stores/PoliciesStore"
import {AnnouncementsStore} from "../Stores/AnnouncementsStore"
import {AccountStore} from "../Stores/AccountStore"
import {ResourcesStore} from "../Stores/ResourcesStore"
import moment from "moment"
import _ from "lodash";

const process = (type, obj) => {
    const duration = moment.duration(moment(new Date()).diff(moment(obj.update)))
    const alertThreshold = obj.reviewAlert === AccountStore.account.reviewAlert? AccountStore.account.reviewAlert : obj.reviewAlert === undefined? AccountStore.account.reviewAlert : obj.reviewAlert  
    const daysExpired = duration.asDays() - alertThreshold
    return duration > alertThreshold * 30? {result: true, data: _.extend(obj, {daysExpired, type})} : {result: false}
}

export const reviewAlertCheck = () => {
    let results = []
    PoliciesStore.allPolicies.slice()
        .filter(i => i.state !== "archived")
        .forEach(i => {if(process("Policy", i).result){results.push(process("Policy", i).data)}})
    AnnouncementsStore.allAnnouncements.slice()
        .filter(i => i.state !== "archived")
        .forEach(i => {if(process("Announcement", i).result){results.push(process("Announcement", i).data)}})
    ResourcesStore.urlResources.slice()
        .filter(i => [...i.associations.policies, ...i.associations.announcements].length === 0)
        .forEach(i => {if(process("URL", i).result){results.push(process("URL", i).data)}})
    ResourcesStore.fileResources.slice()
        .filter(i => [...i.associations.policies, ...i.associations.announcements].length === 0)
        .forEach(i => {if(process("File", i).result){results.push(process("File", i).data)}})
    
    return results.sort((a,b) => (a.daysExpired > b.daysExpired)? -1 : 1)
}