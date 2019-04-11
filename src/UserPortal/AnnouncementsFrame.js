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
      <div onClick={e => handleClick(news.announcementID)} style={{paddingBottom: 15}} style={{boxShadow: "0px 0px 2px 0px #ABACAB", margin: 10, padding: 10, borderRadius: 5, textAlign: "center"}} key={"portalannouncement" + giveMeKey()}>
        {/* <div style={{float: "left", width: 300, height: 300, backgroundColor: "red"}}></div> */}
        {news.img !== ""?  <div style={{display: "inline-block", width: 300, height: 225}}><Image style={{paddingRight: 20, paddingTop: 15}} size="medium" src={news.img} /> </div>: null }
        <div style={{height: 120,  display: "inline-block", verticalAlign: "top"}}>
        <div style={{display: "block", maxHeight: 100, minWidth: 300}}>

        <Header as="h2">
            {news.variations[0].label === ""? news.label : news.variations[0].label}
            <Header.Subheader>{UTCtoFriendly(news.updated)}</Header.Subheader>
            {UIStore.portal.viewedContent.includes(news.announcementID) === false? <Label as='a' size="mini" color='red'> Unread </Label> : null}
        </Header> 
        <span style={{minWidth: 300, paddingTop: 5}}>{HTMLtoString(news.variations[0].contentHTML).split(".")[0] + ".."}</span>
        </div>
        </div>
      </div>
    ));

    const displayContent = displayFeed.length > 0? <React.Fragment> {displayFeed}</React.Fragment> : <PortalContentNoResults/>

    return (
      <div 
      // style={{marginTop: -35, paddingRight: 15}}
      >
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
