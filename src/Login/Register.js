import React from "react"
import { Form, Icon  } from "semantic-ui-react"
import { apiCall_noBody } from "../DataExchange/Fetch"
import GoogleLogin from 'react-google-login';

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.code ? props.code : '',
      error: null
    };
  }

  handleChange(e) {
    this.setState({code: e.target.value})
  }

  async next (type, itemGoogle = false) {
    const { setError } = this.props
    await apiCall_noBody(`validations?filter={"where":{"code":"${this.state.code}"}}`, 'GET').then(response => {
      if (response.length === 0) setError('Sorry, that invite code is invalid')
      else {
        let item = response[0]
        if (item.userId && item.userId !== '') setError('Sorry, that invite code is already used')
        else {
          const { email } = item
          if (itemGoogle) item = Object.assign(item, itemGoogle, {email: email})
          setError(null)
          this.setState({type: type})
          this.props.next(type, item)
        }
      }
    })
  }

  responseGoogle (res) {
    if (res.profileObj) this.next('profileinfoGmail', {
      email: res.profileObj.email,
      displayName_full: res.profileObj.name,
      displayName: res.profileObj.givenName,
      googleId: res.profileObj.googleId,
      img: res.profileObj.imageUrl
    })
  }

  render () {
    const { error } = this.props;
    return (
      <React.Fragment>
        <Form>
          <Form.Input label="Invite Code" value={this.state.code} onChange={(e) => this.handleChange(e)}/>  
          <Form.Button primary icon labelPosition="left" style={{minWidth: 230, marginLeft: 4}} size="small" onClick={e => this.next('profileinfoGmail')}>
            <Icon name={"google"}/>{"Register with G-Suite"}
          </Form.Button>
          <Form.Button primary icon labelPosition="left" style={{minWidth: 230, marginLeft:4}} size="small" onClick={e => this.next('profileinfo')}>
            <Icon name={"mail"}/>{"Register with Email"}
          </Form.Button>
          <GoogleLogin
            clientId="679925808292-ubbvg6ffga3paa1ooj1285ap3hljft1d.apps.googleusercontent.com"
            render={renderProps => (
              <button onClick={renderProps.onClick}>This is my custom Google button</button>
            )}
            buttonText="Login"
            onSuccess={(e) => this.responseGoogle(e)}
            onFailure={(e) => this.responseGoogle(e)}
          />
          {error && <span className="error">{error}</span>}
        </Form>
      </React.Fragment>
    )
  }
}