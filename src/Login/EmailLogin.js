import React from "react"
import { Form, Icon } from "semantic-ui-react"

export const EmailLogin = (props) => {
    return (
  <React.Fragment>
  
        <Form>
        <Form.Input label="Emaill"/>  
        <Form.Input type="password" label="Password"/>  
        <Form.Button primary icon labelPosition="left" style={{minWidth: 230, marginLeft: 4}} size="small" onClick={e => alert("hi")}>
          <Icon name={"mail"}/>
          {"Login with Email"}
        </Form.Button>
        </Form>
     
  </React.Fragment>
    )}
