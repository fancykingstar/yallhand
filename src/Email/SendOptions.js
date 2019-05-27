import React from "react";
import {withRouter} from "react-router-dom"
import { inject, observer } from "mobx-react";
import { Segment, Header, Icon, Form, Checkbox, Menu, Button, Message } from "semantic-ui-react";
import { LabelGroup, validateAdd, labelsOneRemoved } from "../SharedUI/LabelGroup";
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";

import { emailCampaign, emailPreview, schedule } from "../DataExchange/PayloadBuilder";
import { createCampaign, createSchedule } from "../DataExchange/Up"
import { sendEmailPreview } from "../DataExchange/Up";

@inject("UIStore", "DataEntryStore", "AccountStore", "EmailStore")
@observer
class SendOptions extends React.Component {
  render() {
    const { UIStore, DataEntryStore, AccountStore, EmailStore } = this.props;
 
    const sendPreview = () => {
      sendEmailPreview(emailPreview());
    };
  
    const sendLater = async () => {
      let camp = {}
      if(canSubmit()) {
        if(UIStore.menuItem.sendEmailOption === "schedule") 
        await createCampaign(emailCampaign(false, true), false)
          .then(r =>  r.json()
          .then(data => {
            camp = data
            createSchedule(schedule(DataEntryStore.emailCampaign.sendNext, "email send", {"campaignID": data.campaignID, "label": data.subject}))})) 
        else camp = await createCampaign(emailCampaign(false, false)).then((res) => res.json())
        EmailStore.loadCampaigns([...EmailStore.allCampaigns, ...[camp]])
        UIStore.menuItem.sendEmailOption === "schedule"? this.props.history.push("/panel") : UIStore.set("menuItem", "emailFrame", "automations" )
          }

      }

    const canSubmit = () => {
      let validations = {datetime: false}        
      if(UIStore.menuItem.sendEmailOption !== "schedule" ||  DataEntryStore.emailCampaign.sendNext !== 0){validations.datetime = true}
      //Messages
      if(!validations.datetime){UIStore.set("message", "sendLater", "Whoops, please make sure you add a date")}
      else { UIStore.set("message", "sendLater", "") }
      return !Object.values(validations).includes(false)
    }

    const addUser = (user, allUsers, key) => {
      if (validateAdd(user, allUsers) !== null) {
        let newArry = DataEntryStore.emailCampaign.previewUsers;
        newArry.push(DataEntryStore.emailCampaign.previewUser);
        DataEntryStore.set("emailCampaign", key, newArry);
      }
    };

    const displaySendOption = UIStore.menuItem.sendEmailOption === "schedule"? 
    <React.Fragment>
       <Form>
              <Form.Group>
                <DateTimeSelect
                  value={val =>
                    DataEntryStore.set("emailCampaign", "sendNext", val)
                  }
                />
              </Form.Group>
            </Form>
        <div style={DataEntryStore.emailCampaign.loadedTemplateSubject !== DataEntryStore.emailCampaign.sendSubject? {paddingBottom: 5}:{display: "none"}}> <Checkbox checked={DataEntryStore.emailCampaign.sendSaveTemplate}  onClick={(e, data) => DataEntryStore.set("emailCampaign", "sendSaveTemplate", data.checked)} label="Use as template in the future"/> </div>
      
    </React.Fragment>
    :
    <React.Fragment>
       <Form>
              <Form.Group>
                <Form.Select
                  label="Choose Event"
                  options={[
                    { text: "Onboarding Start", value: "firstLogin" },
                    { text: "Offboarding Start", value: "offboard" }
                  ]}
                  defaultValue={DataEntryStore.emailCampaign.sendAutomationEvent}
                  onChange={(e, val) =>
                    DataEntryStore.set(
                      "emailCampaign",
                      "sendAutomationEvent",
                      val.value
                    )
                  }
                />
                <Form.Input
                  label="delay (in days)"
                  type="number"
                  value={DataEntryStore.emailCampaign.sendAutomationDelay}
                  onChange={(e, val) =>
                    DataEntryStore.set(
                      "emailCampaign",
                      "sendAutomationDelay",
                      val.value
                    )
                  }
                />
              </Form.Group>
            </Form>
    </React.Fragment>

    return (
      <div style={{ maxWidth: 650 }}>
        <Icon name="arrow circle left" color="blue" size="large" onClick={() => UIStore.set("menuItem", "emailFrame", "send email")} alt="Go back" />
        <Header as="h2"> Send Options <Header.Subheader> Send an email preview, schedule later, or set email automations </Header.Subheader> </Header>
        <Segment>
         <Header as="h4">Send a preview</Header>
          <span style={{ fontWeight: 800, fontSize: ".9em" }}>
          Add users and send preview email(s)
          </span>
          <Form style={{ paddingTop: 5, minWidth: 400 }}>
            <Form.Group inline>
              <Form.Dropdown placeholder="Select User" search selection
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
                    "previewUsers" ) } >
                Add
              </Form.Button>
              <Form.Button
                disabled={ DataEntryStore.emailCampaign.previewUsers.length === 0 }
                onClick={e => sendPreview()} primary >
                Send Preview
              </Form.Button>
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
                      DataEntryStore.emailCampaign.previewUsers ) ) }
                labelprop={"displayName_full"}
                displayFilter={val => AccountStore._getUser(val)}
              />
              <span style={{ fontWeight: 400, fontSize: ".9em" }} />
              <br />
            </div>
          </Form>
        </Segment>
        <br/>
        <Segment>
         <Header as="h4">Other ways to send your email</Header>
          <span style={{ fontWeight: 800, fontSize: ".9em" }}>
            Choose an option
          </span>
          <br />
          <Menu vertical={UIStore.responsive.isMobile} compact size="tiny">
            <Menu.Item
              as="a"
              active={UIStore.menuItem.sendEmailOption === "schedule"}
              onClick={e => UIStore.set("menuItem", "sendEmailOption", "schedule")}
            >
              {" "}
              Schedule To Send Later
            </Menu.Item>
            <Menu.Item
              as="a"
              active={UIStore.menuItem.sendEmailOption === "automate"}
              onClick={e => UIStore.set("menuItem", "sendEmailOption", "automate")}>
              {" "}
              Onboard/Offboard Automations{" "}
            </Menu.Item>
          </Menu>
          <div style={{ paddingTop: 10 }}> {displaySendOption} <br /> </div>
          <div>
           
            <Button
              icon
              primary
              labelPosition="left"
              onClick={e => sendLater()}
            >
              <Icon name="send" /> Send Later
            </Button>
          </div>
          <Message error hidden={UIStore.message.sendLater === ""}>
            {UIStore.message.sendLater}
          </Message>
        </Segment>
        <br />
      </div>
    );
  }
}
export default withRouter(SendOptions)