import React from 'react';
import { Input } from 'semantic-ui-react'
import './style.css';

export class ChannelSearch extends React.Component {
    render() {
        return(
            <div className = "ChannelSearch">
                <Input inverted icon='search' transparent size="tiny" placeholder='search channels...' />
            </div>
        )
    }
}