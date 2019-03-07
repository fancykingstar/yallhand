import React from "react"
import { Form, Icon } from "semantic-ui-react"

export class Reauth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  next (type) {
    console.log(this.props)
    this.props.next(type)
  }

  render () {
    const style = {minWidth: 230, marginLeft: 10}
    return (
      <React.Fragment>
        <Form>
          <Form.Button primary icon labelPosition="left" style={style} size="small" onClick={e => this.next("loginGmail")}>
            <Icon name={"google"}/> {"Login with G-Suite"}
          </Form.Button>
          <Form.Button primary icon labelPosition="left" style={style} size="small" onClick={e => this.next("login")}>
            <Icon name={"mail"}/> {"Login with Email"}
          </Form.Button>
        </Form>
      </React.Fragment>
    )
  }
}
