import React from "react";
import { inject, observer } from "mobx-react";
import { Table, Header, Button, Checkbox } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { modifyCampaign } from "../DataExchange/Up"
import { emailCampaignEdit } from "../DataExchange/PayloadBuilder"


@inject("EmailStore")
@observer
export class Automations extends React.Component {
  render() {
    const { EmailStore } = this.props;

    const outbounds = EmailStore.allCampaigns
      .filter(camp => camp.isTriggered && camp.completed === false)
      .map(camp => (
        <Table.Row key={"camp" + giveMeKey()}>
          <Table.Cell>{EmailStore._getBundle(camp.bundleID).label}</Table.Cell>
          <Table.Cell>{camp.isTriggered ? "live" : "error"}</Table.Cell>
          <Table.Cell>{UTCtoFriendly(camp.updated)}</Table.Cell>
          <Table.Cell>
            {camp.targetUsers.length > 0 ? "Target Users: " : "selected teams"}
          </Table.Cell>
          <Table.Cell />
          <Table.Cell />
          <Table.Cell>
            <Button basic color="red" 
            onClick={e => modifyCampaign(emailCampaignEdit({"campaignID": camp.campaignID, "completed": true}))}>
              Discontinue
            </Button>
          </Table.Cell>
        </Table.Row>
      ));

    return (
      <div className="Segment">
        <Header as="h2" content="Email Automations" />
        <Table padded="very" basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Bundles</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Online On</Table.HeaderCell>
              <Table.HeaderCell>Targets</Table.HeaderCell>
              <Table.HeaderCell />

              <Table.HeaderCell />

              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>{outbounds}</Table.Body>
        </Table>
      </div>
    );
  }
}
