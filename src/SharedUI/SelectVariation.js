import React from "react";
import "./style.css";
import { Dropdown, Form } from "semantic-ui-react";

export const SelectVariation = (props) => {
    const handleChange = (val) => {
      props.whenChanged(val)
    }

    return (
        <div style={{width: 300, display: 'inline-block'}}>
        <Form>
          <label>Select Variation</label>
          <Dropdown
            fluid
            search
            selection
            options={props.variations}
            defaultValue={props.defaultVal}
            onChange= {(e, {value}) => handleChange(value)} 
          />
        </Form>
    </div>
    );
    } 
