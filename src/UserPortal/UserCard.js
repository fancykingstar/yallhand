import React from 'react'
import { Icon, Label } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import Style from 'style-it';
import './card-style.css'

export const UserCard = (props) => {
        const bgimg = props.data.img
            return(
            <div>
            <Style>
                {`
                    .Card:before {
                        background-image: url('${bgimg}'); 
                    }
                `}
            </Style>
            <Link to={"/portal/learn-detail/" + props.data.policyID} style={{color: "rgb(45, 45, 45)"}}>
            <div className="Card">
            
          
                <div className="displayAdjust">
             
                <div className="Question"><h3>{props.data.label}</h3></div>
                
               
              
                </div>
            
            </div>
            </Link>
            </div>
        )
    
}