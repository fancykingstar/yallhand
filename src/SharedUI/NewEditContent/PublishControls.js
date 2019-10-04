import React from "react";
import {inject, observer} from "mobx-react"
import { Dropdown, Icon } from "semantic-ui-react";
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";
import "../style.css";

@inject("UIStore")
@observer
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
    const { stage, UIStore } = this.props;
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


    return (

      <Dropdown 
      button style={{backgroundColor: "#267EA3", color: "#FFFFFF"}} text="Update">
      <Dropdown.Menu>
      {actionOptions[stage].map(opt =>
        <Dropdown.Item key={"pubctrl" + giveMeKey()} text={displayText[opt]} icon={iconKey[opt]} name={opt} onClick={this.handleItemClick}  />
      )}
      </Dropdown.Menu>
      </Dropdown>

    );
  }
}
