import React from "react"
import { inject, observer } from "mobx-react";
import {Switch, Route} from "react-router-dom"
import Header from "./Header/Header"
import {SearchFrame} from "./UserPortal/SearchFrame"
import {SideBarFrame} from "./UserPortal/SideBarFrame"
import AnnouncementsFrame from "./UserPortal/AnnouncementsFrame"
import {AnnouncementDetailFrame} from "./UserPortal/AnnoucementDetailFrame"
import {CardFrame} from "./UserPortal/CardFrame"
import {CardDetailFrame} from "./UserPortal/CardDetailFrame"
import {validContent} from './SharedCalculations/ValidContent'
import { loadAdmin } from "./DataExchange/LoadProfile";
import "./App.css"


@inject("AnnouncementsStore", "PoliciesStore", "UserStore", "UIStore")
@observer
export class UserPortal extends React.Component {
    componentDidMount() {
        const { UIStore, PoliciesStore, UserStore, AnnouncementsStore } = this.props;
        if (!UIStore._adminLoadingComplete) {
          loadAdmin()
      }else{
        console.log("policies user", JSON.stringify(validContent(PoliciesStore.allPolicies, UserStore.previewTeamPath, UserStore.previewTagPath)))
        console.log("announcements user", validContent(AnnouncementsStore.allAnnouncements, UserStore.previewTeamPath, UserStore.previewTagPath))
        PoliciesStore.loadPolicies(validContent(PoliciesStore.allPolicies, UserStore.previewTeamPath, UserStore.previewTagPath))
        AnnouncementsStore.loadAnnouncements(validContent(AnnouncementsStore.allAnnouncements, UserStore.previewTeamPath, UserStore.previewTagPath))
      }
    }
    
    componentWillUnmount() {
        loadAdmin()
    }
  
    // componentDidMount() {
    //     const {AnnouncementsStore} = this.props
    //      AnnouncementsStore.loadAnnouncements()
        
    //      const {UserStore} = this.props;
    //      UserStore.loadUser()
    //      const {PoliciesStore} = this.props
    //      PoliciesStore.loadUserPortalPolicies(validContent(PoliciesStore.allPolicies, UserStore.previewTeamPath, UserStore.previewTagPath))
    //      AnnouncementsStore.loadUserPortalAnnouncements(validContent(AnnouncementsStore.allAnnouncements, UserStore.previewTeamPath, UserStore.previewTagPath))
        

    // }
     
    render() {
 return(
        <div className="SideAndAction">
            <SideBarFrame/>     

          <div className="ActionFrame">
                <Switch location={this.props.location}>
                    <Route path="/portal" component={AnnouncementsFrame} exact/>
                    <Route path="/portal/announcement/:id" component={AnnouncementDetailFrame} exact/>
                    <Route path="/portal/learn" component={CardFrame} exact/>
                    <Route path="/portal/learn-detail/:id" component={CardDetailFrame} exact/>
                </Switch>
            
          </div>
          <Header />
          <SearchFrame/>
        </div>

        );
    }
}