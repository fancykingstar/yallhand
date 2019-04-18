import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { getContentObj } from "../SharedCalculations/GetContentObj"
import { Table, Header, Button, Segment, Icon } from "semantic-ui-react";
import { deleteSchedule } from "../DataExchange/Up";

@inject("ScheduleStore")
@observer
export class Scheduled extends React.Component {

  render() {
      const {ScheduleStore} = this.props

      const cancel = (id) => {
        deleteSchedule(id)
      }

      const scheduled = ScheduleStore.allScheduled.map(task =>   <Table.Row key={"sched" + giveMeKey()}>
        <Table.Cell>{UTCtoFriendly(task.when)}</Table.Cell>
        <Table.Cell>{task.task}</Table.Cell>
        <Table.Cell>{getContentObj(task.data).label}</Table.Cell>
        <Table.Cell> 
        <Button basic color='red' onClick={e => cancel(task.scheduleID)}>Cancel</Button>
        </Table.Cell>
         </Table.Row>
      )
      const display = ScheduleStore.allScheduled.length === 0 ? <div/> 
      :  
      <Segment>
        <Header as="h3"> <Icon name="hourglass two" />Scheduled</Header>
        <Table padded="very" basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Estimated Delivery</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
            <Table.HeaderCell>Additional Info</Table.HeaderCell>

            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {scheduled} 
        </Table.Body>
      </Table>
      </Segment>
  
    return ( <React.Fragment>  {display} </React.Fragment> );
  }
}
