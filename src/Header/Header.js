import React from 'react';
import { Icon } from "semantic-ui-react";
import './style.css';

export class Header extends React.Component {
    render() {
        return(
            <div className = "Header">
                <div className="MobileMenu">
                    <Icon name="bars" size="huge" color="black"/>
                </div>
            </div>
        )
    }
}