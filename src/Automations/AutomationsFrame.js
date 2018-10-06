import React from "react";
import {inject, observer} from "mobx-react"
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import {AutomationList} from "./AutomationList"
// import { SharedAutos } from "./Shared";
// import { PrivateAutos } from "./Private";



export const AutomationsFrame = inject("AutomationsStore")(observer((props) => {

  const {AutomationsStore} = props
  const handleItemClick = (e, { name }) => {
    AutomationsStore.toggleMenu(name)
  };
  const isVisable = (name) => {return (name === AutomationsStore.automationMenuSelect ? "Visable" : "Hidden")}

    const activeItem = AutomationsStore.automationMenuSelect;
    const menuItems = ["shared", "private"];

  
    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={activeItem}
          handleClick={handleItemClick}
          useSearch={true}
        />
        <div className="TeamActionFrame">
        <div className={isVisable("shared")}>   <AutomationList list={"public"}/></div>
        <div className={isVisable("private")}>  <AutomationList list={"private"}/></div>
      
        </div>
      </div>
    );
  }
))
