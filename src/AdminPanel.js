import React from "react"; 
import { inject, observer } from "mobx-react"
import { Switch, Route } from "react-router-dom";
import { SideBar } from "./SideBar/SideBar";
import { CardFrame } from "./CardFrame/CardFrame";
import { PolicyFrame } from "./Policy/PolicyFrame";
import { NewEditPolicy } from "./Policy/NewEditPolicy";
import { TeamFrame } from "./Teams/TeamFrame";
import { ResourcesFrame } from "./Resources/ResourcesFrame";
import { AutomationsFrame } from "./Automations/AutomationsFrame";
import { AnnoucementsFrame } from "./Annoucements/AnnoucementsFrame";
import { BaseSettings } from "./Settings/BaseSettings";
import { UserSettings } from "./Settings/UserSettings";
import Header from "./Header/Header"


@inject("SideBarStore", "PoliciesStore", "ResourcesStore", "AutomationsStore", "TeamStore", "UserStore", "AnnoucementsStore")
@observer
export class AdminPanel extends React.Component {
  componentWillMount() {

    //load all the things for admin/

    const { SideBarStore } = this.props;
    SideBarStore.loadChannels();
    const { PoliciesStore } = this.props;
    PoliciesStore.loadPolicies()
    const { ResourcesStore } = this.props;
    ResourcesStore.loadFiles()
    ResourcesStore.loadUrls()
    const { AutomationsStore} = this.props;
    AutomationsStore.loadAutomations()
    const { TeamStore } = this.props;
    TeamStore.loadStructure()
    TeamStore.loadClasses()
    const {UserStore} = this.props;
    UserStore.loadAccount()
    const {AnnoucementsStore} = this.props;
    AnnoucementsStore.loadAnnoucements()

  }
  render() {
    return (

        <div className="SideAndAction">
          <SideBar />

          <div className="ActionFrame">
            <Switch location={this.props.location}>
              <Route path="/panel/" component={CardFrame} exact />
              <Route path="/panel/teams" component={TeamFrame} />
              <Route path="/panel/resources" component={ResourcesFrame} />
              <Route path="/panel/automations" component={AutomationsFrame} />
              <Route path="/panel/annoucements" component={AnnoucementsFrame} />
              <Route path="/panel/manage-policy/:id" component={PolicyFrame} exact/>
              <Route path="/panel/policy-variation/:id" component={NewEditPolicy} />
              <Route path="/panel/base-settings" component={BaseSettings} />
              <Route path="/panel/user-settings" component={UserSettings} />
       
            </Switch>
          </div>
          <Header />
        </div>
       
   
    );
  }
}


