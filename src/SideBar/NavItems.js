import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom"
import  NavItem  from "./NavItem";
import "./style.css";

@inject("UIStore", "UserStore")
@observer
class NavItems extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    const location = this.props.location.pathname
    if(location.slice(-6) === "/panel"){UIStore.set("sideNav", "activePrimary", "dashboard")}
    else if(location.includes("/panel/superadmin")){UIStore.set("sideNav", "activePrimary", "superadmin")}
    else if(location.includes("/panel/teams")){UIStore.set("sideNav", "activePrimary", "teams")}
    else if(location.includes("/panel/faqs")){UIStore.set("sideNav", "activePrimary", "faqs")}
    else if(location.includes("/panel/announcements")){UIStore.set("sideNav", "activePrimary", "announcements")}
    else if(location.includes("/panel/email")){UIStore.set("sideNav", "activePrimary", "email")}
    else if(location.includes("/panel/analytics")){UIStore.set("sideNav", "activePrimary", "analytics")}
    else if(location.includes("/panel/resources")){UIStore.set("sideNav", "activePrimary", "resources")}
    else{UIStore.set("sideNav", "activePrimary", "")}
    UIStore.set("sideNav", "activeChannel", "All")
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


      {UserStore.user.invitedBy !== "admin"?"":
      <React.Fragment>
      <NavItem
          id="announcements"
          icon={<i style={{paddingRight: 2,color: "#2fc7f8"}} class="fas fa-vote-yea"/>}
          label="Polls"
          active={UIStore.sideNav.activePrimary === "announcements"}
        />  
        <br />
        </React.Fragment>
    }


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
          id="announcements"
          icon={<i style={{paddingRight: 2,color: "#2fc7f8"}} class="fas fa-tasks"/>}
          label="Tasks"
          active={UIStore.sideNav.activePrimary === "announcements"}
        />  
        <br />
        <NavItem
          id="announcements"
          icon={<i style={{paddingRight: 2,color: "#2fc7f8"}} class="fas fa-robot"/>}

          label="Automations"
          active={UIStore.sideNav.activePrimary === "announcements"}
        />  
   
        </React.Fragment>
    }
      </div>

      
    );
  }
}
export default withRouter(NavItems)