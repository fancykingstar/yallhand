import React from "react"
import { Label, Icon } from "semantic-ui-react";
import {observer} from "mobx-react"

export const validateAdd = (key, list) => {
    if(!list.includes(key)){
        let newList = list.slice()
        newList.push(key)
        return newList
    }
    else{ return null}
}

export const labelsOneRemoved = (key, list) => {
    return list.filter(item => item !== key)
}



export const LabelGroup = (observer((props) => {
    const labelprop = props.labelprop === undefined ? "label" : props.labelprop
    const current = props.currentArray === undefined ? <div></div> : props.currentArray.map(keyword => (
        <Label key={"labelgroup" + keyword}>
          {props.displayFilter !== undefined ? props.displayFilter(keyword) !== undefined ? props.displayFilter(keyword)[labelprop] : keyword : keyword}
          <Icon name="delete" onClick={e => props.onRemove(keyword)} />
        </Label>
      ))
  return (
      <React.Fragment>
      {current}
      </React.Fragment>
      )
   
}))
