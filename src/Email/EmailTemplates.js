import React from "react"
import {inject, observer} from "mobx-react"
import {Dropdown, Divider, Button, Header} from "semantic-ui-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {sortByUTC} from "../SharedCalculations/SortByUTC"
import {getContentObj} from "../SharedCalculations/GetContentObj"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { modifyCampaign } from "../DataExchange/Up";
import { EditorState, convertFromRaw } from "draft-js";

@inject("UIStore", "EmailStore", "DataEntryStore")
@observer
export class EmailTemplates extends React.Component {
    render(){
        const {UIStore, EmailStore, DataEntryStore} = this.props

        const loadTemplate = (obj) => {
            DataEntryStore.reset("emailCampaign",{sendTargetType: "all", sendToTeamID: "global", sendToTagID: "none", sendOption: "schedule",sendAutomationEvent: "firstLogin"})
            DataEntryStore.set("emailCampaign", "sendContent", obj.content)
            DataEntryStore.set("emailCampaign", "loadedTemplateSubject", obj.subject)
            DataEntryStore.set("emailCampaign", "sendSubject", obj.subject)
            DataEntryStore.set("emailCampaign", "draftRAW", obj.draftContentRAW)
            DataEntryStore.set("emailCampaign", "draftHTML", obj.draftContentHTML)
            const body = obj.content.length > 0 && obj.draftContentHTML !== ""? "messagecontent": obj.content.length > 0? "content": "message"
            UIStore.set("menuItem", "sendEmailBody", body)
            const contentState = convertFromRaw(obj.draftContentRAW);
            DataEntryStore.setDraft( "editorState", EditorState.createWithContent(contentState) );
            UIStore.set("menuItem", "emailFrame", "send email")
        } 

        const deleteTemplate = (payload) => {
            modifyCampaign(payload)
        }

        const templates = sortByUTC(EmailStore.allCampaigns, UIStore.dropdown.emailTemplateSort).filter(x => x.isTemplate).map(x => 
            <React.Fragment key={"email template"+giveMeKey()}>
                <div >
                <div style={{marginBottom: 0, paddingBototm: 0}}><h3>{x.subject}</h3></div>
                <div style={{marginTop: 0, paddingTop: 0}}><span style={{fontSize: ".8em", fontWeight: 800}}> {UTCtoFriendly(x.updated)} </span></div>
                
                <div style={x.draftContentHTML === ""? {display: "none"} : {paddingTop: 10, fontSize: ".8em"}}>
                    <span dangerouslySetInnerHTML={{ __html: x.draftContentHTML }} />
                </div>
                <div style={x.content.length === 0? {display: "none"} : {paddingTop: 10}}>
                    <span style={{fontWeight: 800, fontSize: ".8em"}}>Selected Content: {x.content.map(y => <a key={"template link" + giveMeKey()} href={y.policyID !== undefined? "panel/faqs/manage-policy/" + y.policyID :  "panel/announcements/manage-announcement/" + y.announcementID } target="_blank">{getContentObj(y).label}</a>)}</span>
                </div>
 
           
                <div style={{paddingTop: 10, paddingBottom: 0}}>
                    <Button primary onClick={e => loadTemplate(x)} size="mini" basic>Use This Template</Button> <Button onClick={e=> deleteTemplate({campaignID: x.campaignID, isTemplate: false})} size="mini" negative basic>Delete</Button>
                </div>
                <Divider />
                </div>
            </React.Fragment>
            )
        return(
            <div>
                  <Header as="h2" content="Email Templates"
                  style={{padding: 0, margin: 0}}
                  />
                  {EmailStore.allCampaigns.filter(x => x.isTemplate).length === 0 ? <h5 style={{ fontStyle: "italic" }}> You do not have any current templates </h5> : <div/>}
                  <div style={{height: 20, width: "100%"}}>
                    <div style={{float: "right", paddingRight: 25}}> 
                        <span> Sort by{' '} <Dropdown inline options={[{text: "Newest", value: "Newest"}, {text: "Oldest", value: "Oldest"}]} defaultValue={"Newest"} onChange= {(e, {value}) => UIStore.set("dropdown", "emailTemplateSort", value)} /> </span>
                    </div>
                  </div>
                {templates}
                </div>
        )
    }
}