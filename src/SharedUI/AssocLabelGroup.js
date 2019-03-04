import React from "react"
import { inject, observer } from "mobx-react";
import { Label, Icon } from "semantic-ui-react";


//labels for policies/announcements : "name (if team, if tag)"


//make key/values based on value above, return type, id
@inject("PoliciesStore", "AnnouncementsStore", "TeamStore")
@observer
export class AssocLabelGroup extends React.Component {
    render() {
        const {PoliciesStore} = this.props
        const {AnnouncementsStore} = this.props
        const {TeamStore} = this.props

        const labelKey = (type, data) => { 
            const idType = {"policy": "policyID", "announcement": "announcementID"}[type]
            let key = {}
            data.forEach(i => i.variations
                    .forEach(vari => 
                        {
                        const fullObj = type === "policy" ?  PoliciesStore._getPolicy(i[idType]) : AnnouncementsStore._getAnnouncement(i[idType])
                        const fullVari = type === "policy" ?  PoliciesStore._getVariation(i[idType], vari) : AnnouncementsStore._getVariation(i[idType], vari)
                        key[(`${fullObj.label} (${fullVari.teamID === "global" ? "Global" : TeamStore._getTeam(fullVari.teamID.label)} ${fullVari.tags.length === 0 ? "" : TeamStore._getTag(fullVari.tags[0].label)})`)] = {"type": type, [idType]: i[idType], "variationID": vari}
                    }
                        )
                        )
         return key
        }
        const policyKey = labelKey("policy", this.props.assoc.policies)
        const policyLabels = Object.keys(policyKey).map(item => <Label removeIcon='remove'>{item}<Icon onClick={e => this.props.remove(policyKey[item])} name="delete"/></Label>)
        const announcementKey = labelKey("announcement", this.props.assoc.announcements)
         const announcementLabels = Object.keys(announcementKey).map(item => <Label removeIcon='remove'>{item}<Icon onClick={e => this.props.remove(announcementKey[item])} name="delete"/></Label>)
        const labels = <Label.Group>{[...policyLabels, ...announcementLabels].sort()}</Label.Group>
        return(
            <div>{labels}</div>
        )
    }

  }