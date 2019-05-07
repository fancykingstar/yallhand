import React from "react"
import {Icon} from "semantic-ui-react"
import {Desert} from "../Assets/Graphics/Desert"
import { UIStore } from "../Stores/UIStore"
import "./style.css"


export const PortalContentNoResults = () => {
    return(
        <div className="ActionFrameMessage">
        <div className="NoSearchResults">
 
    <div style={{marginTop: 100, width: "100%", display: "inline-block"}}>  
    <div style={{paddingTop: 30,textAlign: "center"}}><Desert/><span style={{fontSize:"2.8em", color: "#ABACAB", lineHeight: "30px"}}>{"  "}Nothing here...(yet)</span></div> 
 
       
    </div>
    </div>    
    </div>
    )
}