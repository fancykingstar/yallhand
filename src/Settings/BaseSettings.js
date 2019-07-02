import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Segment, Form, Button, Message, Icon, Grid } from "semantic-ui-react";
import { FeaturedAvatar } from "../SharedUI/ManageContent/FeaturedAvatar"
import { periods } from "../TemplateData/periods"
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { InfoPopUp } from "../SharedUI/InfoPopUp.js";
import { baseSettingsEdit} from "../DataExchange/PayloadBuilder"
import { modifyAccount } from "../DataExchange/Up"
import { ConfirmDelete } from "../SharedUI/ConfirmDelete.js";
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
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
          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column>
                <h5>Plan</h5>
                <div style={{marginTop: -10,fontWeight: 800}}><p><a href="https://yallhands.com/#pricing" target="_blank">Compare...</a></p></div>
                <span><p>History</p></span>
                </Grid.Column>
              <Grid.Column>
                <h5>Billing Info</h5>
                <span><p>Next payment: $299 on 9/21/19 </p></span>
            <span><p><Icon name="cc visa"/>ending in 4242 exp 4/19</p></span>
            <Button size="mini">Update Billing...</Button>
            <br/>
            <img src="https://yallhandsgeneral.s3.amazonaws.com/powered_by_stripe.png"/>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          {/* <Menu size="small" secondary>
        <Menu.Item name='Plans' />
        <Menu.Item name='Billing Info' />
      </Menu> */}

      <Form style={{ paddingTop: 5, maxWidth: 350 }} >
      

           
   
        
       
            
   
          </Form>
          {/* <span style={{fontWeight: 800}}>Free Trial Until: </span><span>{!AccountStore.account.data.trialExp? "No Date Entered" : UTCtoFriendly(AccountStore.account.data.trialExp)}</span> */}
          {/* <StripeProvider apiKey="pk_test_q15ZR4IPRGLaclyGku9Lkuqs00ZLLvQduo">
        <div className="example">
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider> */}
         
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
