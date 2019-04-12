import React from "react"
import {inject, observer} from "mobx-react"
import { Item, Icon, Label, Divider} from "semantic-ui-react";
import {adminsAbrev} from "../SharedCalculations/AdminsAbbrev"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"



export const FeedItem = inject("AccountStore", "UIStore")(observer((props) => {
    const {AccountStore, UIStore} = props
    if(!props.data.admins) return <div/>
    const adminsList = props.data.admins.length > 3 ? adminsAbrev(props.data.admins) : props.data.admins
    const adminLabels = adminsList.map(admin => <Label key={AccountStore._getDisplayName(admin)} color='blue' horizontal>{AccountStore._getDisplayName(admin)}</Label> )   

    return(
      <React.Fragment>
      <Item style={{paddingBottom: 10}} onClick={e => props.clicked(props.data.announcementID)}>
      {props.data.img.length !== 0 ? <Item.Image size="small" src={props.data.img}/> : null}
      <Item.Content style={UIStore.responsive.isMobile? {textAlign: "center"} : null} >
        <Item.Header>{props.data.label}</Item.Header>
             <Item.Meta>Updated: {UTCtoFriendly(props.data.updated)}</Item.Meta>
         <Item.Extra> {adminLabels}</Item.Extra>
        </Item.Content>
    </Item>
     <Divider/>
   </React.Fragment>
    )

}))