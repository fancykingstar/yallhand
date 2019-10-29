import React from "react";
import { Responsive, Transition } from "semantic-ui-react"
import { inject, observer } from "mobx-react";
import { Switch, Route, Redirect } from "react-router-dom";

import Header from "./Header/Header";
import ManageContent from "./SharedUI/ManageContent/ManageContent"
import { SideBar } from "./SideBar/SideBar";
import NewEditVariation from "./SharedUI/NewEditContent/NewEditVariation";
import { TeamFrame } from "./Teams/TeamFrame";
import { ResourcesFrame } from "./Resources/ResourcesFrame";
import SurveyFrame from "./Surveys/SurveyFrame";
import TaskFrame from "./Tasks/TaskFrame";
import SurveyNewEdit from "./SharedUI/SurveyNewEdit";
import ContentListingPage from "./SharedUI/ContentListingPage";
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
import "./CSS/styles.scss";


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

    const loadingDisplay = !UIStore.adminLoadingComplete.all ? (
      <div />
    ) : (
      <React.Fragment>
      <Header />
      <div id="SideAndAction" className="SideAndAction">
        <Responsive {...Responsive.onlyComputer} fireOnMount={true} onUpdate={(e, val) => checkMobile(val.getWidth())}>
        <SideBar />
        </Responsive>


     {mobileNavDisplay}

        <div id="ActionFrame" className="ActionFrame" style={UIStore.sideNav.activePrimary === "superadmin"? {  backgroundColor: "#151515", marginLeft: UIStore.responsive.isMobile? 0:230} : {marginLeft: UIStore.responsive.isMobile? 0:230}}>
          <Switch location={this.props.location}>
            <Route path="/panel/announcements" render={props => <ContentListingPage {...props} mode="announcement" />} exact />
            <Route path="/panel/announcements/:contentID" component={ManageContent} exact />
            <Route path="/panel/announcements/:contentID/:variID" component={NewEditVariation} exact />
            <Route path="/panel/announcements/:contentID/:variID/:options" component={NewEditVariation} exact />
            <Route path="/panel/faqs" render={props => <ContentListingPage {...props} mode="policy" />} exact />
            <Route path="/panel/faqs/:contentID" component={ManageContent} exact />
            <Route path="/panel/faqs/:contentID/:variID" component={NewEditVariation} exact />
            <Route path="/panel/faqs/:contentID/:variID/:options" component={NewEditVariation} exact />
            <Route path="/panel/teams" component={TeamFrame} />
            <Route path="/panel/storage" component={ResourcesFrame} />
            <Route path="/panel/surveys" component={SurveyFrame} exact/>
            <Route path="/panel/tasks/manage-task/:id" render={props => <SurveyNewEdit {...props} mode="task" />} exact />
            <Route path="/panel/tasks/manage-task" render={props => <SurveyNewEdit {...props} mode="task" />} exact />
            <Route path="/panel/tasks" component={TaskFrame} exact/>
            <Route path="/panel/surveys/manage-survey/:id" render={props => <SurveyNewEdit {...props} mode="survey" />} exact />
            <Route path="/panel/surveys/manage-survey" render={props => <SurveyNewEdit {...props} mode="survey" />} exact />
            <Route path="/panel" component={DashboardFrame} exact/>
            <Route path="/panel/analytics" component={AnalyticsFrame} />
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
