import React from "react";
import "./style.css";
import { Invite } from "./Invite";
import { Users } from "./Users";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { TeamConfig } from "./TeamConfig"
import { Classes } from "./Classes"

export class TeamFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "invite" };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };
  isVisable = (name) => {return (name === this.state.activeItem ? "Visable" : "Hidden")}
  render() {
    const { activeItem } = this.state;
    const menuItems = ["invite", "users", "configure teams", "classes"];
    const useSearch = (this.state.activeItem === 'users') ? true : false;

    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={activeItem}
          handleClick={this.handleItemClick}
          useSearch={useSearch}
        />
        <div className="TeamActionFrame">
        <div className={this.isVisable("invite")}>   <Invite /></div>
        <div className={this.isVisable("users")}>   <Users /></div>
        <div className={this.isVisable("configure teams")}>   <TeamConfig /></div>
        <div className={this.isVisable("classes")}>   <Classes /></div>
      
        </div>
      </div>
    );
  }
}
