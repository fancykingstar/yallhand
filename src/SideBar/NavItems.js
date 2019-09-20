import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom"
import  NavItem  from "./NavItem";
import {syncAdminNav} from "../SharedCalculations/SyncAdminNav"
import "./style.css";

@inject("UIStore", "UserStore")
@observer
class NavItems extends React.Component {
  componentDidMount() {
    syncAdminNav(this.props.location)
  }
  render() {
    const { UIStore, UserStore } = this.props;
    const superAdmin = UserStore.user.isSuperAdmin === true?   
    <NavItem
    id="superadmin"
    icon="chess queen"
    label="Super Admin"
    active={UIStore.sideNav.activePrimary === "superadmin"}
  /> : null

    return (
      <div className="Container">
      {superAdmin}
      <NavItem
          id="dashboard"
          icon="dashboard"
          label="Dashboard"
          active={UIStore.sideNav.activePrimary === "dashboard"}
        /> 

        <br />
        <NavItem
          id="teams"
          icon="group"
          label="Teams"
          active={UIStore.sideNav.activePrimary === "teams"}
        />

        <br />

        <NavItem
          id="faqs"
          icon="question"
          label="FAQs"
          active={UIStore.sideNav.activePrimary === "faqs"}
        />

        <br />
 
        <NavItem
          id="announcements"
          icon="bullhorn"
          label="Announcements"
          active={UIStore.sideNav.activePrimary === "announcements"}
        />


      <React.Fragment>
      <NavItem
          id="surveys"
          icon={<i style={{paddingRight: 2,color: "#2fc7f8"}} className="fas fa-vote-yea"/>}
          label="Surveys"
          active={UIStore.sideNav.activePrimary === "surveys"}
        />  
        <br />
        </React.Fragment>
    


        <NavItem
          id="email"
          icon="mail"
          label="Email Campaigns"
          active={UIStore.sideNav.activePrimary === "email"}
        />

        <br />

        <NavItem
          id="analytics"
          icon="chart bar outline"
          label="Analytics"
          active={UIStore.sideNav.activePrimary === "analytics"}
        />
        <br />

        <NavItem
          id="resources"
          icon="cubes"
          label="Resources"
          active={UIStore.sideNav.activePrimary === "resources"}

        />

      {UserStore.user.invitedBy !== "admin"?"":
      <React.Fragment>
        <br/>
      <NavItem
          id="tasks"
          icon={<i style={{paddingRight: 5,color: "#2fc7f8"}} className="fas fa-tasks"/>}
          label="Tasks"
          active={UIStore.sideNav.activePrimary === "tasks"}
        />  
        <br />
        <NavItem
          id="automations"
          icon={<i style={{paddingRight: 2,color: "#2fc7f8"}} className="fas fa-robot"/>}

          label="Automations"
          active={UIStore.sideNav.activePrimary === "automations"}
        />  
   
        </React.Fragment>
    }
      </div>

      
    );
  }
}
export default withRouter(NavItems)