import React from "react";
import { Divider } from "semantic-ui-react"
import SideBarMenu from "./SideBarMenu"
import { UserWorkspace } from "./UserWorkspace"
import {UIStore} from "../Stores/UIStore"
import "./style.css";


export const SideBarPortal = (props) => {
  return (
    <div className={UIStore.responsive.isMobile? "SideBarFrameMobile":"SideBarFrame"}>
            <UserWorkspace mobile={props.mobile}/>
            <Divider inverted style={{marginTop: 3, marginBottom: 3}}/>
            <SideBarMenu mobile={props.mobile}/>
    </div>
  );
};
