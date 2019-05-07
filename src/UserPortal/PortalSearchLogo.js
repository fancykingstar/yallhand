import React from "react"
import {Icon} from "semantic-ui-react"
import { UIStore } from "../Stores/UIStore"
import "./style.css"

export const PortalSearchLogo = () => {
    return(
        <div className="ActionFrameMessage">
    <div className="NoSearchResults">
        <span 
         style={{fontSize:"3em", color: "#ABACAB"}}
         ><Icon name="search"/>{"  "}no search results... </span>
    </div>
    </div>
    )
}