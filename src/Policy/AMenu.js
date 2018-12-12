import React from "react";
import "./style.css";
import { Menu, Segment } from "semantic-ui-react";
import { ResourceLinks } from "./Links";
import { Attachments } from "./Attachments";
import { Automations } from "./Automations";

export class AMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "links"
    };
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;
    const currentSegment = activeItem => {
      switch (activeItem) {
        default:
            return <ResourceLinks />;
        case "links":
          return <ResourceLinks />;
        case "attachments":
          return <Attachments />;
        // case "automations":
        //   return <Automations />;
      }
    };
    return (
      <div className="AMenu">
        <Menu attached="top" tabular>
          <Menu.Item
            name="links"
            active={activeItem === "links"}
            onClick={this.handleItemClick}
            key="links"
          />
          <Menu.Item
            name="attachments"
            active={activeItem === "attachments"}
            onClick={this.handleItemClick}
            key="attachments"
          />
          {/* <Menu.Item
            name="automations"
            icon="sync alternate"
            active={activeItem === "automations"}
            onClick={this.handleItemClick}
            key="automations"
          /> */}
        </Menu>
        <Segment attached="bottom">
          <div className="AMenuResult"> {currentSegment(activeItem)}</div>
        </Segment>
      </div>
    );
  }
}
