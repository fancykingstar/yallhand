import React from "react";
import { inject, observer } from "mobx-react";
import { Form, Divider, Header, Dropdown, Segment, } from "semantic-ui-react";
import { sendOptionConfig } from "./SendOptionConfig";
import {LabelGroup,validateAdd,labelsOneRemoved } from "../SharedUI/LabelGroup";
import {emailPreview} from "../DataExchange/PayloadBuilder"
import { sendEmailPreview } from "../DataExchange/Up";


export const Send = inject("DataEntryStore", "AccountStore")( observer(props => {
    const { DataEntryStore, AccountStore } = props;
    
    const addUser = (user, allUsers, key) => {
        if (
          validateAdd(user, allUsers) !== null) {
          let newArry = DataEntryStore.emailCampaign.previewUsers;
          newArry.push(DataEntryStore.emailCampaign.previewUser);
          DataEntryStore.set("emailCampaign", key, newArry);
        }
      };

      const sendPreview = () => {
        sendEmailPreview(emailPreview())
      }

    return (
      <div style={ DataEntryStore.emailCampaign.selectedContentBundle === "" ||
      (DataEntryStore.emailCampaign.selectedTeamID === "" &&
        DataEntryStore.emailCampaign.selectedUsers.length === 0) ? {pointerEvents: "none"} : null}>

 
      <Segment
        color="blue"
        disabled={
          DataEntryStore.emailCampaign.selectedContentBundle === "" ||
      (DataEntryStore.emailCampaign.selectedTeamID === "" &&
        DataEntryStore.emailCampaign.selectedUsers.length === 0)
        }
      >
        <div style={{ maxWidth: 400, minHeight: 420 }}>
          <Header>Send</Header>
          <p>
            <span style={{ fontWeight: 800 }}>Preview Email(s): </span>
            <br />
            <span>Send a test copy of all variations to review</span>
          </p>
          <Form
          style={{ paddingTop: 5, minWidth: 400 }}
        >
          <Form.Group inline>
            <Form.Dropdown
              placeholder="Select User"
              search
              selection
              onChange={(e, val) =>
                DataEntryStore.set("emailCampaign", "previewUser", val.value)
              }
              value={DataEntryStore.emailCampaign.previewUser}
              options={AccountStore._getUsersSelectOptions()}
            />
            <Form.Button
              onClick={e =>
                addUser(
                  DataEntryStore.emailCampaign.previewUser,
                  DataEntryStore.emailCampaign.previewUsers,
                  "previewUsers"
                )
              }
            >
              Add
            </Form.Button>
            <Form.Button 
            disabled={DataEntryStore.emailCampaign.previewUsers.length === 0} 
            onClick={e => sendPreview()} primary>Preview</Form.Button>
          </Form.Group>
          <div style={{ marginTop: 20, paddingBottom: 20 }}>
            <LabelGroup
              currentArray={DataEntryStore.emailCampaign.previewUsers}
              onRemove={val =>
                DataEntryStore.set(
                  "emailCampaign",
                  "previewUsers",
                  labelsOneRemoved(
                    val,
                    DataEntryStore.emailCampaign.previewUsers
                  )
                )
              }
              labelprop={"displayName"}
              displayFilter={val => AccountStore._getUser(val)}
            />
          </div>
        </Form>
          <Divider style={{ paddingBottom: 5 }} />
          <p>
            <span style={{ fontWeight: 800 }}>Send Email(s): </span>
          </p>
          <span>
            send this email to eligable users{" "}
            <Dropdown
              inline
              options={[
                { text: "right now", value: "now" },
                { text: "at a scheduled time", value: "schedule" },
                { text: "on annual recurring date starting on", value: "recur" },
                { text: "who are newly effected by event trigger", value: "trigger" }
              ]}
              value={DataEntryStore.emailCampaign.sendEmailsConfig}
              onChange={(e, { value }) => {
                DataEntryStore.set("emailCampaign", "sendEmailsConfig", value)
                DataEntryStore.set("emailCampaign", "sendNext", 0)
                DataEntryStore.set("emailCampaign", "archiveAfter", false)
                DataEntryStore.set("emailCampaign", "sendTriggerEvent", "")
                DataEntryStore.set("emailCampaign", "sendTriggerDelay", 0)
                DataEntryStore.set("emailCampaign", "sendChooseDate", "")
                DataEntryStore.set("emailCampaign", "sendChooseTime", "")
              }
               
              }
            />
          </span>
          <div style={{ paddingTop: 10 }}>{sendOptionConfig()}</div>
        </div>
      </Segment>
      </div>
    );
  })
);
