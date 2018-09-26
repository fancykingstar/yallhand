import React from 'react'
import { Button, Icon } from "semantic-ui-react";

export const PillButton = (props) => {
    return (
        <div style={{ paddingTop: 15 }}>
        <Button primary icon labelPosition="left" circular size="small">
          <Icon name={props.iconName}/>
          {props.label}
        </Button>
      </div>
    )
}