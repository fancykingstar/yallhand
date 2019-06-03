import React from "react";
import { inject, observer } from "mobx-react";
import {Segment, Button, Header, Form} from "semantic-ui-react"
import {DateTimeSelect} from "../DateTimeSelect"
import { createSchedule } from "../../DataExchange/Up"
import { schedule } from "../../DataExchange/PayloadBuilder"
import "./style.css"


export const Schedule = inject("DataEntryStore", "UIStore")(
    observer(props => {
        const {DataEntryStore, UIStore} = props
        const mode = props.mode === "policy" ? "policy" : "announcement"
        const options = () => {
        let publish = {"text":"Publish all drafts", "value": "publish"}
        if(props.state === "ok"){publish["disabled"] = true}  
        let unpublish = {"text":"Unpublish all", "value": "unpublish"}
        if(props.state === "draft" || props.state === "archived"){unpublish["disabled"] = true}  
        return [publish, unpublish]
        }

        const handleClick = () => {
            const data = mode === "policy" ? {"policyID": UIStore.content.policyID} : {"announcementID": UIStore.content.announcementID} 
            const task = DataEntryStore.contentmgmt.eventType === "publish" ? "publish content" : "unpublish content"
            createSchedule(schedule(DataEntryStore.contentmgmt.eventDateTime, task, data))
        }
       
    return(
       
      
  
        <Segment>
          <div style={{ maxWidth: 500 }}>
        <Header>Schedule</Header>
        <Form>
              <Form.Group>
              <Form.Select
                options={options()}
                onChange={(e, val) => DataEntryStore.set("contentmgmt", "eventType", val.value )}
                label="Choose action"
              />
   
         
             </Form.Group></Form>
             <DateTimeSelect value={val => DataEntryStore.set("contentmgmt", "eventDateTime", val) } includeTime />
              <Button primary disabled={DataEntryStore.contentmgmt.eventDateTime === "" || DataEntryStore.contentmgmt.eventType === ""} onClick={e => handleClick()}>Set</Button>

    
   
            </div>
            
        </Segment>
      )
}))
