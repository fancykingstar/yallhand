import React from "react";
import "./style.css";

import { inject, observer } from "mobx-react";
import { Image, Header, Label } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { withRouter } from "react-router-dom";
import { UIStore } from "../Stores/UIStore";
import { Sort } from "../SharedUI/Sort"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { sortByUTC } from "../SharedCalculations/SortByUTC";
import { PortalContentNoResults } from "./PortalContentNoResults"
import { HTMLtoString} from "../SharedCalculations/HtmlToString"
import { contentOverflow } from "../SharedCalculations/ContentOverflow";

@inject("AnnouncementsStore", "UserStore", "UIStore")
@observer
class AnnouncementsFrame extends React.Component {
  componentDidMount(){
    window.scrollTo(0, 0);
  }
  render() {
    const { AnnouncementsStore, UIStore } = this.props;
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
      <div className="PortalAnnc" onClick={e => handleClick(news.announcementID)} key={"portalannouncement" + giveMeKey()}>
        {news.img !== ""?  <div style={{display: "inline-block"}}><Image style={{padding: 20}} size="medium" src={news.img} /> </div>: null }
        <div style={{display: "inline-block", verticalAlign: "top"}}>
        <div style={{display: "block"}}>

        <Header as="h2">
            {news.variations[0].label === ""? news.label : news.variations[0].label}
            <Header.Subheader>{UTCtoFriendly(news.updated)}</Header.Subheader>
            {UIStore.portal.viewedContent.includes(news.announcementID) === false? <Label as='a' size="mini" color='red'> Unread </Label> : null}
        </Header> 
        <span style={{paddingTop: 5}}>{contentOverflow(HTMLtoString(news.variations[0].contentHTML), 140)}</span>
        </div>
        </div>
      </div>
    ));

    const displayContent = displayFeed.length > 0? <React.Fragment> {displayFeed}</React.Fragment> : <PortalContentNoResults/>

    return (
      <div >
        <Sort
          dropdownValueChange={val => UIStore.set("dropdown", "portalannouncementSort", val)} 
          searchValueChange={val =>  UIStore.set("search", "searchPortalannouncementValue", val)} 
          searchValue={UIStore.search.searchPortalannouncementValue}
          />
      
        <div/>
        {displayContent}
      </div>
    );
  }
}

export default withRouter(AnnouncementsFrame);
