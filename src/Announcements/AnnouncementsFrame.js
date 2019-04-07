import React from "react";
import { inject, observer } from "mobx-react";
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import { Item, Button, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { FeedItem } from "./FeedItem";
import { sortByUTC } from "../SharedCalculations/SortByUTC"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import CreateContent from "../SharedUI/ManageContent/CreateContent"
import { SortNSearch } from "../SharedUI/SortNSearch";
import { AnnouncementFilter } from "./AnnouncementFilter";
import "./style.css";


@inject("AnnouncementsStore", "AccountStore", "UIStore", "DataEntryStore")
@observer
class AnnouncementsFrame extends React.Component {
  componentDidMount() {
    const { AnnouncementsStore, UIStore } = this.props;
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
      // AnnouncementsStore.toggleAnnouncementID(val);
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
    const contentFeed = sortByUTC(filteredBySearch(), UIStore.dropdown.announcementSort).map(announcement => (
      <FeedItem key={"announcement" + giveMeKey()} data={announcement} clicked={handleClick} />
    ));

    return (
      <div style={{ width: "auto", paddingRight: 15, paddingBottom: 30 }}>
        <Header as="h2">
          Annoucements Feed
          <Header.Subheader>
            Post relevant content for news and other updates
          </Header.Subheader>
        </Header>
        <div style={{width: '100%', height: 50}}>
        <AnnouncementFilter />
        </div>
        
      
        <SortNSearch useSearch
        searchValue={UIStore.search.searchAnnouncements}
        searchValueChange={val => UIStore.set("search", "searchAnnouncements", val)}
        dropdownValueChange={val => UIStore.set("dropdown", "announcementSort", val)}
        />
        <div style={UIStore.responsive.isMobile? {paddingTop: 100} : {paddingTop: 50}}>
        <CreateContent mode="announcement"/>
        <Item.Group>{contentFeed}</Item.Group>
        </div>
        <div className="createPost" />
      </div>
    );
  }
}
export default withRouter(AnnouncementsFrame);
