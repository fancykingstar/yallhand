import React from "react";
import { inject, observer } from "mobx-react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import Header from "../Header/Header";
import SearchFrame from "./SearchFrame";
import { SideBarPortal } from "./SideBarPortal";
import PortalSearchResults from "./PortalSearchResults";
import { PortalResources } from "./PortalResources";
import { PortalDirectory } from "./PortalDirectory"
import AnnouncementsFrame from "./AnnouncementsFrame";
import { ContentDetail } from "./ContentDetail";
import { UserSettings } from "../Settings/UserSettings"
import { CardFrame } from "./CardFrame";
import { Responsive, Transition } from "semantic-ui-react";
import { loadAdmin } from "../DataExchange/LoadProfile";
import {apiCall_pixel} from "../DataExchange/Fetch"
import { AskAQuestion } from "./AskAQuestion"

@inject("AnnouncementsStore", "PoliciesStore", "UserStore", "UIStore")
@observer
class UserPortal extends React.Component {
  componentDidMount() {
    const { UserStore } = this.props;
    if (UserStore.previewTeam !== "") {
      loadAdmin()
    }
  }

  componentWillMount() {
    const { location } = this.props;
    if (location.search && location.search.indexOf('data=') > -1) apiCall_pixel(`1x1pixel.gif${location.search}`);
  }

  render() {
    const { UIStore } = this.props;
    const checkMobile = width => {
      if (width < 992) {
        UIStore.set("responsive", "isMobile", true);
      } else {
        UIStore.set("responsive", "mobileNav", false);
        UIStore.set("responsive", "isMobile", false);
      }
    };

    const userPortal = !UIStore._adminLoadingComplete ? (
      <div />
    ) : (
      <React.Fragment>
                <AskAQuestion />
        <div className="SideAndAction">
          <Responsive
            {...Responsive.onlyComputer}
            fireOnMount={true}
            onUpdate={(e, val) => checkMobile(val.getWidth())}>
            <SideBarPortal mobile={false} />
          </Responsive>
          <Transition visible={UIStore.responsive.mobileNav} animation="fade right" duration={500}>
            <div className="PortalContainerNavMobile">
              <div style={{float: "left", borderRight: "1px solid"}} > <SideBarPortal mobile={true} /> </div>
              <div style={{height: 800, width: 992}} onClick={e => UIStore.set("responsive", "mobileNav", false)}/> 
            </div>
          </Transition>
          <div className="ActionFrame">
            {/* {UIStore.search.portalSearchValue !== "" && UIStore.search.portalDisplayResults? (<PortalSearch />) : ( */}
            <Switch location={this.props.location}>
              <Route path="/portal" component={AnnouncementsFrame} exact />
              <Route path="/portal/search" component={PortalSearchResults} exact />
              <Route path="/portal/resources" component={PortalResources} exact />
              <Route path="/portal/directory" component={PortalDirectory} exact />
              <Route path="/portal/settings" component={UserSettings} exact />
              <Route path="/portal/announcement/:id" render={props => <ContentDetail {...props} mode="announcement" />} exact />
              <Route path="/portal/learn" component={CardFrame} exact />
              <Route path="/portal/learn-detail/:id" render={props => <ContentDetail {...props} mode="policy" />} exact />
              <Route path="/portal/*">
                <Redirect push to="/panel"/>
              </Route>
            </Switch>
          </div>
          <Header />
          {UIStore.responsive.isMobile ? <div /> : <SearchFrame />}
        </div>
        }
      </React.Fragment>
    );

    return <React.Fragment>{userPortal}</React.Fragment>;
  }
}

export default withRouter(UserPortal)