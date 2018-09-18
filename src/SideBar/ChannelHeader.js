import React from 'react';
import { PlusButton } from '../Assets/Graphics/PlusButton'
import './style.css';

export class ChannelHeader extends React.Component {
    render() {
        return(

                <div className="ChannelHeader">
                    <div style={{float : 'left'}}><h4>Channels</h4></div>
                    <div className="ChannelAdd" style={{float : 'right', marginRight: 50}}><PlusButton /></div>
                </div>
                
               

        )
    }
}