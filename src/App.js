import React from "react";
import "./App.css";
import { Switch, Route, withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { AdminPanel } from "./AdminPanel";
import { UserPortal } from "./UserPortal"
// import { Login } from "./Login/Login";
// import { TwilightZone } from "./MiscPages/404";


class AppRoute extends React.Component {

  componentDidMount() {}
  render() {
    // const RouteTraffic = UserStore.isAuthenticated ? (
    //   <Redirect push to="/panel" />
    // ) : (
    //   <Redirect push to="/login" />
    // );
    return (
      <div className="App">
        {/* <Switch>{RouteTraffic}</Switch> */}
        <Switch>
   
        <Route path="/panel" component={AdminPanel}/>
        <Route path ="/portal" component={UserPortal}/>
    

        {/* <Route path="/login" component={Login} />
        <Route path="*" component={TwilightZone} /> */}

        </Switch>
         {/* <Redirect push to="/panel" /> */}
      </div>
    );
  }
}

// export default App;
const App = withRouter(observer(AppRoute));
export default App
