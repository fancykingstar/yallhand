import React from "react";
import { Message, Form, Divider, Header, Icon } from "semantic-ui-react";
import { Legal } from "./Legal";
import { apiCall, setUser } from "../DataExchange/Fetch"
import { withRouter } from "react-router-dom";

class ProfileLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: null,
      email: '',
      password: '',
      isForgot: false,
      successMsg: null
    };
  }

  login () {
    const { history } = this.props
    this.setState({errorMsg: null})
    console.log({email: this.state.email, password: this.state.password})
    apiCall('users/login', 'POST', {email: this.state.email, password: this.state.password})
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.error) {
          if (res.error.message && res.error.message === 'Denied: unauthorized access') return this.setState({errorMsg: res.error.message})
          else return this.setState({errorMsg: 'Connection error (Email / Password is not good)'})
        }
        if (res.token) {
          setUser({token: res.token})
          history.push(res.isAdmin? '/panel' : '/portal')
        }
      })
  }

  sendForgotMail () {
    const { email } = this.state;
    apiCall('users/forgot', 'POST', {email: email})
      .then((res) => res.json())
      .then((res) => {
        if (res.ko) return this.setState({errorMsg: `This account doesn't exist`})
        this.setState({errorMsg: null, successMsg: `An email has been sent to ${email}`})
      })
  }
  
  render () {
    const { successMsg, errorMsg, email_disable, isForgot } = this.state
    
    return (
      <React.Fragment>
        <div className="ContainerLogin">
          <div className="Login">
            <Header as="h2">
              {isForgot ? 'Forgot your password' : 'Connect to your account'}
            </Header>
            <Divider />
            <Form>
              <Form.Input icon="mail" label="email" onChange={(e) => this.setState({email: e.target.value})} disabled={email_disable} value={this.state.email}/>
              {!isForgot && <Form.Input icon="key" type="password" label="password" onChange={(e) => this.setState({password: e.target.value})} />}
              <Form.Button primary onClick={() => isForgot ? this.sendForgotMail() : this.login()}>Continue</Form.Button>
            </Form>
            <br/>
            <div style={{paddingBottom: 10}}>
            <div style={{float: "left"}}className="switch-forgot" onClick={(e) => this.setState({isForgot: !isForgot})}>
              {!isForgot ? 'Forgot password' : null}
            </div>
            <div style={{float: "right"}}>
              <Icon name="home" size="small" onClick={e => this.props.backHome()}/>
            </div>
            </div>
          </div>
          <Legal/>
          {errorMsg && <div style={{maxWidth: 350, paddingTop: 10}}><Message icon="warning" content={errorMsg} negative/></div>}
          {successMsg && <div style={{maxWidth: 350, paddingTop: 10}}><Message icon="info" content={successMsg} positive/></div>}
        </div>
      </React.Fragment>
    );
  }
};

export default withRouter(ProfileLogin);