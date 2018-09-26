import React from "react";
import { Dropdown, Form } from "semantic-ui-react";

export const SelectVariation = (props) =>  {
  
    return (
        <div style={{width: 300, display: 'inline-block'}}>
        <Form>
          <label>Select variation to view/edit</label>

          <Dropdown
            placeholder="Teams"
            fluid
            search
            selection
            options={props.options}
          />
        </Form>
    </div>
    );

}
