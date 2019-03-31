import {validContent} from "../SharedCalculations/ValidContent"
import { TeamStore } from "../Stores/TeamStore"
import { EmailStore } from "../Stores/EmailStore";
import { AccountStore } from "../Stores/AccountStore";
import { PoliciesStore } from "../Stores/PoliciesStore"
import { AnnouncementsStore } from "../Stores/AnnouncementsStore"
import { EmailCampaignTemplate } from "../TemplateData/emailcampaign"
import _ from 'lodash'

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
    return allUsers
}


export const buildEmail = (campaignID) => {
    const payload = []
    const campaign = EmailStore._getCampaign(campaignID)
    const allContent = campaign.content
        .map(content => Object.keys(content)[0] === "policyID"?
        getContentData("policy", content.policyID) : getContentData("announcement", content.announcementID)
        )
        .filter(content => !_.isEmpty(content))
    const targetUsers = {"all": getUsersByTeamTag("global", "none"), "teams": getUsersByTeamTag(campaign.teamID, campaign.tags.length === 0? "none" : campaign.tags[0]), "users": campaign.targetUsers}[campaign.recipientType]
    targetUsers.forEach(user => {
        const userData = Object.assign({}, AccountStore._getUser(user.userID))
        const userTeamPath = TeamStore.previewValidPath(userData.teamID, "team")
        const userTagPath = userData.tags.length > 0? TeamStore.previewValidPath(userData.tags.length === 0? "none": userData.tags[0], "tag") : {0: "", 1: "", 2: "" }
        const userContentData = validContent(allContent, userTeamPath, userTagPath)
        const userContent = userContentData.map(content => ({
            type: content.announcementID === undefined? "policy" : "announcement",
            id: content[content.announcementID === undefined? "policyID":"announcementID"],
            label: content.variations[0].label === "" ? content.label : content.variations[0].label ,
            img: content.img,
            content: content.variations[0].contentHTML
        }))
        payload.push(
                    {
                        email: userData.email,
                        name: userData.displayName,
                        subject: campaign.subject,
                        content: EmailCampaignTemplate(campaign.bodyContentHTML, userContent, AccountStore.account, campaign.img)
                    }
        )
    })
    return payload
}
