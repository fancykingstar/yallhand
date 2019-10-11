import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import { UserSettings } from "../../../Settings/UserSettings";



class Settings extends React.Component {
   render() {
      return (
         <Layout pageTitle={"Settings"}>
            <div style={{paddingTop: 20}} className="container">
               <div className="page_container">
                    <UserSettings/>
               </div>
            </div>
         </Layout>
      );
   }
}

export default Settings;
