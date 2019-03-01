import {validContent} from "../SharedCalculations/ValidContent"
import { TeamStore } from "../Stores/TeamStore"
import { EmailStore } from "../Stores/EmailStore";
import { AccountStore } from "../Stores/AccountStore";
import { PoliciesStore } from "../Stores/PoliciesStore"
import { AnnouncementsStore } from "../Stores/AnnouncementsStore"

const getContentData = (type, id) => {
    if(type === "policy"){
        return PoliciesStore._getPolicy(id)
    }
    else {
        return AnnouncementsStore._getAnnouncement(id)
    }
}

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

const getUsersByTeamTag = (teamID, tagID) => {
    let users = []
    const allUsers = AccountStore.allUsers.slice()
    allUsers.forEach(user => {
        const teamPath = TeamStore.previewValidPath(teamID, "team")
        const tagPath = TeamStore.previewValidPath(tagID, "tag")
        const validTeam = validUserPath(teamID, teamPath)
        const validTag = validUserPath(tagID, tagPath)
        validTeam.status && validTag.status? users.push(user.userID) : null
    })
    return users
}


export const buildEmail = (campaignID) => {
    const payload = []
    const campaign = EmailStore._getCampaign(campaignID)
    const bundle = EmailStore._getBundle(campaign.bundleID)
    const allContentIDs = EmailStore._getBundle(EmailStore._getCampaign(campaignID).bundleID).bundle
    const allContent = allContentIDs
        .map(content => Object.keys(content)[0] === "policyID"?
        getContentData("policy", content.policyID) : getContentData("announcement", content.anncID)
        )
    const targetUsers = campaign.targetUsers.length > 0? campaign.targetUsers : getUsersByTeamTag(campaign.teamID, campaign.tags[0])
    targetUsers.forEach(user => {
        const userData = Object.assign({}, AccountStore._getUser(user))
        const userTeamPath = TeamStore.previewValidPath(userData.teamID, "team")
        const userTagPath = userData.tags.length > 0? TeamStore.previewValidPath(userData.tags[0], "tag") : {0: "", 1: "", 2: "" }
        const userContentData = validContent(allContent, userTeamPath, userTagPath)
        const userContent = userContentData.map(content => ({
            label: content.variations[0].label === "" ? content.label : content.variations[0].label ,
            img: content.img,
            content: content.variations[0].contentHTML
        }))
        console.log(userContent)
        payload.push(
            {
                        email: userData.email,
                        name: userData.displayName,
                        subject: bundle.subject,
                        body: bundle.bodyContentHTML,
                        content: userContent,
                        companyName: AccountStore.account.label,
                        companyLogo: AccountStore.account.img
                    }
        )
    })
    console.log(payload)

    /////ALL USERS NEED TO HAVE A TEAMID populated

    
    // console.log(JSON.stringify(content))
}


//collect all content...sequenced
//gather all users
//create templates

//TeamStore.previewValidPath("team03", "team")
//{"0":"team01","1":"team07","2":"team03"}

//validContent(allItems, teamPath, tagPath)

//

// [
//     {
//         email,
//         name,
//         subject,
//         body,
//         content: [
//              {
//                  label,
//                  img, 
//                  content
//                 }
//         ],
//         companyName,
//         companyLogo
//     }
// ]