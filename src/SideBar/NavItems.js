import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom"
import {syncAdminNav} from "../SharedCalculations/SyncAdminNav"
import { ListItem, ListItemIcon, ListItemText, List } from '@material-ui/core';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import HelpRoundedIcon from '@material-ui/icons/HelpRounded';
import Announcements from '../UserPortal/assets/images/announcements.svg';
import BallotRoundedIcon from '@material-ui/icons/BallotRounded';
import TocRoundedIcon from '@material-ui/icons/TocRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import BarChartRoundedIcon from '@material-ui/icons/BarChartRounded';
import CloudRoundedIcon from '@material-ui/icons/CloudRounded';
import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import RoomServiceRoundedIcon from '@material-ui/icons/RoomServiceRounded';
import InboxRoundedIcon from '@material-ui/icons/InboxRounded';
import Badge from '@material-ui/core/Badge';

@inject("UIStore", "UserStore", "TicketingStore")
@observer
class NavItems extends React.Component {
  componentDidMount() {
    syncAdminNav(this.props.location)
  }


  render() {
    const { UIStore, UserStore, TicketingStore } = this.props;
    const adminLimits = UserStore.user && UserStore.user.adminLimits && UserStore.user.adminLimits.features && UserStore.user.adminLimits.features.length?  UserStore.user.adminLimits.features : null;
    const isActive = (val) =>  UIStore.sideNav.activePrimary === val? {backgroundColor: "rgba(87, 193, 222, 0.4)"}  : {visibility: "visible"}

    const superAdmin = UserStore.user.isSuperAdmin === true?   
    <ListItem style={isActive("superadmin")} button onClick={e => handleClick("superadmin")}>
    <ListItemIcon>
        <BuildRoundedIcon/>
    </ListItemIcon>
    <ListItemText primary="Super Admin" />
    </ListItem>
  : null

 

  const handleClick = (id) => {
    id === "dashboard"? this.props.history.push("/panel") : this.props.history.push("/panel/" + id)
    UIStore.set("sideNav", "activePrimary", id)
    document.getElementById('ActionFrame').scrollTop = 0;
  }

    return (
      <div className="Container menu-content">
   
      <List>
          {superAdmin}
          <ListItem className={adminLimits? "YHHidden":"YHShow"} style={isActive("dashboard")} button onClick={e => handleClick("dashboard")}>
            <ListItemIcon>
                  <HomeRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Admin Dashboard" />
          </ListItem>
          <ListItem className={!adminLimits || adminLimits.includes('FAQs') || adminLimits.includes('Announcements') || adminLimits.includes('Service Desk')? "YHShow": "YHHidden"} style={isActive("inbox")} button onClick={e => handleClick("inbox")}>
            <ListItemIcon >
            <Badge color="secondary" badgeContent={TicketingStore.allTickets.filter(ticket => ticket._unread).length} 
            >
            <InboxRoundedIcon/>
        </Badge>
              
              </ListItemIcon>
             <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem className={!adminLimits || adminLimits.includes('Teams')? "YHShow": "YHHidden"}  button style={isActive("teams")} button onClick={e => handleClick("teams")} >
            <ListItemIcon>
                  <GroupRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Teams" />
          </ListItem>
          <ListItem className={!adminLimits || adminLimits.includes('FAQs')? "YHShow": "YHHidden"} button style={isActive("faqs")} button onClick={e => handleClick("faqs")} >
            <ListItemIcon>
                  <HelpRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="FAQs" />
          </ListItem>
          <ListItem className={!adminLimits || adminLimits.includes('Announcements')? "YHShow": "YHHidden"}  button style={isActive("announcements")} button onClick={e => handleClick("announcements")} >
            <ListItemIcon>
                  <img src={Announcements}/>
              </ListItemIcon>
             <ListItemText primary="Announcements" />
          </ListItem>
          <ListItem button className={!adminLimits || adminLimits.includes('Surveys')? "YHShow": "YHHidden"}  style={isActive("surveys")} button onClick={e => handleClick("surveys")} >
            <ListItemIcon>
                  <BallotRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Surveys" />
          </ListItem>
          <ListItem button className={!adminLimits || adminLimits.includes('Tasks')? "YHShow": "YHHidden"}  style={isActive("tasks")} button onClick={e => handleClick("tasks")} >
            <ListItemIcon>
                  <TocRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Tasks" />
          </ListItem>
          <ListItem className={!adminLimits || adminLimits.includes('Service Desk')? "YHShow": "YHHidden"} button style={isActive("ticketing")} button onClick={e => handleClick("ticketing")} >
            <ListItemIcon>
                  <RoomServiceRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Service Desk" />
          </ListItem>
          <ListItem className={!adminLimits || adminLimits.includes('Email Campaigns')? "YHShow": "YHHidden"} button style={isActive("email")} button onClick={e => handleClick("email")} >
            <ListItemIcon>
                  <EmailRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Email Campaigns" />
          </ListItem>
          <ListItem className={!adminLimits ? "YHShow": "YHHidden"} button style={isActive("analytics")} button onClick={e => handleClick("analytics")} >
            <ListItemIcon>
                  <BarChartRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Analytics" />
          </ListItem>
          <ListItem className={!adminLimits ? "YHShow": "YHHidden"} button style={isActive("storage")} button onClick={e => handleClick("storage")} >
            <ListItemIcon>
                  <CloudRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Storage" />
          </ListItem>


      </List>
      </div>

      
    );
  }
}
export default withRouter(NavItems)