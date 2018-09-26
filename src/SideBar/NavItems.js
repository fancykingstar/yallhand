import React from 'react';
import { Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";


import './style.css';

export class NavItems extends React.Component {
    makeActive = (navItem) => {this.props.whenClicked(navItem)}
    
    render() {
        const {Store} = this.props
        return(
            <div className = "Container">
             
                <Link to="/teams">
                <div className="NavItemFrame" active={true} onClick={() => this.makeActive('teams')}>
                    <div className="NavItemIcon"><Icon name='group' /></div>
                    <div className="NavItemText"><h4>Teams</h4></div>
                </div></Link>
                <br />
                <Link to="/resources">
                <div className="NavItemFrame" onClick={() => this.makeActive('resources')}>
                    <div className="NavItemIcon"><Icon name='cubes' /></div>
                    <div className="NavItemText"><h4>Resources</h4></div>
                </div></Link>
                <br />
                <Link to="/automations">
                <div className="NavItemFrame" onClick={() => this.makeActive('automations')}>
                    <div className="NavItemIcon"><Icon name='sync alternate' /></div>
                    <div className="NavItemText"><h4>Automations</h4></div>
                </div></Link>
                <br />
                <Link to="/annoucements" onClick={() => this.makeActive('annoucements')}>
                <div className="NavItemFrame">
                    <div className="NavItemIcon"><Icon name='bullhorn' /></div>
                    <div className="NavItemText"><h4>Annoucements</h4></div>
                </div></Link>
             
              
            </div>
        )
    }
}