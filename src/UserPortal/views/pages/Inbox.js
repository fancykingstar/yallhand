import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import Inbox from "../../../Inbox/Inbox";



class PortalInbox extends React.Component {
   render() {
      return (
         <Layout pageTitle={"Inbox"}>
            <div style={{paddingTop: 20}} className="container">
               <div className="page_container">
                    <Inbox hideHeading/>
               </div>
            </div>
         </Layout>
      );
   }
}

export default PortalInbox;
