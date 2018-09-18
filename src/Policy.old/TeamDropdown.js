import React from "react";
import "./style.css";
import { stateOptions, tagOptions } from "./TempObjects";
import { Form, Dropdown } from "semantic-ui-react";

export class TeamDropdown extends React.Component {
  render() {
    return (
      <div style={{maxWidth: 500}}>
          <Form>
            <label>Which team(s) would you like to configure the answer </label>

            <Dropdown
              placeholder="Teams"
              fluid
              search
              selection
              options={stateOptions}
            />
          </Form>
      </div>
    );
  }
}
