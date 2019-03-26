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
      if (response.length === 0) setError('Code does not exist in database')
      else {
        let item = response[0]
        if (item.userId && item.userId !== '') setError('Code is already used')
        else {
          const { email } = item
          if (itemGoogle) {
            if (itemGoogle.email !== email) return setError('Code is not linked to the email in database')
            item = Object.assign(item, itemGoogle, {email: email})
          }
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
    const style = {width: 'calc(100% - 20px)', marginLeft: 10}
    const { error } = this.props;
    return (
      <React.Fragment>
        <Form>
          <Form.Input label="Invite Code" value={this.state.code} onChange={(e) => this.handleChange(e)}/>  
          <div className="field">
            <GoogleLogin
              className="ui small icon primary left labeled button"
              clientId={process.env.REACT_APP_GMAIL}
              render={renderProps => (
                <button className="ui small icon primary left labeled button" style={style} onClick={renderProps.onClick} role="button">
                  <i aria-hidden="true" className="google icon"></i>Register with Google
                </button>
              )}
              onSuccess={(e) => this.responseGoogle(e)}
              onFailure={(e) => this.responseGoogle(e)}
              buttonText="Login">
            </GoogleLogin>
          </div>
          <Form.Button primary icon labelPosition="left" size="small" style={style} onClick={e => this.next('profileinfo')}>
            <Icon name={"mail"}/>{"Register with Email"}
          </Form.Button>
          {error && <span className="error">{error}</span>}
        </Form>
      </React.Fragment>
    )
  }
}