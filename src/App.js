import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { SideBar } from "./SideBar/SideBar";
import { Header } from "./Header/Header";
import { CardFrame } from "./CardFrame/CardFrame";
import { PolicyFrame } from "./Policy/PolicyFrame";
import { NewEditPolicy } from "./Policy/NewEditPolicy";
import { TeamFrame } from "./Teams/TeamFrame";

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

           
            <BrowserRouter>
            
             <Switch>
            
            <Route path="/" component={CardFrame} exact/>
            <Route path="/teams" component={TeamFrame}/>
            <Route path="/manage-policy" component={PolicyFrame} />
            <Route path="/policy-variation" component={NewEditPolicy}/>
              </Switch>
            </BrowserRouter>
        
          </div>
        </div>
        <Header />
      </div>
    );
  }
}

export default App;
