import React from "react";
import { Menu, Icon, Responsive, Input } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { giveMeKey } from "../SharedCalculations/GiveMeKey"
import "./style.css"

@inject("ChannelStore", "UIStore")
@observer
class SideBarMenu extends React.Component {


  render() {
    const { ChannelStore, UIStore } = this.props;
    const channelList = ChannelStore.allChannels.map(channel => (
      <Menu.Item name={channel.label} key={"portalmenu" + giveMeKey()} 
        onClick={e => { UIStore.set("sideNav", "activeChannel", channel.chanID) }} 
      />
    ));
    channelList.unshift(<Menu.Item name={"All"} key={"portalmenu" + giveMeKey()} 
      onClick={e => UIStore.set("sideNav", "activeChannel", "All") }/>
    )

    return (
      <div className="PortalSideNav">
      <Menu compact vertical secondary borderless={true} >
        <Menu.Item>
          <Menu.Header>
          {" "}
            <Icon name="feed" />
            Feed
          </Menu.Header>
          <Menu.Menu>
            <Menu.Item onClick={e => this.props.history.push("/portal")} name="Announcements" />
            <Menu.Item onClick={e => this.props.history.push("/portal/learn")}>FAQs</Menu.Item>

          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>
            <Icon name="cubes" />
            Resources
          </Menu.Header>

          <Menu.Menu>
            <Menu.Item >Files and URLs</Menu.Item>
            <Menu.Item name="Staff Directory" />
          </Menu.Menu>
        </Menu.Item>

        


    <Menu.Item>
          <Menu.Header>
            Channels
          </Menu.Header>
          <Menu.Menu>
            {channelList}
          </Menu.Menu>
        </Menu.Item>

  
        {this.props.mobile?        <Menu.Item>
      <Input className='icon' 
        value={UIStore.search.portalSearchValue} 
        onChange={(e, val) => UIStore.set("search", "portalSearchValue", val.value)}
        icon='search' 
        placeholder='Search...' />
    </Menu.Item> : <div/>}
</Menu>
      </div>
    );
  }
}
export default withRouter(SideBarMenu);
