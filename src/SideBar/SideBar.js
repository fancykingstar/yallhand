import React from "react";
import { Workspace } from "./Workspace";
import { UserProfile } from "./UserProfile";
import { ChannelContainer } from "./ChannelContainer";
import { NavItems } from "./NavItems";
import "./style.css";

export class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isActive: "all" };
  }
 

  render() {
    function updateActive(val) {
        if (val !== this.state.isActive) {this.setState({ isActive: val })};
      };
    return (
      <div className="SideBar">
        <Workspace />
        <UserProfile />
        <NavItems whenClicked={val => updateActive(val)} />
        <ChannelContainer />
      </div>
    );
  }
}
