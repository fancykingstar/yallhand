import React from "react";
import {AccountStore} from "../Stores/AccountStore"
import "./style.css"

export const UserWorkspace = props => {
  return (
    <div style={{ height: 100 }}>

        <div
          className={props.mobile? "WorkspacePortalLogoSm" : "WorkspacePortalLogoLrg"}
          style={{ backgroundImage: `url(${AccountStore.account.img})` }} />
        <div className="WorkspaceNamePortal" style={{color: "#000000"}}>{AccountStore.account.label}</div>

    </div>
  );
};
