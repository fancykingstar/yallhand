import React from "react";
import { Menu, Icon, Label, Transition, Button } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import  SearchFrame  from "./SearchFrame"
import {ItsLog} from "../DataExchange/PayloadBuilder"
import { log } from "../DataExchange/Up"

import "./style.css";

@inject("ChannelStore", "UIStore", "UserStore", "DataEntryStore", "PoliciesStore", "AnnouncementsStore")
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
    const { ChannelStore, UIStore, UserStore, DataEntryStore, PoliciesStore, AnnouncementsStore } = this.props;

    const nonviewedPolicies = PoliciesStore.allPolicies.filter(i => UIStore.portal.viewedContent.includes(i.policyID) === false )
    const nonviewedAnnouncements = AnnouncementsStore.allAnnouncements.filter(i => UIStore.portal.viewedContent.includes(i.announcementID) === false )

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
      // if (UIStore.search.portalSearchValue !== "") {
      //   UIStore.set("search", "portalSearchValue", "");
      // }
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
        log(ItsLog(true,{"event": "click", "type":"ask"}))
      UIStore.set("modal", "askQuestion", true) 
    }

    return (
      <div className="PortalSideNav" onClick={e => resetSearch()}>
             <SearchFrame/>
        <Menu inverted vertical secondary borderless={true}>
   
          <Menu.Item>
            <Menu.Header style={{fontSize: "1.3em", color: "#FF136B"}}>
            <Icon size="small" style={{color: "#FFFFFF"}} name="newspaper outline" />
            {" "}Feed{" "}
       
          
             
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item
                active={UIStore.sideNav.activePrimary === "announcements"}
                style={
                  UIStore.sideNav.activePrimary === "announcements"
                    ? { backgroundColor: "#00a3e0", color: "#FFFFFF", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "announcements");
                  this.props.history.push("/portal");
                  document.getElementById('ActionFrame').scrollTop = 0;
                }}
              >
              Announcements
              {nonviewedAnnouncements.length === 0? null : <div style={{display: "inline-block", marginLeft: 10}}><Label size="mini" color='red'>{String(nonviewedAnnouncements.length)}</Label></div>}

              </Menu.Item>
              <Menu.Item
                active={UIStore.sideNav.activePrimary === "policies"}
                style={
                  UIStore.sideNav.activePrimary === "policies"
                    ? { backgroundColor: "#00a3e0", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "policies");
                  this.props.history.push("/portal/learn");
                  document.getElementById('ActionFrame').scrollTop = 0;
                }}
              >               
                FAQs
                {nonviewedPolicies.length === 0? null :  <div style={{display: "inline-block", marginLeft: 10}}><Label size="mini" color='red'>{String(nonviewedPolicies.length)}</Label></div>}
              </Menu.Item>
                {UserStore.user.invitedBy !== "admin"? "":
              <Menu.Item
                active={UIStore.sideNav.activePrimary === "policies"}
                style={
                  UIStore.sideNav.activePrimary === "policies"
                    ? { backgroundColor: "#00a3e0", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "policies");
                  this.props.history.push("/portal/learn");
                  document.getElementById('ActionFrame').scrollTop = 0;
                }}
              >               
                Surveys
                {nonviewedPolicies.length === 0? null :  <div style={{display: "inline-block", marginLeft: 10}}><Label size="mini" color='red'>{String(nonviewedPolicies.length)}</Label></div>}
              </Menu.Item>
                }
                
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header style={{fontSize: "1.3em", color: "#FF136B"}}>
            <Icon size="small" style={{color: "#FFFFFF"}} name="cubes" />
            {" "}Resources{" "}
           
        
            </Menu.Header>

            <Menu.Menu>
              <Menu.Item
                active={UIStore.sideNav.activePrimary === "resources"}
                style={
                  UIStore.sideNav.activePrimary === "resources"
                    ? { backgroundColor: "#00a3e0", color: "#FFFFFF", width: "247px", fontSize: "1em" }
                    : {fontSize: "1em"}
                }
                onClick={e => {
                  UIStore.set("sideNav", "activePrimary", "resources");
                  this.props.history.push("/portal/resources");
                  document.getElementById('ActionFrame').scrollTop = 0;
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
                  document.getElementById('ActionFrame').scrollTop = 0;
                }}
                name="Staff Directory"
              />
            </Menu.Menu>
            </Menu.Item>

          
            <Menu.Item>
            <Menu.Header style={{fontSize: "1.3em", color: "#FF136B"}}>
            <Icon size="small" style={{color: "#FFFFFF"}} name="chat" />
            {" "}Contact{" "}
  
          
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
              <Menu.Header style={{fontSize: "1.3em", color: "#FF136B"}}>Channels</Menu.Header>
              <Menu.Menu style={{paddingLeft:4}}>{channelList}</Menu.Menu>
            </Menu.Item>
          </Transition>
          
        </Menu>
        {portalReturn}
      </div>
    );
  }
}
export default withRouter(SideBarMenu);
