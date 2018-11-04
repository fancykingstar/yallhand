import React from 'react'
import {inject, observer} from 'mobx-react'
import { Item, Button} from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"

export const Feed = inject("AnnoucementsStore")(observer((props) => { 
    const {AnnoucementsStore} = props
    const contentFeed = AnnoucementsStore.allAnnoucements.map(news => (
      <Item>
        {news.img.length !== 0 ? <Item.Image size="medium" src={news.img}/> : null}
      <Item.Content>
        <Item.Header as='a'>{news.label}</Item.Header>
        <Item.Meta>{news.admin.displayName}</Item.Meta>
        <Item.Description>
          {news.content}
        </Item.Description>
        <Item.Extra>{UTCtoFriendly(news.updated)}</Item.Extra>
    
            
        <Button icon='write' size="small"/><Button size="small" icon='minus circle' />
     
      </Item.Content>
    </Item>

    ))

    return(
      <div style={{maxWidth: 800}}>
        <Item.Group>
          {contentFeed}
       </Item.Group>
       </div>
    )
}))