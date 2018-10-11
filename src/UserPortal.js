import React from "react"
import { inject, observer } from "mobx-react";
import {Header} from "./Header/Header"
import {SearchFrame} from "./UserPortal/SearchFrame"
import {SideBarFrame} from "./UserPortal/SideBarFrame"
import {AnnoucementsFrame} from "./UserPortal/AnnoucementsFrame"
import {CardFrame} from "./UserPortal/CardFrame"
import {CardDetailFrame} from "./UserPortal/CardDetailFrame"
import {Switch, Route} from "react-router-dom"
import "./App.css"


@inject("AnnoucementsStore", "PoliciesStore")
@observer
export class UserPortal extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const {AnnoucementsStore} = this.props
         AnnoucementsStore.loadAnnoucements()
         const {PoliciesStore} = this.props
         PoliciesStore.loadPolicies()
    }
    
    render() {
        
        return(
        <div className="SideAndAction">
            <SideBarFrame/>     

          <div className="ActionFrame">
                <Switch location={this.props.location}>
                    <Route to="/portal/annoucements" component={AnnoucementsFrame}/>
                    <Route to="/portal/learn" component={CardFrame} exact/>
                    <Route to="/portal/learn-detail/:id" component={CardDetailFrame} exact/>
                </Switch>
            
          </div>
          <Header />
          <SearchFrame/>
        </div>

        )
    }
}