import React from 'react'
import { Form, Icon } from "semantic-ui-react";

export const PillButton = (props) => {
    return (
        <React.Fragment>
        <Form.Button primary icon labelPosition="left" style={{minWidth: 230, marginLeft: 10}} size="small" onClick={e => props.click()}>
          <Icon name={props.iconName}/>
          {props.label}
        </Form.Button>
        </React.Fragment>
    )
}