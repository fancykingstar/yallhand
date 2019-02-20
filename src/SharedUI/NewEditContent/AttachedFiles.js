import React from "react";
// import "./style.css";
import { Icon, 
  // Button, 
  List } from "semantic-ui-react";
import UTCtoFriendly from "../../SharedCalculations/UTCtoFriendly"
import {inject, observer} from "mobx-react"
// import {ResourcesSearch} from "../../Resources/Search"
// import {UploadFile} from "../../SharedUI/UploadFile"

@inject("ResourcesStore")
@observer
export class AttachedFiles extends React.Component {
  render() {
    const {ResourcesStore} = this.props
  
    const getFiles = () => ResourcesStore.matchedResources("file", this.props.mode, this.props.mode === "policy" ? this.props.currentObj.policyID : this.props.currentObj.announcementID, this.props.currentObjVariation.variationID) 
    const currentFiles = this.props.isNew !== true ? getFiles() : []
    const attachedList = currentFiles.map(attach => (
      <List.Item>
        <List.Icon name="file" size="large"/>
        <List.Content floated="right" verticalAlign='middle'>
        </List.Content>
        <List.Content>
          <List.Header as="a">{attach.label}</List.Header>
          <List.Description as="a">{UTCtoFriendly(attach.updated)}</List.Description>
          <Icon name="remove" />
        </List.Content>
      </List.Item>
    ));
    return (
      <div className="ResourceLinks">
      <span style={{ fontWeight: 800 }}>Search available resources</span>
          <div style={{display: "flex"}}>
          {/* <div style={{maxWidth: 400}}><ResourcesSearch/></div><div style={{alignSelf: "flex-end"}}><span style={{marginLeft: 15}}>
          <UploadFile objLabel={this.props.mode === "policy" ? this.props.currentObj.label : this.props.currentObj.label} mode={this.props.mode} objID={this.props.mode === "policy" ? this.props.currentObj.policyID : this.props.currentObj.announcementID} variID={this.props.currentObjVariation.variationID}/>  </span></div> */}
          </div>
          <div className="AttachedList">
        <List>
          {attachedList}
        </List>
      </div>
          <div />
      </div>
    );
  }
}
