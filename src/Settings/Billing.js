import React from "react";
import { inject, observer } from "mobx-react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { Header, Segment, Form, Button, Icon, Grid, Image, Modal } from "semantic-ui-react";
import { modifyAccount } from "../DataExchange/Up";
import { createCustomer } from "../DataExchange/ThirdParty";
import _ from "lodash";


@inject("AccountStore")
@observer
export class Billing extends React.Component {
  constructor(props){
    super(props);
    this.state={creatingUser: false}
  }
  render() {
    const { AccountStore } = this.props;
    const stripe = _.isEmpty(AccountStore.stripe.data) ? "" :AccountStore.stripe.data;
    const stripePlans = _.isEmpty(AccountStore.stripe.plans) ? "":AccountStore.stripe.plans;
    const activeUserCount = AccountStore.allUsers.filter(i=>i.isActive).length
    const proPricing = !stripePlans? "" : `$${stripePlans.data[0].tiers.filter(i=>activeUserCount <= i.up_to)[0].flat_amount / 100}`
    const plan = AccountStore.account.plan; //internal reference not stripe
    const sources = !stripe ? "" :  stripe.sources.data;
    const subscriptions = !stripe ? "" :stripe.subscriptions;
    const paymentMethod = !sources? "": <span> <p> <strong>Payment method: </strong> <br /> <Icon name={ccIcon} /> ending in {sources.data[0].last4} exp {sources.data[0].exp_month}/ {sources.data[0].exp_year} </p> </span>
    const ccIcon = !sources ? "" :({ Visa: "cc visa", "American Express": "cc amex", MasterCard: "cc mastercard", Discover: "cc discover", JCB: "cc jcb", "Diners Club": "cc diners club", unknown: "credit card alternative" }[sources.data[0].brand]);
    const periodEnd = 0
    // !stripe ? "" : UTCtoFriendly(subscriptions.data[0].current_period_end * 1000);
    const trialEnd = !stripe || plan === "demo" ? "" : subscriptions.data[0].trial_end >= Number(String(Date.now()).slice(0, 10)) ? UTCtoFriendly(subscriptions.data[0].trial_end * 1000) : ""; const changePlan = type => modifyAccount( { accountID: AccountStore.account.accountID, plan: type }, false );
    const billingDisplay = plan === "demo" && !stripe ? "" : displaySource;
    const billingModal =
      plan === "demo" ? (
        ""
      ) : (
        <Modal trigger={<Button size="mini">Update billing...</Button>}>
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
      );
      const startTrial = async () => {
        await createCustomer();
        //create stripe user
        //create subscription w trial
        //update plan
        //special toast /confetti?
      }
      
    const trialOrModal = !stripe? <Button loading={this.state.creatingUser} onClick={()=>startTrial()} fluid primary>Start Pro Free Trial</Button>:billingModal

    const displaySource = !stripe ? (
      ""
    ) : sources.data.length === 0 ? (
      <p style={{ fontWeight: 800 }}>No billing information entered</p>
    ) : (
      <React.Fragment>
        {" "}
        <span>
          <p>
            <strong>Next payment: </strong>$299 on {periodEnd}{" "}
          </p>
        </span>{" "}
        <br />
        {paymentMethod}
      </React.Fragment>
    );







    return (
      <Segment>
        <Header>Billing & Payments</Header>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>
              <div className="ThinBorder">
                <h5>Plan</h5>
                <div className="PlansContainer">
                  <div
                    onClick={() => changePlan("demo")}
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
                    onClick={() => changePlan("pro")}
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
                {!trialEnd ? (
                  ""
                ) : (
                  <span>
                    <p>
                      <strong>Free trial: </strong>until {trialEnd}{" "}
                    </p>
                  </span>
                )}
                {billingDisplay}
                <br />
                {trialOrModal}
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

        {/* <Menu size="small" secondary>
        <Menu.Item name='Plans' />
        <Menu.Item name='Billing Info' />
      </Menu> */}

        <Form style={{ paddingTop: 5, maxWidth: 350 }} />
        {/* <span style={{fontWeight: 800}}>Free Trial Until: </span><span>{!AccountStore.account.data.trialExp? "No Date Entered" : UTCtoFriendly(AccountStore.account.data.trialExp)}</span> */}
      </Segment>
    );
  }
}
