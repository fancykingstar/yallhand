import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Button, Icon} from "semantic-ui-react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { LazyImg } from "../SharedUI/LazyImg"; 



import MUIDataTable from "mui-datatables";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import CustomToolbarSelect from "./CustomToolbarSelect";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import "./style.css";
import { cpus } from "os";

@inject("AnnouncementsStore", "AccountStore", "UIStore", "DataEntryStore", "ChannelStore")
@observer
class AnnouncementsFrame extends React.Component {
  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTable: {
        root: {
          backgroundColor: "#FF000"
        },
        paper: {
          boxShadow: "none",
          border: "2px solid #e3e8ee",
          borderRadius: 8
        }
      }}}
  );
  render() {
    const { AnnouncementsStore,UIStore, DataEntryStore, ChannelStore } = this.props;

    const MenuContainer = styled.div`
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    paddingbottom: 30px;
    @media (max-width: 580px) {
      justify-content: center;
      flex-direction: column;
    }
  `;

    const handleClick = (val) => {
      UIStore.set("content", "announcementID", val.announcementID)
      const announcement = Object.assign({}, val)
      UIStore.set("content", "variationID", AnnouncementsStore._toggleGlobalVariation(announcement.announcementID))
      DataEntryStore.set("contentmgmt", "label",  announcement.label)
      DataEntryStore.set("contentmgmt", "img",  announcement.img)
      DataEntryStore.set("contentmgmt", "bundle", "queue")
      DataEntryStore.set("contentmgmt", "keywords",  announcement.keywords)
      DataEntryStore.set("contentmgmt", "reviewAlert",  announcement.reviewAlert)
      this.props.history.push(
        `/panel/announcements/${UIStore.content.announcementID}`
        // "/panel/announcements/manage-announcement/" + UIStore.content.announcementID
      );
    };

    const createContent = () => {
      this.props.history.push(this.mode === "policy"? "/panel/faqs/policy-variation" :  `/panel/announcements/content/new`)
      // DataEntryStore.set("content", "contentRAW", null)
      // DataEntryStore.set("content", "isNew", true);
      // DataEntryStore.set("content", "stage", "draft");
      // UIStore.set("modal", "createContent", false);
      // UIStore.set("content", `announcementID`, generateID());
      // UIStore.set("content", "variationID", generateID());
      // this.mode === "policy"
      //   ? this.props.history.push(
      //       "/panel/faqs/policy-variation/" + UIStore.content.variationID
      //     )
      //   : this.props.history.push(
      //       "/panel/announcements/announcement-variation/" + UIStore.content.variationID
      //     );
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

    const data = AnnouncementsStore.allAnnouncements.map(annc => [
      <LazyImg style={{height: 75, width: 120, objectFit: annc.img? "cover":"contain" }}  alt="" height={75} width={120} img={annc.img} src={annc.img? annc.img : "https://yallhandsgeneral.s3.amazonaws.com/no-image-icon.png"} />
    ,annc.label, UTCtoFriendly(annc.updated), ChannelStore._getLabel(annc.chanID), annc.state === "ok"? "published" : annc.state])
    
    const options = {
      elevation: 1,
      selectableRows: "multiple",
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect data={AnnouncementsStore.allAnnouncements} selectedRows={selectedRows} handleClick={(e, v)=> console.log("from handleClick", e, v)} />
      ),
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
        <MenuContainer>
          <div style={{ textAlign: "center" }}>
            <Button color="blue" onClick={()=>createContent()}>
              {" "}
              <Icon name="plus" /> Create New...{" "}
            </Button>
          </div>
          
        </MenuContainer> 
          <div style={{ marginTop: 15 }}>
              <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            // title={"Employee List"}
            data={data}
            columns={columns}
            options={options}
          />
       </MuiThemeProvider>

      {/* <YHTable
      headers={["", "Title", "Last Updated", "Channel", "State"]}
      rows={data}
      /> */}


  
    </div>
   
  </div>
  </React.Fragment>
    );
  }
}
export default withRouter(AnnouncementsFrame);
