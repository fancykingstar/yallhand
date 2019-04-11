import React from "react"
import { inject, observer } from "mobx-react";
import {  Header, Container, Image, Icon, Grid, Item, Button } from 'semantic-ui-react'
import {DraftHTMLDisplay} from "../SharedCalculations/DraftHTMLDisplay"
import { AskAQuestion } from "./AskAQuestion"
import { Sentiment } from "./Sentiment"
import {downloadFilePortal} from "../DataExchange/DownloadFile"
import { log } from "../DataExchange/Up"
import { ItsLog } from "../DataExchange/PayloadBuilder"
import { apiCall_noBody } from "../DataExchange/Fetch"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import BackButton from "../SharedUI/BackButton"
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly'
import "./style.css"

@inject("AnnouncementsStore", "PoliciesStore", "ResourcesStore", "UIStore", "UserStore", "DataEntryStore")
@observer
export class ContentDetail extends React.Component {

    componentDidMount() {
        const {UIStore, AnnouncementsStore, PoliciesStore, UserStore} = this.props
        const content = this.props.mode === "announcement"? AnnouncementsStore._getAnnouncement(this.props.match.params.id) 
        : PoliciesStore._getPolicy(this.props.match.params.id)

        UIStore.set("portal", "sentimentComplete", false)
        
        // if(!UserStore.user.isAdmin){ 
            log(ItsLog(false, {"content": this.props.mode, "contentID": this.props.match.params.id, "variationID": content.variations[0].variationID})) 
        // }
        
        
    
        apiCall_noBody(`sentiments/usersentiment/${UserStore.user.userID}/${this.props.mode === "policy"? content.policyID : content.announcementID}/${this.props.mode === "policy"? "policyID":"announcementID"}`, "GET")
            .then(result => UIStore.set("portal", "sentimentAvailable", result))
            
        if(UIStore.portal.viewedContent.includes(content[this.props.mode + "ID"]) === false){
            UIStore.set("portal", "viewedContent", [...UIStore.portal.viewedContent, content[this.props.mode + "ID"]])
        }
    }

    render() {
        const {AnnouncementsStore, PoliciesStore, ResourcesStore, UIStore, DataEntryStore} = this.props
        
        const mode = this.props.mode
        const content = mode === "announcement"? AnnouncementsStore._getAnnouncement(this.props.match.params.id) 
        : PoliciesStore._getPolicy(this.props.match.params.id)

        const fileResources = ResourcesStore.matchedResources("file", mode, content[mode + "ID"], content.variations[0].variationID)
        const displayFiles = fileResources.map(file =>
            <Item key={"contentResource" + giveMeKey()}>
                <Item.Content onClick={e => downloadFilePortal(file.S3Key.split("gramercy/")[1], file.label, file.resourceID)}>
                <Item.Header as="a">{file.label}{" "}</Item.Header>
                <Item.Meta><Icon name="cloud download"></Icon></Item.Meta>
                </Item.Content>
            </Item>
        )

        const displaySentiment = UIStore.portal.sentimentAvailable.length > 0? <div/> : 
            <Sentiment
            type={mode === "announcement"? "announcementID" : "policyID"}
            ID={mode === "announcement"? content.announcementID : content.policyID}
            variationID={content.variations[0].variationID}
            />

        const handleClick = () => {
                log(ItsLog(true,{"event": "click", "type":"ask"}))
                UIStore.set("modal", "askQuestion", false) 
    }

        return(
            <div className="Content">
            <BackButton/>
                <Container textAlign="center">
                {content.img.length !== 0 ?  <Image centered rounded size="large" src={content.img}/> : null}
                    <Header
                    as="h1"
                    content={content.variations[0].label === ""? content.label: content.variations[0].label}
                    subheader={UTCtoFriendly(content.updated).split(",")[0]}
                  />
                  <div style={{fontSize:"1.4em"}}>
                  {/* <DraftHTMLDisplay storedState={content.variations[0].contentRAW}/> */}
                  <span dangerouslySetInnerHTML={{ __html: content.variations[0].contentHTML }} />
                  </div>
                  </Container>
                <br/>
                <Container textAlign="center">
                <Grid>
                    {displayFiles.length === 0? null : 
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <Item.Group> {displayFiles} </Item.Group>
                        </Grid.Column>
                    </Grid.Row>
                    }
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            {displaySentiment}
                        </Grid.Column>
                        <Grid.Column>
                        <Button basic 
                        onClick={e => {
                        handleClick()
                        UIStore.set("modal", "askQuestion", true) 
                        DataEntryStore.set("ask", "type", "specific")
                        DataEntryStore.set("ask", "content", content)
                    }}
                    >Ask A Question...</Button>
                            </Grid.Column>
                    </Grid.Row>
                </Grid>
                </Container>
                <div style={{paddingBottom: 120}}/>
                   
                </div>
                

       

        )
    }
}




