import React from "react";
import {inject, observer} from "mobx-react"
import { EmailStore } from "../../Stores/EmailStore";
import { Segment, Form, Header } from "semantic-ui-react";
import { toast } from 'react-toastify';
import { modifyBundle } from "../../DataExchange/Up"
import "./style.css";
import _ from "lodash";

export const AddToEmail = inject("DataEntryStore", "UIStore")(
  observer(props => {
  const {DataEntryStore, UIStore} = props
  const bundleBuildOption = EmailStore.allBundles
    .filter(bundle => bundle.bundleID !== "queue")
    .map(bundle => ({
      text: "Add to" + bundle.label,
      value: bundle.bundleID,
      icon: "plus"
    }));
  bundleBuildOption.unshift({
    text: "Add to queue",
    icon: "plus",
    value: "queue"
  });
  const handleSelect = (val) => {
    DataEntryStore.set("contentmgmt", "bundle", val)
  }
  const handleClick = () => {
    if(EmailStore._doesBundleContain(props.mode === "policy" ? UIStore.content.policyID : UIStore.content.anncID, DataEntryStore.contentmgmt.bundle)){
      toast.error("Whoops, that bundle already contains this content 😬", {hideProgressBar: true})
    }else{
      const newBundle = EmailStore._getBundle(DataEntryStore.contentmgmt.bundle).bundle
      props.mode === "policy" ? newBundle.push({policyID: UIStore.content.policyID}) : newBundle.push({anncID: UIStore.content.anncID})
      modifyBundle(_.assign({}, EmailStore._getBundle(DataEntryStore.contentmgmt.bundle), {"bundle": newBundle}))
    }
    
  }
  return (
    <Segment>
      <div style={{ maxWidth: 400 }}>
        <Header>Email Campaign</Header>
        <br />
        <Form onSubmit={e => handleClick(e)}>
          <Form.Group inline>
            <Form.Select
              id=""
              label="Select Action"
              style={{ width: 350 }}
              options={bundleBuildOption}
              defaultValue={"queue"}
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
