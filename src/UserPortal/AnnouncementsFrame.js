import React from "react";
import "./style.css";

import { inject, observer } from "mobx-react";
import { Item, Header, Container, Divider } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { withRouter } from "react-router-dom";
import { UIStore } from "../Stores/UIStore";
import { SortNSearch } from "../SharedUI/SortNSearch"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { sortByUTC } from "../SharedCalculations/SortByUTC";
import { PortalContentNoResults } from "./PortalContentNoResults"

@inject("AnnouncementsStore", "UserStore")
@observer
class AnnouncementsFrame extends React.Component {
  render() {
    const { AnnouncementsStore } = this.props;
    const handleClick = val => {
      this.props.history.push("/portal/announcement/" + val);
    };
    const announcements =
      UIStore.sideNav.activeChannel === "All"
        ? AnnouncementsStore.allAnnouncements.slice()
        : AnnouncementsStore.allAnnouncements
            .slice()
            .filter(news => news.chanID === UIStore.sideNav.activeChannel);

    const displayFeed = sortByUTC(announcements, UIStore.dropdown.portalannouncementSort).map(news => (
      <React.Fragment key={"portalannouncement" + giveMeKey()}>
        <Item  onClick={e => handleClick(news.announcementID)} style={{paddingBottom: 15}}>
        {news.img !== ""?  <Item.Image style={{paddingRight: 20}} size="medium" src={news.img} /> : null }
        <Header
              as="h2"
              content={news.variations[0].label === ""? news.label : news.variations[0].label}
              subheader={UTCtoFriendly(news.updated)}
            />
      </Item>
      <Divider/>
      </React.Fragment>
    ));

    const displayContent = displayFeed.length > 0?  <Item.Group>{displayFeed}</Item.Group> : <PortalContentNoResults/>

    return (
      <div className="Announcements" style={{marginTop: -35, paddingRight: 15}}>
        <SortNSearch 
          dropdownValueChange={val => UIStore.set("dropdown", "portalannouncementSort", val)} 
          searchValueChange={val =>  UIStore.set("search", "searchPortalannouncementValue", val)} 
          searchValue={UIStore.search.searchPortalannouncementValue}
          />
      
        <div style={{paddingTop: 100}}/>
        {displayContent}
      </div>
    );
  }
}

export default withRouter(AnnouncementsFrame);
