import React from "react";
import {inject, observer} from "mobx-react"
import { withRouter } from "react-router-dom"
import {Item} from "semantic-ui-react"
import { stupidSearch } from "../../../SharedCalculations/StupidSearch";
import { downloadFilePortal } from "../../../DataExchange/DownloadFile"
import {PortalSearchLogo} from "../../../UserPortal-OLD/PortalSearchLogo"
import { giveMeKey } from "../../../SharedCalculations/GiveMeKey";
import { log } from "../../../DataExchange/Up"
import { ItsLog } from "../../../DataExchange/PayloadBuilder"
import Layout from '../../layouts/DefaultLayout';

@inject("UIStore", "AnnouncementsStore", "PoliciesStore", "ResourcesStore", "AccountStore", "TicketingStore")
@observer
class PortalSearchResults extends React.Component {
  componentDidMount(){
    window.scrollTo(0, 0);
  }
    render(){
    const {AnnouncementsStore, PoliciesStore, UIStore, ResourcesStore, AccountStore, TicketingStore} = this.props

    const filteredannouncement = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchAnnouncementsData, UIStore.search.portalSearchValue );
          return AnnouncementsStore.allAnnouncements.filter(item => results.includes(item.announcementID));
        } else {
          return []
        }
      };
    
      const filteredPolicy = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchPoliciesData, UIStore.search.portalSearchValue );
          return PoliciesStore.allPolicies.filter(item => results.includes(item.policyID));
        } else {
          return []
        }
      };

      const filteredFiles = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchFilesData, UIStore.search.portalSearchValue );
          return ResourcesStore.fileResources.filter(item => results.includes(item.resourceID));
        } else {
          return []
        }
      };

      const filteredActions = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchTicketsData, UIStore.search.portalSearchValue );
          return TicketingStore.allTickets.filter(item => results.includes(item.ticketID));
        } else {
          return []
        }
      };

    const filteredPeople = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchPeopleData, UIStore.search.portalSearchValue );
            return AccountStore.allUsers.filter(item => results.includes(item.userID));
          } else {
            return []
          }
        };
    


    const resourceResults = (resources) => 
            resources.map(resource =>
            <Item key={"searchres" + giveMeKey() }>
                <Item.Content>
                    <Item.Header>
                    {resource.type !== undefined? <p style={{cursor: "pointer", color: "#1D7E9D"}} as="a" onClick={e => downloadFilePortal(resource.S3Key.split("gramercy/")[1], resource.label, resource.resourceID)}>{resource.label}</p> 
                    : <a 
                    onClick={e => log(ItsLog(false, {"type": "url", "id": resource.resourceID, "variation": ""}))}
                    href={resource.prefix + resource.url} target="_blank">{resource.label}</a>}
                    </Item.Header>
                </Item.Content>
            </Item>
            )


    const isSearchResults = () =>
    <>
      {filteredannouncement().length}
      {filteredPolicy().length}
      {filteredFiles().length}
      {filteredPeople().length}
      {filteredActions().length}
    </>

    return(
      <Layout pageTitle={"Search Results"}>
      <div style={{ paddingTop: 20 }} className="container">
        <div className="page_container">

    {filteredannouncement().length + filteredPolicy().length + filteredFiles().length + filteredPeople().length + filteredActions().length !== 0? isSearchResults():  <PortalSearchLogo />}
    </div> </div>
      </Layout>
 
    )
}}

export default withRouter(PortalSearchResults)