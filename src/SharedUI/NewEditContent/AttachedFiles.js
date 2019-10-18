import React from "react";

import { Icon, Header, Form } from "semantic-ui-react";
import UTCtoFriendly from "../../SharedCalculations/UTCtoFriendly"
import {inject, observer} from "mobx-react"
import { FilesSearch } from "../FilesSearch";
import { UploadFile } from "../../SharedUI/UploadFile";
import { fileResourceAssociate } from "../../DataExchange/PayloadBuilder"
import { modifyFile } from "../../DataExchange/Up";
import { addAssociation } from "../../SharedCalculations/AddAssociation"
import { removeAssociation } from "../../SharedCalculations/RemoveAssociation"
import {S3Download} from "../../DataExchange/S3Download"
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';



@inject("ResourcesStore", "UIStore", "DataEntryStore", "AccountStore")
@observer
export class AttachedFiles extends React.Component {

  render() {
    const {ResourcesStore, UIStore, DataEntryStore, AccountStore} = this.props
    const source = this.props.source? this.props.source : {mode: this.props.mode, contentID: UIStore.content[this.props.mode + "ID"], variID:UIStore.content.variationID}
  
    const handleAddButton = () => {
      DataEntryStore.reset("fileForUpload", {"isNew": true, "teamID": "global", "tagID": "none", "associations": {"policies": [], "announcements": []}})
      UIStore.set("modal", "uploadAssocEdit", false)
      UIStore.set("modal", "uploadFile", true)
    }
  

   const close = () => {
    UIStore.set("modal", "uploadFile", false)
    UIStore.set("modal", "uploadAssocEdit", false)
  }


   const addFileToContent = (resourceID) => {
    const newAssoc = addAssociation(ResourcesStore._getFile(resourceID).associations, source.mode, source.contentID, source.variID) 
    if(newAssoc !== null){modifyFile(fileResourceAssociate(resourceID, newAssoc), false)}
   }

   const removeFileFromContent = (resourceID) => {
     const newAssoc = removeAssociation(ResourcesStore._getFile(resourceID).associations, source.mode, source.contentID, source.variID)
     modifyFile(fileResourceAssociate(resourceID, newAssoc), false)
    }

    const downloadFile = (S3Key, label) => {
      const ext = "." + S3Key.split(".")[1]
      S3Download("quadrance-files/gramercy", S3Key, label, ext)
   }

   const getAssoc = () => source.mode === "policy"? 
   {"announcements":[], "policies": [{"policyID": source.contentID, "variations":[source.variID]}]}
   : {"policies":[], "announcements": [{"announcementID": source.contentID, "variations":[source.variID]}]}


    const getFiles = () => ResourcesStore.matchedResources("file", source.mode, source.contentID, source.variID) 
    const currentFiles = DataEntryStore.content.isNew !== true ? getFiles() : []
    const attachedList = currentFiles.map(attach => (
      <ListItem key={"attachedResource" + giveMeKey()}>
      <ListItemAvatar>
        <Avatar>
          <AttachFileRoundedIcon onClick={e => downloadFile(attach.S3Key.split("gramercy/")[1], attach.label)} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText  primary={<Typography type="body2" style={{ color: '#000000' }}>{attach.label}</Typography>} secondary={UTCtoFriendly(attach.updated)} onClick={e => downloadFile(attach.S3Key.split("gramercy/")[1], attach.label)} />
      <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="delete" onClick={e => removeFileFromContent(attach.resourceID)}>
        <DeleteIcon  />
      </IconButton>
    </ListItemSecondaryAction>
    </ListItem>
      



      // <List.Item key={"attachedResource" + giveMeKey()}>
      //   <List.Icon name="file" size="large"/>
      //   <List.Content floated="right" verticalAlign='middle'>
      //   </List.Content>
      //   <List.Content>
      //     <List.Header as="a" onClick={e => downloadFile(attach.S3Key.split("gramercy/")[1], attach.label)}>{attach.label}</List.Header>
      //     <List.Description as="a">{UTCtoFriendly(attach.updated)}</List.Description>
      //     <Icon name="remove" onClick={e => removeFileFromContent(attach.resourceID)}/>
      //   </List.Content>
      // </List.Item>
    ));
    return (
      <div style={{maxWidth: 400}} className="ResourceLinks">
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
          output={val => close()}
          assoc={getAssoc()}
    
        />


        <List>
          {attachedList}
        </List>
     
      </div>
    );
  }
}
