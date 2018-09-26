import React from 'react';
import './style.css';

export const Channel = (props) => {
   
        const name = props.text
        const active = (props.active === true) ? "ChannelFrame SideBarActive" : "ChannelFrame";
        return(
            <div className = {active}>
                <div className = "ChannelText">{name}</div>
            </div>
        )
  
}