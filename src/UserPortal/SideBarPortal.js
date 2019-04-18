import React from "react";
import { Divider } from "semantic-ui-react"
import SideBarMenu from "./SideBarMenu"
import { UserWorkspace } from "./UserWorkspace"
import "./style.css";


export const SideBarPortal = (props) => {
  return (
    <div className="SideBarFrame">
            <UserWorkspace mobile={props.mobile}/>
            <Divider inverted style={{marginTop: 3, marginBottom: 3}}/>
            <SideBarMenu mobile={props.mobile}/>
    </div>
  );
};
