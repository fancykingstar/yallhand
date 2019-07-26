import React from 'react';
import { inject, observer } from "mobx-react";
import {Button, Segment, Form, Dropdown, Header} from "semantic-ui-react"
import { InviteUser } from './InviteUser';
import { isValidEmail } from "../SharedValidations/InputValidations";
import { user } from "../DataExchange/PayloadBuilder"
import moment from "moment"
import { apiCall } from "../DataExchange/Fetch"
import { createSchedule } from "../DataExchange/Up";
import { schedule } from "../DataExchange/PayloadBuilder"
import { users } from "../DataExchange/Down";
import toast  from "../YallToast"
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";

@inject("AccountStore")
@observer
export class Invite extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      userInvites: [this.reset()]
    }
  }

  reset () {
    return {
      teamID: "global",
      teamName: "global",
      tagID: "none",
      adminConfig: "all",
      adminTeamID: "global",
      adminTagID: "none",
      date: "",
      email: "",
      boss: "",
      isAdmin: false,
      dropdown: "today",
      
    };
  }

  error (validation) {
    let message = '';
    if (validation.userId) message = `${this.state.email} has already been invited to Join and is registered`
    else message = `${this.state.email} has already been invited to Join with code ${validation.code}`
    toast.error(message, {hideProgressBar: true})
    this.setState(this.reset());
  }

  success () {
    toast.success(`🎉 ${this.state.email} has been invited to Join ✉️`, {hideProgressBar: true})
    this.setState(this.reset());
  } 

  handleClick = () => {
    this.setState({ userInvites: [...this.state.userInvites, this.reset()]})
  }
  
  updateFields = (fieldObj, id) => {
    let updatingFields = Object.keys(fieldObj)
    let userList = this.state.userInvites
    updatingFields.forEach( field => {
      userList[id][field] = fieldObj[field]
    })
    this.setState({userInvites: userList})
    debugger
  }

  removeRow = (id) => {
    let userList = this.state.userInvites
    if(userList.length > 1) {
      userList.splice(userList[id], 1)
      this.setState({userInvites: userList})
    }
  }

  checkMultiRow = () => {
    console.log('this runs')
    if(this.state.userInvites.length > 1) {
      return true
    }
    return false
  }

  displayUserInvites = () => {
    return this.state.userInvites.map((invite, index) => {
      return <InviteUser multipleRows={this.checkMultiRow()} info={invite} key={index} id={index} updateFields={this.updateFields} removeRow={this.removeRow}/>
    })
  }
  
  checkMail = () =>  {
    return this.state.userInvites.some(userInvite => {
      return !isValidEmail(userInvite.email)
    })
  }

  checkDate () {
    return this.state.userInvites.some(userInvite => {
      return (userInvite.date === "" || userInvite.date === undefined)
    })
  }

  getDataNewUser (userObj) {
    const { AccountStore} = this.props;
    const { teamID, tagID, email, isAdmin, boss } = userObj;
    const userData = user()

    return {
      invitedBy: userData.invitedBy,
      email: email,
      teamID: teamID,
      teamName: AccountStore.account.label,
      accountID: userData.accountID,
      tags: tagID === "none" ? [] : [tagID],
      isAdmin,
      boss
    }
  }

  onBoard = async(later = false) => {
    const {AccountStore} = this.props;
    for(const userInvite of this.state.userInvites) {
      let newUser = this.getDataNewUser(userInvite)
      newUser.now = !later
      debugger
      if (later) {
        newUser.date = moment(userInvite.date).valueOf();
        debugger
        newUser.now = false;
      }
      
      await apiCall('validations', 'POST', newUser).then((res) => res.json()).then(res => {
        if(later) createSchedule(schedule(newUser.date, 'onboard user', {id: res.id}))
        else res.error ? this.error(res) : this.success()
      })
      await users(AccountStore.account.accountID)
    }
    this.setState(this.reset());
  }

  render() {
    const dropDownText = [{text: "today ⚡️", value: "today" }, { text: "in the future ⏳", value: "future"}]

    return(
      <div className="Segment">
        <Header as="h2" style={{padding: 0, margin: 0}} content="Onboard Users" subheader="Send invite for new user to join organization"/>
        <Segment>
          {this.displayUserInvites()}
          <Button onClick={this.handleClick}> + </Button>
          <div> <span> start user{" "} <Dropdown options={dropDownText} value={"today"} inline /> </span></div>
          <div style={{paddingTop: 20}}>
            <Form.Group inline>
              <Form.Button size="small" content="Onboard Now" icon="street view" primary disabled={this.checkMail()} 
              content="Onboard Now" icon="clock"
              onClick={e => this.onBoard()}/>
            </Form.Group>
          </div>
        </Segment>
      </div>
    )
  }
} 