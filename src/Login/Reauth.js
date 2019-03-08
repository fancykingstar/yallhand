import React from "react"
import { Form, Icon } from "semantic-ui-react"
import GoogleLogin from 'react-google-login';
import { apiCall, setUser } from "../DataExchange/Fetch";
import { withRouter } from "react-router-dom";

class Reauth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  next (type) {
    this.props.next(type)
  }

  responseGoogle (res) {
    if (res.profileObj) {
      apiCall('users/login', 'POST', {email: res.profileObj.email, password: res.profileObj.googleId})
        .then((res) => res.json())
        .then((res) => {
          if (res.token) {
            setUser({token: res.token})
            this.props.history.push('/panel')
          }
        })
    }
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
          <GoogleLogin
            clientId="679925808292-ubbvg6ffga3paa1ooj1285ap3hljft1d.apps.googleusercontent.com"
            render={renderProps => (
              <button onClick={renderProps.onClick}>Login with G-Suite</button>
            )}
            buttonText="Login"
            onSuccess={(e) => this.responseGoogle(e)}
            onFailure={(e) => this.responseGoogle(e)}
          />
        </Form>
      </React.Fragment>
    )
  }
}

export default withRouter(Reauth);