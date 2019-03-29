import React from "react"
import {inject, observer} from "mobx-react"
import {Dropdown, Label, Divider, Button} from "semantic-ui-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {getContentObj} from "../SharedCalculations/GetContentObj"

@inject("UIStore", "EmailStore")
@observer
export class EmailTemplates extends React.Component {
    render(){
        const {UIStore, EmailStore} = this.props
        const templates = EmailStore.allCampaigns.filter(x => x.isTemplate).map(x => 
            <React.Fragment>
                <div style={{marginBottom: 0, paddingBototm: 0}}><h3>{x.subject}</h3></div>
                <div style={{marginTop: 0, paddingTop: 0}}><span style={{fontSize: ".8em", fontWeight: 800}}> {UTCtoFriendly(x.updated)} </span></div>
                
                <div style={x.draftContentHTML === ""? {display: "none"} : {paddingTop: 10, fontSize: ".8em"}}>
                    <span dangerouslySetInnerHTML={{ __html: x.draftContentHTML }} />
                </div>
                <div style={x.content.length === 0? {display: "none"} : {paddingTop: 10}}>
                    <span style={{fontWeight: 800, fontSize: ".8em"}}>Selected Content: {x.content.map(y => <a href={y.policyID !== undefined? "panel/faqs/manage-policy/" + y.policyID :  "panel/announcements/manage-announcement/" + y.announcementID } target="_blank">{getContentObj(y).label}</a>)}</span>
                </div>

           
                <div style={{paddingTop: 10, paddingBottom: 0}}>
                    <Button primary size="mini" basic>Use This Template</Button> <Button size="mini" negative basic>Delete</Button>
                </div>
                <Divider />
            </React.Fragment>
            )
        return(
            <div>
                  <div style={{height: 20, width: "100%"}}>
                    <div style={{float: "right", paddingRight: 25}}> 
                        <span> Sort by{' '} <Dropdown inline options={[{text: "Newest", value: "new"}, {text: "Oldest", value: "old"}]} defaultValue={"new"} onChange= {(e, {value}) => UIStore.set("dropdown", "policySort", value)} /> </span>
                    </div>
                  </div>
                {templates}
                </div>
        )
    }
}