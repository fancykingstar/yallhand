import React from "react";
import { Header } from "semantic-ui-react";
import { ContentSearch } from "../SharedUI/ContentSearch";
import { inject, observer } from "mobx-react";
import { BundleContent } from "../SharedUI/Bundle/BundleContent";
import { BundleConfig } from "../SharedUI/Bundle/BundleConfig";
import { arrayValUpOrDown } from "../SharedCalculations/ArrayValUpOrDown"

@inject("EmailStore", "UIStore", "DataEntryStore")
@observer
export class Queue extends React.Component {

  componentDidMount() {
    const { EmailStore, DataEntryStore } = this.props;
    DataEntryStore.set("emailCampaign", "queue", EmailStore.queue.bundle)
    DataEntryStore.set("emailCampaign", "queueID", EmailStore.queue.bundleID)
    DataEntryStore.set("emailCampaign", "queueLabel", EmailStore.queue.label)
    DataEntryStore.set("emailCampaign", "queueSubject", EmailStore.queue.subject)
    DataEntryStore.set("emailCampaign", "queueSaveSelect", "queue")
    DataEntryStore.setDraft(EmailStore.queue.bodyContentRAW === ""? null : EmailStore.queue.bodyContentRAW)
  }
  render() {
    const {DataEntryStore, UIStore} = this.props


    const queuePopulated = DataEntryStore.emailCampaign.queue.length === 0

    const addToQueue = (item) => {
      if(item.type === "policy") {
        const updatedQueue = DataEntryStore.emailCampaign.queue.slice()
        updatedQueue.push({"policyID": item.value})
        DataEntryStore.set("emailCampaign", "queue", updatedQueue)
      }
      else if(item.type === "announcement") {
        const updatedQueue = DataEntryStore.emailCampaign.queue.slice()
        updatedQueue.push({"announcementID": item.value})
        DataEntryStore.set("emailCampaign", "queue", updatedQueue)
    }
  }

    const remove = (val) => {
        const updatedQueue = DataEntryStore.emailCampaign.queue.filter(item => Object.values(item)[0] !== Object.values(val)[0])
        DataEntryStore.set("emailCampaign", "queue", updatedQueue)
      }
    const moveUp = (val) => {
       DataEntryStore.set("emailCampaign", "queue", arrayValUpOrDown(DataEntryStore.emailCampaign.queue, val, "up"))
    }
    const moveDown = (val) => {
      DataEntryStore.set("emailCampaign", "queue", arrayValUpOrDown(DataEntryStore.emailCampaign.queue, val, "down"))
    }

    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Current Queue"
          subheader="Curate and customize content into a bundle"
        />
        <br />
        <ContentSearch
        output={res => addToQueue(res)}/>
        {queuePopulated ? (
          <h5 style={{ fontStyle: "italic" }}>
            The queue is empty. Add content to start building a bundle.
          </h5>
        ) : (
          <BundleContent input={DataEntryStore.emailCampaign.queue}
          remove={val => remove(val)}
          moveUp={val => moveUp(val)}
          moveDown={val => moveDown(val)}
          />
        )}
        <div style={{ width: 600 }}>
          {queuePopulated ? null : <BundleConfig 
          onClick={e => UIStore.set("menuItem", "emailFrame", "bundles")}
          />}
        </div>
      </div>
    );
  }
}
