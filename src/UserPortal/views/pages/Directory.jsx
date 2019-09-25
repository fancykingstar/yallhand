import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import Grid from '@material-ui/core/Grid';

import { Row, Col, } from 'reactstrap';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TabPanel from "../components/TabPanel";
import StaffDetail from '../components/StaffDetail';

import DirectoryData from '../../data/directory.json';

class Directory extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         StaffDetailsData: [],
         tabValue: 0,
         boss: ["self"]
      }
      this.update_boss = this.update_boss.bind(this);
   }

   handleChangeTab(e, newVal) {
      this.setState({ tabValue: newVal });
   }
   componentDidMount() {
      this.setState({
         StaffDetailsData: DirectoryData,
      });

      document.body.classList.add('page_content_bg');
      document.body.classList.remove('page_content_white');
   }

   get_employee(boss) {
      var { StaffDetailsData } = this.state;
      boss = typeof boss !== 'undefined' ? boss : 'self';
      var returnData = StaffDetailsData.filter(item => item.boss === boss);
      return returnData;
   }

   check_employee_has_child(boss) {
      var { StaffDetailsData } = this.state;
      boss = typeof boss !== 'undefined' ? boss : 'self';
      var returnData = StaffDetailsData.filter(item => item.boss === boss);
      if (returnData.length > 0) {
         return true;
      } else {
         return false;
      }
   }

   update_boss(newIndex, newBoss) {
      if (newIndex !== 0 && newIndex <= 3) {
         var { boss } = this.state;
         boss[newIndex] = newBoss;
         this.setState({ boss });
         console.log(this.state.boss);
      }
   }

   render() {
      const { boss, StaffDetailsData } = this.state;
      return (
         <Layout pageTitle="Directory">
            <div className="container">
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
                           {
                              StaffDetailsData.map((e, i) => <Col className="all-staff-box" lg={4} md={6} sm={6} key={i}>
                                 <StaffDetail
                                    profile={e.img}
                                    name={e.displayName_full}
                                    designation={e.title}
                                    department={e.dept}
                                    location={e.location}
                                    contact={e.phone}
                                    socials={e.socials} />
                              </Col>)
                           }
                        </Row>
                     </TabPanel>
                     <TabPanel value={this.state.tabValue} index={1}>
                        <Grid className="hierarchy-wrap bg-white rounded-corners" container spacing={1}>
                           {boss.map((iboss, i) =>
                              <Grid key={i} className="hierarchy-group" item xs={12} sm={3}>
                                 {this.get_employee(iboss).map((e, j) =>
                                    <StaffDetail
                                       update_boss={this.update_boss}
                                       active={(boss[i + 1] === e.displayName_full)}
                                       boss={{ index: (i + 1), boss: e.displayName_full }}
                                       has_child={this.check_employee_has_child(e.displayName_full)}
                                       key={j}
                                       view="hierarchy"

                                       profile={e.img}
                                       name={e.displayName_full}
                                       designation={e.title}
                                       department={e.dept}
                                       location={e.location}
                                       contact={e.phone}
                                       socials={e.socials} />)}
                              </Grid>)}
                        </Grid>
                     </TabPanel>
                  </div>
               </div>
            </div>
         </Layout>
      );
   }
}

export default Directory;
