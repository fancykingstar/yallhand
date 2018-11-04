import React from "react";
import "./style.css";
import { List, Icon } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {inject, observer} from "mobx-react"

@inject("ResourcesStore", "PoliciesStore")
@observer
export class AttachedList extends React.Component {
  render() {
    const {ResourcesStore} = this.props
    const {PoliciesStore} = this.props
    const currentFiles = ResourcesStore.fileResources.filter(resource => resource.variationID.includes(PoliciesStore.toggledVariation))
    const attachedList = currentFiles.map(attach => (
      <List.Item>
        <List.Icon name="file" size="large"/>
        <List.Content floated="right" verticalAlign='middle'>
  
            <Icon name="minus circle" />
 
        </List.Content>
        <List.Content>
          <List.Header as="a">{attach.label}</List.Header>
          <List.Description as="a">{UTCtoFriendly(attach.updated)}</List.Description>
        </List.Content>
      </List.Item>
    ));
    return (
      <div className="AttachedList">
        <List>
          {attachedList}
        </List>
      </div>
    );
  }
}
