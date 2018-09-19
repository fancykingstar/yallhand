import React from "react";
import "./style.css";
import { List, Button, Icon } from "semantic-ui-react";
import { attached } from "./TempObjects";

export class AttachedList extends React.Component {
  render() {
    const attachedList = attached.map(attach => (
      <List.Item>
        <List.Icon name="file" size="large"/>
        <List.Content floated="right" verticalAlign='middle'>
  
            <Icon name="minus circle" />
 
        </List.Content>
        <List.Content>
          <List.Header as="a">{attach.label}</List.Header>
          <List.Description as="a">{attach.date}</List.Description>
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
