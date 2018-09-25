import React from 'react';
import { Workspace } from './Workspace';
import { UserProfile } from './UserProfile';
import { ChannelContainer } from './ChannelContainer'
import { NavItems } from './NavItems'
import './style.css';

export class SideBar extends React.Component {
    render() {
        return(
            <div className = "SideBar">
                <Workspace />
                <UserProfile />
                <NavItems />
                <ChannelContainer />
            </div>
        )
    }
}