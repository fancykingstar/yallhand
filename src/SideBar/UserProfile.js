import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";
import "./style.css";

export class UserProfile extends React.Component {
  render() {
    return (
      <div className="UserProfile">
       
         <div className="UserSettingsDropdown">
         <Dropdown icon="chevron down">
    <Dropdown.Menu>
        
      <Dropdown.Item text='Settings...' as={NavLink} to='/user-settings'/>
        
      <Dropdown.Item text='Log Out'/>
    </Dropdown.Menu>
  </Dropdown>
          </div>
        <div className="UserName">
          <div>
            <h4>Mark Zuppe</h4>
          </div>
         
        </div>
     
      </div>
    );
  }
}
