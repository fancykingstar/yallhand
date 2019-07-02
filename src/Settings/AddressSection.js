import React from 'react';
import {Form, Flag} from "semantic-ui-react";

class CardSection extends React.Component {
  render() {
    const countries = [
        {text: "United States",value:"united states", flag: "us"},
        {text: "Canada",value:"canada", flag: "ca"},
        {text: "Australia",value:"australia", flag: "au"},
        {text: "New Zealand",value:"new zealand", flag: "nz"},
        {text: "United Kingdom",value:"united kingdom", flag: "gb"},
    ]
    
    return (
        <Form>  
                <Form.Input label="Full Name (As displayed on card)" placeholder="Jane Doe"/>
                <Form.Input label="Address" placeholder="77 Winchester Lane"/>
                <Form.Input label="Address (cont.)" placeholder="Apt 2"/>
                <Form.Group>
                <Form.Input label="City" placeholder="New York City"/>
                <Form.Input maxLength="2" label="State" placeholder="MA"/>
                <Form.Input label="Zip" placeholder="10001"/>
                <Form.Dropdown defaultValue="united states" selection options={countries} label="Country" />
                </Form.Group>
        </Form>

    
    
    );
  }
}

export default CardSection;