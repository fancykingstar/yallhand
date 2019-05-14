import React from "react";
import { Message, Form, Divider, Header } from "semantic-ui-react";
import { InfoPopUp } from "../SharedUI/InfoPopUp.js";
import { apiCall, setUser } from "../DataExchange/Fetch";
import { withRouter } from "react-router-dom";

class ProfileInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      name: props.item && props.item.displayName_full ? props.item.displayName_full : '',
      username: props.item && props.item.displayName ? props.item.displayName : '',
      phone: props.item && props.item.phone ? props.item.phone : '',
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
      googleId: props.item && props.item.googleId ? props.item.googleId : '',
      img: props.item && props.item.img ? props.item.img : '',
    };
    console.log(this.state)
  }

  isEmpty (value) {
    return typeof value === 'undefined' || value === null || value === ''
  }

  isWeak (value) {
    return value.toString().length < 2
  }

  isInvalidEmail (value) {
    return !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase()))
  }

  isInvalidPassword (value) {
    return !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\.!@#$%^&*])(?=.{8,})/.test(String(value)))
  }

  isPasswordNotEqual () {
    return this.state.password !== this.state.password_confirm
  }

  validate (type, humanReadableType) {
    let error = ''
    const field = this.state[type]

    new RegExp("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/")

    if (this.isEmpty(field)) error += `${humanReadableType} cannot be empty`
    else if (this.isWeak(field)) error += `${humanReadableType} is too short`
    else if (type === 'password' && this.isInvalidPassword(field)) error += `${humanReadableType} must contains 8 characters with 1 upper, 1 lower, 1 number and 1 special character`
    else if (type === 'email' && this.isInvalidEmail(field)) error += `${humanReadableType} is not valid`
    else if (type === 'password_confirm' && this.isPasswordNotEqual(field)) error += `${humanReadableType} is not equal to password`

    this.setState({error: error === '' ? null : error})

    return error
  }

  register () {
    const { invitedBy, name, username, isAdmin, teamID, tag, email, phone, password, accountID, now, date, googleId, img } = this.state
    if (this.validate('name', 'name') !== '') return;
    else if (this.validate('username', 'display name') !== '') return;
    else if (this.validate('phone', 'phone') !== '') return;
    else if (this.validate('email', 'email') !== '') return;
    else if (!googleId && this.validate('password', 'password') !== '') return;
    else if (!googleId && this.validate('password_confirm', 'password confirm') !== '') return;

    apiCall('/users', 'POST', {
      isActive: true,
      invitedBy: invitedBy,
      displayName_full: name,
      displayName: username,
      isAdmin: isAdmin,
      teamID: teamID,
      tags: tag,
      email: email,
      img: img,
      phone: phone,
      password: googleId ? googleId : password,
      accountID: accountID,
      now: now,
      date: date,
      googleId: googleId,
    })
    .then((res) => res.json())
    .then((res) => {
      let validateCode = this.props.item;
      validateCode.userId = res.userID;
      const { id } = validateCode
      delete validateCode.id
      apiCall(`/validations/${id}`, 'PUT', validateCode).then(() => {
        apiCall('users/login', 'POST', {email: email, password: googleId ? googleId : password})
          .then((res) => res.json())
          .then((res) => {
            if (res.token) {
              setUser({token: res.token})
              this.props.history.push(res.isAdmin? '/panel' : '/portal')
            }
          })
        })
    })
  }

  render () {
    const { error, email_disable, googleId } = this.state;
    return (
      <React.Fragment>
        <div className="ContainerLogin">
          <div className="Login">
            <Header as="h2">Register your account</Header>
            <Divider />
            <Form>
              <Form.Input label="Full Name"
                          value={this.state.name}
                          onBlur={() => this.validate('name', 'name')}
                          onChange={(e) => this.setState({name: e.target.value})}>
                <input maxLength="32" />
              </Form.Input>
              <Form.Input onBlur={() => this.validate('username', 'display name')}
                          value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}
                          label={<span style={{color: "#000000"}}>Display Name<InfoPopUp content="Short name or nickname" /></span>}>
                <input maxLength="16" />
              </Form.Input>
              <Form.Input icon="phone"
                          type="tel"
                          label="mobile"
                          onBlur={() => this.validate('phone', 'phone')}
                          onChange={(e) => this.setState({phone: e.target.value})}/>
              <Form.Input icon="mail"
                          label="email" 
                          value={this.state.email}
                          disabled={email_disable}
                          onBlur={() => this.validate('email', 'email')}
                          onChange={(e) => this.setState({email: e.target.value})}/>
              {!googleId &&
                <Form.Input icon="key"
                            type="password"
                            label="password" 
                            onBlur={() => this.validate('password', 'password')}
                            onChange={(e) => this.setState({password: e.target.value})}/>}
              {!googleId &&
                <Form.Input icon="key"
                            type="password"
                            label="password confirm" 
                            onBlur={() => this.validate('password_confirm', 'password confirm')}
                            onChange={(e) => this.setState({password_confirm: e.target.value})}/>}
              <Form.Button primary onClick={() => this.register()}>Continue</Form.Button>
            </Form>
          </div>
          {error && <div style={{maxWidth: 350, paddingTop: 10}}><Message icon="warning"  content={error} negative/></div>}
        </div>
      </React.Fragment>
    );
  }
};

export default withRouter(ProfileInfo);