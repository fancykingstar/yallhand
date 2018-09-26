import React from 'react'
import { Item, Image, Button, Icon} from "semantic-ui-react";

export const Feed = (props) => { 
    return(
        <Item.Group>
    <Item>
     

      <Item.Content>
        <Item.Header as='a'>Header</Item.Header>
        <Item.Meta>Description</Item.Meta>
        <Item.Description>
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        </Item.Description>
        <Item.Extra>
            
        <Button icon='write' size="small"/><Button size="small" icon='minus circle' />
        </Item.Extra>
      </Item.Content>
    </Item>

    <Item>
      

      <Item.Content>
        <Item.Header as='a'>Header</Item.Header>
        <Item.Meta>Description</Item.Meta>
        <Item.Description>
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        </Item.Description>
        <Item.Extra><Button icon='write' size="small"/><Button size="small" icon='minus circle' /></Item.Extra>
      </Item.Content>
    </Item>
  </Item.Group>
    )
}