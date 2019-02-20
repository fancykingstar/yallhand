import React from "react";
import { inject, observer } from "mobx-react";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { Links } from "./Links"
import { Files } from "./Files"
import "./style.css";

@inject("UIStore")
@observer
export class ResourcesFrame extends React.Component {
  render() {
  const handleItemClick = (e, { name }) => {
    UIStore.set("menuItem","resourcesFrame", name);
  };
  const isVisable = name => {
  return name === UIStore.menuItem.resourcesFrame ? "Visable" : "Hidden";
  };
    const { UIStore } = this.props;
    const menuItems = ["URL", "file"];
    const handleSearch = val => {
      UIStore.menuItem.resourcesFrame === "URL" ?
      UIStore.set("search", "searchUrls", val) 
      :
      UIStore.set("search", "searchFiles", val) 
    };
    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={UIStore.menuItem.resourcesFrame}
          handleClick={handleItemClick}
          useSearch={true}
          searchOutput={handleSearch}
        />
        <div className="TeamActionFrame">
        <div className={isVisable("URL")}>   <Links/></div>
        <div className={isVisable("file")}>   <Files/></div>
      
        </div>
      </div>
    );
  }
}
