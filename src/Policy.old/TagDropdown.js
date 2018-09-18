import React from "react";
import "./style.css";
import { stateOptions, tagOptions } from "./TempObjects";
import { Dropdown } from "semantic-ui-react";

export class TagDropdown extends React.Component {
  render() {
    return (
        <div style={{maxWidth: 250}}>
        <span>Require user tags to view (optional) </span>
        <Dropdown
          placeholder="Choose tag(s)..."
          fluid
          multiple
          selection
          options={tagOptions}
        />
      </div>
    );
  }
}
