import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import {S3Download} from "../DataExchange/S3Download"
import { FileTypeIcons } from "../SharedUI/FileTypeIcons"
import { AddButton } from "../SharedUI/AddButton"
import { Icon, Table, Header, Button, Item } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import { UploadFile } from "../SharedUI/UploadFile";
import { AssociationSummary } from "../SharedUI/AssociationSummary"
import {
  initSearchObj,
  stupidSearch
} from "../SharedCalculations/StupidSearch";
import { ConfirmDelete } from "../SharedUI/ConfirmDelete";
import { giveMeKey } from "../SharedCalculations/GiveMeKey"
import { fileResource, fileResourceEdit } from "../DataExchange/PayloadBuilder"
import { createFile, modifyFile, deleteFileresource } from "../DataExchange/Up";

@inject("ResourcesStore", "UIStore", "DataEntryStore")
@observer
export class PortalResources extends React.Component {
//   componentDidMount() {
//     const { UIStore } = this.props;
//     const { ResourcesStore } = this.props;
//     if (UIStore.search.searchFilesData.length === 0) {
//       UIStore.set("search",
//         "searchFilesData",
//         initSearchObj(
//           ResourcesStore.fileResources,
//           "resourceID"
//         ) 
//       );
//     }
//   }
  render() {
  const {ResourcesStore} = this.props
  const {UIStore} = this.props
  const {DataEntryStore} =this.props

  const getIcon = (filetype) => {return FileTypeIcons[filetype] }

  
 const downloadFile = (S3Key, label) => {
    const ext = "." + S3Key.split(".")[1]
    S3Download("quadrance-files/gramercy", S3Key, label, ext)
 }

//   const filteredDisplay = () => {
//     if (UIStore.search.searchFiles !== "") {
//       const results = stupidSearch(
//         UIStore.search.searchFilesData,
//         UIStore.search.searchFiles
//       );
//       return ResourcesStore.fileResources.filter(item => results.includes(item.resourceID));
//     } else {
//       return ResourcesStore.fileResources;
//     }
//   };
  const allResources = [...ResourcesStore.fileResources, ...ResourcesStore.urlResources]


  const resources = allResources.map(resource => (
      <Table.Row key={"portalResources" + giveMeKey()}>
        <Table.Cell>{resource.type !== undefined? <p style={{cursor: "pointer", color: "#1D7E9D"}} as="a" onClick={e => downloadFile(resource.S3Key.split("gramercy/")[1], resource.label)}>{resource.label}</p> : <a href={resource.prefix + resource.url} target="_blank">{resource.label}</a>}</Table.Cell>       
            <Table.Cell>
            {resource.type !== undefined? <span>File <Icon name="file outline"/></span> :  <span>URL <Icon name="linkify"/></span>}
            </Table.Cell> 
        <Table.Cell >{UTCtoFriendly(resource.updated)}</Table.Cell>
      </Table.Row>
    ));

    return (
 
      <div className="LinkTable">
           
        <Table basic="very">
          <Table.Header>
            <Table.Row>
            <Table.HeaderCell>Label</Table.HeaderCell>
            <Table.HeaderCell >Type</Table.HeaderCell>
              <Table.HeaderCell >Last Updated</Table.HeaderCell>
              <Table.HeaderCell ></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
    

          <Table.Body>{resources}</Table.Body>
        </Table>
       
      </div>
    );
  }
}