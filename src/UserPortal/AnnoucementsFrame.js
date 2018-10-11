import React from "react"
import "./style.css"
import { inject, observer } from "mobx-react";
import { Item, Header, Container, Divider } from 'semantic-ui-react'
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly'

@inject("AnnoucementsStore")
@observer
export class AnnoucementsFrame extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {AnnoucementsStore} = this.props
        const displayFeed = AnnoucementsStore.allAnnoucements.map(news => (
            <div className="AnnouncementContainer">
            
                {news.img.length !== 0 ?  <div className="imgBox"> <Item.Image size="medium" src={news.img}/> </div> : null}
                <div className={news.img.length !== 0 ? "contentBox" : "fullcontentBox"}>
                <Container>
                    <Header
                    as="h2"
                    content={news.label}
                    subheader={UTCtoFriendly(news.updated)}
                  />
                  <p>{news.content}</p>
                  </Container>
                 
                </div>
                <div className="divider"><Divider /> </div>
                

            </div>
 

    
        ))
    
        return(
            <div className="Annoucements">
             <Item.Group>
                 {displayFeed}
             </Item.Group>
            </div>

        )
    }
}




