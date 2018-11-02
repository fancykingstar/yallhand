import React from "react";
import SideBarMenu from "./SideBarMenu"
import "./style.css";

export const SideBarFrame = () => {
  return (
    <div className="SideBarFrame">
        <div className="SideBarMenu">
            <SideBarMenu/>
        </div>
    </div>
  );
};
