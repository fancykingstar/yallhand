import React from 'react';
import { Channel } from './Channel'
import { ChannelHeader } from './ChannelHeader'
import { ChannelSearch } from './ChannelSearch'
import { Accordion, Icon } from 'semantic-ui-react'
import './style.css';

export class ChannelContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {  activeIndex: 0 }
    }
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
      }
    render() {
        const { activeIndex } = this.state

        return(
            <div className = "Container">
                <ChannelHeader />
                <ChannelSearch />
                <Channel text="Sales" active="false"/>
                <Channel text="Marketing" active="false"/>
                <Accordion>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                    <Icon inverted name='dropdown' />
                    <span style={{color: '#D7D7D7'}}>HR</span>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                    <Channel text="Benefits" active="false"/>
                    <Channel text="Payroll" active="true"/>
                    </Accordion.Content>
                </Accordion>
            </div>
        )
    }
}