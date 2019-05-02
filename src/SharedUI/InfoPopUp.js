import React from "react"
import {Popup, Icon} from "semantic-ui-react"

export const InfoPopUp = (props) => {
    return (
<Popup trigger={ <Icon color="blue" style={{marginLeft: 5}} name="question circle outline" />} content={props.content} />
  )
}