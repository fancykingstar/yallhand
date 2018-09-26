import React from 'react';
import {NavLink} from 'react-router-dom'
import {HyprLogo} from '../Assets/Graphics/HyprLogo'
import './style.css';

export class Workspace extends React.Component {
    render() {
        return(
            <div className = "Workspace">
                <NavLink to="/base-settings"> <div className="WorkspaceLogo"/>
               </NavLink>
               
               
               <div className="WorkspaceName">
                
                <div style={{float: 'left', paddingLeft: 5, width: 30}}><HyprLogo/></div>
                <div style={{paddingLeft: 38}}>HYPRSPACE</div>
                
         
           
               </div>
               
        
             
            </div>
        )
    }
}