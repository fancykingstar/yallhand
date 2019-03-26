import React from "react"
import {inject, observer} from "mobx-react"
import {Segment, Header, Icon, Form, Divider, Menu, Button} from "semantic-ui-react"
import { LabelGroup, validateAdd, labelsOneRemoved } from "../SharedUI/LabelGroup";
import {DateTimeSelect} from "../SharedUI/DateTimeSelect"

@inject("UIStore", "DataEntryStore", "AccountStore")
@observer
export class SendOptions extends React.Component {
    render(){
        const {UIStore, DataEntryStore, AccountStore} = this.props

    const sendPreview = () => {}
    const archiveAfter = () => {}
    const createCampaign = () => {}
    const emailCampaign = {}

    const addUser = (user, allUsers, key) => {
      if (
        validateAdd(user, allUsers) !== null) {
        let newArry = DataEntryStore.emailCampaign.selectedUsers;
        newArry.push(DataEntryStore.emailCampaign.selectedUser);
        DataEntryStore.set("emailCampaign", key, newArry);
      }
    };
        return(
      <div style={{maxWidth: 650}}>
      <Icon
        name="arrow circle left"
        color="blue"
        size="large"
        onClick={() => UIStore.set("menuItem", "emailFrame", "send email")} alt="Go back"
      />
          <Header as="h2">
          Send Options
          <Header.Subheader>
            Send an email preview, schedule later, or set email automations
          </Header.Subheader>
        </Header>
        <Segment>
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
          <span style={{fontWeight: 800, fontSize: ".9em"}}>Select an email send option</span><br/>
            <Menu compact size="tiny">
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "message"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "message")}> Schedule To Send Later</Menu.Item>
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "messagecontent"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "messagecontent")}> Onboard/Offboard Automations </Menu.Item>
          </Menu>

          <div style={{paddingTop: 10}}>
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
            // onClick={e => {
            //   DataEntryStore.set("api", "payload", emailCampaign())
            //   createCampaign(emailCampaign(), false)
            //   .then(createSchedule(schedule(DataEntryStore.emailCampaign.sendNext, "email send", {"campaignID": DataEntryStore.api.payload.campaignID})))
              // .then(() => UIStore.set("menuItem", "emailFrame", "outbound"))
            // }}
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
        </Segment>
        <br/>

      </div>    

        )
    }
}