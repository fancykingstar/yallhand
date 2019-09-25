import React from 'react';
import Layout from '../../layouts/DefaultLayout';

import { Row, Col, } from 'reactstrap';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TabPanel from "../components/TabPanel";
import Hierarchy from "../components/Hierarchy";
import StaffDetail from '../components/StaffDetail';
import DirectoryData from '../../data/directory.json';

class Directory extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         width: 0, height: 0,
         StaffDetailsData: [],
         tabValue: 0
      }
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


   render() {
      const { StaffDetailsData } = this.state;
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
                        <Hierarchy />
                     </TabPanel>
                  </div>
               </div>
            </div>
         </Layout>
      );
   }
}

export default Directory;
