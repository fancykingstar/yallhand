import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Segment, Form, Button, Message } from "semantic-ui-react";
import { FeaturedAvatar } from "../SharedUI/ManageContent/FeaturedAvatar"
import { periods } from "../TemplateData/periods"
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { InfoPopUp } from "../SharedUI/InfoPopUp.js";
import { baseSettingsEdit} from "../DataExchange/PayloadBuilder"
import { modifyAccount } from "../DataExchange/Up"
import { ConfirmDelete } from "../SharedUI/ConfirmDelete.js";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"


@inject("AccountStore", "DataEntryStore")
@observer
export class BaseSettings extends React.Component {
  componentDidMount() {
    const { AccountStore } = this.props;
    const { DataEntryStore } = this.props;
    DataEntryStore.set("baseSettings", "label", AccountStore.account.label);
    DataEntryStore.set("baseSettings", "img", AccountStore.account.img);
    DataEntryStore.set("baseSettings", "userID", AccountStore.account.userID);
    DataEntryStore.set( "baseSettings", "timezone", AccountStore.account.timezone );
    DataEntryStore.set( "baseSettings", "reviewAlert", AccountStore.account.reviewAlert );
    DataEntryStore.set( "baseSettings", "generalEmail", AccountStore.account.generalEmail );
    window.scrollTo(0, 0);
  }
  render() {
    const { AccountStore } = this.props;
    const { DataEntryStore } = this.props;
    const newLabelStatus = FormCharMax(DataEntryStore.baseSettings.label, 24);
    const timezones = require("../TemplateData/timezones.json")
      .map(time => ({ text: time.text, value: time.offset }))
      .reverse();

    const handleDelete = () => {
      console.log("delete account request")
    }

    return (
      <div style={{ padding: 15, maxWidth: 900 }}>
        <Header
          as="h2"
          content="Account Settings"
          subheader="Settings for your Yallhands account"
        />
        <Segment>
          <div style={{ width: 400 }}>
         
            <Form>
           
              <Form.Input
                label="Company Name"
                value={DataEntryStore.baseSettings.label}
                onChange={(e, val) => DataEntryStore.set("baseSettings", "label", val.value)}
              >
                {" "}
                <input maxLength="24" />{" "}
              </Form.Input>
         
        
              <Form.Dropdown
                label={<span>Master Account Admin<InfoPopUp content="Access to billing, master account deletion, and default admin notices"/></span> }
                placeholder="Select User"
                search
                selection
                value={DataEntryStore.baseSettings.userID}
                onChange={(e, { value }) => DataEntryStore.set("baseSettings", "userID", value)}
                options={AccountStore._getUsersSelectOptions()}
              />
             
                
              {/* <Form.Field>
                <Form.Select
                  label="Default Timezone"
                  options={timezones}
                  value={DataEntryStore.baseSettings.timezone}
                  onChange={(e, { value }) => DataEntryStore.set("baseSettings", "timezone", value)}
                  search
                />
              </Form.Field> */}
              <Form.Select
                label="Default Review Alert For Aging Content"
                style={{ width: 150 }}
                options={periods}
                onChange={(e, { value }) => DataEntryStore.set("baseSettings", "reviewAlert", value)}
                value={DataEntryStore.baseSettings.reviewAlert}
              />
                <Form.Input
                label="General Query Email Address"
                value={DataEntryStore.baseSettings.generalEmail}
                onChange={(e, val) => DataEntryStore.set("baseSettings", "generalEmail", val.value)}
              >
                {" "}
                <input maxLength="24" />{" "}
              </Form.Input>

              <Button
                disabled={DataEntryStore.baseSettings.label === ""}
                primary
                type="submit"
                onClick={e => modifyAccount(baseSettingsEdit())}
              >
                Update
              </Button>
            </Form>
            <Message error attached hidden={newLabelStatus.messageHide}>
              {newLabelStatus.message}
            </Message>
          </div>
        </Segment>
        <FeaturedAvatar
          label="Company Logo"
          defaultImgUrl={DataEntryStore.baseSettings.img}
          uploaded={url => {
            DataEntryStore.set("baseSettings", "img", url)
            modifyAccount(baseSettingsEdit())
          }}
        />
        
        <Segment>
          <Header>Billing & Payments</Header>
          <span style={{fontWeight: 800}}>Free Trial Until: </span><span>{!AccountStore.account.data.trialExp? "No Date Entered" : UTCtoFriendly(AccountStore.account.data.trialExp)}</span>
        </Segment>
        <Segment >
          <div style={{height: 50}}>  
          <Form>
            <Form.Field >
              <label>Delete Your Yallhands Account</label>
              <ConfirmDelete size="mini" label="your entire Yallhands account" confirm={e => handleDelete()}/>
            </Form.Field>
          </Form>
          </div> 
        </Segment>
      </div>
    );
  }
}
