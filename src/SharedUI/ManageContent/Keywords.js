import React from "react";
import {inject, observer} from "mobx-react"
import {Segment, Form, Header, Label, Icon} from "semantic-ui-react"
import { StdInputValidation } from "../../SharedCalculations/StdInputValidation"
import { contentPatch } from "../../DataExchange/PayloadBuilder"
import { modifyAnnouncement, modifyPolicy} from "../../DataExchange/Up"

import "./style.css"
import _ from "lodash";

export const Keywords = inject("DataEntryStore", "PoliciesStore", "UserStore", "UIStore")(observer((props) => {
    const {DataEntryStore, PoliciesStore, UserStore, UIStore} = props

    const addKeyword = (val) => {
      if(StdInputValidation(val, DataEntryStore.contentmgmt.keywords).valid && val.trim() !== ""){
        let newarry = DataEntryStore.contentmgmt.keywords.slice()
        newarry.push(val)
        DataEntryStore.set("contentmgmt", "keywords", newarry)
        DataEntryStore.set("contentmgmt", "keywordInput", "")
      }
      }
      const keywords = DataEntryStore.contentmgmt.keywords.map(keyword => (
        <Label key={keyword}>
          {keyword}
          <Icon name="delete" onClick={e =>  DataEntryStore.set("contentmgmt", "keywords", DataEntryStore.contentmgmt.keywords.filter(i => i !== keyword))}/>
        </Label>
      ));
    const submitUpdate = () => {
      let patchObj = {keywords: DataEntryStore.contentmgmt.keywords}
      props.mode === "policy" ? patchObj.policyID = UIStore.content.policyID : patchObj.announcementID = UIStore.content.announcementID
      props.mode === "policy" ? modifyPolicy(contentPatch(patchObj)) : modifyAnnouncement(contentPatch(patchObj))
    }
    return(
        <Segment>
        <div style={{ maxWidth: 400 }}>
        <Header>Searchability</Header>
            <br />
            <div>
              <Form onSubmit={e => addKeyword(DataEntryStore.contentmgmt.keywordInput)}>
              <Form.Group inline>
              <Form.Input
                fluid
                value={DataEntryStore.contentmgmt.keywordInput}
                onChange={(e, val) => DataEntryStore.set("contentmgmt", "keywordInput", val.value)}
                label="Related Keywords/Phrases (optional)"
                action="Add"
                placeholder="Enter term(s)..."
              />
              <Form.Button fluid label="" disabled={DataEntryStore.contentmgmt.keywordInput === "" && DataEntryStore.contentmgmt.keywords.length === 0} primary onClick={e => submitUpdate()}>Update</Form.Button>
              </Form.Group>
              </Form>
              <div className="Form">{keywords}</div>
            </div>
            </div>
        </Segment>
      )
}))
