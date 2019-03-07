import React from "react"
import { Form, Icon  } from "semantic-ui-react"
export const Register = (props) => {
    return (
  <React.Fragment>
    
        <Form>
           <Form.Input label="Invite Code"/>  
          <Form.Button primary icon labelPosition="left" style={{minWidth: 230, marginLeft: 4}} size="small" onClick={e => alert("hi")}>
          <Icon name={"google"}/>
          {"Register with G-Suite"}
        </Form.Button>
        <Form.Button primary icon labelPosition="left" style={{minWidth: 230, marginLeft:4}} size="small" onClick={e => alert("hi")}>
          <Icon name={"mail"}/>
          {"Register with Email"}
        </Form.Button>
        </Form>
    
  </React.Fragment>
    )}
