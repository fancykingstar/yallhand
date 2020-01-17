import React from "react";
import "./style.css";
import { Invite } from "./Invite";
import { Users } from "./Users";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { Teams } from "./Teams";
import { Tags } from "./Tags";
import { Directory } from "./Directory";
import { inject, observer } from "mobx-react";

@inject("UIStore")
@observer
class TeamFrame extends React.Component {
  componentDidMount(){
    window.scrollTo(0, 0);
  }
  render() {
    const { UIStore } = this.props;
    const handleItemClick = (e, { name }) => {
      UIStore.set("menuItem","teamFrame", name);
      if (name !== "users") UIStore.set("search", "searchUsers", "");
    };
    const isVisable = name => {
      return name === UIStore.menuItem.teamFrame ? "Visable" : "Hidden";
    };

    const menuItems = ["onboard", "user management", "directory", "teams", "tags"];
    const handleSearch = val => {
      UIStore.set("search", "searchUsers", val);
    };
    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={UIStore.menuItem.teamFrame}
          handleClick={handleItemClick}
          useSearch={UIStore.menuItem.teamFrame === "user management"}
          searchOutput={handleSearch}
        />
        <div className="TeamActionFrame">
          <div className={isVisable("onboard")}>
            {" "}
            <Invite />
          </div>
          <div className={isVisable("user management")}>
            {" "}
            <Users />
          </div>
          <div className={isVisable("directory")}>
            {" "}
            <Directory />
          </div>
          <div className={isVisable("teams")}>
            {" "}
            <Teams />
          </div>
          <div className={isVisable("tags")}>
            {" "}
            <Tags />
          </div> 
        </div>
      </div>
    );
  }
}

export default TeamFrame
