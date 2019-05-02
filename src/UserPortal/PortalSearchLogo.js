import React from "react"
import {Icon} from "semantic-ui-react"
import { UIStore } from "../Stores/UIStore"


export const PortalSearchLogo = () => {
    return(
    <div style={!UIStore.responsive.isMobile?  {marginLeft: -525} : null}>
    <div 
     style={{width: 400, margin: "auto", marginTop: 250}}>
        <span 
         style={{fontSize:"3em", color: "#ABACAB"}}
         ><Icon name="search"/>{"  "}no search results... </span>
    </div>
    </div>    
    )
}