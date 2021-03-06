import React from "react";
import { withRouter } from "react-router-dom"
import {inject, observer} from "mobx-react"
import { Segment, Header, Menu, Form, Icon, Button, Checkbox, Message } from "semantic-ui-react";
import { ChooseTargeting } from "./ChooseTargeting";
import { BundleContent } from "../SharedUI/Bundle/BundleContent";
import { ContentSearch } from "../SharedUI/ContentSearch";
import { FeaturedImage } from "../SharedUI/ManageContent/FeaturedImage"
import { DraftFormField } from "../SharedUI/DraftFormField";
import { arrayValUpOrDown } from "../SharedCalculations/ArrayValUpOrDown";
import { flashDraft } from "../SharedCalculations/FlashDraft"

import { emailCampaign } from "../DataExchange/PayloadBuilder"
import { createCampaign } from "../DataExchange/Up"
import { EditorState, convertFromRaw } from "draft-js";
import _ from "lodash";




@inject("UIStore", "DataEntryStore", "EmailStore", "AccountStore")
@observer
class EmailPrimary extends React.Component {
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
    DataEntryStore.set('contentmgmt', 'hide', true);
    if(DataEntryStore.emailCampaign.sendContent.length > 0 && UIStore.menuItem.sendEmailBody === "message"){UIStore.set("menuItem", "sendEmailBody", "messagecontent")}
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
      const {UIStore, DataEntryStore, EmailStore, AccountStore} = this.props

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

      const sendNow = async () => {
        if(canSubmit()) {
          const newCamp = await createCampaign(emailCampaign(true, false)).then((res) => res.json())
          EmailStore.loadCampaigns([...EmailStore.allCampaigns, ...[newCamp]])
          const newCampAnalytic = {campaignID: newCamp.campaignID, clicks: 0, completed: false, send: newCamp.updated, subject: newCamp.subject, open_rate: 0, total_views:0, unique_views: 0}
          AccountStore.loadAnalyticData_campaigns([...AccountStore.analyticData_campaigns, ...[newCampAnalytic]])
          this.props.history.push("/panel/analytics")
          this.resetEmail();
        }

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
          <Header as="h2"
          style={{padding: 0, margin: 0}}
          >
          Send Email
          <Header.Subheader>
            Configure and send emails to your employees
          </Header.Subheader>
        </Header>
        <Segment>
          <div style={{ minWidth: 400 }}> 
          
        <ChooseTargeting
        label={"Send email"}
          // input= {!DataEntryStore.emailCampaign.campaignID? false : {sendTargetType: DataEntryStore.emailCampaign.recipientType, 
          //            sendToTeamID: DataEntryStore.emailCampaign.teamID,
          //            sendToTagID: !DataEntryStore.emailCampaign.tags.length? "": DataEntryStore.emailCampaign.tags[0],
          //            sendToUsers: DataEntryStore.emailCampaign.targetUsers, 
          //           }}
          output={val=> 
            {
              if(val.sendTargetType) DataEntryStore.set("emailCampaign", "recipientType", val.sendTargetType);
              if(val.sendToTeamID) DataEntryStore.set("emailCampaign", "teamID", val.sendTargetType);
              if(val.sendToTagID) DataEntryStore.set("emailCampaign", "tags", val.sendToTeamID === "none"? []: [val.sendToTagID]);
              if(val.sendToUsers) DataEntryStore.set("emailCampaign", "targetUsers", val.sendToUsers);  
            }}
          />

           </div>
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
          <span style={{fontWeight: 800, fontSize: ".9em"}}>What should the email body contain?</span>
            <Menu vertical={UIStore.responsive.isMobile} compact size="tiny">
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "message"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "message")}> Custom Message Only </Menu.Item>
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "messagecontent"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "messagecontent")}> Custom Message + Selected Content </Menu.Item>
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "content"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "content")}> Selected Content Only </Menu.Item>
          </Menu>

          <div style={UIStore.menuItem.sendEmailBody === "content"? {display: "none"}:{display:"contents"} }>
          <div style={{ maxWidth: 520, paddingTop: 20, paddingBottom: 20 }}>        <div>
            <span style={{fontWeight: 800, fontSize: ".9em"}}>Custom Message</span>
            <div style={{paddingTop: 3}}> <DraftFormField loadContent={null} border /></div>
            </div></div>
          </div>
          <div style={UIStore.menuItem.sendEmailBody === "message"? {display: "none"}:{display:"contents"} }>
           <div style={{paddingTop: 25}}>
                <Form>
                  <Form.Field className="FixSemanticLabel">
                    <label>Search and add content</label>
                  <ContentSearch output={res => updateSelectedContent(res)}/>
                  </Form.Field>
                </Form>
           </div>
          <div style={{ maxWidth: 500, paddingTop: 5 }}>

          {bundlePopulated ? (
          <h5 style={{ fontStyle: "italic" }}>
            {/* No content added (yet)... */}
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
        <div style={{paddingTop: 10}}>
          <span style={{fontWeight: 800, fontSize: ".9em", paddingBottom: 0}}>Custom Featured Image (optional)</span>
           <FeaturedImage maxWidth={600} compact defaultImgUrl={DataEntryStore.contentmgmt.img} imgData={DataEntryStore.contentmgmt.imgData}/>
           {/* <FeaturedImage defaultImgUrl={DataEntryStore.contentmgmt.img} output={val => DataEntryStore.set("contentmgmt", "bundle", val)}/> */}
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

export default withRouter(EmailPrimary)
