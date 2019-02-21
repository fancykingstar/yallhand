import React from "react";
import "./style.css"

export const UserWorkspace = props => {
  return (
    <div style={{ height: 100 }}>

        <div
          className={props.mobile? "WorkspacePortalLogoSm" : "WorkspacePortalLogoLrg"}
          style={{ backgroundImage: `url(https://quadrance-files.s3.amazonaws.com/central/A1_15e5d752-3c8d-441e-8f49-46253a0eb1a8.png)` }} />
        <div className="WorkspaceNamePortal" style={{color: "#000000"}}>company</div>

    </div>
  );
};
