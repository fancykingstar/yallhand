import React from "react"
import {Icon} from "semantic-ui-react"
import {Desert} from "../Assets/Graphics/Desert"
import { UIStore } from "../Stores/UIStore"
import "./style.css"


export const PortalContentNoResults = () => {
    return(
        <div className="NoResultsContainer" >
            <div className="NoResultsMessage">
        <Desert/>
        <span style={{fontSize:"2.8em", color: "#ABACAB", lineHeight: "30px"}}> {"  "}Nothing here...(yet)</span>
        </div>
        </div>
 

  
       

    )
}