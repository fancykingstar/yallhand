import React from "react";
import {inject, observer} from "mobx-react"
import { Button } from "semantic-ui-react";
import PortalUserProfile from "./PortalUserProfile";
import { withRouter } from "react-router-dom";
import "./style.css";




const PortalDesktop = inject("UIStore", "UserStore")(observer((props) => {
  const {UIStore, UserStore} = props
  const backToAdmin = () => {
    UIStore.reset("adminLoadingComplete")
    props.history.push("/panel")
  }
  const portalReturn = !UserStore.user.isAdmin ? (
    <div />
  ) : (
    <div style={{ float: "right", paddingRight: 15, paddingTop: 6 }}>
      <Button size="mini" onClick={e => backToAdmin()}>
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
}))
export default withRouter(PortalDesktop);
 