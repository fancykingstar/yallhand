import React from 'react';
import Layout from '../../layouts/DefaultLayout';

import {sortByUTC} from "../../../SharedCalculations/SortByUTC";
import { AppBar, } from '@material-ui/core';
import TabPanel from "../components/TabPanel";
import ImageBox from '../components/ImageBox';
import {EmptyPlaceholder} from "../components/EmptyPlaceholder";



import { AnnouncementsStore } from "../../../Stores/AnnouncementsStore";
import { PoliciesStore } from "../../../Stores/PoliciesStore";

class ContentList extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         width: 0, height: 0,
         tabValue: 0,
         source: [],
         path: "",
         mode: "",
      }
   }

   async updateFilter(e) {
      const path = this.props.match.url;
      // let source = await path.includes("announcement") ? AnnouncementsStore.allAnnouncements : PoliciesStore.allPolicies;
      if(e.sort) {
         const source = await sortByUTC(this.state.source, e.sort === "old"? "Oldest" : "Newest")
         await this.setState({source})
      }
      else if(e.channel){
         let source = await path.includes("announcement") ? AnnouncementsStore.allAnnouncements : PoliciesStore.allPolicies;
         source = e.channel === "All"? source : source.filter(content => content.chanID === e.channel); 
         await this.setState({source})
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
      const newMode = path.includes("announcement") ? "announcement" : "policy";
      if (path && newMode !== state.mode ) return {
         path: props.match.url,
         mode: path.includes("announcement") ? "announcement" : "policy",
         source: path.includes("announcement") ? AnnouncementsStore.allAnnouncements : PoliciesStore.allPolicies
      }
      return null
   }



   render() {
 
      const { mode } = this.state;
      return (
         <Layout updateFilter={this.updateFilter.bind(this)} pageTitle={mode === "announcement" ? "Announcements" : "FAQs"}>
            <div className="container">
               <div className="page_container">
             
                  <AppBar position="static">
                     
                  </AppBar>
                  <TabPanel value={this.state.tabValue} index={0}>
                     {
                        !this.state.source.length?  <EmptyPlaceholder type={mode === "policy"? "FAQ": mode} />  :
                        this.state.source.map((item, index) => <div className=" all-staff-box" key={`contentlisting${item[mode === "announcement" ? "announcementID" : "policyID"]}`}>
                           <ImageBox
                              url={`/portal/${mode === "announcement" ? "announcement" : "learn-detail"}/${item[mode === "announcement" ? "announcementID" : "policyID"]}`}
                              main_class={"auto-col"}
                              overlayClass={"box-overlay-color-" + (index < 10? index : (index  % 10))}
                              user_img={item.img}
                              title={item.label}
                              key={`post-list-key ${item[mode === "announcement" ? "announcementID" : "policyID"]}`} />
                        </div>
                        )}

                  </TabPanel>
                 
               </div>
            </div>
         </Layout>
      );
   }
}

export default ContentList;
