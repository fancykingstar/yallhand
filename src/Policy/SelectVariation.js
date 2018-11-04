import React from "react";
import {inject, observer} from "mobx-react"
import "./style.css";
import { Dropdown, Form } from "semantic-ui-react";

export const SelectVariation = inject("PoliciesStore")(observer((props) => {

    const {PoliciesStore} = props
    return (
        <div style={{width: 300, display: 'inline-block'}}>
        <Form>
          <label>Select variation to view/edit</label>

          <Dropdown
            fluid
            search
            selection
            defaultValue={PoliciesStore.toggledVariation}
            options={props.variations}
            onChange= {(e, {value}) => PoliciesStore.toggleVariation(value)} 
          />
        </Form>
    </div>
    );
    }
))