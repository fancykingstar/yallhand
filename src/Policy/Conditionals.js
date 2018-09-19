import React from "react";
import "./style.css";
import { Input, Icon, Accordion, Dropdown, Checkbox } from "semantic-ui-react";
import { teamOptions } from "./TempObjects";
import { ConditionList } from "./ConditionList";

export class Conditionals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      accOpen: false
    };
  }
  handleEnable = (e, data) => {
    this.setState({ enabled: data.checked });
    if (data.checked === false) {
      this.setState({ accOpen: false });
    }
  };
  handleAccClick = e => {
    if (this.state.enabled) {
      this.setState({ accOpen: !this.state.accOpen });
    }
  };

  render() {
    const textClass = this.state.enabled ? "" : "Disabled";
    return (
      <div>
        <Checkbox
          label="Enable conditional answers"
          onClick={(e, data) => this.handleEnable(e, data)}
        />
        <div className="Accordion">
          <Accordion>
            <Accordion.Title
              active={this.state.accOpen}
              onClick={e => this.handleAccClick(e)}
            >
              <Icon name="dropdown" disabled={!this.state.enabled} />
              <span className={textClass}>Manage Conditions</span>
            </Accordion.Title>
            <Accordion.Content active={this.state.accOpen}>
              <ConditionList />
            </Accordion.Content>
          </Accordion>
          <div className="Form">
            <div>
              <span className={textClass}>
                Select condition to toggle answer
              </span>
            </div>
            <Dropdown
              disabled={!this.state.enabled}
              placeholder="Teams"
              fluid
              search
              selection
              options={teamOptions}
              style={{ width: 350 }}
            />
          </div>
        </div>
      </div>
    );
  }
}
