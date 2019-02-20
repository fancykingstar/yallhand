import React from "react";
import { CardDetailView } from "./CardDetailView";
import "./style.css";

export const CardDetailFrame = ({match}) => (  

      <div className="PolicyFrame">
        <div className="ManagePolicy">
      

       
         <CardDetailView policyID={match.params.id}/>
        </div>
      </div>
    );
 
