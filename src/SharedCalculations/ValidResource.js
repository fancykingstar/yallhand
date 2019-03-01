import {UserStore} from "../Stores/UserStore"
import {PoliciesStore } from "../Stores/PoliciesStore"
import {AnnouncementsStore} from "../Stores/AnnouncementsStore"

const validUserPath = (id, path) => {
    let response = {"status": false, "id" : ""}
    if(id === "All" || id === "global"){
        response.status = true
        response.id = id
        return response
    }
    else{
        let i = 0
        while(i < 3){
            if(path[i] === id){
                response.status = true
                response.id = id
            }
            i = i + 1
        }
        return response
    }
} 

const checkValid = (res) => {
    if([...res.associations.policies, ...res.associations.announcements].length === 0){
        let teamValid = false
        let tagValid = false
        if(res.teamID === "global"){teamValid = true}
        else{
            teamValid = validUserPath(res.teamID, UserStore.previewTeamPath).status
        }
        if(res.tags.length === 0){tagValid = true}
        else{
            tagValid = validUserPath(res.tags[0], UserStore.previewTagPath).status
        }
        return teamValid && tagValid
    }
    else{
        let valid = false
        res.associations.policies.forEach(policy => {
            let polsmatched = PoliciesStore.allPolicies.filter(i => i.policyID === policy.policyID)
            if(polsmatched.length === 1 && policy.variations.includes(polsmatched[0].variations[0].variationID)){
                valid = true
            }
        })
        res.associations.announcements.forEach(announcement => {
            let anncsmatched = AnnouncementsStore.allAnnouncements.filter(i => i.anncID === announcement.anncID)
            if(anncsmatched.length === 1 && announcement.variations.includes(anncsmatched[0].variations[0].variationID)){
                valid = true
            }
        })
        return valid
    }
}

export const validResources = (allResources) => {
    return allResources.filter(res => 
        checkValid(res)
    )
}