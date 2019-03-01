import React from "react";
import { inject, observer } from "mobx-react";
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import { Item, Button, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { FeedItem } from "./FeedItem";
import { sortByUTC } from "../SharedCalculations/SortByUTC"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import CreateContent from "../SharedUI/ManageContent/CreateContent"
import "./style.css";
import { SortNSearch } from "../SharedUI/SortNSearch";


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
            "anncID"
          ) 
        );
      }
}
  render() {
    const { AnnouncementsStore,UIStore, DataEntryStore } = this.props;

    const handleClick = val => {
      // AnnouncementsStore.toggleAnnouncementID(val);
      UIStore.set("content", "anncID", val)
      const annc = Object.assign({}, AnnouncementsStore._getAnnouncement(val))
      UIStore.set("content", "variationID", AnnouncementsStore._toggleGlobalVariation(annc.anncID))
      DataEntryStore.set("contentmgmt", "label",  annc.label)
      DataEntryStore.set("contentmgmt", "img",  annc.img)
      DataEntryStore.set("contentmgmt", "bundle", "queue")
      DataEntryStore.set("contentmgmt", "keywords",  annc.keywords)
      DataEntryStore.set("contentmgmt", "reviewAlert",  annc.reviewAlert)
      this.props.history.push(
        "/panel/announcements/manage-announcement/" + UIStore.content.anncID
      );
    };


    const filteredBySearch = () => {
      if (UIStore.search.searchAnnouncements !== "") {
        const results = stupidSearch(
          UIStore.search.searchAnnouncementsData,
          UIStore.search.searchAnnouncements
        );
        
        return AnnouncementsStore.allAnnouncements.filter(item => results.includes(item.anncID));
      } else {
        return filteredByChannel
      }
    };

    const filteredByChannel =
      UIStore.sideNav.activeChannel === "All"
        ? AnnouncementsStore.allAnnouncements
        : AnnouncementsStore.allAnnouncements.filter(
            annc => annc.chanID === UIStore.sideNav.activeChannel
          );
    const contentFeed = sortByUTC(filteredBySearch(), UIStore.dropdown.announcementSort).map(annc => (
      <FeedItem key={"annc" + giveMeKey()} data={annc} clicked={handleClick} />
    ));

    return (
      <div style={{ maxWidth: 800 }}>
        <Header as="h2" style={{ paddingBottom: 15 }}>
          Annoucements Feed
          <Header.Subheader>
            Post relevant content for news and other updates
          </Header.Subheader>
        </Header>
        <SortNSearch useSearch
        searchValue={UIStore.search.searchAnnouncements}
        searchValueChange={val => UIStore.set("search", "searchAnnouncements", val)}
        dropdownValueChange={val => UIStore.set("dropdown", "announcementSort", val)}
        />
        <div style={{paddingTop: 50}}>
        <CreateContent mode="announcement"/>
        <Item.Group>{contentFeed}</Item.Group>
        </div>
     
     
        <div className="createPost" />
      </div>
    );
  }
}
export default withRouter(AnnouncementsFrame);
