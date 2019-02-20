import React from "react";
import {
  Icon,
  Form,
  Accordion,
  Segment,
  Select,
  Button,
  Header
} from "semantic-ui-react";
import { DraftFormField } from "../../SharedUI/DraftFormField";
import { ConfirmDelete } from "../ConfirmDelete";
import { InfoPopUp } from "../../SharedUI/InfoPopUp";
import { inject, observer } from "mobx-react";
import { uploadBundle, mergeBundle, createBundle, modifyBundle } from "../../DataExchange/Up";
import { bundle, bundleMerged } from "../../DataExchange/PayloadBuilder";
import _ from "lodash";
import { flashQueue } from "../../SharedCalculations/FlashQueue";

@inject("UIStore", "DataEntryStore", "EmailStore")
@observer
export class BundleConfig extends React.Component {
  render() {
    const { UIStore, DataEntryStore, EmailStore } = this.props;

    const handleAccClick = e => {
      e.preventDefault();
      UIStore.set("accordion", "bundleConfig", !UIStore.accordion.bundleConfig);
    };

    const bundleBuildOption = EmailStore.allBundles
      .filter(bundle => bundle.bundleID !== "queue")
      .map(bundle => ({
        text: `Merge with ${bundle.label === ""? bundle.subject : bundle.label}`,
        value: bundle.bundleID,
        icon: "sign-in"
      }));
    bundleBuildOption.unshift({
      text: "Create new bundle",
      icon: "plus",
      value: "queue"
    });

    const handleSelect = val => {
      DataEntryStore.set("emailCampaign", "queueSaveSelect", val);
    };

    const saveQueue = e => {
      DataEntryStore.emailCampaign.queueSaveSelect === "queue"
        ? createBundle(bundle()).then(() => {
          this.props.onClick(e);
          flashQueue()
     
          })
        : 
          modifyBundle(bundleMerged(EmailStore._getBundle(DataEntryStore.emailCampaign.queueSaveSelect)), true).then(() => {
            this.props.onClick(e);
            flashQueue()
     
        })
    };

    return (
      <React.Fragment>
        <div
          style={
            DataEntryStore.emailCampaign.queueSaveSelect !== "queue"
              ? { pointerEvents: "none" }
              : null
          }
        >
          <Segment disabled={DataEntryStore.emailCampaign.queueSaveSelect !== "queue"
              ? true
              : false}>
            <Header>Design Email Properties</Header>
            <Form style={{ marginTop: 5 }}>
              <Form.Input
                label={
                  <span>
                    Label (Optional)
                    <InfoPopUp content="Only visable to admin for easy identification" />
                  </span>
                }
                value={DataEntryStore.emailCampaign.queueLabel}
                onChange={(e, val) =>
                  DataEntryStore.set("emailCampaign", "queueLabel", val.value)
                }
              />
              <Form.Input
                label="Email Subject (Required)"
                value={DataEntryStore.emailCampaign.queueSubject}
                onChange={(e, val) =>
                  DataEntryStore.set("emailCampaign", "queueSubject", val.value)
                }
              />
            </Form>

            <Accordion>
              <Accordion.Title
                active={UIStore.accordion.bundleConfig}
                onClick={e => handleAccClick(e)}
              >
                <Icon name="dropdown" />
                Intro Body (Optional)
              </Accordion.Title>
              <Accordion.Content active={UIStore.accordion.bundleConfig}>
                <DraftFormField
                  loadContent={_.isEmpty(EmailStore.queue.bodyContentRAW)? null : EmailStore.queue.bodyContentRAW}
                />
              </Accordion.Content>
            </Accordion>
            <br />
          </Segment>
        </div>

        <Segment>
          <Header>Save This Queue</Header>
          <p style={{ fontWeight: 800, marginBottom: 5 }}>From Queue Items</p>
          <Form style={{ marginLeft: 7 }}>
            <Form.Group>
              <Select
                fluid
                selection
                value={DataEntryStore.emailCampaign.queueSaveSelect}
                onChange={(e, val) => handleSelect(val.value)}
                options={bundleBuildOption}
              />

              <Button
                disabled={
                DataEntryStore.emailCampaign.queueSaveSelect !== "queue" ? false :
                DataEntryStore.emailCampaign.queueSubject === ""  
                }
                primary
                style={{ marginLeft: 10 }}
                onClick={e => saveQueue(e)}
              >
                Save
              </Button>
            </Form.Group>
          </Form>
        </Segment>
        <Segment>
          <div style={{ height: 30 }}>
            {" "}
            <ConfirmDelete
              deleteLabel="Clear All"
              size="mini"
              confirm={e =>  flashQueue()}               
              />
          </div>
        </Segment>
        <br />
      </React.Fragment>
    );
  }
}
