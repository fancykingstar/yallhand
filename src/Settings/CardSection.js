import React from 'react';
import {CardElement} from 'react-stripe-elements';
import {Form} from "semantic-ui-react"

class CardSection extends React.Component {
  render() {
    return (
        <React.Fragment>
        <CardElement style={{base: {fontFamily: 'Helvetica Rounded, Lato, Arial, sans-serif',fontSize: '18px'}}} />
        </React.Fragment>

 
    );
  }
}

export default CardSection;