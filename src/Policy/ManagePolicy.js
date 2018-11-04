import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import { Input, Label, Button, Icon, Header } from "semantic-ui-react";
import { SelectVariation } from "./SelectVariation";
import { NavLink } from "react-router-dom";
import { ManageVariationData } from "./ManageVariationData";


// export const ManagePolicy = inject("PoliciesStore", "ResourcesStore", "TeamStore")(observer((props) => {
@inject("PoliciesStore", "ResourcesStore", "TeamStore")
@observer
export class ManagePolicy extends React.Component {
  componentWillMount() {
    const {PoliciesStore} = this.props
    const {TeamStore} = this.props
    const policy = PoliciesStore.allPolicies.filter(current => current.policyID === this.props.policyID)[0]
    PoliciesStore.togglePolicy(this.props.policyID)
    PoliciesStore.resetVariation()


  const getTags = (variations) => {
    const tagsList = variations.map(variation => variation.label) 
    const displayTags = tagsList.length > 1 ? tagsList.join(', '): tagsList
    return displayTags
  }
    const variations = policy.variations.map(variation => ({'key':variation.variationID, 'value':variation.variationID, 'description': getTags(variation.tags),'text': TeamStore.teamKey[variation.teamID], 'type': variation.type}))
    const grabGlobal = variations.filter(variation => variation.type === 'global')
    
    grabGlobal.length === 0 ? PoliciesStore.toggleVariation('') : grabGlobal.length === 1 ? PoliciesStore.toggleVariation(grabGlobal[0].value) : PoliciesStore.toggleVariation(variations[0].value)
  }
  render() {
  const {PoliciesStore} = this.props
  const {TeamStore} = this.props
  const policy = PoliciesStore.allPolicies.filter(current => current.policyID === this.props.policyID)[0]
  const getTags = (variations) => {
    const tagsList = variations.map(variation => variation.label) 
    const displayTags = tagsList.length > 1 ? tagsList.join(', '): tagsList
    return displayTags
  }


  
  const variations = policy.variations.map(variation => ({'key':variation.variationID, 'value':variation.variationID, 'description': getTags(variation.tags),'text': TeamStore.teamKey[variation.teamID], 'type': variation.type}))
  
  
  const keywords = policy.keywords.map(keyword => <Label key={keyword}>{keyword}<Icon name="delete" /></Label>)
 
  

 

    return(
      <div>
        <Header
          as="h2"
          content="Manage Policy"
          subheader={policy.label}
        />
        
        
        <div className="Form">
          <div>Related Keywords or Phrases (optional)</div>
          <div>
            <Input
              style={{ width: 350 }}
              action="Add"
              placeholder="Enter term(s)..."
            />
          </div>
        </div>
        <div className="Form">
         {keywords}
        </div>
        <div className="Form">
        <Button
content='Upload Image'
icon='image'
/>
        </div>
        <div className="Form">
          <div>
            <SelectVariation variations={variations}/>
            <NavLink to={"/panel/policy-variation/" + PoliciesStore.toggledVariation} >
            <Button style={{ display: "inline-block", marginLeft: 5 }}>
              Edit
            </Button>
            </NavLink>

            <Button color="blue" style={{ display: "inline-block" }}>
              Create New
            </Button>
          </div>
        </div>
       <ManageVariationData currentVariation={""} policy={policy}/>
      </div>
    )}
    }
  
