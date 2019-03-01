import React from "react"
import {inject, observer} from "mobx-react"
import { Item, Icon, Label} from "semantic-ui-react";
import {adminsAbrev} from "../SharedCalculations/AdminsAbbrev"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"



export const FeedItem = inject("AccountStore")(observer((props) => {
    const {AccountStore} = props
    const adminsList = props.data.admins.length > 3 ? adminsAbrev(props.data.admins) : props.data.admins
    const adminLabels = adminsList.map(admin => <Label key={AccountStore._getDisplayName(admin)} color='blue' horizontal>{AccountStore._getDisplayName(admin)}</Label> )   

    return(
    <Item style={{paddingBottom: 25}} onClick={e => props.clicked(props.data.anncID)}>
      <Item.Content>
        <Item.Header as='a'>{props.data.label}</Item.Header>
        <Item.Meta>Updated: {UTCtoFriendly(props.data.updated)} <Icon name="check circle" color='green'/></Item.Meta>
        <Item.Meta>

        </Item.Meta>

          {props.data.img.length !== 0 ? <Item.Image size="small" src={props.data.img}/> : null}
            
        <Item.Extra></Item.Extra>
        <Item.Extra>
          
          {adminLabels}</Item.Extra>
        
        {/* <Button icon='write' size="small"/><Button size="small" icon='minus circle' /> */}
     
      </Item.Content>
    </Item>)

}))