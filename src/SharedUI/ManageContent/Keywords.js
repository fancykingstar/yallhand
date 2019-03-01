import React from "react";
import {inject, observer} from "mobx-react"
import {Segment, Form, Header, Label, Icon} from "semantic-ui-react"
import {patchPolicy} from "../../DataExchange/Content"
import { StdInputValidation } from "../../SharedCalculations/StdInputValidation"
import { contentPatch } from "../../DataExchange/PayloadBuilder"
import { modifyAnnouncement, modifyPolicy} from "../../DataExchange/Up"

import "./style.css"
import _ from "lodash";

export const Keywords = inject("DataEntryStore", "PoliciesStore", "UserStore", "UIStore")(observer((props) => {
    const {DataEntryStore, PoliciesStore, UserStore, UIStore} = props

    const addKeyword = (val) => {
      if(StdInputValidation(val, DataEntryStore.contentmgmt.keywords).valid){
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
      const mode = props.mode === "policy" ? "policy" : "announcement"
      let patchObj = {keywords: DataEntryStore.contentmgmt.keywords}
      mode === "policy" ? patchObj.policyID = UIStore.content.policyID : patchObj.anncID = UIStore.content.anncID
      mode === "policy" ? modifyPolicy(contentPatch(patchObj)) : modifyAnnouncement(contentPatch(patchObj))
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
                // id="keyword"
                value={DataEntryStore.contentmgmt.keywordInput}
                onChange={(e, val) => DataEntryStore.set("contentmgmt", "keywordInput", val.value)}
                label="Add Related Keywords or Phrases (optional)"
                style={{ width: 350 }}
                action="Add"
                placeholder="Enter term(s)..."
              /><Form.Button label="" primary type="button"
              // disabled={DataEntryStore.selectedKeywords.toString() === currentObjVariation.keywords.toString()} 
              onClick={e => submitUpdate()}>Update</Form.Button></Form.Group>
              </Form>
              <div className="Form">{keywords}</div>
            </div>
            </div>
        </Segment>
      )
}))
