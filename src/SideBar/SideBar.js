import React from "react";
import { inject, observer } from "mobx-react";
import { Workspace } from "./Workspace";
import { QLogo } from "../Assets/Graphics/QLogo";
import UserProfile from "./UserProfile";
import NavItems from "./NavItems";

@inject("UIStore")
@observer
export class SideBar extends React.Component {
  render() {
    const { UIStore } = this.props;
    return (
      <div className={this.props.mobile? "SideBarMobile":"SideBar"}>
        <Workspace />
        <UserProfile />
        <NavItems
          whenClicked={val => UIStore.set("sideNav", "activePrimary", val)}
        />
        <div className="PoweredByFrame" style={{borderTop: "1px solid #404040"}}> 
          <div style={{marginLeft: 50, marginTop: 9}}><QLogo width="110px" /></div>
         </div>
      </div>
    );
  }
}
