import {PoliciesStore} from "../Stores/PoliciesStore"
import {AnnouncementsStore} from "../Stores/AnnouncementsStore"
import {AccountStore} from "../Stores/AccountStore"
import {ResourcesStore} from "../Stores/ResourcesStore"
import moment from "moment"

const process = (type, obj) => {
    // const duration = moment.duration(moment(new Date()).diff(moment(obj.update)))
    const duration = moment.duration(moment("20200101").diff(moment(obj.updated)))
    const alertThreshold = obj.reviewAlert !== AccountStore.account.reviewAlert? obj.reviewAlert : AccountStore.account.reviewAlert
    const daysExpired = duration.asDays() - alertThreshold
    return duration > alertThreshold * 30? {result: true, data: Object.assign({daysExpired, type}, obj)} : {result: false}
}

export const reviewAlertCheck = () => {
    let results = []
    
    PoliciesStore.allPolicies.filter(i => i.state !== "archived").forEach(i => {if(process("Policy", i).result){results.push(process("Policy", i).data)}})
    AnnouncementsStore.allAnnouncements.filter(i => i.state !== "archived").forEach(i => {if(process("Announcement", i).result){results.push(process("Announcement", i).data)}})
    ResourcesStore.urlResources.forEach(i => {if(process("URL", i).result){results.push(process("URL", i).data)}})
    ResourcesStore.fileResources.forEach(i => {if(process("File", i).result){results.push(process("File", i).data)}})
    
    return results
}