import React from "react"
import {PortalSelect} from "./PortalSelect"

export const AdminDesktop = (props) => {
    return(
        <div style={{float: "right", paddingRight: 15, paddingTop: 10}}>
            <PortalSelect teamChange={(e, val) => props.teamChange(e, val)} />
        </div>
              
    )
}