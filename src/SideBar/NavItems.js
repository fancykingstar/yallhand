import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom"
import { NavItem } from "./NavItem";
import "./style.css";

@inject("UIStore")
@observer
class NavItems extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    const location = this.props.location.pathname
    if(location.includes("/panel/dashboard")){UIStore.set("sideNav", "activePrimary", "dashboard")}
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
    const { UIStore } = this.props;
    return (
      <div className="Container">

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

        <br />
        <NavItem
          id="email"
          icon="mail"
          label="Email Campaign"
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

        {/* <NavItem
          id="staffdirectory"
          icon="list alternate"
          label="Staff Directory"
          active={UIStore.sideNav.activePrimary === "staffdirectory"}
        /> */}
        {/* <NavItem
          id="announcements"
          icon="check square"
          label="Surveys and Polls"
          active={UIStore.sideNav.activePrimary === "announcements"}
        />*/}
      </div>
    );
  }
}
export default withRouter(NavItems)