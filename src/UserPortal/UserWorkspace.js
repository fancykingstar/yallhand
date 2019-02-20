import React from "react";

export const UserWorkspace = props => {
  return (
    <div style={{ height: 150}}>
      <div className="LoginWorkspace">
        <div
          className="WorkspaceLogoLogin"
          style={{
            backgroundImage: `url(https://quadrance-files.s3.amazonaws.com/central/A1_15e5d752-3c8d-441e-8f49-46253a0eb1a8.png)`
          }}
        />{" "}
        <div className="WorkspaceNameLogin">company</div>
      </div>
    </div>
  );
};
