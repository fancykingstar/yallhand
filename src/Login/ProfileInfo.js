import React from "react";
import { Form, Divider, Header, Button } from "semantic-ui-react";
import { InfoPopUp } from "../SharedUI/InfoPopUp.js";
import { apiCall } from "../DataExchange/Fetch"

export class ProfileInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      name: '',
      username: '',
      phone: '',
      email: props.item && props.item.email ? props.item.email : '',
      email_disable: props.item && props.item.email ? true : false,
      password: '',
      password_confirm: '',
      tag: props.item && props.item.tags ? props.item.tags : [],
      teamID: props.item && props.item.teamID ? props.item.teamID : '',
      isAdmin: props.item && props.item.isAdmin ? props.item.isAdmin : false,
      invitedBy: props.item && props.item.invitedBy ? props.item.invitedBy : '',
      accountID: props.item && props.item.accountID ? props.item.accountID : '',
      now: props.item && props.item.now ? props.item.now : false,
      date: props.item && props.item.date ? props.item.date : '',
    };
  }

  isEmpty (value) {
    return typeof value === 'undefined' || value === null || value === ''
  }

  isWeak (value) {
    return value.toString().length < 3
  }

  isInvalidEmail (value) {
    return !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase()))
  }

  isPasswordNotEqual () {
    return this.state.password !== this.state.password_confirm
  }

  validate (type, humanReadableType) {
    let error = ''
    const field = this.state[type]

    if (this.isEmpty(field)) error += `field ${humanReadableType} cannot be empty`
    else if (this.isWeak(field)) error += `field ${humanReadableType} is to weak`
    else if (type === 'email' && this.isInvalidEmail(field)) error += `${humanReadableType} is not valid`
    else if (type === 'pasword_confirm' && this.isPasswordNotEqual(field)) error += `${humanReadableType} is not equal to password`

    this.setState({error: error === '' ? null : error})

    return error
  }
  
  register () {
    if (this.validate('name', 'name') !== '') return;
    else if (this.validate('username', 'display name') !== '') return;
    else if (this.validate('phone', 'phone') !== '') return;
    else if (this.validate('email', 'email') !== '') return;
    else if (this.validate('password', 'password') !== '') return;
    else if (this.validate('password_confirm', 'password confirm') !== '') return;

    apiCall('/users', 'POST', {
      isActive: true,
      invitedBy: this.state.invitedBy,
      displayName_full: this.state.name,
      displayName: this.state.username,
      isAdmin: this.state.isAdmin,
      teamID: this.state.teamID,
      tags: this.state.tags,
      email: this.state.email,
      img: "",
      phone: this.state.phone,
      password: this.state.password,
      accountID: this.state.accountID,
      now: this.state.now,
      date: this.state.date,
    })
    .then((res) => res.json())
    .then((res) => {
      let validateCode = this.props.item;
      validateCode.userId = res.userID;
      const { id } = validateCode
      delete validateCode.id
      apiCall(`/validations/${id}`, 'PUT', validateCode)
    })
  }
  
  render () {
    const { error, email_disable } = this.state
    return (
      <React.Fragment>
        <div className="ContainerLogin">
          <div className="Login">
            <Header as="h2">Register your account</Header>
            <Divider />
            <Form>
              <Form.Input label="Full Name" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} onBlur={() => this.validate('name', 'name')}>
                <input maxLength="32" />
              </Form.Input>
              <Form.Input
                icon="user circle outline" 
                value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}
                onBlur={() => this.validate('username', 'display name')}
                label={
                <span style={{color: "#000000"}}>
                  Display Name
                  <InfoPopUp content="Short name or nickname" />
                </span>
              }>
                <input maxLength="16" />
              </Form.Input>
              <Form.Input 
                icon="phone" 
                label="mobile" 
                type="tel"
                onChange={(e) => this.setState({phone: e.target.value})} 
                onBlur={() => this.validate('phone', 'phone')}/>
              <Form.Input 
                icon="mail" 
                label="email" 
                onChange={(e) => this.setState({email: e.target.value})} 
                onBlur={() => this.validate('email', 'email')}
                disabled={email_disable}
                value={this.state.email}/>
              <Form.Input 
                icon="key" 
                type="password" 
                label="password" 
                onChange={(e) => this.setState({password: e.target.value})} 
                onBlur={() => this.validate('password', 'password')}/>
              <Form.Input 
                icon="key" 
                type="password" 
                label="password confirm" 
                onChange={(e) => this.setState({password_confirm: e.target.value})} 
                onBlur={() => this.validate('password_confirm', 'password confirm')}/>
              <Form.Button primary onClick={() => this.register()}>Continue</Form.Button>
              {error && <span className="error">{error}</span>}
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
};