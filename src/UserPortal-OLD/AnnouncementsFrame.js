import React from "react";
import { inject, observer } from "mobx-react";
import { Label, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { Sort } from "../SharedUI/Sort"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { sortByUTC } from "../SharedCalculations/SortByUTC";
import { PortalContentNoResults } from "./PortalContentNoResults"
import { HTMLtoString} from "../SharedCalculations/HtmlToString"
import { contentOverflow } from "../SharedCalculations/ContentOverflow";

import "./style.css";


@inject("AnnouncementsStore", "UserStore", "UIStore")
@observer
class AnnouncementsFrame extends React.Component {
  componentDidMount(){
    window.scrollTo(0, 0);
  }
  render() {
    const { AnnouncementsStore, UIStore } = this.props;

    const subIndexKey = {0: "100%", 1: "33.33333%", 2: "33.33333%", 3: "33.33333%", 4:"50%", 5:"50%", 6:"33.33333%", 7:"33.33333%", 8:"33.33333%", 9: "25%", 10:"25%", 11:"25%", 12:"25%"}

    const colorOptions = {0:"#FF0060", 1: "#3772FF", 2:"#44C6BA", 3:"#D655A0", 4:"#31AFD4", 5:"#FFEA4C", 6:"#457B9D",7: "#666A86", 8:"#2EC4B6",9:"#E3B5A4"}

    const allAnnc = (ary) => {
        let i = 0
        let subI = 0
        let anncs = []
        ary.forEach(news => {
            if(subI === 13) subI = 0;
            const r = ary.length - (i + 1)
            anncs.push( <div key={giveMeKey()} style={{flexBasis: UIStore.responsive.isMobile? "100%": subIndexKey[subI]}}>
              
          <div className="AnncWrapper" onClick={e => handleClick(news.announcementID)} key={"portalannouncement" + giveMeKey()} 
            style={{
              backgroundColor: colorOptions[String(news.variations[0].updated).slice(-1)], 
              color: news.img !== ""? "#000000":"#f9f9f9"
              }}>
            {news.img !== ""? <div className="AnncPortalalpha" style={{ backgroundImage: `url(${news.img !== ""? news.img:""})` }} /> : ""}
            <div className="AnncSingle">
            <div className={news.img !== ""? "AnncContentAlt":"AnncContent"}>
            <h1>{news.variations[0].label === ""? news.label : news.variations[0].label}</h1><br/>
           
            <p>{contentOverflow(HTMLtoString(news.variations[0].contentHTML), 140)}</p>
            <br/>
       
            </div>
     
            {UIStore.portal.viewedContent.includes(news.announcementID) === false? <Label as='a' size="mini" color='red'> Unread </Label> : null}
        </div>
              </div></div>)
            i++;
            subI++;
        })
        return anncs
    }



    const handleClick = val => {
      this.props.history.push("/portal/announcement/" + val);
    };
    const announcements =
      UIStore.sideNav.activeChannel === "All"
        ? AnnouncementsStore.allAnnouncements.slice()
        : AnnouncementsStore.allAnnouncements
            .slice()
            .filter(news => news.chanID === UIStore.sideNav.activeChannel);

    const displayFeed = allAnnc(sortByUTC(announcements, UIStore.dropdown.portalannouncementSort))

    const displayContent = displayFeed.length > 0? <React.Fragment><Sort
    dropdownValueChange={val => UIStore.set("dropdown", "portalannouncementSort", val)} 
    searchValueChange={val =>  UIStore.set("search", "searchPortalannouncementValue", val)} 
    searchValue={UIStore.search.searchPortalannouncementValue}
    /> <div className="AnncList"> {displayFeed}</div></React.Fragment> : <PortalContentNoResults/>

    return (
      <div > {displayContent} </div>
    );
  }
}

export default withRouter(AnnouncementsFrame);
