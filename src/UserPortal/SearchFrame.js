import React from "react";
import {inject, observer} from "mobx-react"
import {withRouter} from "react-router-dom"
import { Input, Icon, Form} from "semantic-ui-react";
import { QLogo } from "../Assets/Graphics/QLogo"
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import "./style.css";


@inject("UIStore", "AnnouncementsStore", "PoliciesStore", "ResourcesStore", "AccountStore")
@observer
class SearchFrame extends React.Component {
  componentDidMount() {
    const { AnnouncementsStore, PoliciesStore, ResourcesStore, UIStore, AccountStore } = this.props;
    if (UIStore.search.searchAnnouncementsData.length === 0) {
      UIStore.set("search", "searchAnnouncementsData", initSearchObj( AnnouncementsStore.allAnnouncements, "announcementID" ) );
    }
    if (UIStore.search.searchPoliciesData.length === 0) {
        UIStore.set("search", "searchPoliciesData", initSearchObj( PoliciesStore.allPolicies, "policyID" ) );
      }
    if (UIStore.search.searchUrlsData.length === 0) {
      UIStore.set("search", "searchUrlsData", initSearchObj( ResourcesStore.urlResources, "resourceID" ) );
    }
    if (UIStore.search.searchFilesData.length === 0) {
      UIStore.set("search", "searchFilesData", initSearchObj( ResourcesStore.fileResources, "resourceID" ) );
    }
    if (UIStore.search.searchPeopleData.length === 0) {
      UIStore.set("search", "searchPeopleData", initSearchObj( AccountStore.allUsers, "userID" ) );
    }
  }
  render(){
  const {UIStore} = this.props

 



  return (
    // <div className="SearchFrame">
    //   <div className="SearchControls">

      <Form onSubmit={() => this.props.history.push("/portal/search")}>
      <Form.Input 
        value={UIStore.search.portalSearchValue}
        onChange={(e, val) => UIStore.set("search", "portalSearchValue", val.value)} 
        fluid icon 
        placeholder="Search...">
          <input  style={{background: "transparent", border: "none", color: "#FFFFFF"}} />
          <Icon style={{color:"#2dbffe"}} name="search" />
        </Form.Input>
      </Form>
   
    //   </div>
    //   <div className="LoginQuadrance">
    //   <p style={{fontSize: ".2em", opacity: "0.8", marginBottom: 0}}>powered by</p>
    //       <div style={{ float: "left", opacity: "0.5", marginTop: -4, paddingRight: 4 }}>
    //         {" "}
    //         <QLogo fill="#FFFFFF" style="" width="16px" height="20px" />{" "}
    //       </div>
    //       <div style={{ float: "right", lineHeight: "15px", fontSize: ".5em" }}> yallhands</div>
    //     </div>
  
    // </div>
  );
}}

export default withRouter(SearchFrame)