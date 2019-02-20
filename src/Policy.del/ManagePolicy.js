import React from "react";
import "./style.css";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import { Label, Button, Icon, Header, Segment } from "semantic-ui-react";
import { SelectVariation } from "../SharedUI/SelectVariation";
import { ManageVariationData } from "../SharedUI/ManageVariationData";
import { getDisplayTags } from "../SharedCalculations/GetDisplayTags";

import BackButton  from "../SharedUI/BackButton";
import { FeaturedImage } from "../SharedUI/ManageContent/FeaturedImage";
import { AddToEmail } from "../SharedUI/ManageContent/AddToEmail";
import { Keywords } from "../SharedUI/ManageContent/Keywords";
import { ReviewAlerts } from "../SharedUI/ManageContent/ReviewAlerts";
import { Schedule } from "../SharedUI/ManageContent/Schedule";
import { History } from "../SharedUI/ManageContent/History";
import { Settings } from "../SharedUI/ManageContent/Settings";
import _ from "lodash";
import { generateID } from "../SharedCalculations/GenerateID";

@inject(
  "TeamStore",
  "DataEntryStore",
  "PoliciesStore",
  "UIStore"
)
@observer
class ManagePolicy extends React.Component {
  componentDidMount() {
    const { UIStore, PoliciesStore, DataEntryStore } = this.props;
      if(UIStore.content.policyID === "" 
        || this.props.match.params.id !== UIStore.content.policyID
        || DataEntryStore._isReset("contentmgmt")){
        if(!_.isEmpty(PoliciesStore._getPolicy(this.props.match.params.id))) {
          UIStore.set("content", "policyID", this.props.match.params.id)
          const obj = Object.assign({}, PoliciesStore._getPolicy(UIStore.content.policyID)) 
          UIStore.set("content", "variationID", PoliciesStore._toggleGlobalVariation(obj.policyID))
          DataEntryStore.set("contentmgmt", "label", obj.label)
          DataEntryStore.set("contentmgmt", "img", obj.img)
          DataEntryStore.set("contentmgmt", "bundle", "queue")
          DataEntryStore.set("contentmgmt", "keywords", obj.keywords)
          DataEntryStore.set("contentmgmt", "reviewAlert", obj.reviewAlert)
        }
   
        else{this.props.history.push("/panel/faqs")}
    }
  
    UIStore.set("content", "variationID", PoliciesStore._toggleGlobalVariation(UIStore.content.policyID))
    
  }
  render() {
    const { TeamStore, DataEntryStore, UIStore, PoliciesStore} = this.props;


    const variations = () => {
      return PoliciesStore
            ._getPolicy(UIStore.content.policyID)
            .variations
            .map(variation => ({
          key: variation.variationID,
          value: variation.variationID,
          description: getDisplayTags(variation.tags, TeamStore.tags),
          text: TeamStore.teamKey[variation.teamID],
          type: variation.type
        }));
    }
      
    

    const handleChange = val => {
      UIStore.set("content", "variationID", val)
    };
    const handleCreateNew = e => {
      e.preventDefault();
      UIStore.set("content", "variationID", generateID())
      DataEntryStore.set("content", "isNew", true)
      this.props.history.push(
        "/panel/faqs/policy-variation/" + UIStore.content.variationID
      );
    }; 
 
    const handleEdit = e => {
      e.preventDefault();
      const vari = Object.assign({}, 
      PoliciesStore._getVariation(UIStore.content.policyID, UIStore.content.variationID))
      DataEntryStore.set("content", "label", vari.label)
      DataEntryStore.set("content", "teamID", vari.teamID)
      DataEntryStore.set("content", "tagID", vari.tags.length === 0? "none" : vari.tags[0])
      DataEntryStore.set("content", "draftContentRAW", vari.draftContentRAW)
      DataEntryStore.set("content", "draftContentHTML", vari.draftContentHTML)
      DataEntryStore.set("content", "draft", vari.draft)
      DataEntryStore.set("content", "stage", vari.stage)
      DataEntryStore.set("content", "isNew", false)
      this.props.history.push(
        "/panel/faqs/policy-variation/" +
          vari.variationID
      );
    };
    
    // const updateMobX = (key, val) => {
    //   let updatedPolicy = PoliciesStore._currentObj
    //   updatedPolicy[key] = val
    //   PoliciesStore.replacePolicy(updatedPolicy)
    //   DataEntryStore.loadUneditedFields()
    // }
    const managePolicy = UIStore.content.policyID === "" ? <div></div>:
    <React.Fragment>
       <BackButton />
        <Header
          as="h2"
          content="Manage Policy"
          subheader={DataEntryStore.contentmgmt.label}
        />

        <Segment>
        <div style={{ maxWidth: 600 }}>
          <Label as="a" attached="top right">
            Share <Icon name="share" />
          </Label>
          <Header>Available Variations</Header>
            <br />
            <SelectVariation
              variations={variations()}
              defaultVal={ UIStore.content.variationID }
              whenChanged={handleChange}
            />
            <Button
              style={{ display: "inline-block", marginLeft: 5 }}
              onClick={e => handleEdit(e)}
            >
              Edit...
            </Button>
            <Button
              color="blue"
              style={{ display: "inline-block" }}
              onClick={e => handleCreateNew(e)}
            >
              Create New...
            </Button>
           
          </div>
          <ManageVariationData 
             variation={PoliciesStore._getVariation(UIStore.content.policyID, UIStore.content.variationID)} 
             type={"policy"}
          />
   
        </Segment>
        <FeaturedImage defaultImgUrl={DataEntryStore.contentmgmt.img} output={val => DataEntryStore.set("contentmgmt", "bundle", val)}/>
        <AddToEmail />
        <Keywords />
        <ReviewAlerts output={val => DataEntryStore.set("contentmgmt", "reviewAlert", val)} />
        <Schedule />
        <History />
        {/* <Settings mode={"policy"} /> */}

        <br />
    </React.Fragment>

    return (
      <div className="FixedWidth">
       {managePolicy}
      </div>
    );
  }
}

export default withRouter(ManagePolicy);
