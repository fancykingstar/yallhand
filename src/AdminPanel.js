import React from "react";
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
import {Header} from "./Header/Header"


export class AdminPanel extends React.Component {
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
              <Route path="/panel/policy-variation" component={NewEditPolicy} />
              <Route path="/panel/base-settings" component={BaseSettings} />
              <Route path="/panel/user-settings" component={UserSettings} />
       
            </Switch>
          </div>
          <Header />
        </div>
       
   
    );
  }
}


