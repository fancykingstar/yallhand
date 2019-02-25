import React from "react";
import { Menu, Icon, Form, Transition } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { giveMeKey } from "../SharedCalculations/GiveMeKey"
import "./style.css"

@inject("ChannelStore", "UIStore")
@observer
class SideBarMenu extends React.Component {

  componentDidMount() {
    const {UIStore} = this.props
    const location = this.props.location.pathname
    if(location.includes("portal/learn-detail/")){UIStore.set("sideNav", "activePrimary", "policies")}
    else if(location.includes("/portal/learn")){UIStore.set("sideNav", "activePrimary", "policies")}
    else if(location.includes("/portal/announcement/")){UIStore.set("sideNav", "activePrimary", "announcements")}
    else if(location.includes("/portal/resources")){UIStore.set("sideNav", "activePrimary", "resources")}
    else if(location.includes("/portal/directory")){UIStore.set("sideNav", "activePrimary", "directory")}
    else if(location.includes("/portal/search")){UIStore.set("sideNav", "activePrimary", "")}
    else{UIStore.set("sideNav", "activePrimary", "announcements")}
    UIStore.set("sideNav", "activeChannel", "All")
  }

  render() {
    const { ChannelStore, UIStore } = this.props;
    const channelList = ChannelStore.allChannels.map(channel => (
      <Menu.Item 
        name={channel.label} 
        style={UIStore.sideNav.activeChannel === channel.chanID? {color: "#17b0e4"}: null}
        key={"portalmenu" + giveMeKey()} 
        onClick={e => { UIStore.set("sideNav", "activeChannel", channel.chanID) }} 
      />
    ));
    channelList.unshift(<Menu.Item name={"All"} key={"portalmenu" + giveMeKey()} 
      style={UIStore.sideNav.activeChannel === "All"? {color: "#17b0e4"}: null}
      onClick={e => UIStore.set("sideNav", "activeChannel", "All") }/>
    )

    const resetSearch = () => {
      if(UIStore.search.portalSearchValue !== "") {
        UIStore.set("search", "portalSearchValue", "")
      }
    }

    return (
      <div className="PortalSideNav" onClick={e => resetSearch()}>
      <Menu compact vertical secondary borderless={true} >
        <Menu.Item>
          <Menu.Header>
            <Icon name="feed" />
            Feed
          </Menu.Header>
          <Menu.Menu>
            <Menu.Item 
              style={UIStore.sideNav.activePrimary === "announcements"? {backgroundColor: "#17b0e4", color: "#FFFFFF"} : null}
              onClick={e => {
                UIStore.set("sideNav", "activePrimary", "announcements")
                this.props.history.push("/portal")
              }} 
              name="Announcements" />
            <Menu.Item 
               style={UIStore.sideNav.activePrimary === "policies" ? {backgroundColor: "#17b0e4", color: "#FFFFFF"} : null}
               onClick={e => {
                 UIStore.set("sideNav", "activePrimary", "policies")
                 this.props.history.push("/portal/learn")
               }} 
              >FAQs</Menu.Item>

          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>
            <Icon name="cubes" />
            Resources
          </Menu.Header>

          <Menu.Menu>
            <Menu.Item 
              style={UIStore.sideNav.activePrimary === "resources" ? {backgroundColor: "#17b0e4", color: "#FFFFFF"} : null}
              onClick={e => {
                UIStore.set("sideNav", "activePrimary", "resources")
                this.props.history.push("/portal/resources")
              }} 
            >Files and URLs</Menu.Item>
            <Menu.Item 
                style={UIStore.sideNav.activePrimary === "directory" ? {backgroundColor: "#17b0e4", color: "#FFFFFF"} : null}
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "directory")
                  this.props.history.push("/portal/directory")
                }} 
            name="Staff Directory" />
          </Menu.Menu>
        </Menu.Item>

        

                <Transition animation={"fade"} visible={UIStore.sideNav.activePrimary === "announcements" || UIStore.sideNav.activePrimary === "policies"}  duration={250}>
    <Menu.Item>
          <Menu.Header>
            Channels
          </Menu.Header>
          <Menu.Menu>
            {channelList}
          </Menu.Menu>
        </Menu.Item>
        </Transition>
  
        {this.props.mobile?        <Menu.Item>
      <Form onSubmit={e => {
        this.props.history.push("/portal/search")
        UIStore.set("responsive", "mobileNav", false)
      }}>
      <Form.Input className='icon' 
        value={UIStore.search.portalSearchValue} 
        onChange={(e, val) => UIStore.set("search", "portalSearchValue", val.value)}
        icon='search' 
        placeholder='Search...' />
        </Form>
    </Menu.Item> : <div/>}
</Menu>
      </div>
    );
  }
}
export default withRouter(SideBarMenu);
