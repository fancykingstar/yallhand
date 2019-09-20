import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { getContentObj } from "../SharedCalculations/GetContentObj"
import { Table, Header, Button, Segment, Icon } from "semantic-ui-react";
import { deleteSchedule } from "../DataExchange/Up";
import { scheduled } from "../DataExchange/Down";
 
@inject("ScheduleStore", "EmailStore", "UserStore", "AccountStore")
@observer
export class Scheduled extends React.Component {
  render() {
      const {ScheduleStore, EmailStore, AccountStore} = this.props

      const cancel = (id) => {
        deleteSchedule(id)
      }

      const displayTask = (task) => 
        ({"send campaign": `Send ${task.data.label} ${!task.userID? `to ${AccountStore._getUser(task.data.userID).displayName_full} (Email Automation)`:""}`,
          "onboard user": `Onboard ${AccountStore.allUsers.filter(i=>i.id === task.data.id)[0].email}`,
          "offboard user": `Offboard ${AccountStore._getUser(task.data.userID).displayName_full}`,
          "publish content": `Publish ${getContentObj(task.data).label}`,
          "unpublish content": `Unpublish ${getContentObj(task.data).label}`
      }[task.task])

      const scheduled = ScheduleStore.allScheduled.map(task =>   <Table.Row key={"sched" + giveMeKey()}>
        <Table.Cell>{UTCtoFriendly(task.when)}</Table.Cell>
        <Table.Cell>{displayTask(task)}</Table.Cell>
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
            <Table.HeaderCell>ETA</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>

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
