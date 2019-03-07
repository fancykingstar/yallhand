import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown, Image } from "semantic-ui-react";
import { inject, observer} from "mobx-react"
import "./style.css";
// import { DataEntryStore } from "../Stores/DataEntryStore";

@inject("UserStore")
@observer
export class UserProfile extends React.Component {
  render() {
    const {UserStore} = this.props
 

    return (
      <div className="UserProfile">
       
         <div className="UserSettingsDropdown" >
         <Dropdown icon="chevron down" trigger={<div className="UserSettingsTrigger"/>} >
    <Dropdown.Menu>
               
    <Dropdown.Header><div className="Avatar-Wrap"> <Image className="Avatar" size="small"  src={UserStore.user.img} /></div> </Dropdown.Header>
      <Dropdown.Item text='Settings...' as={NavLink} to='/panel/user-settings'/>
      <Dropdown.Item text='Contact Support' as="a" href="mailto:support@yallhands.com?subject=Report%20an%20issue"/>
      <Dropdown.Item text='Log Out'/>
    </Dropdown.Menu>
  </Dropdown>
          </div>
        <div className="UserName">
          <div>
            <h4>{UserStore.user.displayName_full}</h4>

          </div>
         
        </div>
     
      </div>
    );
  }
}
