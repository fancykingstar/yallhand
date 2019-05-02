import React from 'react'
import {Prompt} from 'react-router-dom'

const holdUnload = (val) => {
    if (val) {
        window.onbeforeunload = () => true
      } else {
        window.onbeforeunload = undefined
      }
}


export const HoldLeave = (props) => {
  
    return(
        <Prompt
        when={props.value}
        message="This draft hasn't been saved, leave anyway?"
      />
    )
    }

export default holdUnload
