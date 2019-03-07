import React from "react";
import { Form, Divider, Header } from "semantic-ui-react";
import { apiCall, setUser } from "../DataExchange/Fetch"
import { withRouter } from "react-router-dom";

class ProfileLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: ''
    };
  }

  login () {
    const { history } = this.props
    apiCall('users/login', 'POST', {email: this.state.email, password: this.state.password})
    .then((res) => res.json())
    .then((res) => {
      if (res.token) {
        setUser({token: res.token})
        history.push('/panel')
      }
    })
  }
  
  render () {
    const { error, email_disable } = this.state
    return (
      <React.Fragment>
        <div className="ContainerLogin">
          <div className="Login">
            <Header as="h2">Connect to your account</Header>
            <Divider />
            <Form>
              <Form.Input 
                icon="mail" 
                label="email" 
                onChange={(e) => this.setState({email: e.target.value})} 
                disabled={email_disable}
                value={this.state.email}/>
              <Form.Input 
                icon="key" 
                type="password" 
                label="password" 
                onChange={(e) => this.setState({password: e.target.value})} />
              <Form.Button primary onClick={() => this.login()}>Continue</Form.Button>
              {error && <span className="error">{error}</span>}
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
};

export default withRouter(ProfileLogin);