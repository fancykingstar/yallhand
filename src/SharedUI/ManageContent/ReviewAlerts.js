import React from "react";
import { inject, observer } from "mobx-react";
import { Segment, Button, Header, Dropdown, Form } from "semantic-ui-react";
import { giveMeKey } from "../../SharedCalculations/GiveMeKey"
import { DatePicker } from "../DatePicker";
import {periods} from "../../TemplateData/periods"
import moment from "moment"
import { contentPatch } from "../../DataExchange/PayloadBuilder"
import { modifyAnnouncement, modifyPolicy} from "../../DataExchange/Up"
import { createSchedule } from "../../DataExchange/Up"
import { schedule } from "../../DataExchange/PayloadBuilder"
import "./style.css";

export const ReviewAlerts = inject("UIStore", "AccountStore", "DataEntryStore")(
  observer(props => {
    const { UIStore, AccountStore, DataEntryStore } = props;
    const defaultReview = props.defaultVal === undefined ?
      AccountStore.account.reviewAlert : props.defaultVal

    const mode = props.mode === "policy" ? "policy" : "announcement"

    const handleClick = () => {
      if(UIStore.dropdown.reviewAlerts === "recur"){
          let patchObj = {reviewAlert: DataEntryStore.contentmgmt.reviewAlert}
          mode === "policy" ? patchObj.policyID = UIStore.content.policyID : patchObj.announcementID = UIStore.content.announcementID
          mode === "policy" ? modifyPolicy(contentPatch(patchObj)) : modifyAnnouncement(contentPatch(patchObj))
      }
      else{
        const data = mode === "policy" ? {"policyID": UIStore.content.policyID} : {"announcementID": UIStore.content.announcementID} 
        createSchedule(schedule(DataEntryStore.contentmgmt.schedAlert, "review alert", data))
      }
    }


    const alertOptions =
      UIStore.dropdown.reviewAlerts === "recur" ? (
        <Form>
          <Form.Select
            style={{ width: 150 }}
            options={periods}
            defaultValue={defaultReview}
            onChange={(e, val) => DataEntryStore.set("contentmgmt", "reviewAlert", val.value)}
          />
        </Form>
      ) :
       (
        <React.Fragment>
          <Form>
            <Form.Input>
              <DatePicker output={val => DataEntryStore.set("contentmgmt", "schedAlert", moment(new Date(val)).valueOf())}/>
            </Form.Input>
          </Form>
        </React.Fragment>
      );
    return (
      <Segment>
        <div className="FixedWidth">
          <Header>Review Alerts</Header>
        </div>
        <span>
          Alert to review this policy{" "}
          <Dropdown
            inline
            onChange={(e, val) =>
              UIStore.set("dropdown", "reviewAlerts", val.value)
            }
            options={[
              { text: "on a recurring basis every", value: "recur" },
              { text: "once on the next following date", value: "one-time" }
            ]}
            defaultValue={"recur"}
          />
        </span>
        {alertOptions}
        <Button primary style={{ marginTop: 15 }} onClick={e => handleClick()}>
          Update
        </Button>
      </Segment>
    );
  })
);
