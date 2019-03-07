import React from "react";
import { Button } from "semantic-ui-react";
import { PortalUserProfile } from "./PortalUserProfile";
import { withRouter } from "react-router-dom";
import { UserStore } from "../Stores/UserStore";
import "./style.css";



const PortalDesktop = props => {
  const portalReturn = !UserStore.user.isAdmin ? (
    <div />
  ) : (
    <div style={{ float: "right", paddingRight: 15, paddingTop: 6 }}>
      <Button size="mini" onClick={e => props.history.push("/panel/dashboard")}>
        {" "} Admin Panel{" "}
      </Button>
    </div>
  );

  return (
    <div>
      <div style={{ float: "left" }}> <PortalUserProfile /> </div>
      {portalReturn}
    </div>
  );
};
export default withRouter(PortalDesktop);
