import React, { Component } from "react";
import "./App.css";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { SideBar } from "./SideBar/SideBar";
import { Header } from "./Header/Header";
import { CardFrame } from "./CardFrame/CardFrame";
import { PolicyFrame } from "./Policy/PolicyFrame";

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
            <PolicyFrame/>
            {/* <CardFrame /> */}
            {/* <Switch>
            
            <Route path="/" component={PolicyFrame} />
            <Route path="/CardFrame" component={CardFrame} />
          </Switch> */}
          </div>
        </div>
        <Header />
      </div>
    );
  }
}

export default App;
