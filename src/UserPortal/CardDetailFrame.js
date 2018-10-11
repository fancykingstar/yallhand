import React from "react";
// import { BackToChan } from "./BackToChan";
import { CardDetailView } from "./CardDetailView";
import "./style.css";

export const CardDetailFrame = ({match}) => (  

      <div className="PolicyFrame">
        <div className="ManagePolicy">
      
            {/* <BackToChan /> */}
       
         <CardDetailView policyID={match.params.id}/>
        </div>
      </div>
    );
 
