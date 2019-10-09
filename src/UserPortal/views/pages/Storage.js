import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import {inject, observer} from "mobx-react"
import {S3Download} from "../../../DataExchange/S3Download"
import { FileTypeIcons } from "../../../SharedUI/FileTypeIcons"
import { AddButton } from "../../../SharedUI/AddButton"
import { Icon, Table, Header, Button, Item } from "semantic-ui-react";
import UTCtoFriendly from "../../../SharedCalculations/UTCtoFriendly"
import { UploadFile } from "../../../SharedUI/UploadFile";
import { AssociationSummary } from "../../../SharedUI/AssociationSummary"
import { initSearchObj, stupidSearch } from "../../../SharedCalculations/StupidSearch";
import { ConfirmDelete } from "../../../SharedUI/ConfirmDelete";
import { giveMeKey } from "../../../SharedCalculations/GiveMeKey"
import { downloadFilePortal } from "../../../DataExchange/DownloadFile"
import { fileResource, fileResourceEdit } from "../../../DataExchange/PayloadBuilder"
import { createFile, modifyFile, deleteFileresource } from "../../../DataExchange/Up";
import { log } from "../../../DataExchange/Up"
import { ItsLog } from "../../../DataExchange/PayloadBuilder"


@inject("ResourcesStore", "UIStore", "DataEntryStore")
@observer
class Storage extends React.Component {

    componentDidMount(){
        window.scrollTo(0, 0);
      }
    

   render() {
    const {ResourcesStore, UIStore, DataEntryStore} = this.props
  
    const getIcon = (filetype) => {return FileTypeIcons[filetype] }

    const allResources = [...ResourcesStore.fileResources, ...ResourcesStore.urlResources]


    const resources = allResources.map(resource => (
        <Table.Row key={"portalResources" + giveMeKey()}>
          <Table.Cell>{resource.type !== undefined? <p style={{cursor: "pointer", color: "#1D7E9D"}} as="a" onClick={e => downloadFilePortal(resource.S3Key.split("gramercy/")[1], resource.label, resource.resourceID)}>{resource.label}</p> : <a href={resource.prefix + resource.url} onClick={e => log(ItsLog(false, {"type": "url", "id": resource.resourceID, "variation": ""}))} target="_blank">{resource.label}</a>}</Table.Cell>       
              <Table.Cell>
              {resource.type !== undefined? <span>File <Icon name="file outline"/></span> :  <span>URL <Icon name="linkify"/></span>}
              </Table.Cell> 
          <Table.Cell >{UTCtoFriendly(resource.updated)}</Table.Cell>
        </Table.Row>
      ));
  
      return (
         <Layout pageTitle={"Storage"}>
            <div style={{paddingTop: 20}} className="container">
               <div className="page_container">
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
               </div>
            </div>
         </Layout>
      );
   }
}

export default Storage;
