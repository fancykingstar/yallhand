import React from "react";
// import "./style.css";
import { Dropdown } from "semantic-ui-react";
import { teamOptions } from "../Policy/TempObjects";
import { SelectVariation } from "../SharedUI/SelectVariation";

export class PostControls extends React.Component {
  render() {
    return (
      <div>
        <SelectVariation options={teamOptions} />
        <br />
        <br />
        <Dropdown
          placeholder="Tags"
          search
          selection
          multiple
          options={teamOptions} 
        />
      </div>
    );
  }
}
