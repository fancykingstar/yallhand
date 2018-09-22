import React from "react";
import "./style.css";
import { Menu, Icon } from "semantic-ui-react";
export class TeamControls extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      activeItem: ''
    }
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { activeItem } = this.state
    return (
      <div id="PubControls">
             <Menu compact icon='labeled' vertical size="mini" inverted>
        <Menu.Item name="send" onClick={this.handleItemClick}>
          <Icon name='send' size="small" />
          Send
        </Menu.Item>
        </Menu>

       
       
    
      </div>
    );
  }
}
