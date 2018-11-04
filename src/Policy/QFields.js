import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import { BackToChan } from "./BackToChan";
import { Input, Icon} from "semantic-ui-react";
// import { Conditionals } from "./Conditionals";
import { NavLink } from "react-router-dom";
import { TeamTagSelect } from "../SharedUI/TeamTagSelect"

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
    const invalidteams = policy.variations.map(vari => vari.teamID).filter(team => team !== variation.teamID)
    const invalidtags = policy.variations.map(vari => vari.tagID).filter(tag => tag !== variation.tagID)//makes duplicates, doesn't effect process
    const variationLabel = variation.label !== "" ? variation.label : policy.label
    const defaultTag = variation.tags.length === 0 ? '' : variation.tags[0].tagID
    return (
      <div className="ManagePolicy">
        <NavLink to="/manage-policy">
          <BackToChan />
        </NavLink>
        

        <div style={{marginBottom: 0, paddingBottom: 0}}><h2>Edit Variation</h2></div>
        <div style={{marginTop: 0, paddingTop: 0}}> 
        <Input
                disabled={this.state.qFieldDisabled}
                transparent
                value={variationLabel}
                placeholder="Enter a template question..."
                size="huge"
              />

              <Icon name="write" size="small" onClick={e => this.handleEditQuestion(e)} /></div>
   

              
        
        
          <div className="Form">
          <TeamTagSelect invalidTeams={invalidteams} invalidTags={invalidtags} defaultTeam={variation.teamID} defaultTag={defaultTag} />
          </div>
        <div className="Form" style={{ maxWidth: 350 }}>
          {/* <Conditionals /> */}
        </div>
      </div>
    );
  } 
}
