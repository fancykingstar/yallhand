import React from "react";
import { inject, observer } from "mobx-react";
import { Switch, Route } from "react-router-dom";
import Header from "../Header/Header";
import { SearchFrame } from "./SearchFrame";
import { SideBarPortal } from "./SideBarPortal";
import AnnouncementsFrame from "./AnnouncementsFrame";
import { AnnouncementDetailFrame } from "./AnnoucementDetailFrame";
import { CardFrame } from "./CardFrame";
import { CardDetailFrame } from "./CardDetailFrame";
import { validContent } from "../SharedCalculations/ValidContent";
import { loadAdmin } from "../DataExchange/LoadProfile";
import { Responsive, Transition } from "semantic-ui-react";

@inject("AnnouncementsStore", "PoliciesStore", "UserStore", "UIStore")
@observer
export class UserPortal extends React.Component {
  componentDidMount() {
    const { UIStore, PoliciesStore, UserStore, AnnouncementsStore } = this.props;
    if (!UIStore._adminLoadingComplete) {
      loadAdmin();
    } else {
      console.log( "policies user", JSON.stringify( validContent( PoliciesStore.allPolicies, UserStore.previewTeamPath, UserStore.previewTagPath ) ) );
      console.log( "announcements user", validContent( AnnouncementsStore.allAnnouncements, UserStore.previewTeamPath, UserStore.previewTagPath ) );
      PoliciesStore.loadPolicies( validContent( PoliciesStore.allPolicies, UserStore.previewTeamPath, UserStore.previewTagPath ) );
      AnnouncementsStore.loadAnnouncements( validContent( AnnouncementsStore.allAnnouncements, UserStore.previewTeamPath, UserStore.previewTagPath ) );
    }
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

    const userPortal = !UIStore._adminLoadingComplete? <div/> : 
    <React.Fragment>
      <div className="SideAndAction">
        <Responsive
          {...Responsive.onlyComputer}
          fireOnMount={(e, val) => checkMobile(val.getWidth())}
          onUpdate={(e, val) => checkMobile(val.getWidth())}
        >
          <SideBarPortal  mobile={false}/>
        </Responsive>
        <Transition
          visible={UIStore.responsive.mobileNav}
          animation="fade right"
          duration={500}
        >
          <div className="PortalContainerNavMobile">
            <SideBarPortal mobile={true} />
          </div>
        </Transition>


        <div className="ActionFrame">
          <Switch location={this.props.location}>
            <Route path="/portal" component={AnnouncementsFrame} exact />
            <Route
              path="/portal/announcement/:id"
              component={AnnouncementDetailFrame}
              exact
            />
            <Route path="/portal/learn" component={CardFrame} exact />
            <Route
              path="/portal/learn-detail/:id"
              component={CardDetailFrame}
              exact
            />
          </Switch>

          
        </div>
        <Header />
        {UIStore.responsive.isMobile? <div/>: <SearchFrame />}
      </div>}
    </React.Fragment>
    

    return (
      <React.Fragment>
        {userPortal}
      </React.Fragment>
    );
  }
}
