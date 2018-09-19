import React from "react";
import "./style.css";
import { Dropdown } from "semantic-ui-react";
import { automations} from "./TempObjects";

export class Automations extends React.Component {
  render() {
    return (
  
        <div>
          <span>
            Select an automation to apply
          </span>
      
        <div className="AutomationsSelect">
        <Dropdown
          scrolling
          fluid
          placeholder="Teams"
          search
          selection
          options={automations}

        /></div>
      </div>
 
    );
  }
}



