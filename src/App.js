import React from "react";
import { observer, inject } from "mobx-react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { AdminPanel } from "./AdminPanel";
// import UserPortal from "./UserPortal/UserPortal";
import Login from "./Login/Login";
import Forgot from "./Login/Forgot";
import { Spinner } from "./Spinner/spinner";
import { loadAdmin } from "./DataExchange/LoadProfile";
import FullStory from 'react-fullstory';
import toast from './YallToast'
import { ToastContainer, Slide } from "react-toastify";
import { getUser } from "./DataExchange/Fetch";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
// import "./App.css";


@inject("UIStore", "UserStore")
@observer
class AppRoute extends React.Component {
  componentDidCatch(error, info) {
    alert(error);
    // Display fallback UI
    // this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }
  constructor(props){
    super(props);
    const { UserStore, UIStore } = this.props;
    const { location } = this.props;
    this.state = {shouldRedirect: false, redirect: "/"}
    if (getUser() === null && location.pathname !== '/') this.props.history.push('/');
    else if (!UIStore._adminLoadingComplete) {
      UserStore.setPreviewTeam("")
      UserStore.setPreviewTag("")
      const loadthings = async ()=>{
        await loadAdmin();
        const { isAuthenticated } = getUser() ? UserStore: false;
        const path = location.pathname;
        const loggedOutRoutes = ['/', '/register', '/forgot'];
        const loggedInRoutes = ['/panel', '/portal'];
        this.setState({redirect: isAuthenticated ? (UserStore.user.isAdmin ? "/panel" : "/portal") : "/"});
        if (!path.includes(this.state.redirect)) this.setState({shouldRedirect: true});
        else if (this.state.redirect !== path || path.includes("/portal/")) this.setState({shouldRedirect: (isAuthenticated ? loggedOutRoutes : loggedInRoutes).some(route => route.indexOf(path) > -1)});
      }
      fetch(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL + "ping" : "http://127.0.0.1:3000/ping", {
        mode: 'no-cors',
        }).then(() => loadthings())
      .catch(() => toast.error("Unable to connect to Yallhands...", {hideProgressBar: true, autoClose: false, closeOnClick: false}) )
      }
    }

  render() {
    const {UIStore} = this.props;

    const theme = createMuiTheme({
      typography: {
        fontFamily: 'Lato, Arial',
      }
    });

    return (
      <div className="App">
        <ThemeProvider theme={theme}>
        <FullStory org="JJAMV"/>
        {UIStore.isScreenLoading && <Spinner />}
        <div className={UIStore.isScreenLoading ? "LoadingDim" : ""}>
        {this.state.shouldRedirect && <Switch><Redirect push to={this.state.redirect}/></Switch>}
        <Switch>
          <Route path="/panel" component={AdminPanel} />
          {/* <Route path="/portal" component={UserPortal} /> */}
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
        closeButton={false}
        />
        </ThemeProvider>
      </div>
    );
  }
}


const App = withRouter(AppRoute);
export default App;
