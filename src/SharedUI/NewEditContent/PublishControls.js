import React from "react";
import "../style.css";
import { Menu, Icon } from "semantic-ui-react";
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";

export class PublishControls extends React.Component {
  clickActions = {
    "draft":"draft",
    "published": "published",
    "update": "published",
    "unpublish": "draft",
    "archived": "archived",
    "restore": "draft"
  }
  handleItemClick = (e, { name }) => this.props.onClick(this.clickActions[name]);
  render() {
    const actionOptions = {
      draft: ["draft", "published", "archived"],
      published: ["update", "unpublish", "archived"],
      archived: ["restore"]
    };
 
    const iconKey = {
      draft: "keyboard",
      published: "rocket",
      update: "angle double up",
      unpublish: "remove circle",
      archived: "archive",
      restore: "hand spock"
    };

    const displayText = {
      draft: "Save Draft",
      published: "Publish",
      update: "Update",
      unpublish: "Un-publish",
      archived: "Archive",
      restore: "Restore"
    };

    const currentControls = actionOptions[this.props.stage].map(opt => (
      <Menu.Item key={"pubctrl" + giveMeKey()} name={opt} onClick={this.handleItemClick}>
        <Icon name={iconKey[opt]} size="small" />
        {displayText[opt]}
      </Menu.Item>
    ));

    return (
      <div id="PubControls">
        <Menu compact icon="labeled" vertical size="mini" inverted>
          <Menu.Item style={{color: "#2fc7f8"}}>Currently: {this.props.stage.charAt(0).toUpperCase() + this.props.stage.substring(1)}</Menu.Item>
          {currentControls}
        </Menu>
      </div>
    );
  }
}
