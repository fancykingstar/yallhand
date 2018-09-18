import React from "react";
import "./style.css";
import { Input, Icon, Accordion, Dropdown, Checkbox } from "semantic-ui-react";
import { teamOptions } from "./TempObjects";

export class AccordionContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      accOpen: false
    };
  }
  render() {
    return(
      <Accordion>
      <Accordion.Title
        active={this.state.accOpen}
        onClick={e => this.handleAccClick(e)}
      >
        <Icon name="dropdown" disabled={!this.state.enabled} />
        <span className={textClass}>Manage Conditions</span>
      </Accordion.Title>
      <Accordion.Content active={this.state.accOpen}>

      </Accordion.Content>
      </Accordion>
    )
  }