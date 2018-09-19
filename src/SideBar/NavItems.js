import React from 'react';
import { Icon } from 'semantic-ui-react'
import './style.css';

export class NavItems extends React.Component {
    render() {
        return(
            <div className = "Container">
                <div className="NavItemFrame">
                    <div className="NavItemIcon"><Icon name='group' /></div>
                    <div className="NavItemText"><h4>Teams</h4></div>
                </div>
                <br />
                <div className="NavItemFrame">
                    <div className="NavItemIcon"><Icon name='cubes' /></div>
                    <div className="NavItemText"><h4>Resources</h4></div>
                </div>
                <br />
                <div className="NavItemFrame">
                    <div className="NavItemIcon"><Icon name='sync alternate' /></div>
                    <div className="NavItemText"><h4>Automations</h4></div>
                </div>
            </div>
        )
    }
}