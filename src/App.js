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
import FullStory from 'react-fullstory';

import { ToastContainer, Slide } from "react-toastify";
import { getUser } from "./DataExchange/Fetch";


@inject("UIStore", "UserStore")
@observer
class AppRoute extends React.Component {
  constructor(props){
    super(props)
    const { UserStore, UIStore } = this.props;
    this.state = {shouldRedirect: false, redirect: "/"}
    if (getUser() === null) this.props.history.push('/');
    else if (!UIStore._adminLoadingComplete) {
      UserStore.setPreviewTeam("")
      UserStore.setPreviewTag("")
      const loadthings = async ()=>{
        await loadAdmin()
        const { location } = this.props;
        const { isAuthenticated } = UserStore;
        const path = location.pathname;
        const loggedOutRoutes = ['/', '/register', '/forgot'];
        const loggedInRoutes = ['/panel', '/portal'];
        this.setState({redirect: isAuthenticated ? (UserStore.user.isAdmin ? "/panel" : "/portal") : "/"});
        if (!path.includes(this.state.redirect)) this.setState({shouldRedirect: true});
        else if (this.state.redirect !== path || path.includes("/portal/")) this.setState({shouldRedirect: (isAuthenticated ? loggedOutRoutes : loggedInRoutes).some(route => route.indexOf(path) > -1)});
      }
      loadthings()
      }

     
    }
  

  // componentDidMount() {
  //   const { UserStore, UIStore } = this.props;
  //   if (!UIStore._adminLoadingComplete) {
  //     UserStore.setPreviewTeam("")
  //     UserStore.setPreviewTag("")
  //     loadAdmin()
  //   }
  //   if (!UserStore.isAuthenticated) this.props.history.push('/')
    
  // }

  render() {
    const {UIStore} = this.props;
    console.log(this.state.redirect, this.state.shouldRedirect)
    return (
      <div className="App">
        <FullStory org="JJAMV"/>
        {UIStore.isScreenLoading && <Spinner />}
        <div className={UIStore.isScreenLoading ? "LoadingDim" : ""}>
        {this.state.shouldRedirect && <Switch><Redirect push to={this.state.redirect}/></Switch>}
        <Switch>
          <Route path="/panel" component={AdminPanel} />
          <Route path="/portal" component={UserPortal} />
          <Route path="/register" component={Login} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/" component={Login} exact />
          <Route path="*"> <Redirect push to={this.state.redirect}/> </Route>
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
