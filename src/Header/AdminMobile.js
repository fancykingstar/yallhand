import React from "react"
import {inject, observer} from "mobx-react"
import {PortalSelect} from "./PortalSelect"
import {Icon} from "semantic-ui-react"


export const AdminMobile = inject("UIStore")(observer((props) => {
    const {UIStore} = props
    return(
        <div> 
            <div className="Hamburger">
          <Icon
            onClick={e => UIStore.set( "responsive", "mobileNav", !UIStore.responsive.mobileNav ) }
            style={!UIStore.responsive.isMobile ? { display: "none" } : null }
            style={ UIStore.responsive.mobileNav ? { color: "#2FC7F8" } : { color: "#000000" } }
            name="bars"
            size="large"

          /></div>

        <div>
        <div style={{float: "right", paddingRight: 15, paddingTop: 10}}>
            <PortalSelect teamChange={(e, val) => props.teamChange(e, val)} />
        </div></div>
        </div>

    )}))