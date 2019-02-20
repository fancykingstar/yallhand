import React from "react";
import { inject, observer } from "mobx-react";
import { NavItem } from "./NavItem";
import "./style.css";

@inject("UIStore")
@observer
export class NavItems extends React.Component {
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
