import React from "react"
import "./style.css"
import { inject, observer } from "mobx-react";
import {  Header, Container, Image, Icon, Button, Grid, Item } from 'semantic-ui-react'

import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly'
import {DraftHTMLDisplay} from "../SharedCalculations/DraftHTMLDisplay"
import { AskAQuestion } from "./AskAQuestion"
import { Sentiment } from "./Sentiment"
import BackButton from "../SharedUI/BackButton"
import {downloadFilePortal} from "../DataExchange/DownloadFile"

import { log } from "../DataExchange/Up"
import { ItsLog } from "../DataExchange/PayloadBuilder"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";

@inject("AnnouncementsStore", "PoliciesStore", "ResourcesStore", "UIStore")
@observer
export class ContentDetail extends React.Component {

    componentDidMount() {
        const {UIStore, AnnouncementsStore, PoliciesStore} = this.props
        const content = this.props.mode === "announcement"? AnnouncementsStore._getAnnouncement(this.props.match.params.id) 
        : PoliciesStore._getPolicy(this.props.match.params.id)

        UIStore.set("portal", "sentimentComplete", false)
        log(ItsLog(false, {"type": this.props.mode, "id": this.props.match.params.id, "variation": content.variations[0].variationID}))
    }

    render() {
        const {AnnouncementsStore, PoliciesStore, ResourcesStore} = this.props
        
        const mode = this.props.mode
        const content = mode === "announcement"? AnnouncementsStore._getAnnouncement(this.props.match.params.id) 
        : PoliciesStore._getPolicy(this.props.match.params.id)

        const fileResources = ResourcesStore.matchedResources("file", mode, content[mode + "ID"], content.variations[0].variationID)
        // console.log("file", mode, content[mode + "ID"], content.variations[0].variationID)
        const displayFiles = fileResources.map(file =>
            <Item key={"contentResource" + giveMeKey()}>
                <Item.Content onClick={e => downloadFilePortal(file.S3Key.split("gramercy/")[1], file.label, file.resourceID)}>
                <Item.Header as="a">{file.label}{" "}</Item.Header>
                <Item.Meta><Icon name="cloud download"></Icon></Item.Meta>
                </Item.Content>
            </Item>
        )

        return(
            <div className="Content">
            <BackButton/>
                <Container>
                {content.img.length !== 0 ?  <Image rounded size="large" src={content.img}/> : null}
                    <Header
                    as="h2"
                    content={content.variations[0].label === ""? content.label: content.variations[0].label}
                    subheader={UTCtoFriendly(content.updated).split(",")[0]}
                  />
    
                  <DraftHTMLDisplay storedState={content.variations[0].contentRAW}/>
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
                            <Sentiment
                            type={mode === "announcement"? "announcementID" : "policyID"}
                            ID={mode === "announcement"? content.announcementID : content.policyID}
                            variationID={content.variations[0].variationID}
                            />
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




