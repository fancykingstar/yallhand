import React from 'react';
import Layout from '../../layouts/DefaultLayout';

import { Row, Col, } from 'reactstrap';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TabPanel from "../components/TabPanel";
import ImageBox from '../components/ImageBox';
import Hierarchy from "../components/Hierarchy";
import StaffDetail from '../components/StaffDetail';
// import ContentListData from '../../data/directory.json';


import { AnnouncementsStore } from "../../../Stores/AnnouncementsStore";
import { PoliciesStore } from "../../../Stores/PoliciesStore";

class ContentList extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         width: 0, height: 0,
         StaffDetailsData: [],
         tabValue: 0,
         source: [],
         path: "",
         mode: "",
      }
   }

   handleChangeTab(e, newVal) {
      this.setState({ tabValue: newVal });
   }
   componentDidMount() {
      const path = this.props.match.url;
      this.setState({
         path,
         mode: path.includes("announcement") ? "announcement" : "policy",
         source: path.includes("announcement") ? AnnouncementsStore.allAnnouncements : PoliciesStore.allPolicies
      });

      document.body.classList.add('page_content_bg');
      document.body.classList.remove('page_content_white');
   }

   static getDerivedStateFromProps(props, state) {
      const path = props.match ? props.match.url : null
      if (path) return {
         path: props.match.url,
         mode: path.includes("announcement") ? "announcement" : "policy",
         source: path.includes("announcement") ? AnnouncementsStore.allAnnouncements : PoliciesStore.allPolicies
      }
      return null
   }



   render() {
      //   const { StaffDetailsData } = this.state;
      const { mode } = this.state;
      return (
         <Layout pageTitle={mode === "announcement" ? "Announcements" : "FAQs"}>
            <div className="container">
               <div className="page_container">
                  {/* <div className="staffDetailTab custom-tabs"> */}
                  <AppBar position="static">
                     {/* <Tabs indicatorColor="primary"
                           textColor="primary" value={this.state.tabValue} onChange={this.handleChangeTab.bind(this)} aria-label="simple tabs example">
                           <Tab label="All Staff" id='simple-tab-0' aria-controls='simple-tabpanel-0' />
                           <Tab label="Explore Hierarchy" id='simple-tab-1' aria-controls='simple-tabpanel-1' />
                        </Tabs> */}
                  </AppBar>
                  <TabPanel value={this.state.tabValue} index={0}>

                     {
                        this.state.source.map((item, index) => <div className=" all-staff-box" key={index}>
                           <ImageBox
                              url={`/portal/${mode === "announcement" ? "announcement" : "learn-detail"}/${item[mode === "announcement" ? "announcementID" : "policyID"]}`}
                              main_class={"auto-col"}
                              user_img={item.img}
                              title={item.label}
                              key={`post-list-key ${index}`} />
                        </div>
                        )}

                  </TabPanel>
                  {/* <TabPanel value={this.state.tabValue} index={1}>
                        <Hierarchy />
                     </TabPanel> */}
                  {/* </div> */}
               </div>
            </div>
         </Layout>
      );
   }
}

export default ContentList;
