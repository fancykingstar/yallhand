import React from "react";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import {Feed} from "./Feed"
import {PostFrame} from "./PostFrame"

export class AnnoucementsFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "feed" };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };
  isVisable = (name) => {return (name === this.state.activeItem ? "Visable" : "Hidden")}
  render() {
    const { activeItem } = this.state;
    const menuItems = ["feed", "post"];

    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={activeItem}
          handleClick={this.handleItemClick}
          useSearch={false}
        />
        <div>
        <div className={this.isVisable("feed")}><Feed/></div>
        <div className={this.isVisable("post")}>   <PostFrame/></div>
      
        </div>
      </div>
    );
  }
}
