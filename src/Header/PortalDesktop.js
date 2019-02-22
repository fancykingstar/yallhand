import React from "react"
import { Button } from "semantic-ui-react"
import {PortalUserProfile} from "./PortalUserProfile"
import { withRouter } from "react-router-dom";
import "./style.css"

const PortalDesktop = (props) => {
    return(
      <div>
       <div style={{float: "left"}}>
            <PortalUserProfile />
       </div>

        <div style={{float: "right", paddingRight: 15, paddingTop: 6}}>
         <Button size="mini" onClick={e => props.history.push("/panel/dashboard")} > Admin Panel </Button>
        </div>
        </div>
      
    )
}
export default withRouter(PortalDesktop);