import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom"
import { Segment, Form, Header } from "semantic-ui-react";
import { ChannelSelect } from "../ChannelSelect"
import { contentPatch } from "../../DataExchange/PayloadBuilder"
import { modifyAnnouncement, modifyPolicy, deletePolicy, deleteAnnouncement} from "../../DataExchange/Up"
import { ConfirmDelete } from "../ConfirmDelete"
import "./style.css";

const Settings = inject( "DataEntryStore", "PoliciesStore", "UserStore", "AnnouncementsStore", "UIStore" )( observer(props => {
    const { DataEntryStore, PoliciesStore, AnnouncementsStore, UIStore } = props;

    const content = props.mode === "policy"? PoliciesStore._getPolicy(UIStore.content.policyID) : AnnouncementsStore._getAnnouncement(UIStore.content.announcementID)

    const updateSettings = () => {
      let patchObj = {label: DataEntryStore.contentmgmt.settingsLabel, chanID: DataEntryStore.contentmgmt.settingsChannel}
      props.mode === "policy" ? patchObj.policyID = UIStore.content.policyID : patchObj.announcementID = UIStore.content.announcementID
      props.mode === "policy" ? modifyPolicy(contentPatch(patchObj)) : modifyAnnouncement(contentPatch(patchObj))
    }

    const archiveAll = () => {
      const patchObj = props.mode === "policy" ? Object.assign({}, PoliciesStore._getPolicy(UIStore.content.policyID)) : Object.assign({}, AnnouncementsStore._getAnnouncement(UIStore.content.announcementID))
      patchObj.variations.forEach(vari => vari.stage = "archived")
      props.mode === "policy" ? patchObj.policyID = UIStore.content.policyID : patchObj.announcementID = UIStore.content.announcementID
      props.mode === "policy" ? modifyPolicy(contentPatch(patchObj)) : modifyAnnouncement(contentPatch(patchObj))

    }

    const deleteDisplay = 
      content.everPublished ? null 
      :    <ConfirmDelete size="small" label={`this ${props.mode}`} 
        deleteLabel="Delete All"
        confirm={e => {
        props.mode === "policy"? deletePolicy(UIStore.content.policyID): deleteAnnouncement(UIStore.content.announcementID)
        props.mode === "policy"? props.history.push("/panel/faqs") : props.history.push("/panel/announcements")
      }}/>
    

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
              {deleteDisplay}
            </Form.Group>
          </Form>
        </div>
      </Segment>
    );
  })
);

export default withRouter(Settings)