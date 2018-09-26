import React from 'react';
import { Workspace } from './Workspace';
import { UserProfile } from './UserProfile';
import { ChannelContainer } from './ChannelContainer'
import { NavItems } from './NavItems'
import { Provider } from 'mobx-react'
import SideBarStore from '../Stores/SideBarStore'
import './style.css';

export class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isActive: "all" }
    }
    updateActive = (val) => {
        val != this.state.isActive ? this.setState({isActive: val}) : null}
        
    render() {
        return(
            <Provider Store={SideBarStore}>
            <div className = "SideBar">
                <Workspace />
                <UserProfile />
                <NavItems whenClicked={(val) => this.updateActive(val)}/>
                <ChannelContainer />
            </div>
            </Provider>
        )
    }
}