import React from "react";
import { DataEntryStore } from "../Stores/DataEntryStore";
import { UIStore } from "../Stores/UIStore";
import { Form, Checkbox, Button, Icon } from "semantic-ui-react";
import { emailCampaign, schedule } from "../DataExchange/PayloadBuilder";
import { createCampaign, createSchedule } from "../DataExchange/Up";
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";
import { DatePicker } from "../SharedUI/DatePicker"
import { getTimeZone } from "../SharedCalculations/GetTimezone";
import moment from "moment";

export const sendOptionConfig = () => {
  const sendEmailLater = () => {}
  const archiveAfter = (
    <div style={{ paddingTop: 5 }}>
      <Checkbox
        label="Archive when completed"
        checked={DataEntryStore.emailCampaign.archiveAfter}
        onChange={e =>
          DataEntryStore.set(
            "emailCampaign",
            "archiveAfter",
            !DataEntryStore.emailCampaign.archiveAfter
          )
        }
      />
    </div>
  );
 
  switch (DataEntryStore.emailCampaign.sendEmailsConfig) {
    case "now":
      return (
        <div>
          <Button
            icon
            primary
            labelPosition="left"
            onClick={e => {
              createCampaign(emailCampaign(true)).then(() => UIStore.set("menuItem", "emailFrame", "outbound"))
            }}
          >
          
            <Icon name="send" /> Send Now
          </Button>
          <br />
          {archiveAfter}
        </div>
      );
      break;
    case "schedule":
      return (
        <div>
          <Form><Form.Group>
          <DateTimeSelect
              value={val => DataEntryStore.set("emailCampaign", "sendNext", val)}
             />
                
          </Form.Group>
          <Form.Button
            disabled={DataEntryStore.emailCampaign.sendNext === 0}
            icon
            primary
            labelPosition="left"
            onClick={e => {
              DataEntryStore.set("api", "payload", emailCampaign())
              createCampaign(emailCampaign(), false)
              .then(createSchedule(schedule(DataEntryStore.emailCampaign.sendNext, "email send", {"campaignID": DataEntryStore.api.payload.campaignID})))
              // .then(() => UIStore.set("menuItem", "emailFrame", "outbound"))
            }}
          >
            <Icon name="send" /> Send Later
          </Form.Button>
             </Form>
          {/* <p style={{ marginTop: 5 }}>
            <span style={{ fontWeight: 800 }}>Time Format: </span>
            {getTimeZone().value}
          </p> */}
      
          <br />
          {archiveAfter}
        </div>
      );
      break;
    case "recur":
      return (
        <div>
          <Form>
          <DatePicker from={"tomorrow"} output={val => DataEntryStore.set("emailCampaign", "sendNext", moment(val).valueOf())} />
          </Form>
          <p style={{ marginTop: 5 }}>Will recur every year same month/day</p>
          <Button
            icon
            primary
            disabled={DataEntryStore.emailCampaign.sendNext === 0}
            labelPosition="left"
            onClick={e => {
              createCampaign(emailCampaign(), false)
              .then(createSchedule(schedule(DataEntryStore.emailCampaign.sendNext, "email send", {"campaignID": DataEntryStore.api.payload.campaignID})))
              // .then(UIStore.set("menuItem", "emailFrame", "outbound"))
            }}
          >
            <Icon name="send" /> Send Later
          </Button>
        </div>
      );
      break;
    case "trigger":
      return (
        <div>
          <Form>
            <Form.Group>
              <Form.Select
                label="event"
                placeholder="choose event"
                options={[
                  { text: "Onboarding Start", value: "firstLogin" },
                  { text: "Offboarding Start", value: "offboard" }
                ]}
                defaultValue={DataEntryStore.emailCampaign.sendTriggerEvent}
                onChange={(e, val) => DataEntryStore.set("emailCampaign", "sendTriggerEvent", val.value)}
              />
              <Form.Input
                label="delay (in days)"
                type="number"
                value={DataEntryStore.emailCampaign.sendTriggerDelay}
                onChange={(e, val) => DataEntryStore.set("emailCampaign", "sendTriggerDelay", val.value)}
              />
            </Form.Group>
          </Form>
          <Button
            icon
            primary
            disabled={DataEntryStore.emailCampaign.sendTriggerEvent === ""}
            labelPosition="left"
            onClick={e => {
              createCampaign(emailCampaign()).then(UIStore.set("menuItem", "emailFrame", "outbound"))
            }}
          >

            <Icon name="send" /> Send Later
          </Button>
        </div>
      );
      break;
    default:
      return <div />;
  }
};
