import React from "react";
import "./App.css";

import { observer, inject } from "mobx-react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { AdminPanel } from "./AdminPanel";
import UserPortal from "./UserPortal/UserPortal";
import Login from "./Login/Login";
import { TwilightZone } from "./MiscPages/404";
import { Spinner } from "./Spinner/spinner";

import FullStory from "react-fullstory"

@inject("UIStore", "UserStore")
@observer
class AppRoute extends React.Component {

  componentDidMount() {
    const { UserStore } = this.props;
    if(UserStore.isAuthenticated === false){
      this.props.history.push("/login");
    }
  }

  render() {
    const { UserStore, UIStore, location } = this.props;
    const { isAuthenticated } = UserStore;
    const path = location.pathname;
    const shouldRedirect = (isAuthenticated && (path === "/register" || path === "/login")) ||
                         (!isAuthenticated && (path.indexOf( "/panel") > -1 && path.indexOf( "/portal") > -1));

    const RouteTraffic = isAuthenticated ? <Redirect push to="/panel" /> : <Redirect push to="/login" />;

    console.log('isAuthenticated', isAuthenticated)
  
    return (
      <div className="App">
        {/* <FullStory org="JJAMV"/> */}
        {UIStore.isScreenLoading && <Spinner />}
        <div className={UIStore.isScreenLoading? "LoadingDim" : ""}>
        {shouldRedirect && <Switch>{RouteTraffic}</Switch>}
        <Switch>
          <Route path="/panel" component={AdminPanel} />
          <Route path="/portal" component={UserPortal} />
          <Route path="/register" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="*" component={TwilightZone} />
        </Switch>
        {/* <Redirect push to="/panel" /> */}
        </div>
      </div>
    );
  }
}

// export default App;
const App = withRouter(AppRoute);
export default App;
