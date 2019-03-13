import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import { AdminDesktop } from "./AdminDesktop"
import { AdminMobile } from "./AdminMobile"
import { PortalMobile } from "./PortalMobile"
import  PortalDesktop  from "./PortalDesktop"
import "./style.css";


@inject("TeamStore", "UserStore", "UIStore")
@observer
class Header extends React.Component {
  constructor(props){
    super(props)
    this.mode = this.props.location.pathname.includes("panel")? "panel" : "portal"
  }
  render() {
    const { TeamStore, UserStore, UIStore } = this.props;

    const teamChange = (e, val) => {
      UserStore.setPreviewTeam(val.team);
      UserStore.setPreviewTag(val.tag);
      UserStore.setPreviewTeamPath(
        TeamStore.previewValidPath(val.team, "team")
      );
      UserStore.setPreviewTagPath(TeamStore.previewValidPath(val.tag, "tag"));
      this.props.history.push("/portal");
    };

    const header = () => {
      if(this.mode === "panel" && UIStore.responsive.isMobile === false){return <AdminDesktop teamChange={(e, val) => teamChange(e, val)}/>}
      else if(this.mode === "panel" && UIStore.responsive.isMobile){return <AdminMobile teamChange={(e, val) => teamChange(e, val)}/>}
      else if(this.mode === "portal" && UIStore.responsive.isMobile === false){return <PortalDesktop/>}
      else if(this.mode === "portal" && UIStore.responsive.isMobile){return <PortalMobile/>}
    }


    return (
      <div className={
        this.mode === "panel" ? 
        "Header" : "PortalHeader" }>
        <div style={{paddingLeft: 20}}>
          {header()}
        </div>

    


        {/* <div className="MobileMenu"  onClick={e => UIStore.set( "responsive", "mobileNav", !UIStore.responsive.mobileNav ) } style={!UIStore.responsive.isMobile ? { display: "none" } : null} >
          <div style={{ float: "left"}}>
            <Icon
              name="bars"
              size="large"
              style={
                UIStore.responsive.mobileNav
                  ? { color: "#2FC7F8" }
                  : { color: "white" }
              }
            />
          </div>
          <div > 
           
          </div>
        </div>
        <PortalUserProfile />
         */}
      </div>
    );
  }
}
export default withRouter(Header);