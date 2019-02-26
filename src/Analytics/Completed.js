import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header, Button, Checkbox} from "semantic-ui-react";

@inject("EmailStore")
@observer
export class Completed extends React.Component {
  render() {
    const {EmailStore} = this.props
    const outbounds = EmailStore.allCampaigns
        .filter(camp => camp.completed)
         .map(camp => 
      <Table.Row key={"camp" + giveMeKey()}>
      <Table.Cell>{EmailStore._getBundle(camp.bundleID).label}</Table.Cell>
      <Table.Cell>{camp.targetUsers.length > 0? "Target Users: " : "selected teams"}</Table.Cell>
      <Table.Cell>{UTCtoFriendly(camp.updated)}</Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell> 
      {/* <Button basic color='red'>Cancel</Button> */}
      </Table.Cell>
       </Table.Row>
    )

    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Outbound"
        />
          <Table padded="very" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Destination</Table.HeaderCell>
                <Table.HeaderCell>Sent</Table.HeaderCell>
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
