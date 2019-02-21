import React from "react";
import { Menu, Icon, Responsive, Input } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { NavLink, withRouter } from "react-router-dom";
import { giveMeKey } from "../SharedCalculations/GiveMeKey"
import "./style.css"

@inject("ChannelStore", "UIStore")
@observer
class SideBarMenu extends React.Component {


  render() {
    const { ChannelStore, UIStore } = this.props;
    const channelList = ChannelStore.allChannels.map(channel => (
      <Menu.Item name={channel.label} key={"portalmenu" + giveMeKey()} 
        onClick={e => { this.props.history.push( "/portal" )
        UIStore.set("sideNav", "activeChannel", channel.chanID)
      } } />
    ));
    channelList.unshift(<Menu.Item name={"All"} key={"portalmenu" + giveMeKey()} 
      onClick={e => { this.props.history.push( "/portal" )
      UIStore.set("sideNav", "activeChannel", "All")
    }} />)

    return (
      <div className="PortalSideNav">
      <Menu compact vertical secondary borderless={true} >
        <Menu.Item>
          <Menu.Header>
          {" "}
            <Icon name="newspaper outline" />
            Feed
          </Menu.Header>
          <Menu.Menu>
          <Menu.Item disabled>Featured</Menu.Item>

          <NavLink to="/portal" style={{ color: "rgb(45, 45, 45)" }}>
            <Menu.Item name="Announcements" />
            
          </NavLink>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
    
          <Menu.Header>
            {" "}
            <Icon name="info circle" />
            Learn
          </Menu.Header>
          <Menu.Menu>
            {channelList}
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>
            <Icon name="cubes" />
            Resources
          </Menu.Header>

          <Menu.Menu>
            <Menu.Item
              name="common"
              //   active={activeItem === 'shared'}
              //   onClick={this.handleItemClick}
            />
            <Menu.Item
              name="recently used"
              //   active={activeItem === 'dedicated'}
              //   onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>
            <Icon name="help circle" />
            Support
          </Menu.Header>

          <Menu.Menu>
            <Menu.Item disabled name="email">
              Directory
            </Menu.Item>
            <Menu.Item disabled name="email">
              Get Assistance
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        {this.props.mobile?        <Menu.Item>
      <Input className='icon' icon='search' placeholder='Search...' />
    </Menu.Item> : <div/>}
      </Menu>
      </div>
    );
  }
}
export default withRouter(SideBarMenu);
