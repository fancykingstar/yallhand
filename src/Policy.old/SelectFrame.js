import React from "react";
import "./style.css";
import { TeamDropdown } from './TeamDropdown'
import { TagDropdown } from './TagDropdown'
import { stateOptions, tagOptions } from "./TempObjects";
import { Form, Dropdown } from "semantic-ui-react";

export class SelectFrame extends React.Component {
  render() {
    return (
      <div className="Grid">
        <TeamDropdown/>
        <TagDropdown/>
      </div>
    );
  }
}
