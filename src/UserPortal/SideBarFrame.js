import React from "react";
import { Divider } from "semantic-ui-react"
import SideBarMenu from "./SideBarMenu"
import { UserWorkspace } from "./UserWorkspace"
import "./style.css";

export const SideBarFrame = () => {
  return (
    <div className="SideBarFrame">
        <div className="SideBarMenu">
            <UserWorkspace/>
            <Divider/>
            <SideBarMenu/>
        </div>
    </div>
  );
};
