import React from 'react';
import {NavLink} from 'react-router-dom'
import {QLogo} from '../Assets/Graphics/QLogo'
import './style.css';

export class Workspace extends React.Component {
    render() {
        return(
            <div className = "Workspace">
                <NavLink to="/base-settings"> <div className="WorkspaceLogo"/>
               </NavLink>
               
               
               <div className="WorkspaceName">
                
                <div style={{float: 'left', paddingLeft: 2, paddingTop: 13, width: 30, position: 'absolute'}}><QLogo/></div>
                <div style={{paddingLeft: 25}}>QUADRANCE</div>
                
         
           
               </div>
               
        
             
            </div>
        )
    }
}