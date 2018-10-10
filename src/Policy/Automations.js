import React from "react";
import "./style.css";
import { Dropdown } from "semantic-ui-react";
import {inject, observer} from "mobx-react"

@inject("AutomationsStore", "PoliciesStore")
@observer
export class Automations extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {AutomationsStore} = this.props
    const {PoliciesStore} = this.props
    const automationsFiltered = AutomationsStore.allAutomations.filter(automation => automation.variationID.includes(PoliciesStore.toggledVariation))
    const automations = automationsFiltered.map(automation => ({'key': automation.automationID, 'value': automation.automationID, "text": automation.label}))
    console.log(automations)
    return (
  
        <div>
          <span>
            Select an automation to apply
          </span>
      
        <div className="AutomationsSelect">
        <Dropdown
          scrolling
          fluid
          placeholder="Teams"
          search
          selection
          options={automations}

        /></div>
      </div>
 
    );
  }
}



