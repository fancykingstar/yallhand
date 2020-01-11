import React from 'react';
import {inject, observer} from "mobx-react"
import Layout from '../UserPortal/layouts/DefaultLayout';
import { Form, Segment, Header } from "semantic-ui-react";
import { Row, Col, } from 'reactstrap';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TabPanel from "../UserPortal/views/components/TabPanel";
import Hierarchy from "../UserPortal/views/components/Hierarchy";
import StaffDetail from '../UserPortal/views/components/StaffDetail';

@inject("AccountStore")
@observer
export class Directory extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         width: 0, height: 0,
         tabValue: 0
      }
   }

   handleChangeTab(e, newVal) {
      this.setState({ tabValue: newVal });
   }
   componentDidMount() {
      document.body.classList.add('page_content_bg');
      document.body.classList.remove('page_content_white');
   }

   socials = (user) => {
      let socials = {}
      if(user.profile.Twitter !== "" && user.profile.Twitter !== undefined) { socials = { ...socials, "github": `https://twitter.com/${user.profile.Twitter}` } }
      if(user.profile.Medium !== "" && user.profile.Medium !== undefined) { socials = { ...socials, "medium": `https://medium.com/@${user.profile.Medium}` } }
      if(user.profile.Github !== "" && user.profile.Github !== undefined) { socials = { ...socials, "twitter": `https://github.com/${user.profile.Twitter}` } }
      if(user.profile.LinkedIn !== "" && user.profile.LinkedIn !== undefined) { socials = { ...socials, "linkedin": `https://linkedin.com/${user.profile.LinkedIn}` } }
      return socials
   }

   render() {
      const { AccountStore } = this.props;

      const allUsers = AccountStore._allActiveUsers || [];
      let users = allUsers.map((user, i) => {
         return (
            <Col className="all-staff-box" lg={4} md={6} sm={6} key={i}>
               <StaffDetail
                  profile={user.img}
                  name={user.displayName_full}
                  designation={user.profile.Title}
                  department={user.profile.Department}
                  location={user.profile.Location}
                  contact={user.profile["Phone or Extension"]}
                  mobile={user.profile['Mobile']}
                  dob={user.dob}
                  email={user.email}
                  socials={this.socials(user)}
                  aboutme={user.profile["About Me"]}
                  reportto={user.boss ? AccountStore._getDisplayName(user.boss) : false}
                  skills={user.profile.Skills}
               />
            </Col>
         )
      })
      return (
        <div className="Segment">
           <Header
              as="h2"
              content="Directory"
           />
           <div className="page_container">
              <div className="staffDetailTab custom-tabs">
                 <AppBar position="static">
                    <Tabs indicatorColor="primary"
                       textColor="primary" value={this.state.tabValue} onChange={this.handleChangeTab.bind(this)} aria-label="simple tabs example">
                       <Tab label="All Staff" id='simple-tab-0' aria-controls='simple-tabpanel-0' />
                       <Tab label="Explore Hierarchy" id='simple-tab-1' aria-controls='simple-tabpanel-1' />
                    </Tabs>
                 </AppBar>
                 <TabPanel value={this.state.tabValue} index={0}>
                    <Row>
                       {users}
                    </Row>
                 </TabPanel>
                 <TabPanel value={this.state.tabValue} index={1}>
                    <Hierarchy />
                 </TabPanel>
              </div>
           </div>
        </div>
      );
   }
}
