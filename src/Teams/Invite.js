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
import * as load from "../DataExchange/Down"

@inject("AccountStore")
@observer
export class Invite extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      userInvites: [this.reset()], 
      dropdown: "today", 
      onBoardDate: ''
    }
  };

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
    };
  }

  error (validation, email) {
    let message = '';
    if (validation.userId) message = `${email} has already been invited to Join and is registered`
    else message = `${email} has already been invited to Join with code ${validation.code}`
    toast.error(message, {hideProgressBar: true})
    // this.reset()
  }

  success (email) {
    toast.success(`🎉 ${email} has been invited to Join ✉️`, {hideProgressBar: true})
    // this.setState(this.reset());
  } 

  handleClick = () => {
    this.setState({ userInvites: [...this.state.userInvites, this.reset()]})
  }
  
  updateFields = (fieldObj, id) => {
    let userList = [...this.state.userInvites]
    userList[id] = {...userList[id], ...fieldObj}
    this.setState({
        userInvites: userList
    })
  }

  removeRow = (id) => {
    let userList = this.state.userInvites
    if(userList.length > 1) {
      userList.splice(userList[id], 1)
      this.setState({userInvites: userList})
    }
  }

  checkMultiRow = () => {
    if(this.state.userInvites.length > 1) {
      return true
    }
    return false
  }

  displayUserInvites = () => {
    return this.state.userInvites.map((invite, index) => {
      return <InviteUser multipleRows={this.checkMultiRow()} info={invite} key={index} id={index} updateFields={this.updateFields} removeRow={this.removeRow} checked={invite.isAdmin}/>
    })
  }
  
  checkMail = () =>  {
    return this.state.userInvites.some(userInvite => {
      return !isValidEmail(userInvite.email)
    })
  }

  checkDate () {
    return (this.state.onBoardDate === "" || this.state.onBoardDate === undefined)
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


  render() {
    const dropDownText = [{text: "today ⚡️", value: "today" }, { text: "in the future ⏳", value: "future"}]
    const {dropdown} = this.state
    const {AccountStore} = this.props;

    const onBoard = async(later = false) => {

      for(const userInvite of this.state.userInvites) {
        let newUser = this.getDataNewUser(userInvite)
        newUser.now = !later
        if (later) {
          newUser.date = moment(this.state.onBoardDate).valueOf();
          newUser.now = false;
        }
        
        await apiCall('validations', 'POST', newUser).then((res) => res.json()).then(res => {
          if(later) createSchedule(schedule(newUser.date, 'onboard user', {id: res.id}))
          else res.error ? this.error(res, newUser.email) : this.success(newUser.email)
        })
        await users(AccountStore.account.accountID)
      }
      await load.users(AccountStore.account.accountID);
      await this.setState({userInvites:[]});
      const reset = await [this.reset()];
      await this.setState({
        userInvites: reset, 
        dropdown: "today", 
        onBoardDate: ''
      });

    }

    return(
      <div className="Segment">
        <Header as="h2" style={{padding: 0, margin: 0}} content="Onboard Users" subheader="Send invite for new user to join organization"/>
        <Segment>
          {this.displayUserInvites()}
   
          <div style={{ paddingBottom: "10px" }}>
          <Button primary circular icon="plus" onClick={() => this.handleClick()} />
        </div>
     
          <div> 
            <span> start user{" "} 
              <Dropdown 
                options={dropDownText} 
                value={dropdown} 
                onChange={(e, v) => this.setState({dropdown: v.value})}
                inline /> 
            </span>
          </div>
          <div style={{paddingTop: 20}}>
            <Form.Group inline>
            {dropdown === "today" ?
              <Form.Button size="small" content="Onboard Now" icon="street view" primary disabled={this.checkMail()} 
              content="Onboard Now" icon="clock"
              onClick={e => onBoard()}/>
             :
              <React.Fragment>
                <Form.Input label="Choose Date">
                  <DateTimeSelect notToday value={val => this.setState({onBoardDate: val}) } />
                </Form.Input>
                <Form.Button onClick={e => onBoard(true)} size="small" content="Schedule Start Day" icon="clock" disabled={this.checkMail() || this.checkDate()}/>
              </React.Fragment>
            }
            </Form.Group>
          </div>
        </Segment>
      </div>
    )
  }
} 