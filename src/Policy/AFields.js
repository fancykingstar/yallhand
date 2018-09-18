import React from "react";
import "./style.css";
import { AnswerField } from './AnswerField';

import { AMenu } from "./AMenu";


export class AFields extends React.Component {
  render() {
    return (
   
        <div>
          <AnswerField/>
          <AMenu/>
        
        </div>

    );
  }
}
