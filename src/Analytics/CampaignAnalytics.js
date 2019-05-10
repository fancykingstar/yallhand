import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header, Button, Modal} from "semantic-ui-react";
import {getContentObj} from "../SharedCalculations/GetContentObj"

@inject("AccountStore", "EmailStore", "TeamStore", )
@observer
export class CampaignAnalytics extends React.Component {
  render() {
    const {AccountStore, EmailStore, TeamStore} = this.props
    const getCampaignRecipients = (id) => {
      const targets = EmailStore._getCampaign(id)
      if (targets.recipientType === "all") return "Everyone"
      else {
        return targets.recipientType === "users" ? targets.targetUsers.map(i => AccountStore._getUser(i) === undefined? "New User" : AccountStore._getUser(i).displayName_full).join(',')
        : `${TeamStore._getTeam(targets.teamID).label} ${targets.tags.length === 0? "No Tags" : TeamStore._getTag(targets.tags[0]).label}`
      }
    }
    const outbounds = AccountStore.analyticData_campaigns.map(camp => 
      <Table.Row disabled={!camp.completed} key={"camp" + giveMeKey()}>
      <Table.Cell>
          <Header>
            <Header.Content>
            {camp.subject}
            </Header.Content>
            </Header>
      </Table.Cell>
      <Table.Cell>{UTCtoFriendly(camp.sent)}</Table.Cell>
      <Table.Cell>{`${camp.total_views}/${camp.unique_views}`}</Table.Cell>
      <Table.Cell>{camp.open_rate}%</Table.Cell>
      <Table.Cell>{Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)}%</Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell> 
          <Modal trigger={ <Button basic>Details</Button>}>
          <Modal.Header>{camp.subject}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
            {EmailStore._getCampaign(camp.campaignID).img === ""? <div/> :
            <React.Fragment>
          <h4>Featured Image</h4>
          <div className="imgPreview"> <img alt="featured visual" src={camp.img} /></div>
          </React.Fragment>

          }
             <h4>Recipients</h4>
             <p>{getCampaignRecipients(camp.campaignID)}</p>
             <div style={EmailStore._getCampaign(camp.campaignID).draftContentHTML === ""? {display: "none"} : {paddingTop: 10, fontSize: "1em"}}>
                    <span dangerouslySetInnerHTML={{ __html: EmailStore._getCampaign(camp.campaignID).draftContentHTML }} />
                </div>
                <div style={EmailStore._getCampaign(camp.campaignID).content.length === 0? {display: "none"} : {paddingTop: 10}}>
                    <span style={{fontWeight: 800, fontSize: "1em"}}>Selected Content: {EmailStore._getCampaign(camp.campaignID).content.map(y => <a key={"template link" + giveMeKey()} href={y.policyID !== undefined? "panel/faqs/manage-policy/" + y.policyID :  "panel/announcements/manage-announcement/" + y.announcementID } target="_blank">{getContentObj(y).label}</a>)}</span>
                </div>
      
            </Modal.Description>
          </Modal.Content>
        </Modal>
       
        </Table.Cell>
              
       </Table.Row>
    )

    return (
      <div>
        <Header
          as="h2"
          content="Email Campaign Performance"
        />
          <Table padded="very" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Sent</Table.HeaderCell>
                <Table.HeaderCell>Views (All/Unique)</Table.HeaderCell>
                <Table.HeaderCell>Open Rate</Table.HeaderCell>
                <Table.HeaderCell>Click Rate</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
               
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
                {outbounds}
            </Table.Body>
          </Table>

   
       
      </div>
    );
  }
}
