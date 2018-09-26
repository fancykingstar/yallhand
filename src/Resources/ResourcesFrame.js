import React from "react";
import "./style.css";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { Links } from "./Links"
import { Files } from "./Files"


export class ResourcesFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "links" };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };
  isVisable = (name) => {return (name === this.state.activeItem ? "Visable" : "Hidden")}
  render() {
    const { activeItem } = this.state;
    const menuItems = ["links", "files"];

    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={activeItem}
          handleClick={this.handleItemClick}
          useSearch={true}
        />
        <div className="TeamActionFrame">
        <div className={this.isVisable("links")}>   <Links/></div>
        <div className={this.isVisable("files")}>   <Files/></div>
      
        </div>
      </div>
    );
  }
}
