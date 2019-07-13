import React from 'react';
import { inject, observer } from "mobx-react";
import {Button, Segment, Form, Dropdown} from "semantic-ui-react"
import { UserInvite } from './UserInvite';
import { isValidEmail } from "../SharedValidations/InputValidations";
import { user } from "../DataExchange/PayloadBuilder"
import moment from "moment"
import { apiCall } from "../DataExchange/Fetch"
import { createSchedule } from "../DataExchange/Up";
import { schedule } from "../DataExchange/PayloadBuilder"
import { users } from "../DataExchange/Down";

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

  handleClick = () => {
    this.setState({ userInvites: [...this.state.userInvites, this.reset()]})
  }
  
  updateFields = (fieldObj, id) => {
    let userList = this.state.userInvites
    userList[id].email = fieldObj.email
    this.setState({userInvites: userList})
  }

  removeRow = (id) => {
    let userList = this.state.userInvites
    if(userList.length > 1) {
      userList.splice(userList[id], 1)
      this.setState({userInvites: userList})
    }
  }

  displayUserInvites = () => {
    return this.state.userInvites.map((invite, index) => {
      return <UserInvite info={invite} key={index} id={index} updateFields={this.updateFields} removeRow={this.removeRow}/>
    })
  }
  
  checkMail = () =>  {
    return this.state.userInvites.some(userInvite => {
      return !isValidEmail(userInvite.email)
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
      console.log(userInvite)
      let newUser = this.getDataNewUser(userInvite)
      newUser.now = !later
      if (later) {
        newUser.date = moment(this.state.date).valueOf();
        newUser.now = false;
      }

      console.log(newUser)
      await apiCall('validations', 'POST', newUser).then((res) => res.json()).then(res => {
        console.log(res)
        if(later) createSchedule(schedule(newUser.date, 'onboard user', {id: res.id}))
        else res.error ? this.error(res) : this.success()
      })
      await users(AccountStore.account.accountID)
      this.setState(this.reset());
    }
  }

  render() {
    const dropDownText = [{text: "today ⚡️", value: "today" }, { text: "in the future ⏳", value: "future"}]

    return(
      <div className="Segment">
        <Segment>
          {this.displayUserInvites()}
          <Button onClick={this.handleClick}> + </Button>
          <div> <span> start user{" "} <Dropdown options={dropDownText} value={"today"} inline /> </span></div>
          <div style={{paddingTop: 20}}>
            <Form.Group inline>
              <Form.Button size="small" content="Onboard Now" icon="street view" primary disabled={this.checkMail()} 
              content="Schedule Start Day" icon="clock"
              onClick={e => this.onBoard(true)}/>
            </Form.Group>
          </div>
        </Segment>
      </div>
    )
  }
} 