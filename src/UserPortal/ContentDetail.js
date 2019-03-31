import React from "react"
import { inject, observer } from "mobx-react";
import {  Header, Container, Image, Icon, Grid, Item } from 'semantic-ui-react'
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

@inject("AnnouncementsStore", "PoliciesStore", "ResourcesStore", "UIStore", "UserStore")
@observer
export class ContentDetail extends React.Component {

    componentDidMount() {
        const {UIStore, AnnouncementsStore, PoliciesStore, UserStore} = this.props
        const content = this.props.mode === "announcement"? AnnouncementsStore._getAnnouncement(this.props.match.params.id) 
        : PoliciesStore._getPolicy(this.props.match.params.id)

        UIStore.set("portal", "sentimentComplete", false)
        log(ItsLog(false, {"type": this.props.mode, "id": this.props.match.params.id, "variation": content.variations[0].variationID}))
    
        apiCall_noBody(`sentiments/usersentiment/${UserStore.user.userID}/${this.props.mode === "policy"? content.policyID : content.announcementID}/${this.props.mode === "policy"? "policyID":"announcementID"}`, "GET")
            .then(result => UIStore.set("portal", "sentimentAvailable", result))
            
    }

    render() {
        const {AnnouncementsStore, PoliciesStore, ResourcesStore, UIStore} = this.props
        
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

        return(
            <div className="Content">
            <BackButton/>
                <Container>
                {content.img.length !== 0 ?  <Image rounded size="large" src={content.img}/> : null}
                    <Header
                    as="h1"
                    content={content.variations[0].label === ""? content.label: content.variations[0].label}
                    subheader={UTCtoFriendly(content.updated).split(",")[0]}
                  />
                  <div style={{fontSize:"1.4em"}}>
                  <DraftHTMLDisplay storedState={content.variations[0].contentRAW}/>
                  </div>
                  </Container>
                <br/>
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
                            <AskAQuestion content={content}/>
                            </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div style={{paddingBottom: 120}}/>
                   
                </div>
                

       

        )
    }
}




