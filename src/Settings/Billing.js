import React from "react";
import { inject, observer } from "mobx-react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { Header, Segment, Form, Button, Icon, Grid, Image, Modal, Dimmer,Loader } from "semantic-ui-react";
import { modifyAccount} from "../DataExchange/Up";
import { createCustomer,addPaymentMethod,deletePaymentMethod, endSubscription, getStripeAcct, createSubscription, getInvoicePreview } from "../DataExchange/ThirdParty";
import _ from "lodash";
import { ThemeProvider } from "styled-components";


@inject("AccountStore")
@observer
export class Billing extends React.Component {
  constructor(props){
    const {AccountStore} = props;
    super(props);
    this.state={creatingUser: false, downgradeModal: false, upgradeModal: false, paymentModal:false, payment: null, loading: false, selectedPlan: AccountStore.account.plan}
  }
  
  render() { 
    const { AccountStore } = this.props;
    const stripe = _.isEmpty(AccountStore.stripe.data) ? "" :AccountStore.stripe.data;
    const stripePlans = _.isEmpty(AccountStore.stripe.plans) ? "":AccountStore.stripe.plans;
    const invoice = _.isEmpty(AccountStore.stripe.invoice) ? "":AccountStore.stripe.invoice
    const activeUserCount = AccountStore._allActiveUsers.length
    const proPricing = !stripePlans? "" : `$${stripePlans.data[0].tiers.filter(i=>activeUserCount <= i.up_to)[0].flat_amount / 100}`
    const plan = this.state.selectedPlan; //internal reference not stripe
    const sources = !stripe ? "" :  stripe.sources.data.length === 0? "": stripe.sources.data;
    const subscriptions = !stripe ? "" : stripe.subscriptions.data.length === 0? "": stripe.subscriptions.data;
    const periodEnd =  !stripe || !subscriptions? "" : UTCtoFriendly(subscriptions[0].current_period_end * 1000, false);
    const card = !sources?"": sources[0].card? sources[0].card: sources[0]
    const currentOrDowngrading = !subscriptions?"": subscriptions[0].cancel_at_period_end? 
      <p><strong>PRO</strong> plan set to end on {periodEnd}</p>:
      <React.Fragment>
      <p>This payment method will be automatically charged every month on a recurring basis. 
        <span style={{color:"#4183c4", fontWeight: 800}} onClick={()=>this.setState({downgradeModal:true})}> Downgrade to cancel...</span>
      </p> 
      <p><strong>Next Payment Due:</strong> ${invoice.amount_due / 100} on {UTCtoFriendly(invoice.next_payment_attempt * 1000, false)}
      </p>
      </React.Fragment>

    const ccIcon = !sources ? "" :({ Visa: "cc visa", "American Express": "cc amex", MasterCard: "cc mastercard", Discover: "cc discover", JCB: "cc jcb", "Diners Club": "cc diners club", unknown: "credit card alternative" }[card.brand]);
    const paymentMethod = !sources? "": <span> <p> <strong>Payment method: </strong> <br /> <Icon name={ccIcon} /> ending in {card.last4} exp {card.exp_month}/{card.exp_year} <span style={{color:"#4183c4", fontWeight: 800}} onClick={()=>this.setState({paymentModal:true})}>Change.. </span></p></span>
    const trialEnd = !stripe || plan === "demo" || !subscriptions? "" : subscriptions[0].trial_end >= Number(String(Date.now()).slice(0, 10)) ? UTCtoFriendly(subscriptions[0].trial_end * 1000, false) : ""; 
    // const billingDisplay = plan === "demo" && !stripe ? "" : displaySource;
    const changePlan = type => {
     modifyAccount( { accountID: AccountStore.account.accountID, plan: type }, false )
      this.setState({selectedPlan: type});
    };

    const downgrade = async () => {
      this.setState({loading:true});
      if (sources) await deletePaymentMethod(stripe.id, sources[0].id) 
      if (subscriptions) await endSubscription(subscriptions[0].id) 
      await getStripeAcct(AccountStore.account.data.stripe);
      this.setState({loading:false});
    }
    const upgrade = async () => {
      if (stripe) this.setState({upgradeModal: true,selectedPlan: "pro"})
    }

    const updatePayment = async (v) => {
      this.setState({loading:true});
      await this.setState({paymentModal: false, payment:v.source.id});
      await addPaymentMethod(stripe.id, this.state.payment);
      if (!subscriptions) await createSubscription();
      if (!invoice) await getInvoicePreview(stripe.id);
      if (AccountStore.account.plan !== "pro") await changePlan("pro");
      this.setState({loading:false});
    }

    const startTrial = async () => {
  this.setState({creatingUser:true});
  await createCustomer();
  changePlan("pro")
  this.setState({creatingUser:false, selectedPlan:"pro"})
}


    const upgradeModal = <Modal closeIcon onClose={()=>this.setState({upgradeModal:false})} open={this.state.upgradeModal}>
      <Modal.Content>
        Please add a billing payment method to confirm your upgrade to pro.
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={()=>this.setState({upgradeModal:false})}> Will do!</Button>
      </Modal.Actions>
      </Modal>

    const paymentModal =  <Modal closeIcon onClose={()=>this.setState({paymentModal:false})} open={this.state.paymentModal}>
            <Modal.Header>Payment Method</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PROVIDER_KEY}>
                  <div>
                    <Elements>
                      <CheckoutForm pricing={proPricing} addMethod={v => updatePayment(v)}/>
                    </Elements>
                  </div>
                </StripeProvider>
              </Modal.Description>
            </Modal.Content>
          </Modal>
    const downgradeModal = <Modal open={this.state.downgradeModal}>
                              <Modal.Content>
                                <p>Are you sure you want to downgrade to a demo account?</p>
                                <p>Your account will downgrade at the end of the current billing period and any pro features or scheduled events will be lost.</p>
                              </Modal.Content>
                              <Modal.Actions>
                                  <Button primary onClick={()=>{
                                    downgrade();
                                    this.setState({downgradeModal:false});
                                  }}>Downgrade</Button>
                                  <Button onClick={()=> this.setState({downgradeModal:false})}>Cancel</Button>
                              </Modal.Actions>
                          </Modal>
    const billingModal =
      this.state.selectedPlan === "demo" ? ( <p>Your <strong>DEMO</strong> account doesn't require billing information.</p> ) 
      : sources? paymentMethod : (<Button onClick={()=>this.setState({paymentModal:true})} size="mini" fluid>Add Payment Method</Button>)
  
    const missingBilling_Trial = trialEnd && !sources? <p style={{fontSize: '0.8em'}}>Add a payment method or your account will downgrade to <strong>DEMO</strong> after trial.</p>: ""
    const freeTrial = !trialEnd?"": <React.Fragment><p> <strong>Free trial </strong>until {trialEnd}{" "} </p> {missingBilling_Trial}</React.Fragment> 
    const trialAndBilling = !stripe? <Button loading={this.state.creatingUser} onClick={()=>startTrial()} fluid primary>Start Pro Free Trial</Button>: billingModal

    return (
      <Segment>
          <Dimmer active={this.state.loading} inverted>
           <Loader active={this.state.loading} inverted/>
         </Dimmer>
        {downgradeModal}
        {upgradeModal}
        {paymentModal}
        <Header>Billing & Payments</Header>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>
              <div className="ThinBorder">
                <h5>Plan</h5>
                <div className="PlansContainer">
                  <div
                    onClick={() => {
                      if(plan === 'pro' && AccountStore.account.plan === 'pro') this.setState({downgradeModal: true});
                      else this.setState({selectedPlan:"demo"});
                    }}
                    className={
                      plan === "demo" ? "PlanOption PlanActive" : "PlanOption"
                    }
                  >
                    Demo
                    <div className="PlanDesc">
                      Free (limited features)
                      <h5>$0 / month</h5>
                    </div>
                  </div>
                  <div
                    onClick={() => upgrade()}
                    className={
                      plan === "pro" ? "PlanOption PlanActive" : "PlanOption"
                    }
                  >
                    <Icon color="yellow" name="star" /> Pro
                    <div className="PlanDesc">
                      Paid (all features) for {activeUserCount} users
                      <h5>{proPricing} / month</h5>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontWeight: 800
                  }}
                >
                  <p>
                    <a href="https://yallhands.com/#pricing" target="_blank">
                      Compare...
                    </a>
                  </p>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="ThinBorder">
                <h5>Billing Info</h5>
                {freeTrial}
                {currentOrDowngrading}
                {trialAndBilling}
                
              </div>
              <div className="StripeBadge">
                {" "}
                <Image
                  style={{ marginBottom: "0px" }}
                  centered
                  size="tiny"
                  src="https://yallhandsgeneral.s3.amazonaws.com/powered_by_stripe.png"
                />{" "}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Form style={{ paddingTop: 5, maxWidth: 350 }} />
        {/* <span style={{fontWeight: 800}}>Free Trial Until: </span><span>{!AccountStore.account.data.trialExp? "No Date Entered" : UTCtoFriendly(AccountStore.account.data.trialExp)}</span> */}
      </Segment>
    );
  }
}
