import React from "react";
import "./App.css";

import { observer, inject } from "mobx-react";
import { Switch, Route, withRouter } from "react-router-dom";
import { AdminPanel } from "./AdminPanel";
import UserPortal from "./UserPortal/UserPortal";
import { Login } from "./Login/Login";
import { TwilightZone } from "./MiscPages/404";
import { Spinner } from "./Spinner/spinner";

import FullStory from "react-fullstory"




@inject("UIStore", "UserStore")
@observer
class AppRoute extends React.Component {
  componentDidMount(){
    const { UserStore} = this.props;
    if(UserStore.isAuthenticated === false){
      this.props.history.push("/login");
    }
  }
  render() {
    const { UIStore } = this.props;
  
    // const RouteTraffic = UserStore.isAuthenticated ? (
    //   <Redirect push to="/panel/dashboard" />
    // ) : (
    //   <Redirect push to="/login" />
    // );
  
    const loader = () => {
      if (UIStore.isScreenLoading) {
        return <Spinner />;
      }
    };
    return (
      <div className="App">
        {/* <FullStory org="JJAMV"/> */}
        {loader()}
        <div className={UIStore.isScreenLoading? "LoadingDim" : ""}>
        {/* <Switch>{RouteTraffic}</Switch> */}
        <Switch>
          <Route path="/panel" component={AdminPanel} />
          <Route path="/portal" component={UserPortal} />

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
