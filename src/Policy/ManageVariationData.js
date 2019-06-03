 import React from 'react'
 import {inject, observer} from 'mobx-react'
 import {Label} from "semantic-ui-react"
 import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
 import {JoinLinksCommas} from "../SharedCalculations/JoinLinksCommas"



export const ManageVariationData = inject("PoliciesStore", "ResourcesStore")(observer((props) => {
        const {PoliciesStore} = props
        const {ResourcesStore} = props
        const policy = props.policy
        const variations = props.policy.variations
        const thisVariation = variations.filter(variation => variation.variationID === PoliciesStore.toggledVariation)[0]
        const files = ResourcesStore.fileResources.filter(file => file.variationID.includes(PoliciesStore.toggledVariation))
        const urls = ResourcesStore.urlResources.filter(file => file.variationID.includes(PoliciesStore.toggledVariation))
        const tags = thisVariation.tags.length > 0 ? thisVariation.tags : []
  
      
        const tagsDisplay = tags.length !== 0 ? tags.map(tag => tag.label).join(', ') : "None"
        const valStyle = {fontWeight: '400', fontStyle: 'italic'}
        
        const filesDisplay = files.length !== 0 ? JoinLinksCommas(files.length, files, "label", "url") : "none"
        const urlsDisplay = urls.length !== 0 ? JoinLinksCommas(urls.length, urls, "label", "url") : "none"
         return(
            <div>
            <div className="Form">
            <span>Required Tags: </span><span style={valStyle}>{tagsDisplay}</span>
          </div>
          <div className="Form">
            <span>Last Updated: </span> <span style={valStyle}>{UTCtoFriendly(policy.updated)}</span>
          </div>
          <div className="Form">
            <span>Resource URLs: </span> <span style={valStyle} className="lightText">{urlsDisplay}</span>
          </div>
          <div className="Form">
            <span>Attached Files: </span> <span style={valStyle} className="lightText">{filesDisplay}</span>
          </div>
          <div className="Form">
            <span>Active Automations: </span> <span style={valStyle}>none</span>
          </div>
          <div className="Form">
            <span>Owner: </span>
            <Label color="blue" horizontal>
              {thisVariation.admin['displayName']}
            </Label>
          </div>
            </div>
     )
         }))