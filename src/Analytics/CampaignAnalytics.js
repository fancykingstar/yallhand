import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header, Button, Checkbox} from "semantic-ui-react";

@inject("AccountStore")
@observer
export class CampaignAnalytics extends React.Component {
  render() {
    const {AccountStore} = this.props
    const outbounds = AccountStore.analyticData_campaigns
        // .filter(camp => camp.completed)
         .map(camp => 
      <Table.Row key={"camp" + giveMeKey()}>
      <Table.Cell>{camp.subject}</Table.Cell>
      <Table.Cell>{UTCtoFriendly(camp.sent)}</Table.Cell>
      <Table.Cell>{`${camp.total_views}/${camp.unique_views}`}</Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell>{Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)}%</Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell> 
      {/* <Button basic color='red'>Cancel</Button> */}
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
