import React from 'react';
import {NavLink} from 'react-router-dom'
import './style.css';

export class Workspace extends React.Component {
    render() {
        return(
            <div className = "Workspace">
                <NavLink to="/base-settings"> <div className="WorkspaceLogo"/>
               </NavLink>
               <div className="WorkspaceName">HYPERSBASE</div>
             
            </div>
        )
    }
}