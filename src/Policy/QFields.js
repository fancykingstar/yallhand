import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import { BackToChan } from "./BackToChan";
import { Input, Icon } from "semantic-ui-react";
import { Conditionals } from "./Conditionals";
import { NavLink } from "react-router-dom";

@inject("PoliciesStore")
@observer
export class QFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = { qFieldDisabled: true };
  }
  handleEditQuestion = e => {
    this.setState({ qFieldDisabled: !this.state.qFieldDisabled });
  };
  render() {
    const {PoliciesStore} = this.props
    const policy = PoliciesStore.allPolicies.filter(policy => policy.policyID === PoliciesStore.toggledPolicy)[0]
    const variation = policy.variations.filter(variation => variation.variationID === PoliciesStore.toggledVariation)[0]
    const variationLabel = variation.label !== "" ? variation.label : policy.label
    return (
      <div className="ManagePolicy">
        <NavLink to="/manage-policy">
          <BackToChan />
        </NavLink>
        <h2>Edit Variation</h2>
        <div className="Form">
          <div>
            <span />
          </div>

          <div className="Form">
            <div style={{ paddingBottom: 10 }}>
              Question Variation (optional)
            </div>
            <div className="FormField">
              <Input
                disabled={this.state.qFieldDisabled}
                transparent
                value={variationLabel}
                placeholder="Enter a template question..."
                size="huge"
              />

              <Icon name="edit" onClick={e => this.handleEditQuestion(e)} />
            </div>
          </div>

        </div>

        <div className="Form" style={{ maxWidth: 350 }}>
          <Conditionals />
        </div>
      </div>
    );
  }
}
