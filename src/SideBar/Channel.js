import React from 'react';
import './style.css';

export class Channel extends React.Component {
    render() {
        const name = this.props.text
        const active = (this.props.active === 'true') ? "ChannelFrame SideBarActive" : "ChannelFrame";
        return(
            <div className = {active}>
                <div className = "ChannelText">{name}</div>
            </div>
        )
    }
}