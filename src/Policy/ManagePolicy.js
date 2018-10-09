import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import { Input, Label, Button, Icon, Header } from "semantic-ui-react";
import { SelectVariation } from "./SelectVariation";
import { NavLink } from "react-router-dom";
import { ManageVariationData } from "./ManageVariationData";


export const ManagePolicy = inject("PoliciesStore", "ResourcesStore", "TeamStore")(observer((props) => {
  const {PoliciesStore} = props
  const {TeamStore} = props
  const policy = PoliciesStore.allPolicies.filter(current => current.policyID === props.policyID)[0]
  PoliciesStore.resetVariation()
  //Load team for line 19
  const variations = policy.variations.map(variation => ({'key':variation.variationID, 'value':variation.variationID, 'text':variation.variationID, 'type': variation.type}))
  const grabGlobal = variations.filter(variation => variation.type === 'global')

  grabGlobal.length === 1 ? PoliciesStore.toggleVariation(grabGlobal[0].value) : PoliciesStore.toggleVariation(variations[0].value)
  
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
          <div>
            <SelectVariation variations={variations}/>
            <Button style={{ display: "inline-block", marginLeft: 5 }}>
              Edit
            </Button>
            <NavLink to="/policy-variation">
            <Button color="blue" style={{ display: "inline-block" }}>
              Create New
            </Button></NavLink>
          </div>
        </div>
       <ManageVariationData currentVariation={"V1"} policy={policy}/>
      </div>
    )
}))
  
