import React from "react"
import "./style.css"
import { inject, observer } from "mobx-react";
import { Item, Header, Container, Divider } from 'semantic-ui-react'
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly'
import { withRouter } from "react-router-dom";
import { UIStore } from "../Stores/UIStore";

@inject("AnnouncementsStore", "UserStore")
@observer
class AnnouncementsFrame extends React.Component {

    render() {
        const {AnnouncementsStore} = this.props
        const handleClick = (val) => {
            this.props.history.push(
                "/portal/announcement/" + val
              )
        }
        const anncs = UIStore.sideNav.activeChannel === "All"? AnnouncementsStore.allAnnouncements.slice()
        :AnnouncementsStore.allAnnouncements.slice().filter(news => news.chanID === UIStore.sideNav.activeChannel)
            
            const displayFeed = anncs.map(news => (
            <div className="AnnouncementContainer">
            
                {news.img.length !== 0 ?  <div className="imgBox" > <Item.Image rounded size="small" src={news.img}/> </div> : null}
                <div className={news.img.length !== 0 ? "contentBox" : "fullcontentBox"}>
                <Container onClick={e => handleClick(news.announcementID)}>
                    <Header
                    as="h2"
                    // style={{marginLeft: -100}}
                    content={news.label}
                    subheader={UTCtoFriendly(news.updated)}
                  />
                  {/* <p>{news.content}</p> */}
                  </Container>
                 
                </div>
                <div className="divider"><Divider /> </div>
                
            </div>
 

    
        ))
    
        return(
            <div className="Announcements">
             <Item.Group>
                 {displayFeed}
             </Item.Group>
            </div>

        )
    }
}


export default withRouter(AnnouncementsFrame)

