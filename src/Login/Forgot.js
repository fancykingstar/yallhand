import React from "react";
import { withRouter } from "react-router-dom";
import { apiCall } from "../DataExchange/Fetch"
import { QLogo } from "../Assets/Graphics/QLogo";
import { Divider, Grid, Message } from "semantic-ui-react";
import { Form, Icon  } from "semantic-ui-react"
import toast from '../YallToast'
import "./style.css";


class Forgot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      errorMsg: null,
      code: null,
      codeOK: false,
      pwd1: '',
      pwd2: ''
    };
  }

  componentWillMount() {
    this.ckeckForCode()
  }

  async next () {
    const { email, code } = this.state
    await apiCall(`users/check/reset`, 'POST', {email, code}).then((res) => res.json()).then(res => {
      if (res.ko) return this.setState({errorMsg: 'Your email or validation code is wrong'});
      this.setState({errorMsg: null, codeOK: true});
    })
  }

  ckeckForCode () {
    const { location } = this.props

    if (location.search && location.search.indexOf('reset') > -1) {
      this.setState({code: location.search.replace('?reset=', '')})
    }
  }

  isInvalidPassword (value) {
    return !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(String(value)))
  }

  isPasswordNotEqual () {
    return this.state.pwd1 !== this.state.pwd2
  }

  async validatePwd () {
    const { email, code, pwd1, pwd2 } = this.state
    if (this.isInvalidPassword(pwd1)) return this.setState({errorMsg: 'New password must contains 8 characters with 1 upper, 1 lower, 1 number and 1 special character'});
    if (this.isPasswordNotEqual(pwd2)) return this.setState({errorMsg: 'Confirm new password is not equal to New password'});
    await apiCall(`/users/reset`, 'POST', {password: pwd1, email, code}).then((res) => res.json()).then(res => {
      const { history } = this.props;
      if (res.ko) return this.setState({errorMsg: 'Your email or validation code is wrong'});
      this.setState({errorMsg: null, codeOK: true});
      toast.success("Your password has been changed", {hideProgressBar: true, closeOnClick: false}) 
      history.push('/login')
    })
  }

  render() {
    const style = {width: 'calc(100% - 20px)', marginLeft: 10};
    const styleInput = {width: '100%', margin: '0.3rem 0 1rem', color: '#000'};
    const { errorMsg, codeOK } = this.state

    return (
      <div className="LoginFrame">
        <React.Fragment>
          <div className="ContainerLogin">
            <div className="Login forgot">
              <div className="LoginWorkspace">
              <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}> <QLogo blue width="200"/> </div> 
              </div>
              <div className="ERM">Employee Relationship Management</div>
              <Divider />
              {!codeOK && <Form.Input icon="mail" label="email" style={styleInput} onChange={(e) => this.setState({email: e.target.value})}/>}
              {codeOK && <Form.Input icon="key" type="password" style={styleInput} label="New password" onChange={(e) => this.setState({pwd1: e.target.value})}/>}
              {codeOK && <Form.Input icon="key" type="password" style={styleInput} label="Confirm new password" onChange={(e) => this.setState({pwd2: e.target.value})}/>}
              <Form.Button primary icon labelPosition="left" size="small" style={style} onClick={e => codeOK ? this.validatePwd() : this.next()}>
                <Icon name={"mail"}/>{"Verify your email"}
              </Form.Button>
            </div>
            {errorMsg && <div style={{maxWidth: 350, paddingTop: 10}}><Message icon="warning" content={errorMsg} negative/></div>}
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default withRouter(Forgot);