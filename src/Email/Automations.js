import React from "react";
import { inject, observer } from "mobx-react";
import { Table, Header, Button, Checkbox } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { modifyCampaign } from "../DataExchange/Up"
import { emailCampaignEdit } from "../DataExchange/PayloadBuilder"
import { CampaignDetails } from "../SharedUI/CampaignDetails";


@inject("EmailStore")
@observer
export class Automations extends React.Component {
  render() {
    const { EmailStore } = this.props;

    const outbounds = EmailStore.allCampaigns
     .filter(camp => camp.isTriggered && !camp.completed)
      .map(camp => (
        <Table.Row key={"camp" + giveMeKey()}>
          <Table.Cell>{EmailStore._getCampaign(camp.campaignID).subject}</Table.Cell>
          <Table.Cell>{UTCtoFriendly(camp.updated)}</Table.Cell>
          <Table.Cell>{camp.suspended? "Paused":"Live"}</Table.Cell>
          <Table.Cell>
            {CampaignDetails(camp)} 
          </Table.Cell>
          <Table.Cell>
  
            <Button.Group>
              {camp.suspended? 
              <Button basic primary icon="play" onClick={e => modifyCampaign(emailCampaignEdit({"campaignID": camp.campaignID, "suspended": false}), false)}/>
              :
              <Button basic color="grey" icon="pause" onClick={e => modifyCampaign( emailCampaignEdit({"campaignID": camp.campaignID, "suspended": true}), false) }/>
            }
                
                <Button basic color="red" icon="circle remove" onClick={e => modifyCampaign(emailCampaignEdit({"campaignID": camp.campaignID, "completed": true}))}/>
            </Button.Group>
          </Table.Cell>
        </Table.Row>
      ));

    const displayAutomations = EmailStore.allCampaigns.filter(camp => camp.isTriggered && !camp.completed)?
 <Table padded="very" basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Email Subject</Table.HeaderCell>
              <Table.HeaderCell>Went Online On</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />

              <Table.HeaderCell />

              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>{outbounds}</Table.Body>
        </Table>:
            <h5 style={{ fontStyle: "italic" }}>
            No onboard/offboard automations are active
          </h5> 


    return (
      <div>
        <Header as="h2" content="Email Automations"
        style={{padding: 0, margin: 0}}
        />
      {displayAutomations}
      </div>
    );
  }
}
