import React from "react"
import "./style.css"
import { inject, observer } from "mobx-react";
import {  Header, Container, Image } from 'semantic-ui-react'
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly'
import {DraftHTMLDisplay} from "../SharedCalculations/DraftHTMLDisplay"

@inject("AnnouncementsStore")
@observer
export class AnnouncementDetailView extends React.Component {
    render() {
        const {AnnouncementsStore} = this.props
        const annc = AnnouncementsStore._getAnnouncement(this.props.announcementID)
        console.log(annc)
        return(
            <div className="Announcements">
                <Container>
                {annc.img.length !== 0 ?  <Image size="medium" src={annc.img}/> : null}
                    <Header
                    as="h2"
                    content={annc.label}
                    subheader={UTCtoFriendly(annc.updated)}
                  />
                  {/* <p>{policyData.variations.content}</p> */}
         
                  <DraftHTMLDisplay storedState={annc.variations[0].contentRAW}/>
                  </Container>
            
                </div>
                

       

        )
    }
}




