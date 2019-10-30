import React from "react";
import {inject, observer} from "mobx-react"
import { Dropdown, Icon } from "semantic-ui-react";
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";
import "../style.css";

@inject("UIStore")
@observer
export class CommonOptions extends React.Component {
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
    


    return (

      <Dropdown 
      button text="Options...">
      <Dropdown.Menu>
        <Dropdown.Item key={"pubctrl" + giveMeKey()} text={"Channel..."} onClick={() => this.props.handleClick("channel")}  /> 
        <Dropdown.Item key={"pubctrl" + giveMeKey()} text={"Featured Image..."} onClick={() => this.props.handleClick("image")}   />
        <Dropdown.Item disabled={this.props.unsavedWarning} key={"pubctrl" + giveMeKey()} text={`Attach Files...${this.props.unsavedWarning && "(requires save)"}`} onClick={() => this.props.handleClick("attach")}   />
      </Dropdown.Menu>
      </Dropdown>

    );
  }
}
