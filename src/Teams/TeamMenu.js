import React from "react";
import "./style.css";
import { Input, Menu } from 'semantic-ui-react'

export class TeamMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {activeItem: 'home'}
    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    render() {
        const { activeItem } = this.state

        return(
            <div className="TeamMenu">
            <Menu secondary>
            <Menu.Item
              name='invite'
              active={activeItem === 'invite users'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='users'
              active={activeItem === 'users'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='configure teams'
              active={activeItem === 'configure teams'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='classes'
              active={activeItem === 'classes'}
              onClick={this.handleItemClick}
            />

          </Menu>
          </div>
        )
    }
}