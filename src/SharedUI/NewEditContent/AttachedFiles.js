import React from "react";

import { Icon, Header, List, Form } from "semantic-ui-react";
import UTCtoFriendly from "../../SharedCalculations/UTCtoFriendly"
import {inject, observer} from "mobx-react"
import { FilesSearch } from "../FilesSearch";
import { UploadFile } from "../../SharedUI/UploadFile";
import { fileResource, fileResourceEdit, fileResourceAssociate } from "../../DataExchange/PayloadBuilder"
import { createFile, modifyFile } from "../../DataExchange/Up";
import { addAssociation } from "../../SharedCalculations/AddAssociation"
import { removeAssociation } from "../../SharedCalculations/RemoveAssociation"
import {S3Download} from "../../DataExchange/S3Download"
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";


@inject("ResourcesStore", "UIStore", "DataEntryStore")
@observer
export class AttachedFiles extends React.Component {

  render() {
    const {ResourcesStore, UIStore, DataEntryStore} = this.props
  
    const handleAddButton = () => {
      DataEntryStore.reset("fileForUpload", {"isNew": true, "teamID": "global", "tagID": "none", "associations": {"policies": [], "announcements": []}})
      UIStore.set("modal", "uploadAssocEdit", false)
      UIStore.set("modal", "uploadFile", true)
    }

    const addFile = (val) => {
      const assoc = this.props.mode === "policy"? 
        {"announcements":[], "policies": [{"policyID": UIStore.content.policyID, "variations":[UIStore.content.variationID]}]}
        : {"policies":[], "announcements": [{"announcementID": UIStore.content.announcementID, "variations":[UIStore.content.variationID]}]}
      createFile(fileResource(assoc))
    }
  

   const close = () => {
    UIStore.set("modal", "uploadFile", false)
    UIStore.set("modal", "uploadAssocEdit", false)
  }


   const addFileToContent = (resourceID) => {
    const newAssoc = addAssociation(ResourcesStore._getFile(resourceID).associations, this.props.mode, UIStore.content[this.props.mode + "ID"], UIStore.content.variationID) 
    if(newAssoc !== null){modifyFile(fileResourceAssociate(resourceID, newAssoc), false)}
   }

   const removeFileFromContent = (resourceID) => {
     const newAssoc = removeAssociation(ResourcesStore._getFile(resourceID).associations, this.props.mode, UIStore.content[this.props.mode + "ID"], UIStore.content.variationID)
     modifyFile(fileResourceAssociate(resourceID, newAssoc), false)
    }

    const downloadFile = (S3Key, label) => {
      const ext = "." + S3Key.split(".")[1]
      S3Download("quadrance-files/gramercy", S3Key, label, ext)
   }


    const getFiles = () => ResourcesStore.matchedResources("file", this.props.mode, this.props.mode === "policy" ? UIStore.content.policyID : UIStore.content.announcementID, UIStore.content.variationID) 
    const currentFiles = DataEntryStore.content.isNew !== true ? getFiles() : []
    const attachedList = currentFiles.map(attach => (
      <List.Item key={"attachedResource" + giveMeKey()}>
        <List.Icon name="file" size="large"/>
        <List.Content floated="right" verticalAlign='middle'>
        </List.Content>
        <List.Content>
          <List.Header as="a" onClick={e => downloadFile(attach.S3Key.split("gramercy/")[1], attach.label)}>{attach.label}</List.Header>
          <List.Description as="a">{UTCtoFriendly(attach.updated)}</List.Description>
          <Icon name="remove" onClick={e => removeFileFromContent(attach.resourceID)}/>
        </List.Content>
      </List.Item>
    ));
    return (
      <div className="ResourceLinks">
        <Header as="h4">Attach Files</Header>
        <Form style={{paddingLeft: 10}}>
          <Form.Group>
          <FilesSearch output={val => addFileToContent(val.value)}/>
          <Form.Button onClick={e => handleAddButton()} style={{marginTop: 35, marginLeft: 15}}>Add New...</Form.Button>
          </Form.Group>
        </Form>
     
        <UploadFile
          open={UIStore.modal.uploadFile}
          close={e => close}
          selection={""}
          title="Upload and configure a new file"
          output={val => addFile(val)}
    
        />


        <List>
          {attachedList}
        </List>
     
      </div>
    );
  }
}
