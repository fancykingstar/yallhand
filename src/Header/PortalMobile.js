import React from "react"
import { inject, observer} from "mobx-react"
import { Icon } from "semantic-ui-react"
import PortalUserProfile from "./PortalUserProfile"

export const PortalMobile = inject("UIStore")(observer((props) => {
    const {UIStore} = props
  const style = () => {
    let output = {}
    if(!UIStore.responsive.isMobile){ output.display = "none" }
    if(UIStore.responsive.mobileNav){output.color = "#2FC7F8"} 
    else{output.color = "#FFFFFF"}
    return output
  }

    return(
        <div>
        <div className="Hamburger" >
          <Icon
            onClick={e => UIStore.set( "responsive", "mobileNav", !UIStore.responsive.mobileNav ) }
            style={style()}
            name="bars"
            size="large"
          /></div>

 

        <div style={{float: "right"}}>
        <PortalUserProfile direction="left"/>
        </div>
        </div>
    )}))
