import React from "react";
import { inject, observer } from "mobx-react";
import { TagSelect } from "../SharedUI/TagSelect";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { Form, Segment, Header, Dropdown } from "semantic-ui-react";
import { DatePicker } from "../SharedUI/DatePicker";
import { isValidEmail } from "../SharedValidations/InputValidations";
import { createUser, createSchedule } from "../DataExchange/Up"
import { user } from "../DataExchange/PayloadBuilder"
import { schedule } from "../DataExchange/PayloadBuilder"
import moment from "moment"
import "./style.css";
import { apiCall } from "../DataExchange/Fetch"

@inject("DataEntryStore", "UIStore")
@observer
export class InviteUser extends React.Component {
  constructor(props) {
    super(props);
    const { DataEntryStore } = this.props;
    const reset = () => {
      DataEntryStore.reset("onOffBoarding", {
        teamID: "global",
        tagID: "none",
        adminConfig: "all",
        adminTeamID: "global",
        adminTagID: "none"
      });
    }
    this.reset = reset.bind(this)
  }
  
  componentDidMount() {
    this.reset()
  }

  getDataNewUser () {
    const { DataEntryStore } = this.props;
    const userData = user()
    return {
      invitedBy: userData.invitedBy,
      email: userData.email,
      teamID: DataEntryStore.onOffBoarding.teamID,
      accountID: userData.accountID,
      tags: DataEntryStore.onOffBoarding.tagID === "none" ? [] : [DataEntryStore.onOffBoarding.tagID],
      isAdmin: false
    }
  }

  async onboardNow () {
    let newUser = this.getDataNewUser()
    newUser.now = true
    await apiCall('validations', 'POST', newUser).then(response => {})
  }

  async onboardLater () {
    const { DataEntryStore } = this.props;
    let newUser = this.getDataNewUser()
    newUser.now = false
    newUser.date = moment(DataEntryStore.onOffBoarding.onBoardingDate).valueOf()
    await apiCall('validations', 'POST', newUser).then(response => {})
  };

  render() {
    const { DataEntryStore } = this.props;
    const { UIStore } = this.props;
    const teamChange = val => DataEntryStore.set("onOffBoarding", "teamID", val);
    const tagChange = val => DataEntryStore.set("onOffBoarding", "tagID", val);
    const emailChange = val => DataEntryStore.set("onOffBoarding", "email", val);
    const setOnBoardDate = day => DataEntryStore.set("onOffBoarding", "onBoardingDate", day);
    const toggleOnboardWhen = (val) =>  UIStore.set("dropdown", "onBoardUser", val)

    const { onOffBoarding } = DataEntryStore;
    const { onBoardingDate, email, teamID, tagID } = onOffBoarding;
    const { dropdown } = UIStore;
    
    const userOnboardWhen = dropdown.onBoardUser === "today" ? (
      <Form.Button
        size="small"
        onClick={e => this.onboardNow()}
        content="Onboard Now"
        icon="street view"
        primary
        disabled={!isValidEmail(email)}/>
     ) : (
      <React.Fragment>
        <Form.Input label="Choose Date">
          <DatePicker from={"tomorrow"} output={setOnBoardDate} />
        </Form.Input>
        <Form.Button
          onClick={e => this.onboardLater()}
          size="small"
          content="Schedule Start Day"
          icon="clock"
          disabled={!isValidEmail(email) || (onBoardingDate === "" || onBoardingDate === undefined)}/>
      </React.Fragment>
    )

    return (
      <div className="Segment" style={{ position: "relative" }}>
        <Header as="h2" content="Onboard Users" subheader="Send invite for new user to join organization"/>
        <Segment>
          <Form>
            <Form.Group widths="equal">
              <Form.Input fluid label="Email" value={email} placeholder="jane@placethatwework.co" onChange={(e, val) => emailChange(val.value)}/>
              <TeamSelect label="Choose Team:" value={teamID} outputVal={val => teamChange(val)}/>
              <TagSelect label="Choose Tag (optional):" value={tagID} outputVal={val => tagChange(val)}/>
            </Form.Group>

            <span>
              start user
              <Dropdown inline
                options={[{ text: "today ⚡️", value: "today" }, { text: "in the future ⏳", value: "future" }]}
                onChange={(e, val) => toggleOnboardWhen(val.value)}
                value={dropdown.onBoardAdmin} />
            </span>
            <div style={{paddingTop: 10}}>
              <Form.Group inline>
                {userOnboardWhen}
              </Form.Group>
            </div>
          </Form>
        </Segment>
      </div>
    );
  }
}
