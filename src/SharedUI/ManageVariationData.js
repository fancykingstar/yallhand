 import React from 'react'
 import {inject, observer} from 'mobx-react'
 import {Label, Grid} from "semantic-ui-react"
 import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
 import {JoinLinksCommas} from "../SharedCalculations/JoinLinksCommas"
 import {TagID2Friendly } from "../SharedCalculations/TagID2Friendly"

export const ManageVariationData = inject("ResourcesStore", "PoliciesStore", "AnnouncementsStore", "TeamStore", "UserStore", "AccountStore", "UIStore")(observer((props) => {
        const {ResourcesStore} = props
        const {TeamStore} = props
        const {UserStore} = props
        const {UIStore} = props
        const {AccountStore} = props
        const sourceType = props.type
        const resources = {
          "policy": {
            "files": ResourcesStore.matchedResources("file", "policy", UIStore.content.policyID, UIStore.content.variationID),
            "urls": ResourcesStore.matchedResources("url", "policy", UIStore.content.policyID, UIStore.content.variationID)
          }
          ,
          "announcement": {
            "files": ResourcesStore.matchedResources("file", "announcement", UIStore.content.announcementID, UIStore.content.variationID),
            "urls": ResourcesStore.matchedResources("url", "announcement", UIStore.content.announcementID, UIStore.content.variationID),
          }
        }
        const files = resources[sourceType]["files"]
        const urls = resources[sourceType]["urls"]
        let tags = props.variation.tags.length > 0 ? props.variation.tags : []
        if (tags.length !== 0) {tags = tags.map(tag => TagID2Friendly(tag, TeamStore.tags))}
  
        const tagsDisplay = tags.length !== 0 ? tags.join(', ') : "None"
        const valStyle = {fontWeight: '400', fontStyle: 'italic'}
        
        const filesDisplay = resources[sourceType].files.length !== 0 ? JoinLinksCommas(resources[sourceType].files.length, files, "label", "file") : "none"
        const urlsDisplay =  urls.length !== 0 ? JoinLinksCommas(urls.length, urls, "label", "url") : "none"
       
         return(
          //  <Grid stackable style={{width: "100%"}}>
          //    <Grid.Row>
          //      <Grid.Column width={8}>
          <React.Fragment>
                    <div>
                  <div className="Form">
                <span>Alternate Variation Title: </span><span style={valStyle} className="lightText">{props.variation.label !== "" ? props.variation.label : "None"}</span>
              </div>
                <div className="Form">
                <span>Required User Tags: </span><span style={valStyle}>{tagsDisplay}</span>
              </div>
              <div className="Form">
                <span>Last Updated: </span> <span style={valStyle}>{UTCtoFriendly(props.variation.updated, UserStore.user.timezone)}</span>
              </div>
              <div className="Form">
                <span>Stage: </span> <span style={valStyle}>{props.variation.stage}</span>
              </div>
              <div className="Form">
                <span>Resource URLs: </span> <span style={valStyle} className="lightText">{urlsDisplay}</span>
              </div>
              <div className="Form">
                <span>Attached Files: </span> <span style={valStyle} className="lightText">{filesDisplay}</span>
              </div>
              <div style={{paddingBottom: 10}} className="Form">
                <span>Owner: </span>
                <Label color="blue" horizontal>
                  {AccountStore._getDisplayName(props.variation.userID)}
                </Label>
              </div>
                </div>
                {/* </Grid.Column> */}
             
              <div style={{height: 135, paddingTop: 10, overflow: "auto"}}><span dangerouslySetInnerHTML={{__html: props.variation.contentHTML}} /></div>
              
   
          </React.Fragment>

     )
         }))