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

export const CampaignDetails = (campaign) => 
<Modal trigger={ <Button basic>Details</Button>}>
<Modal.Header>{campaign.subject}</Modal.Header>
<Modal.Content>
  <Modal.Description>
  {campaign.img === "" ? 
    null :
    <React.Fragment>
      <h4>Featured Image</h4>
      <div className="imgPreview"> <img alt="featured visual" src={campaign.img} /></div>
    </React.Fragment>}
  <h4>Recipients</h4>
  <p>{getCampaignRecipients(campaign.campaignID)}</p>
  <h4>Content</h4>
    <div style={campaign.draftContentHTML === ""? {display: "none"} : {paddingTop: 5, fontSize: "1em"}}>
      <span dangerouslySetInnerHTML={{ __html: campaign.draftContentHTML }} />
    </div>
    <div style={campaign.content.length === 0? {display: "none"} : {paddingTop: 5}}>
      <span style={{fontWeight: 800, fontSize: "1em"}}>Selected Content: {campaign.content.map(y => <a key={"template link" + giveMeKey()} href={y.policyID !== undefined? "panel/faqs/manage-policy/" + y.policyID :  "panel/announcements/manage-announcement/" + y.announcementID } target="_blank">{getContentObj(y).label}</a>)}</span>
    </div>
  </Modal.Description>
</Modal.Content>
</Modal>