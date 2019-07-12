import React from "react";
import { inject, observer } from "mobx-react";
import { TagSelect } from "../SharedUI/TagSelect";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { Form, Segment, Header, Dropdown } from "semantic-ui-react";
import { isValidEmail } from "../SharedValidations/InputValidations";
import { user } from "../DataExchange/PayloadBuilder"
import { apiCall } from "../DataExchange/Fetch"
import { createSchedule } from "../DataExchange/Up";
import { schedule } from "../DataExchange/PayloadBuilder"
import { users } from "../DataExchange/Down";
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";
import toast  from "../YallToast"
import moment from "moment"
import "./style.css";

@inject("UIStore", "AccountStore")
@observer
export class InviteUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.reset();
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

  componentDidMount() {
    this.setState(this.reset());
  }

  getDataNewUser () {
    const { AccountStore} = this.props;
    const { teamID, teamName, tagID, email, isAdmin, boss } = this.state;
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

  checkMail () {
    return !isValidEmail(this.state.email)
  }

  checkDate () {
    return (this.state.date === "" || this.state.date === undefined)
  }

  async onboard (later = false) {
    const {AccountStore} = this.props;
    let newUser = this.getDataNewUser()
    newUser.now = !later
    if (later) {
      newUser.date = moment(this.state.date).valueOf();
      newUser.now = false;
    }
    await apiCall('validations', 'POST', newUser).then((res) => res.json()).then(res => {
      console.log(res)
      if(later) createSchedule(schedule(newUser.date, 'onboard user', {id: res.id}))
      else res.error ? this.error(res) : this.success()
    })
    await users(AccountStore.account.accountID)
    this.setState(this.reset());
  }

  render() {
    const dropDownText = [{text: "today ⚡️", value: "today" }, { text: "in the future ⏳", value: "future"}]
    const { email, teamID, tagID, dropdown } = this.state;
    const { isAdmin, AccountStore } = this.props;

    return (
      <div className="Segment">
        {isAdmin ?
          <Header as="h2" style={{padding: 0, margin: 0}} content="Onboard Admin Collaborators" subheader="Send invite to admin to generate and manage information"/> :
          <Header as="h2" style={{padding: 0, margin: 0}} content="Onboard Users" subheader="Send invite for new user to join organization"/>}
        <Segment>
          <Form widths="equal">
            <Form.Group > 
              <Form.Input label="Email" value={email} placeholder="jane@placethatwework.co" onChange={(e, v) => this.setState({email: v.value})}/>
              <TeamSelect label="Choose Team:" value={teamID} outputVal={e => this.setState({teamID: e.value, teamName: e.text})}/>
              <TagSelect  label="Choose Tag (optional):" value={tagID} outputVal={e => this.setState({tagID: e})}/>
              <Form.Dropdown
                label="Reports to (optional):"
                search
                selection
                onChange={(e, val) => this.setState({boss:val.value})}
                value={this.state.boss}
                options={AccountStore._getUsersSelectOptions()}
              />
            
            </Form.Group>
           <div style={{float:"left"}}> <span> start user{" "} <Dropdown onChange={(e, v) => this.setState({dropdown: v.value})} options={dropDownText} value={dropdown} inline /> </span></div>
            <div style={{float: "right"}}><Form.Checkbox checked={this.state.isAdmin} onChange={()=>this.setState({isAdmin:!this.state.isAdmin})} label="Admin"/></div>
            <div style={{paddingTop: 20}}>
              <Form.Group inline>
              {dropdown === "today" ?
                <Form.Button size="small" onClick={e => this.onboard()} content="Onboard Now" icon="street view" primary disabled={this.checkMail()}/>
              :
                <React.Fragment>
                  <Form.Input label="Choose Date">
                    <DateTimeSelect notToday value={val => this.setState({date: val}) } />

                  </Form.Input>
                  <Form.Button onClick={e => this.onboard(true)} size="small" content="Schedule Start Day" icon="clock" disabled={this.checkMail() || this.checkDate()}/>
                </React.Fragment>}
              </Form.Group>
              
            </div>
          </Form>
        </Segment>
      </div>
    );
  }
}