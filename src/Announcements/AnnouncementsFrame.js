import React from "react";
import { inject, observer } from "mobx-react";
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import { Item, Header} from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { FeedItem } from "./FeedItem";
import { sortByUTC } from "../SharedCalculations/SortByUTC"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import CreateContent from "../SharedUI/ManageContent/CreateContent"
import { Sort } from "../SharedUI/Sort";
import { SearchBox } from "../SharedUI/SearchBox"
import { ContentFilter } from "../SharedUI/ContentFilter";
import "./style.css";


@inject("AnnouncementsStore", "AccountStore", "UIStore", "DataEntryStore")
@observer
class AnnouncementsFrame extends React.Component {
  componentDidMount() {
    const { AnnouncementsStore, UIStore } = this.props;
    window.scrollTo(0, 0);
    if (UIStore.search.searchAnnouncementsData.length === 0) {
        UIStore.set("search",
          "searchAnnouncementsData",
          initSearchObj(
            AnnouncementsStore.allAnnouncements,
            "announcementID"
          ) 
        );
      }
}
  render() {
    const { AnnouncementsStore,UIStore, DataEntryStore } = this.props;

    const handleClick = val => {
      UIStore.set("content", "announcementID", val)
      const announcement = Object.assign({}, AnnouncementsStore._getAnnouncement(val))
      UIStore.set("content", "variationID", AnnouncementsStore._toggleGlobalVariation(announcement.announcementID))
      DataEntryStore.set("contentmgmt", "label",  announcement.label)
      DataEntryStore.set("contentmgmt", "img",  announcement.img)
      DataEntryStore.set("contentmgmt", "bundle", "queue")
      DataEntryStore.set("contentmgmt", "keywords",  announcement.keywords)
      DataEntryStore.set("contentmgmt", "reviewAlert",  announcement.reviewAlert)
      this.props.history.push(
        "/panel/announcements/manage-announcement/" + UIStore.content.announcementID
      );
    };


    const filteredBySearch = () => {
      if (UIStore.search.searchAnnouncements !== "") {
        const results = stupidSearch(
          UIStore.search.searchAnnouncementsData,
          UIStore.search.searchAnnouncements
        );
        
        return AnnouncementsStore.allAnnouncements.filter(item => results.includes(item.announcementID));
      } else {
        return filteredByChannel
      }
    };

    const filteredByStatus = () => {
      let filtered = AnnouncementsStore.allAnnouncements.slice()
      filtered = UIStore.filter.anncFilterPublished? filtered : 
        filtered
        .filter(policy => !["ok", "partial", "notOk"].includes(policy.state))
      filtered = UIStore.filter.anncFilterDrafts? filtered : 
      filtered
        .filter(policy => policy.state !== "draft")
      filtered = UIStore.filter.anncFilterArchived? filtered : 
      filtered
      .filter(policy => policy.state !== "archived")
      return filtered
    } 

    const filteredByChannel =
      UIStore.sideNav.activeChannel === "All"
        ? filteredByStatus()
        : filteredByStatus().filter(
            announcement => announcement.chanID === UIStore.sideNav.activeChannel
          );
    const contentFeed = sortByUTC(filteredBySearch(), UIStore.dropdown.announcementSort)
      .map(announcement => (
      <FeedItem key={"announcement" + giveMeKey()} data={announcement} clicked={handleClick} />
    ));
    
    return (
      <div style={{ width: "auto", paddingRight: 15, paddingBottom: 30 }}>
        <Header as="h2"
        style={{padding: 0, margin: 0}}
        >
          Annoucements Feed
          <Header.Subheader>
            Post relevant content for news and other updates
          </Header.Subheader>
        </Header>
        <div style={{width: "100%", paddingTop: 10, paddingBottom: 10, display: "flex", flexWrap: "wrap"}}>
            <div style={{flex: 1, verticalAlign: "top", minWidth: 300, minHeight: 30, width: 120}}>  <Sort dropdownValueChange={val => UIStore.set("dropdown", "announcementSort", val)}/></div>
            <div style={{flex: 2, verticalAlign: "top", minWidth: 300, paddingTop: 0, paddingBottom: 5, minHeight: 30,}}> <ContentFilter mode="announcement" /> </div>
            <div style={{flex: 1, verticalAlign: "top", minWidth: 300, minHeight: 30, contentAlign: "right",}}> <SearchBox value={UIStore.search.searchAnnouncements} output={val => UIStore.set("search", "searchAnnouncements", val)} /></div>
        </div>
  
      
        
        <div style={UIStore.responsive.isMobile? {paddingTop: 100} : {paddingTop: 20}}>
        {/* <div style={{marginRight: 10}}>
        </div> */}
        <CreateContent mode="announcement"/>
        <Item.Group>{contentFeed}</Item.Group>
        </div>
        <div className="createPost" />
      </div>
    );
  }
}
export default withRouter(AnnouncementsFrame);
