import React from "react";
import { BackToChan } from "./BackToChan";
import { ManagePolicy } from "./ManagePolicy";
import "./style.css";

export const PolicyFrame = ({match}) => (  

      <div className="PolicyFrame">
        <div className="ManagePolicy">
      
            <BackToChan />
       
         <ManagePolicy policyID={match.params.id}/>
        </div>
      </div>
    );
 
