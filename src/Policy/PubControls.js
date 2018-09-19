import React from "react";
import "./style.css";
import { Menu, Icon } from "semantic-ui-react";
export class PubControls extends React.Component {
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
        <Menu.Item name="draft" onClick={this.handleItemClick}>
          <Icon name='keyboard' size="small" />
          Save Draft
        </Menu.Item>

        <Menu.Item
          name='publish'
         
          onClick={this.handleItemClick}
        >
          <Icon name='rocket'  size="small"/>
          Publish
        </Menu.Item>
        <Menu.Item
          name='update'
      
          onClick={this.handleItemClick}
        >
          <Icon name='angle double up'  size="small"/>
          Update
        </Menu.Item>

        <Menu.Item
          name='unpublish'
          onClick={this.handleItemClick}
      
        >
          <Icon name='remove circle'  size="small"/>
          Un-Publish
        </Menu.Item>
        <Menu.Item
          name='archive'
          onClick={this.handleItemClick}
      
        >
          <Icon name='archive'  size="small"/>
          Archive
        </Menu.Item>
      </Menu>
    
      </div>
    );
  }
}
