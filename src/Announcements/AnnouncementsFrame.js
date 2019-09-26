import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Image} from "semantic-ui-react";
import { withRouter } from "react-router-dom";

import MUIDataTable from "mui-datatables";
import "./style.css";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";


@inject("AnnouncementsStore", "AccountStore", "UIStore", "DataEntryStore", "ChannelStore")
@observer
class AnnouncementsFrame extends React.Component {
  render() {
    const { AnnouncementsStore,UIStore, DataEntryStore, ChannelStore } = this.props;

    const handleClick = val => {
      UIStore.set("content", "announcementID", val.announcementID)
      const announcement = Object.assign({}, val)
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

    // const filteredByChannel =
    //   UIStore.sideNav.activeChannel === "All"
    //     ? filteredByStatus()
    //     : filteredByStatus().filter(
    //         announcement => announcement.chanID === UIStore.sideNav.activeChannel
    //       );
    // const contentFeed = sortByUTC(filteredBySearch(), UIStore.dropdown.announcementSort)
    //   .map(announcement => (
    //   <FeedItem key={"announcement" + giveMeKey()} data={announcement} clicked={handleClick} />
    // ));

    
      
    const columns = ["","Title", "Last Updated", "Channel","State"];

    const data = AnnouncementsStore.allAnnouncements.map(annc => [<img style={{height: 75, width: 120, objectFit: annc.img? "cover":"contain" }} src={annc.img? annc.img : "https://yallhandsgeneral.s3.amazonaws.com/no-image-icon.png"} size="tiny"/>,annc.label, UTCtoFriendly(annc.updated), ChannelStore._getLabel(annc.chanID), annc.state])
    
    const options = {
      elevation: 1,
      selectableRows: "none",
      filter:true,
      filterType: 'dropdown',
      filterList: [["active"]],
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      download: false,
      onRowClick: (i, data) => handleClick(AnnouncementsStore.allAnnouncements[data.rowIndex])
    };
    
    return (
        <React.Fragment>
        <div>
        
        <Header as="h2"
        style={{padding: 0, margin: 0}}
        >
          Announcements Feed
          <Header.Subheader>
            Post relevant content for news and other updates
          </Header.Subheader>
        </Header>

          <div style={{ marginTop: 15 }}>
      <MUIDataTable
        // title={"Employee List"}
        data={data}
        columns={columns}
        options={options}
      />
  
    </div>
   
  </div>
  </React.Fragment>
    );
  }
}
export default withRouter(AnnouncementsFrame);
