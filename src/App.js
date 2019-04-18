import React from "react";
import "./App.css";
import { observer, inject } from "mobx-react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { AdminPanel } from "./AdminPanel";
import UserPortal from "./UserPortal/UserPortal";
import Login from "./Login/Login";
import Forgot from "./Login/Forgot";
import { Spinner } from "./Spinner/spinner";
import { loadAdmin } from "./DataExchange/LoadProfile";
import DevTools from 'mobx-react-devtools'

import { ToastContainer, Slide } from "react-toastify";


@inject("UIStore", "UserStore")
@observer
class AppRoute extends React.Component {

  componentDidMount() {
    const { UserStore, UIStore } = this.props;
    if (!UIStore._adminLoadingComplete) {
      UserStore.setPreviewTeam("")
      UserStore.setPreviewTag("")
      loadAdmin()
    }
    if (!UserStore.isAuthenticated) this.props.history.push('/')
    
  }

  render() {
    const { UserStore, UIStore, location } = this.props;
    const { isAuthenticated } = UserStore;
    const path = location.pathname;
    const loggedOutRoutes = ['/', '/register', '/forgot'];
    const loggedInRoutes = ['/panel', '/portal'];
    const redirect = isAuthenticated ? (UserStore.user.isAdmin ? "/panel" : "/portal") : "/"
    let shouldRedirect = false;
    
    if (redirect !== path) shouldRedirect = (isAuthenticated ? loggedOutRoutes : loggedInRoutes).some(route => route.indexOf(path) > -1);

    return (
      <div className="App">
      <DevTools />
        {/* <FullStory org="JJAMV"/> */}
        {UIStore.isScreenLoading && <Spinner />}
        <div className={UIStore.isScreenLoading ? "LoadingDim" : ""}>
        {shouldRedirect && <Switch><Redirect push to={redirect}/></Switch>}
        <Switch>
          <Route path="/panel" component={AdminPanel} />
          <Route path="/portal" component={UserPortal} />
          <Route path="/register" component={Login} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/" component={Login} exact />
          <Route path="*"> <Redirect push to={redirect}/> </Route>
        </Switch>
        </div>
        <ToastContainer 
        className="toast-container"
        toastClassName='toast-style'
        position="top-center"
        transition={Slide}
        />
      </div>
    );
  }
}


const App = withRouter(AppRoute);
export default App;
