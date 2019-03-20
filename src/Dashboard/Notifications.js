import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { getContentObj } from "../SharedCalculations/GetContentObj"
import { Table, Header, Button, Segment, Icon } from "semantic-ui-react";
import { deleteSchedule } from "../DataExchange/Up";


@inject("AccountStore")
@observer
export class Notifications extends React.Component {

  render() {
      const {AccountStore} = this.props

      const cancel = (id) => {
        // deleteSchedule(id)
      }



      const reviewQueue = AccountStore.reviewQueue.map(i =>   <Table.Row key={"notif" + giveMeKey()}>
        <Table.Cell>{i.type} Review Alert</Table.Cell>
        <Table.Cell>{i.label}</Table.Cell>
        <Table.Cell>~ {Math.round(i.daysExpired)} days</Table.Cell>
        <Table.Cell> 
        <Button basic color="black" onClick={e => cancel()}>View</Button>
        <Button basic color='red' onClick={e => cancel()}>Cancel</Button>
        </Table.Cell>
         </Table.Row>
      )
      const display = AccountStore.reviewQueue.length === 0 ? <h5 style={{ fontStyle: "italic" }}>No notifications.</h5> 
      :  
        <Table padded="very" basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Label</Table.HeaderCell>
            <Table.HeaderCell>Overdue</Table.HeaderCell>

            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {reviewQueue} 
        </Table.Body>
      </Table>
  
    return (
        <React.Fragment>
            <Segment>
        <Header as="h3"> <Icon name="bell" />Notifications</Header>
        {display}
        </Segment>
        </React.Fragment>
    );
  }
}
