import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import { BackToChan } from "./BackToChan";
import { Input, Icon, Form } from "semantic-ui-react";
import { Conditionals } from "./Conditionals";
import { NavLink } from "react-router-dom";

@inject("PoliciesStore", "TeamStore")
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
    const {TeamStore} = this.props
    const policy = PoliciesStore.allPolicies.filter(policy => policy.policyID === PoliciesStore.toggledPolicy)[0]
    const variation = policy.variations.filter(variation => variation.variationID === PoliciesStore.toggledVariation)[0]
    const variationLabel = variation.label !== "" ? variation.label : policy.label
    const teamList = TeamStore.structure.map(team => ({'key': team.teamID, 'value': team.teamID, 'text': team.label}) )
    teamList.unshift({'key': 'global', 'value': '', 'text': 'Global (all teams)'})
    const classList = TeamStore.classes.map(clas => ({'key': clas.classID, 'value': clas.classID, 'text': clas.label}) )
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
           
            
          </div>

      <div className="Form">
            <div style={{paddingBottom: 5}}>
              <h4>Configure Audience</h4>
            </div>
            <Form>
              <Form.Group>
              <Form.Dropdown
            label="Teams"
              placeholder="Teams"
              fluid
              search
              selection
              options={teamList}
              defaultValue={''}
            
              style={{ width: 350 }}
            />
            <Form.Dropdown
            label="Classes (optional)"
              placeholder="classes"
              fluid
              search
              selection
              options={classList}
              style={{ width: 350 }}
            />

              </Form.Group>
            </Form>
            
          </div>

     

        <div className="Form" style={{ maxWidth: 350 }}>
          <Conditionals />
        </div>
      </div>
    );
  }
}
