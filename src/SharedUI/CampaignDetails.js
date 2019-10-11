import React from "react"
import {Modal, Button} from "semantic-ui-react"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import {getContentObj} from "../SharedCalculations/GetContentObj"
import {EmailStore} from "../Stores/EmailStore"
import {AccountStore} from "../Stores/AccountStore"
import {TeamStore} from "../Stores/TeamStore"

const getCampaignRecipients = (id) => {
  const targets = EmailStore._getCampaign(id)
  if(!targets) return;
  if (targets.recipientType === "all") return "Everyone"
  else {
    return targets.recipientType === "users" ? targets.targetUsers.map(i => AccountStore._getUser(i) === undefined? "New User" : AccountStore._getUser(i).displayName_full).join(',')
    : `${TeamStore._getTeam(targets.teamID).label} ${targets.tags.length === 0? "No Tags" : TeamStore._getTag(targets.tags[0]).label}`
  }
}

const automationText = (campaign) => {
  const event = {"offboard": "start of user being offboarded", "firstLogin": "start of user being onboarded"}[campaign.event]
  const delay = (val) => val === 0? "": `${val} days after `
  return delay(campaign.delay) + event
}



export const CampaignDetails = (props) => 
!props.source? null :
<Modal closeIcon open={props.open} onClose={(e)=> props.onClose(e)}>
<Modal.Header>{props.source.subject}</Modal.Header>
<Modal.Content>
  <Modal.Description>
  {props.source.img === "" ? 
    null :
    <React.Fragment>
      <h4>Featured Image</h4>
      <div className="imgPreview"> <img alt="featured visual" src={props.source.img} /></div>
    </React.Fragment>}
    {!props.source.isTriggered?"":
    <React.Fragment>
    <h4>Automation Event</h4>
    <p>{automationText(props.source.eventTrigger)}</p>
    </React.Fragment>
  }
  <h4>Recipients</h4>
  <p>{getCampaignRecipients(props.source.campaignID)}</p>
  <h4>Content</h4>
    <div style={props.source.draftContentHTML === ""? {display: "none"} : {paddingTop: 5, fontSize: "1em"}}>
      <span dangerouslySetInnerHTML={{ __html: props.source.draftContentHTML }} />
    </div>
    <div style={props.source.content.length === 0? {display: "none"} : {paddingTop: 5}}>
      <span style={{fontWeight: 800, fontSize: "1em"}}>Selected Content: {props.source.content.map(y => <a key={"template link" + giveMeKey()} href={y.policyID !== undefined? "panel/faqs/manage-policy/" + y.policyID :  "panel/announcements/manage-announcement/" + y.announcementID } target="_blank">{getContentObj(y).label}</a>)}</span>
    </div>
  </Modal.Description>
</Modal.Content>
</Modal>