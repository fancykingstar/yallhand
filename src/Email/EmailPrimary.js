import React from "react";
import {inject, observer} from "mobx-react"
import { Segment, Header, Menu, Form, Icon, Button, Checkbox, Message } from "semantic-ui-react";
import { ChooseTargeting } from "./ChooseTargeting";
import { BundleContent } from "../SharedUI/Bundle/BundleContent";
import { ContentSearch } from "../SharedUI/ContentSearch";
import { DraftFormField } from "../SharedUI/DraftFormField";
import { arrayValUpOrDown } from "../SharedCalculations/ArrayValUpOrDown";
import { flashDraft } from "../SharedCalculations/FlashDraft"

import { emailCampaign } from "../DataExchange/PayloadBuilder"
import { createCampaign } from "../DataExchange/Up"
import { EditorState, convertFromRaw } from "draft-js";
import _ from "lodash";
 

@inject("UIStore", "DataEntryStore")
@observer
export class EmailPrimary extends React.Component {
  constructor(props){
    super(props)
    const {DataEntryStore} = this.props
    this.resetEmail = () => {
      DataEntryStore.reset("emailCampaign",{sendTargetType: "all", sendToTeamID: "global", sendToTagID: "none", sendOption: "schedule",sendAutomationEvent: "firstLogin"})
      flashDraft()
    }
  }
  componentDidMount() {
    const {DataEntryStore, UIStore} = this.props
    if(DataEntryStore.emailCampaign.sendContent.lengh > 0 && UIStore.menuItem.sendEmailBody === "message"){UIStore.set("menuItem", "sendEmailBody", "messagecontent")}
    if(DataEntryStore.emailCampaign.draftHTML !== ""){
      const contentState = convertFromRaw(DataEntryStore.emailCampaign.draftRAW);
      DataEntryStore.setDraft( "editorState", EditorState.createWithContent(contentState) );
    }
  }
  componentWillUnmount(){
    const {DataEntryStore} = this.props
    if(DataEntryStore.draftContentHTML !== "" && DataEntryStore.draftContentHTML !== "<p><br></p>"){
      DataEntryStore.set("emailCampaign", "draftRAW", DataEntryStore.draftContentRAW)
      DataEntryStore.set("emailCampaign", "draftHTML", DataEntryStore.draftContentHTML)
    }
  }
  render() {
      const {UIStore, DataEntryStore} = this.props
      
      const canSubmit = () => {
        let validations = {subject: false, targets: false, content: false}        
        if(UIStore.menuItem.sendEmailBody === "message" && DataEntryStore.draftContentHTML !== "" && DataEntryStore.draftContentHTML !== "<p><br></p>"){validations.content = true}
        else if(UIStore.menuItem.sendEmailBody=== "messagecontent" && (DataEntryStore.draft.draftContentHTML !== "" || DataEntryStore.draft.draftContentHTML === "<p><br></p>") && DataEntryStore.emailCampaign.sendContent.length > 0){validations.content = true}
        else if(UIStore.menuItem.sendEmailBody=== "content" && DataEntryStore.emailCampaign.sendContent.length > 0){validations.content = true}
        if(DataEntryStore.emailCampaign.sendTargetType === "all" || DataEntryStore.emailCampaign.sendTargetType === "teams" ||  (DataEntryStore.emailCampaign.sendTargetType === "users" && DataEntryStore.emailCampaign.sendToUsers.length > 0)){validations.targets = true}
        if(DataEntryStore.emailCampaign.sendSubject !== ""){validations.subject = true}
        //Messages
        if(!validations.content){UIStore.set("message", "sendNow", "Whoops, please make sure you added the appropriate message or content")}
        else if(!validations.targets){UIStore.set("message", "sendNow", "Whoops, please add recipients to send this to")}
        else if(!validations.subject){UIStore.set("message", "sendNow", "All emails need a subject, can you please add one?")}
        else { UIStore.set("message", "sendNow", "") }
        return !Object.values(validations).includes(false)
      }

      const sendNow = () => {
        if(canSubmit()) {createCampaign(emailCampaign(true, false))}
      }

      const bundlePopulated = DataEntryStore.emailCampaign.sendContent.length === 0;

      const updateSelectedContent = (item) => {
        if(item.type === "policy") {
          const updatedBundle = DataEntryStore.emailCampaign.sendContent.slice()
          if(!JSON.stringify(updatedBundle).includes(item.value)){
            updatedBundle.push({"policyID": item.value})
            DataEntryStore.set("emailCampaign", "sendContent", updatedBundle)
          }
        }
        else if(item.type === "announcement") {
          const updatedBundle = DataEntryStore.emailCampaign.sendContent.slice()
          if(!JSON.stringify(updatedBundle).includes(item.value)){
            updatedBundle.push({"announcementID": item.value})
            DataEntryStore.set("emailCampaign", "sendContent", updatedBundle)
          }
      }
      }
      const remove = val => {
        const updatedBundle= DataEntryStore.emailCampaign.sendContent.filter(
          item => Object.values(item)[0] !== Object.values(val)[0]
        );
        DataEntryStore.set("emailCampaign", "sendContent", updatedBundle);
      };
      const moveUp = val => {
        DataEntryStore.set(
          "emailCampaign",
          "sendContent",
          arrayValUpOrDown(
            DataEntryStore.emailCampaign.sendContent,
            val,
            "up"
          )
        );
      };
      const moveDown = val => {
        DataEntryStore.set(
          "emailCampaign",
          "sendContent",
          arrayValUpOrDown(
            DataEntryStore.emailCampaign.sendContent,
            val,
            "down"
          )
        );
      };
    return (
      <div style={{maxWidth: 650}}>
          <Header as="h2">
          Send Email
          <Header.Subheader>
            Configure and send emails to your employees
          </Header.Subheader>
        </Header>
        <Segment>
          <div style={{ minWidth: 400 }}> <ChooseTargeting /> </div>
          <div style={{ paddingTop: 10, paddingBottom: 10}}>
          <Form>
          <Form.Input label="Email Subject (Required)"
                value={DataEntryStore.emailCampaign.sendSubject}
                onChange={(e, val) =>
                  DataEntryStore.set("emailCampaign", "sendSubject", val.value)
                }
              />
            </Form>
          </div>
          <span style={{fontWeight: 800, fontSize: ".9em"}}>What should the email body contain?</span><br/>
            <Menu vertical={UIStore.responsive.isMobile} compact size="tiny">
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "message"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "message")}> Custom Message Only </Menu.Item>
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "messagecontent"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "messagecontent")}> Custom Message + Selected Content </Menu.Item>
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "content"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "content")}> Selected Content Only </Menu.Item>
          </Menu>
          
          <div style={UIStore.menuItem.sendEmailBody === "content"? {display: "none"}:{display:"contents"} }>
          <div style={{ maxWidth: 520, paddingTop: 20, paddingBottom: 20 }}>        <div>
            <span style={{fontWeight: 800, fontSize: ".9em"}}>Custom Message</span>
                <DraftFormField loadContent={null} />
            </div></div>
          </div>
          <div style={UIStore.menuItem.sendEmailBody === "message"? {display: "none"}:{display:"contents"} }>
           <div style={{paddingTop: 25}}> <ContentSearch output={res => updateSelectedContent(res)}/> </div>
          <div style={{ maxWidth: 500, paddingTop: 5 }}>    
          
          {bundlePopulated ? (
          <h5 style={{ fontStyle: "italic" }}>
            No content added (yet)...
          </h5>
        ) : (
          <BundleContent
            input={DataEntryStore.emailCampaign.sendContent}
            remove={val => remove(val)}
            moveUp={val => moveUp(val)}
            moveDown={val => moveDown(val)}
          />
        )}

          </div>
        </div>
         
        <br/>
        <div style={DataEntryStore.emailCampaign.loadedTemplateSubject !== DataEntryStore.emailCampaign.sendSubject? {paddingBottom: 5}:{display: "none"}}  > <Checkbox checked={DataEntryStore.emailCampaign.sendSaveTemplate}  onClick={(e, data) => DataEntryStore.set("emailCampaign", "sendSaveTemplate", data.checked)} label="Use as template in the future"/> </div>
        <Button icon primary labelPosition="left" onClick={e => sendNow()} > <Icon name="send"/> Send Now </Button>
          <Button 
          onClick={e => {if(canSubmit()) UIStore.set("menuItem", "emailFrame", "send options")}} > Preview & Options... </Button>
          <div style={UIStore.responsive.isMobile? {paddingTop: 10}: {float: "right"}}> 
          <Button onClick={e => this.resetEmail()}> Clear All </Button> </div>
          <Message error hidden={UIStore.message.sendNow === ""}>
            {UIStore.message.sendNow}
          </Message>
        </Segment>
        <br/>

      </div>
    );
  }
}
