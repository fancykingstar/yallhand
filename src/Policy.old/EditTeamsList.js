import React from "react";
import "./style.css";
import { teamOptions } from "./TempObjects";
import { Dropdown, Form } from "semantic-ui-react";

export class EditTeamsList extends React.Component {
  render() {
    return (
        <div style={{maxWidth: 700}}>
        <Form>
          <label>Select saved answer to load and edit </label>

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
