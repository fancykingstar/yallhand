import React from "react";
import { inject, observer } from "mobx-react";
import { Item, Button, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { FeedItem } from "./FeedItem";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import CreateContent from "../SharedUI/ManageContent/CreateContent"
import "./style.css";


@inject("AnnouncementsStore", "AccountStore", "UIStore", "DataEntryStore")
@observer
class AnnouncementsFrame extends React.Component {
  render() {
    const { AnnouncementsStore,UIStore, DataEntryStore } = this.props;

    const handleClick = val => {
      // AnnouncementsStore.toggleAnnouncementID(val);
      UIStore.set("content", "announcementID", val)
      const annc = Object.assign({}, AnnouncementsStore._getAnnouncement(val))
      UIStore.set("content", "variationID", AnnouncementsStore._toggleGlobalVariation(annc.announcementID))
      DataEntryStore.set("contentmgmt", "label",  annc.label)
      DataEntryStore.set("contentmgmt", "img",  annc.img)
      DataEntryStore.set("contentmgmt", "bundle", "queue")
      DataEntryStore.set("contentmgmt", "keywords",  annc.keywords)
      DataEntryStore.set("contentmgmt", "reviewAlert",  annc.reviewAlert)
      this.props.history.push(
        "/panel/announcements/manage-announcement/" + UIStore.content.announcementID
      );
    };
    const displayFilter =
      UIStore.sideNav.activeChannel === "All"
        ? AnnouncementsStore.allAnnouncements
        : AnnouncementsStore.allAnnouncements.filter(
            annc => annc.chanID === UIStore.sideNav.activeChannel
          );
    const contentFeed = displayFilter.map(annc => (
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
        <CreateContent mode="announcement"/>
        <Item.Group>{contentFeed}</Item.Group>
        <div className="createPost" />
      </div>
    );
  }
}
export default withRouter(AnnouncementsFrame);
