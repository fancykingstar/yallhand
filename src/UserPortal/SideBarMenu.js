import React from "react";
import { Menu, Icon, Form, Transition, Button } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import  SearchFrame  from "./SearchFrame"
import "./style.css";

@inject("ChannelStore", "UIStore", "UserStore", "DataEntryStore")
@observer
class SideBarMenu extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    const location = this.props.location.pathname;
    if (location.includes("portal/learn-detail/")) {
      UIStore.set("sideNav", "activePrimary", "policies");
    } else if (location.includes("/portal/learn")) {
      UIStore.set("sideNav", "activePrimary", "policies");
    } else if (location.includes("/portal/announcement/")) {
      UIStore.set("sideNav", "activePrimary", "announcements");
    } else if (location.includes("/portal/resources")) {
      UIStore.set("sideNav", "activePrimary", "resources");
    } else if (location.includes("/portal/directory")) {
      UIStore.set("sideNav", "activePrimary", "directory");
    } else if (location.includes("/portal/search")) {
      UIStore.set("sideNav", "activePrimary", "");
    } else {
      UIStore.set("sideNav", "activePrimary", "announcements");
    }
    UIStore.set("sideNav", "activeChannel", "All");
  }

  render() {
    const { ChannelStore, UIStore, UserStore, DataEntryStore } = this.props;
    const channelList = ChannelStore.allChannels.map(channel => (
      <Menu.Item
        name={channel.label} style={ UIStore.sideNav.activeChannel === channel.chanID
            ? { color: "#17b0e4" } : null }
        key={"portalmenu" + giveMeKey()}
        onClick={e => {
          UIStore.set("sideNav", "activeChannel", channel.chanID);
        }}
      />
    ));

    channelList.unshift(
      <Menu.Item
        name={"All"}
        key={"portalmenu" + giveMeKey()}
        style={ UIStore.sideNav.activeChannel === "All" ? { color: "#17b0e4" } : null }
        onClick={e => UIStore.set("sideNav", "activeChannel", "All")}
      />
    );

    const resetSearch = () => {
      if (UIStore.search.portalSearchValue !== "") {
        UIStore.set("search", "portalSearchValue", "");
      }
    };

    const portalReturn = this.props.mobile && UserStore.user.isAdmin ? 
      <div style={{ marginLeft: 15 }}>
        <Button size="mini"
          onClick={e => {
            this.props.history.push("/panel");
            UIStore.set("responsive", "mobileNav", false);
          }} > Return To Admin Panel{" "}
        </Button>
      </div>
     : <div/>

     const handleClick = () => {
      //   log(ItsLog(true,{"event": "click", "type":"ask"}))
      UIStore.set("modal", "askQuestion", true) 
    }

    return (
      <div className="PortalSideNav" onClick={e => resetSearch()}>
             <SearchFrame/>
        <Menu vertical secondary borderless={true}>
   
          <Menu.Item>
            <Menu.Header style={{fontSize: "1.3em"}}>
              {/* <Icon name="feed" /> */}
              Feed
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item
                style={
                  UIStore.sideNav.activePrimary === "announcements"
                    ? { backgroundColor: "#00a3e0", color: "#FFFFFF", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "announcements");
                  this.props.history.push("/portal");
                }}
                name="Announcements"
              />
              <Menu.Item
                style={
                  UIStore.sideNav.activePrimary === "policies"
                    ? { backgroundColor: "#00a3e0", color: "#FFFFFF", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "policies");
                  this.props.history.push("/portal/learn");
                }}
              >
                FAQs
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header style={{fontSize: "1.3em"}}>
              {/* <Icon name="cubes" /> */}
              Resources
            </Menu.Header>

            <Menu.Menu>
              <Menu.Item
                style={
                  UIStore.sideNav.activePrimary === "resources"
                    ? { backgroundColor: "#00a3e0", color: "#FFFFFF", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "resources");
                  this.props.history.push("/portal/resources");
                }}
              >
                Files
              </Menu.Item>
              <Menu.Item
                style={
                  UIStore.sideNav.activePrimary === "directory"
                    ? { backgroundColor: "#00a3e0", color: "#FFFFFF", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "directory");
                  this.props.history.push("/portal/directory");
                }}
                name="Staff Directory"
              />
            </Menu.Menu>
            </Menu.Item>

          
            <Menu.Item>
            <Menu.Header style={{fontSize: "1.3em"}}>
              {/* <Icon name="feed" /> */}
              Contact
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item
                style={
                  UIStore.sideNav.activePrimary === "ask"
                    ? { backgroundColor: "#00a3e0", color: "#FFFFFF", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "ask");
                  DataEntryStore.set("ask", "type", "general")
                  UIStore.set("modal", "askQuestion", true);
                }}
              >Ask Anything</Menu.Item>
              <Menu.Item
                style={
                  UIStore.sideNav.activePrimary === "report"
                    ? { backgroundColor: "#00a3e0", color: "#FFFFFF", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "report");
                  DataEntryStore.set("ask", "type", "anonymous")
                  UIStore.set("modal", "askQuestion", true);
                }}
              >
                Report Anonymously
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>

          

          <Transition
            animation={"fade"}
            visible={
              UIStore.sideNav.activePrimary === "announcements" ||
              UIStore.sideNav.activePrimary === "policies"
            }
            duration={250}
          >
            <Menu.Item>
              <Menu.Header style={{fontSize: "1.3em"}}>Channels</Menu.Header>
              <Menu.Menu style={{paddingLeft:4}}>{channelList}</Menu.Menu>
            </Menu.Item>
          </Transition>
          

          {/* {this.props.mobile ? ( */}
            {/* <Menu.Item>
              <SearchFrame/>
            </Menu.Item> */}
          {/* )  */}
          {/* : (
            <div />
          )} */}
        </Menu>
        {portalReturn}
      </div>
    );
  }
}
export default withRouter(SideBarMenu);
