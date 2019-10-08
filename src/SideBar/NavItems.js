import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom"
import  NavItem  from "./NavItem";
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

@inject("UIStore", "UserStore")
@observer
class NavItems extends React.Component {
  componentDidMount() {
    syncAdminNav(this.props.location)
  }


  render() {
    const { UIStore, UserStore } = this.props;
    const superAdmin = UserStore.user.isSuperAdmin === true?   
    <NavItem
    id="superadmin"
    icon="chess queen"
    label="Super Admin"
    active={UIStore.sideNav.activePrimary === "superadmin"}
  /> : null

  const isActive = (val) =>  UIStore.sideNav.activePrimary === val? {backgroundColor: "rgba(87, 193, 222, 0.4)"}  : {visibility: "visible"}


  const handleClick = (id) => {
    id === "dashboard"? this.props.history.push("/panel") : this.props.history.push("/panel/" + id)
    UIStore.set("sideNav", "activePrimary", id)
    document.getElementById('ActionFrame').scrollTop = 0;
  }

    return (
      <div className="Container menu-content">
      {/* {superAdmin} */}
      <List>
          <ListItem style={isActive("dashboard")} button onClick={e => handleClick("dashboard")}>
            <ListItemIcon>
                  <HomeRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button style={isActive("teams")} button onClick={e => handleClick("teams")} >
            <ListItemIcon>
                  <GroupRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Teams" />
          </ListItem>
          <ListItem button style={isActive("faqs")} button onClick={e => handleClick("faqs")} >
            <ListItemIcon>
                  <HelpRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="FAQs" />
          </ListItem>
          <ListItem button style={isActive("announcements")} button onClick={e => handleClick("announcements")} >
            <ListItemIcon>
                  <img src={Announcements}/>
              </ListItemIcon>
             <ListItemText primary="Announcements" />
          </ListItem>
          <ListItem button style={isActive("surveys")} button onClick={e => handleClick("surveys")} >
            <ListItemIcon>
                  <BallotRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Surveys" />
          </ListItem>
          <ListItem button style={isActive("tasks")} button onClick={e => handleClick("tasks")} >
            <ListItemIcon>
                  <TocRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Tasks" />
          </ListItem>
          <ListItem button style={isActive("email")} button onClick={e => handleClick("email")} >
            <ListItemIcon>
                  <EmailRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Email Campaigns" />
          </ListItem>
          <ListItem button style={isActive("analytics")} button onClick={e => handleClick("analytics")} >
            <ListItemIcon>
                  <BarChartRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Analytics" />
          </ListItem>
          <ListItem button style={isActive("storage")} button onClick={e => handleClick("storage")} >
            <ListItemIcon>
                  <CloudRoundedIcon/>
              </ListItemIcon>
             <ListItemText primary="Storage" />
          </ListItem>


      </List>
      {/* <NavItem
          id="dashboard"
          icon="dashboard"
          label="Dashboard"
          active={}
        /> 

        <br />
        <NavItem
          id="teams"
          icon="group"
          label="Teams"
          active={UIStore.sideNav.activePrimary === "teams"}
        />

        <br />

        <NavItem
          id="faqs"
          icon="question"
          label="FAQs"
          active={UIStore.sideNav.activePrimary === "faqs"}
        />

        <br />
 
        <NavItem
          id="announcements"
          icon="bullhorn"
          label="Announcements"
          active={UIStore.sideNav.activePrimary === "announcements"}
        />


      <React.Fragment>
      <NavItem
          id="surveys"
          icon={<i style={{paddingRight: 2,color: "#2fc7f8"}} className="fas fa-vote-yea"/>}
          label="Surveys"
          active={UIStore.sideNav.activePrimary === "surveys"}
        />  
        <br />
        </React.Fragment>
       <NavItem
          id="tasks"
          icon={<i style={{paddingRight: 5,color: "#2fc7f8"}} className="fas fa-tasks"/>}
          label="Tasks"
          active={UIStore.sideNav.activePrimary === "tasks"}
        />  
        <br />


        <NavItem
          id="email"
          icon="mail"
          label="Email Campaigns"
          active={UIStore.sideNav.activePrimary === "email"}
        />

        <br />

        <NavItem
          id="analytics"
          icon="chart bar outline"
          label="Analytics"
          active={UIStore.sideNav.activePrimary === "analytics"}
        />
        <br />

        <NavItem
          id="storage"
          icon="cloud"
          label="Storage"
          active={UIStore.sideNav.activePrimary === "storage"}
        />
        <br/>
         */}

      {/* {UserStore.user.invitedBy !== "admin"?"":
      <React.Fragment>
        <br/>
      <NavItem
          id="tasks"
          icon={<i style={{paddingRight: 5,color: "#2fc7f8"}} className="fas fa-tasks"/>}
          label="Tasks"
          active={UIStore.sideNav.activePrimary === "tasks"}
        />  
        <br />
        <NavItem
          id="automations"
          icon={<i style={{paddingRight: 2,color: "#2fc7f8"}} className="fas fa-robot"/>}

          label="Automations"
          active={UIStore.sideNav.activePrimary === "automations"}
        />  
   
        </React.Fragment>
    } */}
      </div>

      
    );
  }
}
export default withRouter(NavItems)