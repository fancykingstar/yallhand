import React from 'react';
import { Logo } from './Logo';
import { UserProfile } from './UserProfile';
import { ChannelContainer } from './ChannelContainer'
import { NavItems } from './NavItems'
import './style.css';

export class SideBar extends React.Component {
    render() {
        return(
            <div className = "SideBar">
                <Logo />
                <UserProfile />
                <NavItems />
                <ChannelContainer />
            </div>
        )
    }
}