import React from "react";
import { inject, observer } from "mobx-react";
import { TagSelect } from "../SharedUI/TagSelect";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { Form, Segment, Header, Dropdown } from "semantic-ui-react";
import { DatePicker } from "../SharedUI/DatePicker";
import { isValidEmail } from "../SharedValidations/InputValidations";
import { user } from "../DataExchange/PayloadBuilder"
import moment from "moment"
import "./style.css";
import { apiCall } from "../DataExchange/Fetch"
import { toast } from 'react-toastify';

@inject("UIStore")
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
      dropdown: "today"
    };
  }

  componentDidMount() {
    this.setState(this.reset());
  }

  getDataNewUser () {
    const { isAdmin } = this.props;
    const { teamID, teamName, tagID, email } = this.state;
    const userData = user()

    return {
      invitedBy: userData.invitedBy,
      email: email,
      teamID: teamID,
      teamName: teamName,
      accountID: userData.accountID,
      tags: tagID === "none" ? [] : [tagID],
      isAdmin: isAdmin
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
    let newUser = this.getDataNewUser()
    newUser.now = !later
    if (later) newUser.date = moment(this.state.date).valueOf()
    // console.log(newUser)
    await apiCall('validations', 'POST', newUser).then((res) => res.json()).then((res) => res.error ? this.error(res) : this.success())
  }

  render() {
    const dropDownText = [{text: "today ⚡️", value: "today" }, { text: "in the future ⏳", value: "future"}]
    const { email, teamID, tagID, dropdown } = this.state;
    const { isAdmin } = this.props;

    return (
      <div className="Segment" style={{ position: "relative" }}>
        {isAdmin ?
          <Header as="h2" content="Onboard Admin Collaborators" subheader="Send invite to admin to generate and manage information"/> :
          <Header as="h2" content="Onboard Users" subheader="Send invite for new user to join organization"/>}
        <Segment>
          <Form>
            <Form.Group widths="equal">
              <Form.Input fluid label="Email" value={email} placeholder="jane@placethatwework.co" onChange={(e, v) => this.setState({email: v.value})}/>
              <TeamSelect label="Choose Team:" value={teamID} outputVal={e => this.setState({teamID: e.value, teamName: e.text})}/>
              <TagSelect label="Choose Tag (optional):" value={tagID} outputVal={e => this.setState({tagID: e})}/>
            </Form.Group>
            <span>
              start user{" "}
              <Dropdown onChange={(e, v) => this.setState({dropdown: v.value})} options={dropDownText} value={dropdown} inline />
            </span>
            <div style={{paddingTop: 10}}>
              <Form.Group inline>
              {dropdown === "today" ?
                <Form.Button size="small" onClick={e => this.onboard()} content="Onboard Now" icon="street view" primary disabled={this.checkMail()}/>
              :
                <React.Fragment>
                  <Form.Input label="Choose Date">
                    <DatePicker from={"tomorrow"} output={e => this.setState({date: e})} />
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
