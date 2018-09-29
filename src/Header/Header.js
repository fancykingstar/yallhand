import React from "react";
import { Icon, Label, Dropdown } from "semantic-ui-react";
import "./style.css";

const tempOptions = [{label: "team1right how", key: "1", value:"1"},{label: "team2", key:"2", value:"2"}]

export class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <div className="AdminHeaderControls">
          <div className="Notification">
            <Label
              style={{ marginLeft: 11, marginTop: 8, position: "absolute" }}
              circular
              empty
              color="red"
            />
            <Icon color="grey" name="bell" size="large" />

          
              <Dropdown style={{marginLeft: 10}} text="Employee Portal" options={tempOptions} />
        
          </div>
        </div>
        <div className="MobileMenu">
          <Icon name="bars" size="large" color="black" />
        </div>
      </div>
    );
  }
}
