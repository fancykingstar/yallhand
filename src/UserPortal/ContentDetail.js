import React from "react"
import "./style.css"
import { inject, observer } from "mobx-react";
import {  Header, Container, Image, Icon, Button, Grid, Item } from 'semantic-ui-react'
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly'
import {DraftHTMLDisplay} from "../SharedCalculations/DraftHTMLDisplay"
import { AskAQuestion } from "./AskAQuestion"
import { Sentiment } from "./Sentiment"
import BackButton from "../SharedUI/BackButton"

@inject("AnnouncementsStore", "PoliciesStore", "UIStore")
@observer
export class ContentDetail extends React.Component {

    componentDidMount() {
        const {UIStore} = this.props
        UIStore.set("portal", "sentimentComplete", false)
    }

    render() {
        const {AnnouncementsStore, PoliciesStore, UIStore} = this.props
        const mode = this.props.mode
        const content = mode === "announcement"? AnnouncementsStore._getAnnouncement(this.props.match.params.id) 
        : PoliciesStore._getPolicy(this.props.match.params.id)


        return(
            <div className="Content">
            <BackButton/>
                <Container>
                {content.img.length !== 0 ?  <Image rounded size="large" src={content.img}/> : null}
                    <Header
                    as="h2"
                    content={content.label}
                    subheader={UTCtoFriendly(content.updated).split(",")[0]}
                  />
    
                  <DraftHTMLDisplay storedState={content.variations[0].contentRAW}/>
                  </Container>
                <br/>
                <Grid>
                    <Grid.Row columns={1}>
                    <Grid.Column>
                       <Item.Group>
                           <Item>
                               <Item.Content>
                               <Item.Header>File{" "}</Item.Header>
                               <Item.Meta><Icon name="cloud download"></Icon></Item.Meta>
                               </Item.Content>
                             
                           </Item>
                       </Item.Group>
                       </Grid.Column>
                    </Grid.Row>
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




