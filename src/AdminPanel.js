import React from "react";

import ManageContent from "./SharedUI/ManageContent/ManageContent"
import Header from "./Header/Header";
import { Responsive, Transition } from "semantic-ui-react"
import { inject, observer } from "mobx-react";
import { Switch, Route, Redirect } from "react-router-dom";
import { SideBar } from "./SideBar/SideBar";
import { CardFrame } from "./CardFrame/CardFrame";
import NewEditVariation from "./SharedUI/NewEditContent/NewEditVariation";
import {SurveyNewEdit} from "./Surveys/SurveyNewEdit";
import { TeamFrame } from "./Teams/TeamFrame";
import { ResourcesFrame } from "./Resources/ResourcesFrame";
import { SurveyFrame } from "./Surveys/SurveyFrame";
import AnnouncementsFrame from "./Announcements/AnnouncementsFrame";
import { BaseSettings } from "./Settings/BaseSettings";
import { UserSettings } from "./Settings/UserSettings";
import { EmailFrame } from "./Email/EmailFrame";
import  DashboardFrame  from "./Dashboard/DashboardFrame";
import { AnalyticsFrame } from "./Analytics/AnalyticsFrame"
import SuperAdminFrame from "./SuperAdmin/SuperAdminFrame"
import { EditAccounts } from "./SuperAdmin/EditAccounts"
import { CreateAccounts } from "./SuperAdmin/CreateAccounts"
import { EditUsers } from "./SuperAdmin/EditUsers"
import { CreateUsers } from "./SuperAdmin/CreateUsers"
import { Analytics } from "./SuperAdmin/Analytics"
import { loadAdmin } from "./DataExchange/LoadProfile";
import {syncAdminNav} from "./SharedCalculations/SyncAdminNav";

@inject( "UserStore", "UIStore", )
@observer
export class AdminPanel extends React.Component {
  componentDidMount() {
    const { UserStore, UIStore } = this.props;
    if (!UIStore._adminLoadingComplete) {
      UserStore.setPreviewTeam("")
      UserStore.setPreviewTag("")
      loadAdmin()
    }
  }
  componentDidUpdate() {
    syncAdminNav(this.props.location)
  }
  render() {
    const { UIStore, UserStore } = this.props;

    const mobileNavDisplay =  UIStore.responsive.mobileNav?
    <div className="SideBarContainerMobile">
      <div style={{float: "left"}} > 
      <SideBar mobile={true} />
       </div>
      <div style={{height: "100vh", width: "100vw"}} onClick={e => UIStore.set("responsive", "mobileNav", false)}/> 
    </div>
  : null

    const accountOptions = () => []

    const checkMobile = (width) => {
      if(width < 992){
        UIStore.set("responsive", "isMobile", true)
      }
      else{
          UIStore.set("responsive", "mobileNav", false)
          UIStore.set("responsive", "isMobile", false)
        }
    }

    const superAdminPath = UserStore.user !== null && UserStore.user.isSuperAdmin !== undefined && UserStore.user.isSuperAdmin === true? <Route path="/panel/superadmin" component={SuperAdminFrame} exact /> : null

    const loadingDisplay = !UIStore._adminLoadingComplete ? (
      <div />
    ) : (
      <React.Fragment>
      <Header />
      <div className="SideAndAction">
        <Responsive {...Responsive.onlyComputer} fireOnMount={true} onUpdate={(e, val) => checkMobile(val.getWidth())}>
        <SideBar />
        </Responsive>
        {/* <Transition visible={UIStore.responsive.mobileNav} animation='fade right' duration={500}>
          <div> 
          <div style={{float: "left"}}> <SideBar /> </div>
          <div style={{height: "100vh", width: "100vw"}} onClick={e => UIStore.set("responsive", "mobileNav", false)}/> 
        </div>
        </Transition> */}

     {mobileNavDisplay}

        <div id="ActionFrame" className="ActionFrame" style={UIStore.sideNav.activePrimary === "superadmin"? {  backgroundColor: "#151515", marginLeft: UIStore.responsive.isMobile? 0:230} : {marginLeft: UIStore.responsive.isMobile? 0:230}}>
          <Switch location={this.props.location}>
            <Route path="/panel/faqs" component={CardFrame} exact />
            <Route path="/panel/faqs/manage-policy/:id" component={ManageContent} exact />
            <Route path="/panel/faqs/policy-variation/:id" render={props => <NewEditVariation {...props} mode="policy" /> }/>
            <Route path="/panel/teams" component={TeamFrame} />
            <Route path="/panel/resources" component={ResourcesFrame} />
            <Route path="/panel/surveys" component={SurveyFrame} />
            <Route path="/panel/survey-detail" component={SurveyNewEdit} />
            <Route path="/panel/announcements" component={AnnouncementsFrame} exact/>
            <Route path="/panel" component={DashboardFrame} exact/>
            <Route path="/panel/analytics" component={AnalyticsFrame} />
            <Route path="/panel/announcements/manage-announcement/:id" component={ManageContent} exact />
            <Route path="/panel/announcements/announcement-variation/:id" render={props => <NewEditVariation {...props} mode="announcement" />} />
            <Route path="/panel/base-settings" component={BaseSettings} />
            <Route path="/panel/user-settings" component={UserSettings} />
            <Route path="/panel/email" component={EmailFrame} />
            {superAdminPath}
            <Route path="/panel/superadmin/edit-account" component = {props => <EditAccounts accounts={accountOptions()} {...props}/>} exact/>
            <Route path="/panel/superadmin/create-account" component={CreateAccounts} exact/>
            <Route path="/panel/superadmin/edit-user" component={EditUsers} exact/>
            <Route path="/panel/superadmin/create-user" component={CreateUsers} exact/>
            <Route path="/panel/superadmin/analytics" component = {props => <Analytics accounts={accountOptions()} {...props}/>} exact/>
            <Route path="/panel/*">
                <Redirect push to="/panel"/>
           </Route>

          </Switch>

        </div>
   
      </div>

      </React.Fragment>
    );

    return <React.Fragment>{loadingDisplay}</React.Fragment>;
  }
}
