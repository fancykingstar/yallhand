import React from "react";
import "./App.css";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { AdminPanel } from "./AdminPanel";
import { Login } from "./Login/Login";
import { TwilightZone } from "./MiscPages/404";


@inject("UserStore")

class AppRoute extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    const { UserStore } = this.props;
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
    

        {/* <Route path="/login" component={Login} />
        <Route path="*" component={TwilightZone} /> */}

        </Switch>
        <Redirect push to="/panel" />
      </div>
    );
  }
}

// export default App;
const App = withRouter(observer(AppRoute));
export default App
