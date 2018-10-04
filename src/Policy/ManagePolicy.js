import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import { Input, Label, Button, Icon, Header } from "semantic-ui-react";
import { SelectVariation } from "./SelectVariation";
import { NavLink } from "react-router-dom";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"

export const ManagePolicy = inject("PoliciesStore")(observer((props) => {
  const {PoliciesStore} = props
  const policy = PoliciesStore.allPolicies.filter(current => current.policyID === props.policyID)[0]
  const keywords = policy.keywords.map(keyword => <Label key={keyword}>{keyword}<Icon name="delete" /></Label>)
  const tags = policy.TagID ? policy.tagID.map(tag => tag.label) : "None"

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
            <SelectVariation />
            <Button style={{ display: "inline-block", marginLeft: 5 }}>
              Edit
            </Button>
            <NavLink to="/policy-variation">
            <Button color="blue" style={{ display: "inline-block" }}>
              Create New
            </Button></NavLink>
          </div>
        </div>
        <div className="Form">
          <span>Required Tags: {tags}</span>
        </div>
        <div className="Form">
          <span>Last Updated: {UTCtoFriendly(policy.updated)}</span>
        </div>
        <div className="Form">
          <span>Resource URLs: none</span>
        </div>
        <div className="Form">
          <span>Attached Files: none</span>
        </div>
        <div className="Form">
          <span>Active Automations: none</span>
        </div>
        <div className="Form">
          <span>Owner(s): </span>
          <Label color="blue" horizontal>
            Mark Z.
          </Label>
        </div>
      </div>
    )
}))
  
