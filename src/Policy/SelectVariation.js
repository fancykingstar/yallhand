import React from "react";
import "./style.css";
import { teamOptions } from "./TempObjects";
import { Dropdown, Form } from "semantic-ui-react";

export class SelectVariation extends React.Component {
  render() {
    return (
        <div style={{width: 300, display: 'inline-block'}}>
        <Form>
          <label>Select variation to view/edit</label>

          <Dropdown
            placeholder="Teams"
            fluid
            search
            selection
            options={teamOptions}
          />
        </Form>
    </div>
    );
  }
}
