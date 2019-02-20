import React from "react";
import { Segment, Header, Form, Dropdown } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { PermissionLevel } from "./PermissionLevel";
import { AdminConfig } from "./AdminConfig";
import { TagSelect } from "../SharedUI/TagSelect";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { isValidEmail } from "../SharedValidations/InputValidations";
import { createUser, createSchedule } from "../DataExchange/Up"
import { DatePicker } from "../SharedUI/DatePicker";
import { user } from "../DataExchange/PayloadBuilder"
import { schedule } from "../DataExchange/PayloadBuilder"
import moment from "moment"
import "./style.css";

@inject("DataEntryStore", "UIStore")
@observer
export class InviteAdmin extends React.Component {
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
    const configOptions =
      DataEntryStore.onOffBoarding.adminConfig === "all" ? null : (
        <AdminConfig storeTarget="onOffBoarding" />
      );
    const changeConfig = val => {
      DataEntryStore.set("onOffBoarding", "adminConfig", val);
    };
    const teamChange = val =>
      DataEntryStore.set("onOffBoarding", "adminTeamID", val);
    const tagChange = val =>
      DataEntryStore.set("onOffBoarding", "adminTagID", val);
    const emailChange = val =>
      DataEntryStore.set("onOffBoarding", "adminEmail", val);
      const setOnBoardDate = day => {
        DataEntryStore.set("onOffBoarding", "adminOnBoardingDate", day);
      };
      const toggleOnboardWhen = (val) => {
        UIStore.set("dropdown", "onBoardAdmin", val)
      }
      const onboardLater = () => {
        createUser(user(), false).then(() => {
          //need to get USERID back
          createSchedule(schedule(moment(DataEntryStore.onOffBoarding.adminOnBoardingDate).valueOf(), "onboard user", {"userID": "unknown"}))
          .then(() => {
          this.reset() 
          UIStore.set("dropdown", "onBoardAdmin", "today")
        })

  
      })
    };
  
      const onboardNow = () => {
        createUser(user()).then(() => {
        this.reset()
        UIStore.set("dropdown", "onBoardAdmin", "today")
        })
      }

    const userOnboardWhen = UIStore.dropdown.onBoardAdmin === "today" ?
    <Form.Button
    size="small"
    onClick={e => onboardNow()}
    content="Onboard Now"
    icon="street view"
    primary
    disabled={
      !isValidEmail(DataEntryStore.onOffBoarding.adminEmail)
    }
  />
  :
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
    !isValidEmail(DataEntryStore.onOffBoarding.adminEmail) || (DataEntryStore.onOffBoarding.adminOnBoardingDate === "" || DataEntryStore.onOffBoarding.adminOnBoardingDate === undefined) }
  />
</React.Fragment>
    return (
      <div className="Segment" style={{ position: "relative" }}>
        <Header
          as="h2"
          content="Onboard Admin Collaborators"
          subheader="Send invite to admin to generate and manage information"
        />
        <Segment>
          <Form>
           
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Email"
                  value={DataEntryStore.onOffBoarding.adminEmail}
                  placeholder="jane@placethatwework.co"
                  onChange={(e, val) => emailChange(val.value)}
                />
                <TeamSelect
                  label="Choose Team:"
                  value={DataEntryStore.onOffBoarding.adminTeamID}
                  outputVal={val => teamChange(val)}
                />
                <TagSelect
                  label="Choose Tag (optional):"
                  value={DataEntryStore.onOffBoarding.adminTagID}
                  outputVal={val => tagChange(val)}
                />
              </Form.Group>
              <PermissionLevel value={DataEntryStore.onOffBoarding.adminConfig} output={changeConfig} />
              {configOptions}
            </Form>
      
          <Form style={{paddingTop: 15}}>
         
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
