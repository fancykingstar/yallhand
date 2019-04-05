import React from "react";
import { Header, Segment, Form } from "semantic-ui-react";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { inject, observer } from "mobx-react";
import _ from "lodash";

export const SelectContentBundle = inject(
  "DataEntryStore",
  "EmailStore",
  "PoliciesStore",
  "AnnouncementsStore"
)(
  observer(props => {
    const {
      DataEntryStore,
      EmailStore,
      PoliciesStore,
      AnnouncementsStore
    } = props;

    const getContentLabel = obj => {
      return Object.keys(obj)[0] === "policyID"
        ? PoliciesStore._getPolicy(Object.values(obj)[0]).label
        : AnnouncementsStore._getAnnouncement(Object.values(obj)[0]).label;
    };

    return (
      <Segment>
        <div style={{ maxWidth: 400 }}>
          <Header>Select Content Bundle</Header>

          <Form>
            <Form.Group>
              <Form.Select
                placeholder="Select build..."
                value={DataEntryStore.emailCampaign.selectedContentBundle}
                onChange={(e, { value }) =>
                  DataEntryStore.set(
                    "emailCampaign",
                    "selectedContentBundle",
                    value
                  )
                } 
                options={EmailStore._activeBundles.map(bundle => ({
                  key: "bundleSelect" + giveMeKey(),
                  text: bundle.label === ""? bundle.subject : bundle.label,
                  value: bundle.bundleID
                }))}
              />
            </Form.Group>
          </Form>
          <p>
            <span style={{ fontWeight: 400 }}>Bundle Includes: </span>{" "}<br/>
            <span style={{ fontWeight: 800 }}>
              {" "}
              {DataEntryStore.emailCampaign.selectedContentBundle === ""
                ? ""
                : EmailStore._getBundle(
                    DataEntryStore.emailCampaign.selectedContentBundle
                  )
                    .bundle.map(content => getContentLabel(content))
                    .join(", ")}
            </span>
          </p>
          <p>
            <span style={{ fontWeight: 400 }}>Subject: </span>
            <span style={{ fontWeight: 800 }}>
              {DataEntryStore.emailCampaign.selectedContentBundle === ""
                ? ""
                : EmailStore._getBundle(
                    DataEntryStore.emailCampaign.selectedContentBundle
                  ).subject}
            </span>
          </p>
          <p>
            <span style={{ fontWeight: 400 }}>Intro Body (optional): </span>
            {DataEntryStore.emailCampaign.selectedContentBundle === ""
              ? ""
              : 
                  EmailStore._getBundle(
                    DataEntryStore.emailCampaign.selectedContentBundle
                  ).bodyContentHTML === ""
                
              ? ""
              : <span dangerouslySetInnerHTML={{__html: EmailStore._getBundle(
                DataEntryStore.emailCampaign.selectedContentBundle
              ).bodyContentHTML}} />
              }
          </p>
        </div>
      </Segment>
    );
  })
);
