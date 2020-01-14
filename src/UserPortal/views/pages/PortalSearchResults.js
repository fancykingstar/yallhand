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

import ActionsSlider from '../components/ActionsSlider';
import ImageBox from '../components/ImageBox';
import { Container, Col, Row } from 'reactstrap';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import StaffDetail from '../components/StaffDetail';

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

    const resourceResults = (resources) => resources.map(resource =>
        <div 
           className="selectPdf"
           as="a"
           key={"contentresourse" + giveMeKey()}
           onClick={e => downloadFilePortal(resource.S3Key, resource.label)}
           style={{ marginRight: "40px" }}
         >
          <AttachFileIcon/> {resource.label}
         </div>
      )

    const contents = (content, mode) => content.map((item, index) => {
      return <div className=" all-staff-box" style={{ float: "none" }} key={`contentlisting${item[mode === "announcement" ? "announcementID" : "policyID"]}`}>
               <ImageBox
                  url={`/portal/${mode === "announcement" ? "announcement" : "learn-detail"}/${item[mode === "announcement" ? "announcementID" : "policyID"]}`}
                  main_class={"auto-col"}
                  overlayClass={"box-overlay-color-" + (index < 10? index : (index  % 10))}
                  user_img={item.img}
                  title={item.label}
                  key={`post-list-key ${item[mode === "announcement" ? "announcementID" : "policyID"]}`} />
            </div>
    })

    const contentAnnoucmentsorFaqs = (data, mode) =>
      <Container>
        <div className="section_title shadow">
           <h4>{ mode === "policy" ? "FAQs" : "Announcements"}</h4>
        </div>
        <div className="page_content shadow">
          <div className="" style={{ display: "flex", "flexWrap": "wrap" }}>
            {contents(data, mode)}
          </div>
        </div>
      </Container>

    const files = (data) =>
      <Container>
        <div className="section_title shadow">
           <h4>Files</h4>
        </div>
        <div className="page_content shadow">
          <div className="" style={{ display: "flex", "flexWrap": "wrap" }}>
            {resourceResults(data)}
          </div>
        </div>
      </Container>

    const socials = (user) => {
      let socials = {}
      if(user.profile.Twitter !== "" && user.profile.Twitter !== undefined) { socials = { ...socials, "github": `https://twitter.com/${user.profile.Twitter}` } }
      if(user.profile.Medium !== "" && user.profile.Medium !== undefined) { socials = { ...socials, "medium": `https://medium.com/@${user.profile.Medium}` } }
      if(user.profile.Github !== "" && user.profile.Github !== undefined) { socials = { ...socials, "twitter": `https://github.com/${user.profile.Twitter}` } }
      if(user.profile.LinkedIn !== "" && user.profile.LinkedIn !== undefined) { socials = { ...socials, "linkedin": `https://linkedin.com/${user.profile.LinkedIn}` } }
      return socials
    }
    const users = (allUsers) => allUsers.map((user, i) => {
       return (
          <Col className="all-staff-box" lg={4} md={6} sm={6} key={i}>
             <StaffDetail
                profile={user.img}
                name={user.displayName_full}
                designation={user.profile.Title}
                department={user.profile.Department}
                location={user.profile.Location}
                contact={user.profile["Phone or Extension"]}
                mobile={user.profile['Mobile']}
                dob={user.dob}
                email={user.email}
                socials={socials(user)}
                aboutme={user.profile["About Me"]}
                reportto={user.boss ? AccountStore._getDisplayName(user.boss) : false}
             />
          </Col>
       )
    })

    const isSearchResults = () =>
    <>
      { filteredannouncement().length ? contentAnnoucmentsorFaqs([...filteredannouncement()], "announcement") : null }
      { filteredPolicy().length ? contentAnnoucmentsorFaqs([...filteredPolicy()], "policy") : null }
      { filteredFiles().length ? <div className="PostDetailContent">{files([...filteredFiles()])}</div> : null }
      { filteredActions().length ? <ActionsSlider data={[...filteredActions()]} /> : null }
      { filteredPeople().length ? <Container><Row>{users([...filteredPeople()])}</Row></Container> : null }
    </>    

    return(
      <Layout pageTitle={"Search Results"}>
      <div className="page_content_bg">
        <div style={{ paddingTop: 20 }} className="container">
        <div className="page_container">

    {filteredannouncement().length + filteredPolicy().length + filteredFiles().length + filteredPeople().length + filteredActions().length !== 0? isSearchResults():  <PortalSearchLogo />}
    </div> </div></div>
      </Layout>
 
    )
}}

export default withRouter(PortalSearchResults)