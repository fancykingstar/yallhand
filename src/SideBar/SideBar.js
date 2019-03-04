import React from "react";
import { inject, observer } from "mobx-react";
import { Workspace } from "./Workspace";
import { UserProfile } from "./UserProfile";
import { ChannelContainer } from "./ChannelContainer";
import NavItems from "./NavItems";
import { QLogo } from "../Assets/Graphics/QLogo";
import "./style.css";

@inject("UIStore")
@observer
export class SideBar extends React.Component {
  render() {
    const { UIStore } = this.props;
    return (
      <div className="SideBar">
        <Workspace />
        <UserProfile />
        <NavItems
          whenClicked={val => UIStore.set("sideNav", "activePrimary", val)}
        />
        <ChannelContainer />
        <div className="PoweredByFrame">
          <div className="PoweredByText">
            <div style={{ float: "left", paddingTop: 7, paddingLeft: 12 }}>
              <QLogo />
            </div>
            <div>yallhands</div>
          </div>
        </div>
      </div>
    );
  }
}
