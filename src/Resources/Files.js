import React from "react";
import {inject, observer} from "mobx-react"
import {S3Download} from "../DataExchange/S3Download"
import { FileTypeIcons } from "../SharedUI/FileTypeIcons"
import { AddButton } from "../SharedUI/AddButton"
import { Icon, Table, Header, Button, Item } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import { UploadFile } from "../SharedUI/UploadFile";
import { AssociationSummary } from "../SharedUI/AssociationSummary"
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import { giveMeKey } from "../SharedCalculations/GiveMeKey"
import { fileResource, fileResourceEdit } from "../DataExchange/PayloadBuilder"
import { createFile, modifyFile, deleteFileresource } from "../DataExchange/Up";
import "./style.css";

@inject("ResourcesStore", "UIStore", "DataEntryStore")
@observer
export class Files extends React.Component {
  constructor(props){
    super(props)
    const {UIStore, ResourcesStore} = this.props
    this.loadSearch = () => {
      console.log("reloaded search")
      UIStore.set("search",
      "searchFilesData",
      initSearchObj(
        ResourcesStore.fileResources,
        "resourceID"
      ) 
    );
    }
  }
  componentDidMount() {
    const { UIStore } = this.props;
    if (UIStore.search.searchFilesData.length === 0) {
     this.loadSearch()
    }
  }
  render() {
  const {ResourcesStore, UIStore, DataEntryStore, AccountStore} = this.props

  const edit = (data) => {
    DataEntryStore.set("fileForUpload", "isNew", false)
    DataEntryStore.set("fileForUpload", "resourceID", data.resourceID)
    DataEntryStore.set("fileForUpload", "type", data.type)
    DataEntryStore.set("fileForUpload", "url", data.url)
    DataEntryStore.set("fileForUpload", "label", data.label)
    DataEntryStore.set("fileForUpload", "teamID", data.teamID)
    DataEntryStore.set("fileForUpload", "tagID", data.tags.length === 0 ? "none" : data.tags[0])
    DataEntryStore.set("fileForUpload", "associations", data.associations)
    UIStore.set("modal", "uploadAssocEdit", true)
    UIStore.set("modal", "uploadFile", true)
  }

  const handleAddButton = () => {
    DataEntryStore.reset("fileForUpload", {"isNew": true, "teamID": "global", "tagID": "none", "associations": {"policies": [], "announcements": []}})
    UIStore.set("modal", "uploadAssocEdit", true)
    UIStore.set("modal", "uploadFile", true)
  }


  const close = () => {
    UIStore.set("modal", "uploadFile", false)
    UIStore.set("modal", "uploadAssocEdit", false)
  }

  const getIcon = (filetype) => FileTypeIcons[filetype] === undefined? FileTypeIcons["default"] : FileTypeIcons[filetype]  
 
  
  const addFile = async (val) => {
    const newFile = await createFile(fileResource()).then((res) => res.json())
    await ResourcesStore.loadFiles([...ResourcesStore.fileResources, ...[newFile]])
    this.loadSearch()
  }

  const updateFile = async (val) => {
    const updatedFile = await modifyFile(fileResourceEdit())
    await ResourcesStore.loadFiles([...ResourcesStore.fileResources.filter(i => i.resourceID !== updatedFile.resourceID), ...[updatedFile]])
    this.loadSearch()
 }
 const deleteFile =  async (val) => {
  await deleteFileresource(val)
  ///add S3 removal
  await ResourcesStore.loadFiles(ResourcesStore.fileResources.filter(i => i.resourceID !== val))
  this.loadSearch()

}

 const downloadFile = (S3Key, label) => {
    const ext = "." + S3Key.split(".")[1]
    S3Download("quadrance-files/gramercy", S3Key, label, ext)
 }


  const filteredDisplay = () => {
    if (UIStore.search.searchFiles !== "") {
      const results = stupidSearch(
        UIStore.search.searchFilesData,
        UIStore.search.searchFiles
      );
      return ResourcesStore.fileResources.filter(item => results.includes(item.resourceID));
    } else {
      return ResourcesStore.fileResources;
    }
  };


  const resfiles = filteredDisplay().map(resfile => (
      <Table.Row key={"files" + giveMeKey()}>
        <Table.Cell>
          <Icon color="blue" name={getIcon(resfile.url.slice(-3))} />
          <Item style={{cursor: "pointer"}} as="a" onClick={e => downloadFile(resfile.S3Key.split("gramercy/")[1], resfile.label)}>{resfile.label}</Item>
       
        </Table.Cell>
        <Table.Cell >{resfile.type}</Table.Cell>
        <Table.Cell >{UTCtoFriendly(resfile.updated)}</Table.Cell>
        <Table.Cell >
        <AssociationSummary data={resfile}/>
        </Table.Cell>
        <Table.Cell><Button basic onClick={() => edit(resfile)} key={resfile.label}>Edit</Button></Table.Cell>
        <Table.Cell>
          <Button basic negative onClick={e => deleteFile(resfile.resourceID)}>Delete</Button>
        </Table.Cell>
      </Table.Row>
    ));

    return (
 
      <div className="LinkTable">
           <Header
      style={{padding: 0, margin: 0}}
      as="h2"
      content="Manage Files"
      subheader="Manage files and control access across your teams"
    /><br/>

       <UploadFile
          open={UIStore.modal.uploadFile}
          close={e => close}
          selection={""}
          title="Upload and configure a new file"
          output={val => val === "create" ? addFile(val) : updateFile(val)}
          includeTeamTag={true}

        />
      <AddButton output={e => handleAddButton()}/>
        <Table basic="very">
          <Table.Header>
            <Table.Row>
            <Table.HeaderCell>Label</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell >Last Updated</Table.HeaderCell>
              <Table.HeaderCell>Currently Associated With</Table.HeaderCell>
              <Table.HeaderCell/>
              <Table.HeaderCell/>
            </Table.Row>
          </Table.Header>
    

          <Table.Body>{resfiles}</Table.Body>
        </Table>
       
      </div>
    );
  }
}