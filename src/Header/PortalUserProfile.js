import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown, Image } from "semantic-ui-react";
import { inject, observer} from "mobx-react"
import "./style.css";
// import { DataEntryStore } from "../Stores/DataEntryStore";

@inject("UserStore")
@observer
export class PortalUserProfile extends React.Component {
  render() {
    const {UserStore} = this.props
 

    return (
      <div className="PortalUserProfile">
       
         <div className="PortalUserSettingsDropdown" >
         <Dropdown direction={this.props.direction === undefined? "right" : this.props.direction} icon="chevron down" trigger={<div className="PortalUserSettingsTrigger"/>} >
    <Dropdown.Menu>
               
    <Dropdown.Header><div className="Avatar-Wrap"> <Image className="Avatar" size="small"  src={UserStore.user.img} /></div> </Dropdown.Header>
      <Dropdown.Item text='Settings...' as={NavLink} to='/panel/user-settings'/>
      <Dropdown.Item text='Log Out'/>
    </Dropdown.Menu>
  </Dropdown>
          </div>
        <div className="UserName">
          <div style={{color: "#FFFFFF", display: "inline"}}>
          <Image bordered style={{marginTop: -5, float: "left"}} avatar src={UserStore.user.img} />
            <p>{UserStore.user.displayName}</p>

          </div>
         
        </div>
     
      </div>
    );
  }
}
