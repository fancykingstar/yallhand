import React from "react";
import "./style.css";
import { inject, observer } from "mobx-react";
import { Item, Header, Container, Divider } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { withRouter } from "react-router-dom";
import { UIStore } from "../Stores/UIStore";
import { SortNSearch } from "../SharedUI/SortNSearch"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";

@inject("AnnouncementsStore", "UserStore")
@observer
class AnnouncementsFrame extends React.Component {
  render() {
    const { AnnouncementsStore } = this.props;
    const handleClick = val => {
      this.props.history.push("/portal/announcement/" + val);
    };
    const anncs =
      UIStore.sideNav.activeChannel === "All"
        ? AnnouncementsStore.allAnnouncements.slice()
        : AnnouncementsStore.allAnnouncements
            .slice()
            .filter(news => news.chanID === UIStore.sideNav.activeChannel);

    const displayFeed = anncs.map(news => (
      <React.Fragment key={"portalAnnc" + giveMeKey()}>
        <Item  onClick={e => handleClick(news.announcementID)} style={{paddingBottom: 15}}>
        {news.img !== ""?  <Item.Image style={{paddingRight: 20}} size="medium" src={news.img} /> : null }
        <Header
              as="h2"
              content={news.label}
              subheader={UTCtoFriendly(news.updated)}
            />
      </Item>
      <Divider/>
      </React.Fragment>
    ));

    return (
      <div className="Announcements" style={{marginTop: -35, paddingRight: 15}}>
        <SortNSearch 
          dropdownValueChange={val => UIStore.set("dropdown", "portalAnncSort", val)} 
          searchValueChange={val =>  UIStore.set("search", "searchPortalAnncValue", val)} 
          searchValue={UIStore.search.searchPortalAnncValue}
          />
        <Item.Group>{displayFeed}</Item.Group>
        <div style={{paddingTop: 100}}/>
      </div>
    );
  }
}

export default withRouter(AnnouncementsFrame);
