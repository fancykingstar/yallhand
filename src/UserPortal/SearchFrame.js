import React from "react";
import {inject, observer} from "mobx-react"
import { Input, Icon} from "semantic-ui-react";
import { QLogo } from "../Assets/Graphics/QLogo"
import "./style.css";

export const SearchFrame = inject("UIStore")(observer((props) => {
  const {UIStore} = props

  const handleSearch = (val) => {
    UIStore.set("search", "portalSearchValue", val)
  }

  return (
    <div className="SearchFrame">
      <div className="SearchControls">
        <Input 
        value={UIStore.search.portalSearchValue}
        onChange={(e, val) => handleSearch(val.value)} 
        fluid icon 
        placeholder="Search...">
          <input />
          <Icon name="search" />
        </Input>
      </div>
      <div className="LoginQuadrance">
      <p style={{fontSize: ".2em", opacity: "0.8", marginBottom: 0}}>powered by</p>
          <div style={{ float: "left", opacity: "0.5", marginTop: -4, paddingRight: 4 }}>
            {" "}
            <QLogo fill="#FFFFFF" style="" width="16px" height="20px" />{" "}
          </div>
          <div style={{ float: "right", lineHeight: "15px", fontSize: ".5em" }}> quadrance.</div>
        </div>
  
    </div>
  );
}))
 