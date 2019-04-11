import React from "react";
import {inject, observer} from "mobx-react"
import { Menu, Icon } from "semantic-ui-react";
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
      <div className={UIStore.responsive.isMobile? "PubControlsH" : "PubControlsV"}>
        <Menu compact icon="labeled" vertical={UIStore.responsive.isMobile? false : true} size="mini" inverted>
          <Menu.Item style={{color: "#2fc7f8"}}>Currently: {stage.charAt(0).toUpperCase() + stage.substring(1)}</Menu.Item>
          {actionOptions[stage].map(opt => <Menu.Item key={"pubctrl" + giveMeKey()} name={opt} onClick={this.handleItemClick}>
            <Icon name={iconKey[opt]} size="small" />
            {displayText[opt]}
          </Menu.Item>)}
        </Menu>
      </div>
    );
  }
}
