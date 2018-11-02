import React from "react";
import { inject, observer } from "mobx-react";
import { NavItem } from "./NavItem";
import "./style.css";

@inject("SideBarStore")
@observer
export class NavItems extends React.Component {
  // makeActive = (navItem) => {this.props.whenClicked(navItem)}
  render() {
    const { SideBarStore } = this.props;
    return (
      <div className="Container">
        <NavItem
          id="teams"
          icon="group"
          label="Teams"
          active={SideBarStore.checkActive("teams")}
        />

        <br />

        <NavItem
          id="resources"
          icon="cubes"
          label="Resources"
          active={SideBarStore.checkActive("resources")}
        />

        <br />

        <NavItem
          id="automations"
          icon="sync alternate"
          label="Automations"
          active={SideBarStore.checkActive("automations")}
        />

        <br />

        <NavItem
          id="annoucements"
          icon="bullhorn"
          label="Annoucements"
          active={SideBarStore.checkActive("annoucements")}
        />
         {/* <NavItem
          id="annoucements"
          icon="check square"
          label="Surveys and Polls"
          active={SideBarStore.checkActive("annoucements")}
        />*/}
         <NavItem
          id="surveys"
          icon="check square"
          label="Surveys and Polls"
          active={SideBarStore.checkActive("surveys")}
        /> 
         <NavItem
          id="email"
          icon="mail"
          label="Email Campaign"
          active={SideBarStore.checkActive("email")}
        />

        <br />

        {/* <NavItem
          id="staffdirectory"
          icon="list alternate"
          label="Staff Directory"
          active={SideBarStore.checkActive("staffdirectory")}
        /> */}
      </div>
    );
  }
}
