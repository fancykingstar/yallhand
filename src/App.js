import React from 'react';
import { observer, inject } from 'mobx-react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import FullStory from 'react-fullstory';
import { ToastContainer, Slide } from 'react-toastify';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import AdminPanel from './AdminPanel';
import UserPortal from './UserPortal/App';
import Login from './Login/Login';
import Forgot from './Login/Forgot';
import { Spinner } from './Spinner/spinner';
import { loadProfile } from './DataExchange/LoadProfile';
import toast from './YallToast';
import { getUser } from './DataExchange/Fetch';
import { log } from './DataExchange/Up';
import { ItsLog } from './DataExchange/PayloadBuilder';

@inject('UIStore', 'UserStore')
@observer
class AppRoute extends React.Component {
  constructor(props) {
    super(props);
    const { UserStore, UIStore } = props;
    const { location } = props;

    this.state = {
      shouldRedirect: false,
      redirect: '/',
    };

    if (getUser() === null && location.pathname !== '/' && !location.pathname.includes('/forgot')) {
      props.history.push('/');
    } else if (!UIStore._adminLoadingComplete) {
      UserStore.setPreviewTeam('');
      UserStore.setPreviewTag('');

      const loadthings = async () => {
        await loadProfile();
        const { isAuthenticated } = getUser() ? UserStore : false;
        const path = location.pathname;
        const loggedOutRoutes = ['/', '/register', '/forgot'];
        const loggedInRoutes = ['/panel', '/portal'];

        if (isAuthenticated) {
          this.setState({
            redirect: UserStore.user.isAdmin ? '/panel' : '/portal',
          });
          log(ItsLog(true, { event: 'click', type: 'login' }));
        } else {
          this.setState({
            redirect: '/',
          });
        }

        const { redirect } = this.state;
        if (!path.includes(redirect)) this.setState({ shouldRedirect: true });
        else if (redirect !== path || path.includes('/portal/'))
          this.setState({
            shouldRedirect: (isAuthenticated ? loggedOutRoutes : loggedInRoutes).some(
              route => route.indexOf(path) > -1,
            ),
          });
      };
      fetch(
        process.env.REACT_APP_API_URL
          ? `${process.env.REACT_APP_API_URL}ping`
          : 'http://127.0.0.1:3000/ping',
        {
          mode: 'no-cors',
        },
      )
        .then(() => loadthings())
        .catch(() =>
          toast.error('Unable to connect to Yallhands...', {
            hideProgressBar: true,
            autoClose: false,
            closeOnClick: false,
          }),
        );
    }
  }

  componentDidCatch(error) {
    console.log(error);
  }

  render() {
    const { UIStore } = this.props;
    const { shouldRedirect, redirect } = this.state;

    const theme = createMuiTheme({
      props: {
        App: {
          MuiButtonBase: {
            disableRipple: true,
          },
        },
      },
      typography: {
        fontFamily: 'Lato, Arial',
      },
    });

    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <FullStory org="JJAMV" />
          {UIStore.isScreenLoading && <Spinner />}
          <div className={UIStore.isScreenLoading ? 'LoadingDim' : ''}>
            {shouldRedirect && (
              <Switch>
                <Redirect push to={redirect} />
              </Switch>
            )}
            <Switch>
              <Route path="/panel" component={AdminPanel} />
              <Route path="/portal" component={UserPortal} />
              <Route path="/register" component={Login} />
              <Route path="/login" component={Login} exact />
              <Route path="/forgot" component={Forgot} />
              <Route path="/" component={Login} exact />
              <Route path="*">
                {' '}
                <Redirect push to={redirect} />
                {' '}
              </Route>
            </Switch>
          </div>
          <ToastContainer
            className="toast-container"
            toastClassName="toast-style"
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
