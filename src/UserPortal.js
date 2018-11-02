import React from "react"
import { inject, observer } from "mobx-react";
import {Switch, Route} from "react-router-dom"
import Header from "./Header/Header"
import {SearchFrame} from "./UserPortal/SearchFrame"
import {SideBarFrame} from "./UserPortal/SideBarFrame"
import {AnnoucementsFrame} from "./UserPortal/AnnoucementsFrame"
import {CardFrame} from "./UserPortal/CardFrame"
import {CardDetailFrame} from "./UserPortal/CardDetailFrame"
import "./App.css"


@inject("AnnoucementsStore", "PoliciesStore", "UserStore")
@observer
export class UserPortal extends React.Component {
  
    componentDidMount() {
        const {AnnoucementsStore} = this.props
         AnnoucementsStore.loadAnnoucements()
         const {UserStore} = this.props;
         UserStore.loadAccount()
         const {PoliciesStore} = this.props
         PoliciesStore.loadUserPortalPolicies(UserStore.previewTeam, UserStore.previewTag)
        

    }
     
    render() {
        
        return(
        <div className="SideAndAction">
            <SideBarFrame/>     

          <div className="ActionFrame">
                <Switch location={this.props.location}>
                    <Route path="/portal" component={AnnoucementsFrame} exact/>
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