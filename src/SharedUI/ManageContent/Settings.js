import React from "react";
import { inject, observer } from "mobx-react";
import { Segment, Form, Header } from "semantic-ui-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { patchPolicy } from "../../DataExchange/Content";
import { ChannelSelect } from "../ChannelSelect"
import { contentPatch } from "../../DataExchange/PayloadBuilder"
import { modifyAnnouncement, modifyPolicy} from "../../DataExchange/Up"


import "./style.css";

export const Settings = inject(
  "DataEntryStore",
  "PoliciesStore",
  "UserStore",
  "AnnouncementsStore",
  "UIStore"
)(
  observer(props => {
    const { DataEntryStore, UserStore, PoliciesStore, AnnouncementsStore, UIStore } = props;
    const modeRouter = {
      policy: {
        selectedID: PoliciesStore.selectedPolicyID,
        _currentObj: PoliciesStore._currentObj
      },
      announcement: {
        selectedID: AnnouncementsStore.selectedAnnouncementID,
        _currentObj: AnnouncementsStore._currentAnnouncement
      }
    };

    const mode = props.mode === "policy" ? "policy" : "announcement"

    const updateSettings = () => {
      let patchObj = {label: DataEntryStore.contentmgmt.settingsLabel, chanID: DataEntryStore.contentmgmt.settingsChannel}
      mode === "policy" ? patchObj.policyID = UIStore.content.policyID : patchObj.announcementID = UIStore.content.announcementID
      mode === "policy" ? modifyPolicy(contentPatch(patchObj)) : modifyAnnouncement(contentPatch(patchObj))
    }

    const archiveAll = () => {
      const patchObj = mode === "policy" ? Object.assign({}, PoliciesStore._getPolicy(UIStore.content.policyID)) : Object.assign({}, AnnouncementsStore._getAnnouncement(UIStore.content.announcementID))
      patchObj.variations.forEach(vari => vari.stage = "archived")
      mode === "policy" ? patchObj.policyID = UIStore.content.policyID : patchObj.announcementID = UIStore.content.announcementID
      mode === "policy" ? modifyPolicy(contentPatch(patchObj)) : modifyAnnouncement(contentPatch(patchObj))

    }
    return (
      <Segment>
        <div style={{ maxWidth: 425 }}>
          <Header>Settings</Header>
          <br />
          <Form>
              <Form.Input
                label="Update Policy Label"
                value={DataEntryStore.contentmgmt.settingsLabel}
                onChange={(e, val) => DataEntryStore.set("contentmgmt", "settingsLabel", val.value)}
              />
              <ChannelSelect
              defaultVal={props.defaultChannel}
              label={"Update Associated Channel"}
              placeholder="choose channel..."
              outputVal={val => DataEntryStore.set("contentmgmt", "settingsChannel", val)}
            />
              <Form.Button primary onClick={e => updateSettings()}>Update</Form.Button> 
          </Form>
        
        
          <h5>Manage Policy</h5>
          <Form>
            <Form.Group inline>
              <Form.Button size="small" onClick={e => archiveAll()}>Archive All</Form.Button>
              <Form.Button size="small" color="red" disabled={true}>
                Delete All
              </Form.Button>
            </Form.Group>
          </Form>
        </div>
      </Segment>
    );
  })
);
