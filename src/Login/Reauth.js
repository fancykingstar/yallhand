import React from "react"
import { Form, Icon } from "semantic-ui-react"

export const Reauth = (props) => {
    return (
  <React.Fragment>
        <Form>
          <Form.Button primary icon labelPosition="left" style={{minWidth: 230, marginLeft: 10}} size="small" onClick={e => alert("hi")}>
          <Icon name={"google"}/>
          {"Login with G-Suite"}
        </Form.Button>
        <Form.Button primary icon labelPosition="left" style={{minWidth: 230, marginLeft: 10}} size="small" onClick={e => alert("hi")}>
          <Icon name={"mail"}/>
          {"Login with Email"}
        </Form.Button>
        </Form>
    <div />
  </React.Fragment>
    )}
