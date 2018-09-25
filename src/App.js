import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
// import { inject, observer } from "mobx-react";
import { SideBar } from "./SideBar/SideBar";
import { Header } from "./Header/Header";
import { CardFrame } from "./CardFrame/CardFrame";
import { PolicyFrame } from "./Policy/PolicyFrame";
import { NewEditPolicy } from "./Policy/NewEditPolicy";
import { TeamFrame } from "./Teams/TeamFrame";
import { ResourcesFrame } from "./Resources/ResourcesFrame";
import { AutomationsFrame } from "./Automations/AutomationsFrame";
import { AnnoucementsFrame } from "./Annoucements/AnnoucementsFrame";
import { BaseSettings } from "./Settings/BaseSettings";
import { UserSettings } from "./Settings/UserSettings";

// @inject('Store')
// @observer
class App extends Component {
  render() {
    const { Store } = this.props;
    return (
      <div className="App">
        <div className="SideAndAction">
          <SideBar />

          <div className="ActionFrame">

           
          
            
             <Switch>
            
            <Route path="/" component={CardFrame} exact/>
            <Route path="/teams" component={TeamFrame}/>
            <Route path="/resources" component={ResourcesFrame}/>
            <Route path="/automations" component={AutomationsFrame}/>
            <Route path="/annoucements" component={AnnoucementsFrame}/>
            <Route path="/manage-policy" component={PolicyFrame} />
            <Route path="/policy-variation" component={NewEditPolicy}/>
            <Route path="/base-settings" component={BaseSettings} />
            <Route path="/user-settings" component={UserSettings}/>
              </Switch>
         
        
          </div>
        </div>
        <Header />
      </div>
    );
  }
}

export default App;
