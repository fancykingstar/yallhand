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
    if(DataEntryStore.contentmgmt.campaign === "new"){
      // DataEntryStore.emailCampaign.sendContent.map(i => i.obj)
      if(EmailStore._doesCampaignContain(props.mode === "policy" ? UIStore.content.policyID : UIStore.content.announcementID, DataEntryStore.contentmgmt.campaign, DataEntryStore.emailCampaign.sendContent)){
        toast.error("Whoops, that campaign already contains this content 😬", {hideProgressBar: true})
      }else{
        let newBundle = DataEntryStore.emailCampaign.sendContent.slice()
        props.mode === "policy" ? newBundle.push({policyID: UIStore.content.policyID}) : newBundle.push({announcementID: UIStore.content.announcementID})
        DataEntryStore.set("emailCampaign", "sendContent", newBundle)
      }
    }
    else if(EmailStore._doesCampaignContain(props.mode === "policy" ? UIStore.content.policyID : UIStore.content.announcementID, DataEntryStore.contentmgmt.campaign)){
      toast.error("Whoops, that campaign already contains this content 😬", {hideProgressBar: true})
    }else{
      let newBundle = EmailStore._getCampaign(DataEntryStore.contentmgmt.campaign).content.slice()
      props.mode === "policy" ? newBundle.push({policyID: UIStore.content.policyID}) : newBundle.push({announcementID: UIStore.content.announcementID})
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
              id=""
              label="Add this content to which email campaign"
              style={{ width: 350 }}
              options={campaigns}
              defaultValue={"new"}
              onChange={(e, val) => handleSelect(val.value)}
            />
            <Form.Button label="" primary>
              Submit
            </Form.Button>
          </Form.Group>
        </Form>
      </div>
    </Segment>
  );
}))
