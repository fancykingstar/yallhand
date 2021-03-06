/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Responsive } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './Header/Header';
import SideBar from './SideBar/SideBar';
import NewEditVariation from './SharedUI/NewEditContent/NewEditVariation';
import TeamFrame from './Teams/TeamFrame';
import ResourcesFrame from './Resources/ResourcesFrame';
import SurveyFrame from './Surveys/SurveyFrame';
import TicketingFrame from './Ticketing/TicketingFrame';
import Inbox from './Inbox/Inbox';
import SurveyNewEdit from './SharedUI/SurveyNewEdit';
import TicketingNewEdit from './Ticketing/TicketingNewEdit';
import ContentListingPage from './SharedUI/ContentListingPage';
import DashboardFrame from './Dashboard/DashboardFrame';
import BaseSettings from './Settings/BaseSettings';
import SuperAdminFrame from './SuperAdmin/SuperAdminFrame';
import { Content } from './SharedUI/ManageContent/Content';
import { UserSettings } from './Settings/UserSettings';
import { EmailFrame } from './Email/EmailFrame';
import { AnalyticsFrame } from './Analytics/AnalyticsFrame';
import { EditAccounts } from './SuperAdmin/EditAccounts';
import { CreateAccounts } from './SuperAdmin/CreateAccounts';
import { EditUsers } from './SuperAdmin/EditUsers';
import { CreateUsers } from './SuperAdmin/CreateUsers';
import { Analytics } from './SuperAdmin/Analytics';

import { loadProfile } from './DataExchange/LoadProfile';
import { syncAdminNav } from './SharedCalculations/SyncAdminNav';

import './CSS/styles.scss';

@inject('UserStore', 'UIStore')
@observer
class AdminPanel extends React.Component {
  componentDidMount() {
    const { UserStore, UIStore } = this.props;
    if (!UIStore._adminLoadingComplete) {
      UserStore.setPreviewTeam('');
      UserStore.setPreviewTag('');
      loadProfile();
    }
  }

  componentDidUpdate() {
    const { location } = this.props;
    syncAdminNav(location);
  }

  render() {
    const { UIStore, UserStore, location } = this.props;
    const adminLimits =
      UserStore.user &&
      UserStore.user.adminLimits &&
      UserStore.user.adminLimits.features &&
      UserStore.user.adminLimits.features.length
        ? UserStore.user.adminLimits.features
        : false;

    const mobileNavDisplay = UIStore.responsive.mobileNav ? (
      <div className="SideBarContainerMobile">
        <div style={{ float: 'left' }}>
          <SideBar mobile />
        </div>
        <div
          style={{ height: '100vh', width: '100vw' }}
          onClick={e => UIStore.set('responsive', 'mobileNav', false)}
        />
      </div>
    ) : null;

    const accountOptions = () => [];

    const checkMobile = width => {
      if (width < 992) {
        UIStore.set('responsive', 'isMobile', true);
      } else {
        UIStore.set('responsive', 'mobileNav', false);
        UIStore.set('responsive', 'isMobile', false);
      }
    };

    const superAdminPath =
      UserStore.user !== null &&
      UserStore.user.isSuperAdmin !== undefined &&
      UserStore.user.isSuperAdmin === true ? (
        <Route path="/panel/superadmin" component={SuperAdminFrame} exact />
      ) : null;

    const loadingDisplay = !UIStore.adminLoadingComplete.all ? (
      <div />
    ) : (
      <>
        <Header />
        <div id="SideAndAction" className="SideAndAction">
          <Responsive
            {...Responsive.onlyComputer}
            fireOnMount
            onUpdate={(e, val) => checkMobile(val.getWidth())}
          >
            <SideBar />
          </Responsive>

          {mobileNavDisplay}
          <div
            id="ActionFrame"
            className="ActionFrame"
            style={
              UIStore.sideNav.activePrimary === 'superadmin'
                ? { backgroundColor: '#151515', marginLeft: UIStore.responsive.isMobile ? 0 : 230 }
                : { marginLeft: UIStore.responsive.isMobile ? 0 : 230 }
            }
          >
            <Switch location={location}>
              <Route path="/panel/content/" component={Content} exact />
              <Route path="/panel/content/:contentID" component={Content} exact />

              <Route
                path="/panel/announcements"
                render={props => <ContentListingPage {...props} mode="announcement" />}
                exact
              />
              <Route path="/panel/announcements/:contentID" component={Content} exact />
              <Route path="/panel/announcements/:contentID/:variID" component={Content} exact />
              <Route
                path="/panel/announcements/:contentID/:variID/:options"
                component={Content}
                exact
              />
              <Route
                path="/panel/faqs"
                render={props => <ContentListingPage {...props} mode="policy" />}
                exact
              />
              <Route path="/panel/faqs/:contentID" component={Content} exact />
              <Route path="/panel/faqs/:contentID/:variID" component={Content} exact />
              <Route
                path="/panel/faqs/:contentID/:variID/:options"
                component={NewEditVariation}
                exact
              />
              <Route path="/panel/teams" component={TeamFrame} />
              <Route path="/panel/storage" component={ResourcesFrame} />
              <Route
                path="/panel/surveys"
                component={props => <SurveyFrame {...props} mode="survey" />}
                exact
              />
              <Route
                path="/panel/tasks"
                component={props => <SurveyFrame {...props} mode="task" />}
                exact
              />
              <Route
                path="/panel/polls"
                component={props => <SurveyFrame {...props} mode="poll" />}
                exact
              />
              <Route
                path="/panel/tasks/manage-task/:id"
                render={props => <SurveyNewEdit {...props} mode="task" />}
                exact
              />
              <Route
                path="/panel/tasks/manage-task"
                render={props => <SurveyNewEdit {...props} mode="task" />}
                exact
              />
              <Route path="/panel/ticketing" component={TicketingFrame} exact />
              <Route
                path="/panel/ticketing/manage-ticket"
                render={props => <TicketingNewEdit {...props} />}
                exact
              />
              <Route
                path="/panel/ticketing/manage-ticket/:id"
                render={props => <TicketingNewEdit {...props} />}
                exact
              />
              <Route
                path="/panel/surveys/manage-survey/:id"
                render={props => <SurveyNewEdit {...props} mode="survey" />}
                exact
              />
              <Route
                path="/panel/surveys/manage-survey"
                render={props => <SurveyNewEdit {...props} mode="survey" />}
                exact
              />
              <Route
                path="/panel/polls/manage-poll/:id"
                render={props => <SurveyNewEdit {...props} mode="poll" />}
                exact
              />
              <Route
                path="/panel/polls/manage-poll"
                render={props => <SurveyNewEdit {...props} mode="poll" />}
                exact
              />
              <Route path="/panel" component={!adminLimits && DashboardFrame} exact />
              <Route path="/panel/inbox" component={Inbox} exact />
              <Route path="/panel/analytics" component={AnalyticsFrame} />
              <Route path="/panel/base-settings" component={BaseSettings} />
              <Route path="/panel/user-settings" component={UserSettings} />
              <Route path="/panel/email" component={EmailFrame} />
              {superAdminPath}
              <Route
                path="/panel/superadmin/edit-account"
                component={props => <EditAccounts accounts={accountOptions()} {...props} />}
                exact
              />
              <Route path="/panel/superadmin/create-account" component={CreateAccounts} exact />
              <Route path="/panel/superadmin/edit-user" component={EditUsers} exact />
              <Route path="/panel/superadmin/create-user" component={CreateUsers} exact />
              <Route
                path="/panel/superadmin/analytics"
                component={props => <Analytics accounts={accountOptions()} {...props} />}
                exact
              />
              <Route path="/panel/*">
                <Redirect push to="/panel" />
              </Route>
            </Switch>
          </div>
        </div>
      </>
    );

    return <>{loadingDisplay}</>;
  }
}

export default AdminPanel;
