import React from "react";
import {inject, observer} from "mobx-react"
import {withRouter} from "react-router-dom"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header, Button, Segment, Icon } from "semantic-ui-react";
import { UIStore } from "../Stores/UIStore";
import {S3Download} from "../DataExchange/S3Download"
import { clearNotification } from "../DataExchange/Up";
import { reviewAlertCheck } from "../SharedCalculations/ReviewAlertCheck";


@inject("AccountStore")
@observer
class Notifications extends React.Component {

  render() {
      const {AccountStore} = this.props

      const cancel = (obj) => {
        clearNotification(obj).then(() => AccountStore.loadReviewQueue(reviewAlertCheck()))
      }

      const downloadFile = (S3Key, label) => {
        const ext = "." + S3Key.split(".")[1]
        S3Download("quadrance-files/gramercy", S3Key, label, ext)
     }

      const pushToLocation = (obj) => {
        const keys = {"Policy": "/panel/faqs/manage-policy/", "Announcement": "/panel/announcements/manage-announcement/", "File": "/panel/resources", "URL": "/panel/resources"}
        obj.type === "Policy" || obj.type === "Announcement"? obj.type === "Policy"? this.props.history.push(keys[obj.type] + obj.policyID) : this.props.history.push(keys[obj.type] + obj.announcementID) : null
        obj.type === "File" || obj.type === "URL"? obj.type === "File"? downloadFile(obj.S3Key.split("gramercy/")[1], obj.label) : window.open(obj.prefix + obj.url)  : null
        }



      const reviewQueue = AccountStore.reviewQueue.map(i =>   <Table.Row key={"notif" + giveMeKey()}>
        <Table.Cell>{i.type} Review Alert</Table.Cell>
        <Table.Cell>{i.label}</Table.Cell>
        <Table.Cell>~ {Math.round(i.daysExpired)} days</Table.Cell>
        <Table.Cell> 
        <Button basic color="black" onClick={e => pushToLocation(i)}>View</Button>
        <Button basic icon='remove' color='red' onClick={e => cancel(i)}/>
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
export default withRouter(Notifications)