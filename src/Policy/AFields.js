import React from "react";
import "./style.css";


import { AMenu } from "./AMenu";
import { DraftFormField } from "../SharedUI/DraftFormField";


export class AFields extends React.Component {
  displayContent = (val) => {
    console.log(val)}

  render() {
  
    
    return (
   
        <div>
          <DraftFormField updateContent={this.displayContent}/>
          <AMenu/>
        
        </div>

    );
  }
}
