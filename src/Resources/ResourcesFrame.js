import React from "react";
import { Input } from "semantic-ui-react"
import { inject, observer } from "mobx-react";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
// import { Links } from "./Links"
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
    const menuItems = ["file", "URL"];
    const handleSearch = val => {
      // UIStore.menuItem.resourcesFrame === "URL" ?
      // UIStore.set("search", "searchUrls", val) 
      // :
      UIStore.set("search", "searchFiles", val) 
    };
    return (
      <div>
        {/* <SecondaryMenu
          menuItems={menuItems}
          activeItem={UIStore.menuItem.resourcesFrame}
          handleClick={handleItemClick}
          useSearch={true}
          searchOutput={handleSearch}
        /> */}
        <div style={{float: "right", marginRight: 10, marginTop: 10}}>  
      <Input icon='search' placeholder='Search...' 
      onChange={(e, val) => handleSearch(val.value)} 
      value={UIStore.search.searchFiles}
      />
     </div> 
        <div className="ResourceActionFrame">
        {/* <div className={isVisable("URL")}>   <Links/></div> */}
        <div>   <Files/></div>
      
        </div>
      </div>
    );
  }
}
