import React from "react"
import { inject, observer} from "mobx-react"
import { Icon } from "semantic-ui-react"
import {PortalUserProfile} from "./PortalUserProfile"

export const PortalMobile = inject("UIStore")(observer((props) => {
    const {UIStore} = props
    return(
        <div>
        <div className="Hamburger" >
          <Icon
            onClick={e => UIStore.set( "responsive", "mobileNav", !UIStore.responsive.mobileNav ) }
            style={!UIStore.responsive.isMobile ? { display: "none" } : null }
            style={ UIStore.responsive.mobileNav ? { color: "#2FC7F8" } : { color: "#FFFFFF" } }
            name="bars"
            size="large"
          /></div>

 

        <div style={{float: "right"}}>
        <PortalUserProfile direction="left"/>
        </div>
        </div>
    )}))
