import React from "react";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { SharedAutos } from "./Shared";
import { PrivateAutos } from "./Private";



export class AutomationsFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "shared" };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };
  isVisable = (name) => {return (name === this.state.activeItem ? "Visable" : "Hidden")}
  render() {
    const { activeItem } = this.state;
    const menuItems = ["shared", "private"];

    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={activeItem}
          handleClick={this.handleItemClick}
          useSearch={true}
        />
        <div className="TeamActionFrame">
        <div className={this.isVisable("shared")}>   <SharedAutos/></div>
        <div className={this.isVisable("private")}>  <PrivateAutos/></div>
      
        </div>
      </div>
    );
  }
}
