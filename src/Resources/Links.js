import React from "react";
import "./style.css";
import { Table, Header, Button, 
  // Confirm  
} from "semantic-ui-react";
import { AddButton } from "../SharedUI/AddButton";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import { UploadURL } from "../SharedUI/UploadURL";
import { AssociationSummary } from "../SharedUI/AssociationSummary"
import {
  initSearchObj,
  stupidSearch
} from "../SharedCalculations/StupidSearch";
// import _ from "lodash";
import { ConfirmDelete } from "../SharedUI/ConfirmDelete";
import { urlResource } from "../DataExchange/PayloadBuilder";
import { createUrlResource, modifyUrlResource, deleteUrlResource } from "../DataExchange/Up";
import { giveMeKey } from "../SharedCalculations/GiveMeKey"

@inject("ResourcesStore", "UIStore", "DataEntryStore")
@observer
export class Links extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    // const { TeamStore } = this.props;
    const { ResourcesStore } = this.props;
    if (UIStore.search.searchUrlsData.length === 0) {
      UIStore.set("search",
        "searchUrlsData",
        initSearchObj(
          ResourcesStore.urlResources,
          "resourceID"
        ) 
      );
    }
  }
  render() {
    const {ResourcesStore} =this.props
    const {UIStore} =this.props
    const {DataEntryStore} =this.props
    const edit = (data) => {
      console.log(data)
      DataEntryStore.set("urlForUpload", "isNew", false)
      DataEntryStore.set("urlForUpload", "resourceID", data.resourceID)
      DataEntryStore.set("urlForUpload", "url", data.url)
      DataEntryStore.set("urlForUpload", "label", data.label)
      DataEntryStore.set("urlForUpload", "prefix", data.prefix)
      DataEntryStore.set("urlForUpload", "teamID", data.teamID)
      DataEntryStore.set("urlForUpload", "tagID", data.tags.length === 0 ? "none" : data.tags[0])
      DataEntryStore.set("urlForUpload", "associations", data.associations)
      // DataEntryStore.set("urlForUpload", "uploadConfig", true)
      UIStore.set("modal", "uploadAssocEdit", true)
      UIStore.set("modal", "uploadURL", true)
    }

    const handleAddButton = () => {
      DataEntryStore.reset("urlForUpload", {"isNew": true, "teamID": "global", "tagID": "none", "prefix": "https://", "associations": {"policies": [], "announcements": []}})
      UIStore.set("modal", "uploadAssocEdit", true)
      UIStore.set("modal", "uploadURL", true)
    }
  

    const close = () => {
      UIStore.set("modal", "uploadURL", false)
      UIStore.set("modal", "uploadAssocEdit", false)
    }

    const addUrl = (val) => {
       createUrlResource(urlResource(val)).then(() => {
       DataEntryStore.reset("urlForUpload")
       UIStore.set("modal", "uploadURL", false)
       UIStore.set("modal", "uploadAssocEdit", false)
       })
  
    }

    const modifyUrl = (val) => {
      console.log("mod")
      modifyUrlResource(urlResource(val, val.resourceID))
    }

    const deleteUrl = (val) => {
      // console.log(val)
      deleteUrlResource(val)
    }


    const filteredDisplay = () => {
      if (UIStore.search.searchUrls !== "") {
        const results = stupidSearch(
          UIStore.search.searchUrlsData,
          UIStore.search.searchUrls
        );
        return ResourcesStore.urlResources.filter(item => results.includes(item.resourceID));
      } else {
        return ResourcesStore.urlResources;
      }
    };


    const resurls = filteredDisplay().map(resurl => (
      <Table.Row key={"links" + giveMeKey()}>
        <Table.Cell> {resurl.label}</Table.Cell>
        <Table.Cell>
          <a href={resurl.url} target="_blank">
            {resurl.url}
          </a>
        </Table.Cell>
        <Table.Cell>{UTCtoFriendly(resurl.updated)}</Table.Cell>
        <Table.Cell>
          <AssociationSummary data={resurl}/>
        </Table.Cell>
        <Table.Cell><Button basic onClick={() => edit(resurl)} key={resurl.label}>Edit</Button></Table.Cell>
        <Table.Cell>
          <ConfirmDelete basic confirm={e => deleteUrl(resurl.resourceID)}/>
        </Table.Cell>
      </Table.Row>
    ));
    return (
      <div className="LinkTable">
            <Header
          as="h2"
          content="Manage URLs"
          subheader="Manage hyperlinks to other websites and control access across your teams"
        />
         <UploadURL
          open={UIStore.modal.uploadURL}
          close={e => close}
          selection={""}
          title="Add and configure a new URL"
          onSubmit={val => val === "create" ? addUrl(DataEntryStore.urlForUpload) : modifyUrl(DataEntryStore.urlForUpload)}
          includeTeamTag={true}
          hideResource={true}

        />
        <AddButton output={e => handleAddButton()}/>
        <Table basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>URL</Table.HeaderCell>
              <Table.HeaderCell>Last Updated</Table.HeaderCell>
              <Table.HeaderCell>Currently Associated With</Table.HeaderCell>
              <Table.HeaderCell/>
              <Table.HeaderCell/>
            </Table.Row>
          </Table.Header>
          <Table.Body>{resurls}</Table.Body>
        </Table>
      </div>
    );}
}
