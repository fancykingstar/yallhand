import React from 'react';
import {stateToHTML} from 'draft-js-export-html';
import {convertFromRaw} from 'draft-js';
import ReactHtmlParser from 'react-html-parser';
 

export const DraftHTMLDisplay = (props) => {
  const storedState =  convertFromRaw(props.storedState);
  const htmlOutput = stateToHTML(storedState)

  return (
     <div className="readonly-editor">
       <div>{ ReactHtmlParser(htmlOutput) }</div>
     </div>
  );
}