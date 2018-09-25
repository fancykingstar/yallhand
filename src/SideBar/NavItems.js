import React from 'react';
import { Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";

import './style.css';

export class NavItems extends React.Component {
    render() {
        return(
            <div className = "Container">
                
                <Link to="/teams">
                <div className="NavItemFrame">
                    <div className="NavItemIcon"><Icon name='group' /></div>
                    <div className="NavItemText"><h4>Teams</h4></div>
                </div></Link>
                <br />
                <Link to="/resources">
                <div className="NavItemFrame">
                    <div className="NavItemIcon"><Icon name='cubes' /></div>
                    <div className="NavItemText"><h4>Resources</h4></div>
                </div></Link>
                <br />
                <Link to="/automations">
                <div className="NavItemFrame">
                    <div className="NavItemIcon"><Icon name='sync alternate' /></div>
                    <div className="NavItemText"><h4>Automations</h4></div>
                </div></Link>
                <br />
                <Link to="/annoucements">
                <div className="NavItemFrame">
                    <div className="NavItemIcon"><Icon name='bullhorn' /></div>
                    <div className="NavItemText"><h4>Annoucements</h4></div>
                </div></Link>
             
              
            </div>
        )
    }
}