import React from "react";
import {inject, observer} from "mobx-react"
import { Segment, Form, Header } from "semantic-ui-react";
import toast  from "../../YallToast"
import { modifyCampaign } from "../../DataExchange/Up"
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";
import "./style.css";
import _ from "lodash";

export const AddToEmail = inject("DataEntryStore", "UIStore", "EmailStore")(
  observer(props => {
  const {DataEntryStore, UIStore, EmailStore} = props

  const campaigns = EmailStore.allCampaigns
    .filter(x => x.isTemplate)
    .map(bundle => ({
      key: giveMeKey(),
      text: bundle.subject,
      value: bundle.campaignID,
    }));
  campaigns.unshift({
    text: "New email campaign",
    value: "new"
  });

  const handleSelect = (val) => {
    DataEntryStore.set("contentmgmt", "campaign", val)
  }
  const handleClick = () => {
    const key = {
      policy: {id: "policyID", current: UIStore.content.policyID},
      announcement: {id: "announcementID", current: UIStore.content.announcementID},
    }[props.mode]
    if(DataEntryStore.contentmgmt.campaign === "new"){
      if(DataEntryStore.emailCampaign.sendContent.filter(i => i[key.id] === key.current).length > 0){
        toast.error("Whoops, that campaign already contains this content 😬", {hideProgressBar: true})
      }else{
        let newBundle = DataEntryStore.emailCampaign.sendContent.slice()
        let updatedObj = {}
        updatedObj[key.id] = key.current
        newBundle.push(updatedObj)
        DataEntryStore.set("emailCampaign", "sendContent", newBundle)
        toast.success("This current has been added to the selected email campaign", {hideProgressBar: true})
      }
    }
    else if(EmailStore._doesCampaignContain(key.current, DataEntryStore.contentmgmt.campaign)){
      toast.error("Whoops, that campaign already contains this content 😬", {hideProgressBar: true})
    }else{
      let newBundle = EmailStore._getCampaign(DataEntryStore.contentmgmt.campaign).content.slice()
      props.mode === "policy" ? newBundle.push({policyID: key.current}) : newBundle.push({announcementID: key.current})
      modifyCampaign(_.assign({}, EmailStore._getCampaign(DataEntryStore.contentmgmt.campaign), {"content": newBundle}))
    }
    
  }
  return (
    <Segment>
      <div style={{ maxWidth: 400 }}>
        <Header>Add To Email Campaigns</Header>
        <br />
        <Form onSubmit={e => handleClick(e)}>
          <Form.Group inline>
            <Form.Select
              fluid
              id=""
              label="Add this content to which email campaign"
              options={campaigns}
              defaultValue={"new"}
              onChange={(e, val) => handleSelect(val.value)}
            />
            <Form.Button fluid label="" primary>
              Submit
            </Form.Button>
          </Form.Group>
        </Form>
      </div>
    </Segment>
  );
}))
