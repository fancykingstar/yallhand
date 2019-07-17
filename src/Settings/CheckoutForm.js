import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import {Button, Checkbox} from "semantic-ui-react"
import CardSection from './CardSection';
import {AccountStore} from "../Stores/AccountStore";
import "./style.css";
class CheckoutForm extends React.Component {
  constructor(props){
    super(props);
    this.state={nameError:false, name: "", recur: false, recurError:false}
  }
  handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!this.state.name) this.setState({nameError:true});
    else if (!this.state.recur) this.setState({recurError:true})
    else {
      this.setState({nameError:false, recurError:false});
      const src = await this.props.stripe.createSource({
      type: 'card',
      owner: {name: "test user"},
      usage: "reusable"
    });
    if (src.source) this.props.addMethod(src)
  };
  };
  

  render() {
    const chargeNow = AccountStore.account.plan === 'demo' && AccountStore.stripe.data.subscriptions.data.length === 0? `. I will be charged ${this.props.pricing} for my first month upon submitting.`:"."
    return (
      <form onSubmit={this.handleSubmit}>
        <CardSection />
        <input value={this.state.name} onChange={e=>this.setState({name: e.currentTarget.value})} placeholder="Cardholder's name (e.g. Jane Smith)" className={this.state.nameError? "cardinfo infoError":"cardinfo"}/>
        <div style={{marginTop: 10}}>
        <Checkbox onChange={()=>this.setState({recur: !this.state.recur})} checked={this.state.recur} className={this.state.recurError? "infoError":""} label={`I understand this card will be charged automatically on a monthly recurring basis and I can cancel at anytime${chargeNow} `} />
       
        </div>
        <div style={{marginTop: 20}}><Button onClick={e => this.handleSubmit(e)} primary size="tiny">Submit</Button></div>
        
        
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);