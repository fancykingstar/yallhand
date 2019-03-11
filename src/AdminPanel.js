import React from "react";

import ManageContent from "./SharedUI/ManageContent/ManageContent"
import Header from "./Header/Header";
import { Responsive, Transition } from "semantic-ui-react"
import { inject, observer } from "mobx-react";
import { Switch, Route } from "react-router-dom";
import { SideBar } from "./SideBar/SideBar";
import { CardFrame } from "./CardFrame/CardFrame";
import { NewEditVariation } from "./SharedUI/NewEditContent/NewEditVariation";
import { TeamFrame } from "./Teams/TeamFrame";
import { ResourcesFrame } from "./Resources/ResourcesFrame";
import AnnouncementsFrame from "./Announcements/AnnouncementsFrame";
import { BaseSettings } from "./Settings/BaseSettings";
import { UserSettings } from "./Settings/UserSettings";
import { EmailFrame } from "./Email/EmailFrame";
import EditBundle from "./Email/EditBundle";
import { DashboardFrame } from "./Dashboard/DashboardFrame";
import { AnalyticsFrame } from "./Analytics/AnalyticsFrame"

import { loadAdmin } from "./DataExchange/LoadProfile";
import { ToastContainer } from "react-toastify";

@inject(
  "ChannelStore",
  "PoliciesStore",
  "ResourcesStore",
  "TeamStore",
  "UserStore",
  "AnnouncementsStore",
  "AccountStore",
  "UIStore",
  "EmailStore",
)
@observer
export class AdminPanel extends React.Component {
  componentDidMount() {
    const { UIStore, UserStore } = this.props;
    if (!UIStore._adminLoadingComplete) {
      this.props.history.push("/panel/dashboard")
      UserStore.setPreviewTeam("")
      UserStore.setPreviewTag("")
      loadAdmin()
  }
}

  render() {
    const { UIStore } = this.props;
    const checkMobile = (width) => {
      if(width < 992){
        UIStore.set("responsive", "isMobile", true)
      }
      else{
          UIStore.set("responsive", "mobileNav", false)
          UIStore.set("responsive", "isMobile", false)
        }
    }

    const loadingDisplay = !UIStore._adminLoadingComplete ? (
      <div />
    ) : (
      <div className="SideAndAction">
        <Responsive {...Responsive.onlyComputer} fireOnMount={true} onUpdate={(e, val) => checkMobile(val.getWidth())}>
        <SideBar />
        </Responsive>
        <Transition visible={UIStore.responsive.mobileNav} animation='fade right' duration={500}>
          <div style={{marginTop: 40, position: "fixed", zIndex: 50}}> 
          <div style={{float: "left"}}>
            <SideBar />
          </div>
          <div style={{height: 800, width: 992}} onClick={e => UIStore.set("responsive", "mobileNav", false)}/> 
        </div>
        </Transition>
        <div className="ActionFrame">
          <Switch location={this.props.location}>
            <Route path="/panel/faqs" component={CardFrame} exact />
            <Route path="/panel/faqs/manage-policy/:id" component={ManageContent} exact />
            <Route path="/panel/faqs/policy-variation/:id" render={props => <NewEditVariation {...props} mode="policy" />} />{" "} />
            <Route path="/panel/teams" component={TeamFrame} />
            <Route path="/panel/resources" component={ResourcesFrame} />
            <Route path="/panel/announcements" component={AnnouncementsFrame} exact/>
            <Route path="/panel/dashboard" component={DashboardFrame} />
            <Route path="/panel/analytics" component={AnalyticsFrame} />
            <Route path="/panel/announcements/manage-announcement/:id" component={ManageContent} exact />
            <Route path="/panel/announcements/announcement-variation/:id" render={props => <NewEditVariation {...props} mode="announcement" />} />
            <Route path="/panel/email/edit-bundle" component={EditBundle} />
            <Route path="/panel/base-settings" component={BaseSettings} />
            <Route path="/panel/user-settings" component={UserSettings} />
            <Route path="/panel/email" component={EmailFrame} />
          </Switch>
        </div>
        <ToastContainer />
        <Header />
      </div>
    );

    return <React.Fragment>{loadingDisplay}</React.Fragment>;
  }
}
