import React from 'react';
import { Input } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import './style.css';


export const ChannelSearch = inject("SideBarStore")(observer((props) => {
        const {SideBarStore} = props
        const handleChange = (e, val) => {SideBarStore.handleSearch(val.value)}
        return(
            <div className = "ChannelSearch">
                <Input inverted icon='search' transparent size="tiny" placeholder='search channels...' onChange={(e, val) => handleChange(e, val)} />
            </div>
)}));