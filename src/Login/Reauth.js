import React from "react"
import { Message, Form, Icon } from "semantic-ui-react"
import GoogleLogin from 'react-google-login';
import { apiCall, setUser } from "../DataExchange/Fetch";
import { withRouter } from "react-router-dom";

class Reauth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: null
    };
  }

  next (type) {
    this.props.next(type)
  }

  responseGoogle (res) {
    this.setState({errorMsg: null})
    if (res.profileObj) {
      apiCall('users/login', 'POST', {email: res.profileObj.email, password: res.profileObj.googleId})
        .then((res) => res.json())
        .then((res) => {
          if (res.error) return this.setState({errorMsg: 'Connection error (Email / Password is not good)'})
          if (res.token) {
            setUser({token: res.token})
            this.props.history.push('/panel')
          }
        })
    }
  }

  render () {
    const style = {width: 'calc(100% - 20px)', marginLeft: 10};
    const { errorMsg } = this.state;
    return (
      <React.Fragment>
        <Form>
          <div className="field">
            <GoogleLogin
              className="ui small icon primary left labeled button"
              clientId={process.env.REACT_APP_GMAIL}
              render={renderProps => (
                <button className="ui small icon primary left labeled button" style={style} onClick={renderProps.onClick} role="button">
                  <i aria-hidden="true" className="google icon"></i>Login with Google
                </button>
              )}
              onSuccess={(e) => this.responseGoogle(e)}
              onFailure={(e) => this.responseGoogle(e)}
              buttonText="Login">
            </GoogleLogin>
          </div>
          <Form.Button primary icon labelPosition="left" size="small" style={style} onClick={e => this.next("login")}>
            <Icon name={"mail"}/> {"Login with Email"}
          </Form.Button>
        </Form>
        {errorMsg && <Message  icon="warning"  content={errorMsg} negative/>}
      </React.Fragment>
    )
  }
}

export default withRouter(Reauth);
