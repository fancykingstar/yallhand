import React from "react"
import {inject, observer} from "mobx-react"
import {PortalSelect} from "./PortalSelect"
import {Icon} from "semantic-ui-react"


export const AdminMobile = inject("UIStore")(observer((props) => {
    const {UIStore} = props

    const style = () => {
      let output = {}
      if(!UIStore.responsive.isMobile){ output.display = "none" }
      if(UIStore.responsive.mobileNav){output.color = "#2FC7F8"} 
      else{output.color = "#000000"}
      return output
    }

    return(
        <div> 
            <div className="Hamburger">
          <Icon
            onClick={e => UIStore.set( "responsive", "mobileNav", !UIStore.responsive.mobileNav ) }
            style={style()}
            name="bars"
            size="large"

          /></div>

        <div>
        <div style={{float: "right", paddingRight: 15, paddingTop: 10}}>
            <PortalSelect teamChange={(e, val) => props.teamChange(e, val)} />
        </div></div>
        </div>

    )}))