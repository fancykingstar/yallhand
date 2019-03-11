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
  render() {
    const { DataEntryStore } = this.props;
    const { UIStore } = this.props;
    const teamChange = val =>
      DataEntryStore.set("onOffBoarding", "teamID", val);
    const tagChange = val => DataEntryStore.set("onOffBoarding", "tagID", val);
    const emailChange = val => {
      DataEntryStore.set("onOffBoarding", "email", val);
    };
    const setOnBoardDate = day => {
      DataEntryStore.set("onOffBoarding", "onBoardingDate", day);
    };
    const toggleOnboardWhen = (val) => {
      UIStore.set("dropdown", "onBoardUser", val)
    }

    const onboardLater = () => {
      const newUser = user()
      createUser(newUser, false).then(() => {
        createSchedule(schedule(moment(DataEntryStore.onOffBoarding.onBoardingDate).valueOf(), "onboard user", {"userID": newUser.userID}))
        .then(() => {
        this.reset() 
        UIStore.set("dropdown", "onBoardUser", "today")
      })
      })
    };

   

    const onboardNow = () => {
      createUser(user()).then(() => {
        this.reset()
        UIStore.set("dropdown", "onBoardUser", "today")
      })
    }

    const userOnboardWhen = UIStore.dropdown.onBoardUser === "today" ? (
      <Form.Button
      size="small"
      onClick={e => onboardNow()}
      content="Onboard Now"
      icon="street view"
      primary
      disabled={!isValidEmail(DataEntryStore.onOffBoarding.email)}
    />
     ) : (
      <React.Fragment>
        
                <Form.Input label="Choose Date">
                <DatePicker from={"tomorrow"} output={setOnBoardDate} />
                </Form.Input>
                <Form.Button
                onClick={e => onboardLater()}
                size="small"
                content="Schedule Start Day"
                icon="clock"
                disabled={
                  !isValidEmail(DataEntryStore.onOffBoarding.email) || (DataEntryStore.onOffBoarding.onBoardingDate === "" || DataEntryStore.onOffBoarding.onBoardingDate === undefined) }
                />
      </React.Fragment>
     )

    

    return (
      <div className="Segment" style={{ position: "relative" }}>
        <Header
          as="h2"
          content="Onboard Users"
          subheader="Send invite for new user to join organization"
        />
        <Segment>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Email"
                value={DataEntryStore.onOffBoarding.email}
                placeholder="jane@placethatwework.co"
                onChange={(e, val) => emailChange(val.value)}
              />
              <TeamSelect
                label="Choose Team:"
                value={DataEntryStore.onOffBoarding.teamID}
                outputVal={val => teamChange(val)}
              />
              <TagSelect
                label="Choose Tag (optional):"
                value={DataEntryStore.onOffBoarding.tagID}
                outputVal={val => tagChange(val)}
              />
            </Form.Group>

            <span>
              start user{' '}
              <Dropdown
            inline
            value={UIStore.dropdown.onBoardAdmin}
                options={[
                  { text: "today ⚡️", value: "today" },
                  { text: "in the future ⏳", value: "future" }
                ]
              } 
              onChange={(e, val) => toggleOnboardWhen(val.value)}
              />
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
