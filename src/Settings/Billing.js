import React from 'react';
import {inject, observer} from "mobx-react";
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { Header, Segment, Form, Button, Icon, Grid, Image, Modal } from "semantic-ui-react";
import { modifyAccount } from '../DataExchange/Up';
import _ from 'lodash';

@inject("AccountStore")
@observer
export class Billing extends React.Component {
    render(){
    
        const {AccountStore} = this.props;
        const periodEnd = _.isEmpty(AccountStore.stripe)?"": UTCtoFriendly(AccountStore.stripe.subscriptions.data[0].current_period_end * 1000)
        const sources = _.isEmpty(AccountStore.stripe)?"": AccountStore.stripe.sources.data.length === 0? <p style={{fontWeight:800}}>No billing information entered</p> :
        <React.Fragment> <span><p><strong>Next payment: </strong>$299 on {periodEnd} </p></span> <br/>   
        <span><p><strong>Payment method: </strong><br/><Icon name="cc visa"/>ending in {AccountStore.stripe.sources.data[0].last4} exp {AccountStore.stripe.sources.data[0].exp_month}/{AccountStore.stripe.sources.data[0].exp_year}</p></span>
   </React.Fragment>
        const trialEnd = _.isEmpty(AccountStore.stripe)?"": AccountStore.stripe.subscriptions.data[0].trial_end >= Number(String(Date.now()).slice(0,10))? UTCtoFriendly(AccountStore.stripe.subscriptions.data[0].trial_end * 1000):""
        const changePlan = (type) => modifyAccount({accountID:AccountStore.account.accountID,plan: type});
        const billingDisplay = 
            AccountStore.account.plan === "demo" && !AccountStore.account.stripe? 
            "": sources 
                   
        return(
            <Segment>
          <Header>Billing & Payments</Header>
          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column>
                <div className="ThinBorder">
                <h5>Plan</h5>
                <div className="PlansContainer">
                <div onClick={()=>changePlan("demo")} className={AccountStore.account.plan === "demo"? "PlanOption PlanActive":"PlanOption"}>Demo
                  <div className="PlanDesc">
                    Free (limited features)
                    <h5>$0 / month</h5>
                  </div>
                </div>
                <div onClick={()=>changePlan("pro")} className={AccountStore.account.plan === "pro"? "PlanOption PlanActive":"PlanOption"}>
                    <Icon color="yellow" name="star"/> Pro
                
                <div className="PlanDesc">
                    Paid (all features)
                    <h5>$99 / month</h5>
                  </div>
                </div>
                </div>
                <div style={{width: '100%', textAlign: 'center',fontWeight: 800}}><p><a href="https://yallhands.com/#pricing" target="_blank">Compare...</a></p></div>
               
                </div>
                </Grid.Column>
              <Grid.Column>
              <div className="ThinBorder">
                <h5>Billing Info</h5>
                {!trialEnd?"": <span><p><strong>Free trial: </strong>until {trialEnd} </p></span>}
                {billingDisplay}
            <br/>   
            <Modal trigger={ <Button size="mini">Update billing...</Button>}>
            <Modal.Header>Update Billing Method</Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <StripeProvider apiKey="pk_test_q15ZR4IPRGLaclyGku9Lkuqs00ZLLvQduo">
        <div className="example">
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
            </Modal.Description>
            </Modal.Content>
        </Modal>
            </div>
            <div className="StripeBadge"> <Image style={{marginBottom: "0px"}} centered size="tiny" src="https://yallhandsgeneral.s3.amazonaws.com/powered_by_stripe.png"/> </div>
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
         
         
        </Segment>
        )
    }
}