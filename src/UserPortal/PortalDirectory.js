import React from "react";
import { AccountStore } from "../Stores/AccountStore";
import { Card, Image, Button, Icon, Modal } from "semantic-ui-react";
import { getDefaultUserImg } from "../SharedCalculations/GetDefaultUserImg"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import "./style.css"

export const PortalDirectory = () => {

  const cardMeta = (user) => {
    let meta = []
    if(user.profile.Department !== "" && user.profile.Department !== undefined) {meta.push(<Card.Meta key={giveMeKey()} ><a style={{color: "#17b0e4"}} href={`mailto:${user.email}`}><Icon name="mail"/> {user.email}</a></Card.Meta>)}
    if(user.profile.Location !== "" && user.profile.Location !== undefined) {meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="map marker alternate"/> {user.profile.Location}</Card.Meta>)}
    if(user.profile["Phone or Extension"] !== "" && user.profile["Phone or Extension"] !== undefined) {meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="phone"/>  {user.profile["Phone or Extension"]}</Card.Meta>)}
    if(user.profile.Mobile !== "" && user.profile.Mobile !== undefined) {meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="mobile alternate"/> {user.profile.Mobile}</Card.Meta>)}
    return meta
}

  const socials = (user) => {
      let socials = []
      if(user.profile.Twitter !== "" && user.profile.Twitter !== undefined) {socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://twitter.com/${user.profile.Twitter}`} target="_blank"><Icon key={giveMeKey()} name="twitter"/>Twitter</a></p>)}
      if(user.profile.Medium !== "" && user.profile.Medium !== undefined) {socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://medium.com/@${user.profile.Medium}`} target="_blank"><Icon key={giveMeKey()} name="medium"/>Medium</a></p>)}
      if(user.profile.Github !== "" && user.profile.Github !== undefined) {socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://github.com/${user.profile.Twitter}`} target="_blank"><Icon key={giveMeKey()} name="github"/>Github</a></p>)}
      if(user.profile.LinkedIn !== "" && user.profile.LinkedIn !== undefined) {socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://linkedin.com/${user.profile.LinkedIn}`} target="_blank"><Icon key={giveMeKey()} name="linkedin"/>LinkedIn</a></p>)}
      return socials
    }

  const users = AccountStore._allActiveUsers.map(user => (
    <Card centered key={"staffDir" + giveMeKey()}>

      <Card.Content>

      <Modal closeIcon trigger={
      <Image
        src={user.img !== ""? user.img : getDefaultUserImg(user.userID)}
        size="mini"
        floated="right"
      />} basic size="small" >
    <Modal.Content> <Image src={user.img !== ""? user.img : getDefaultUserImg(user.userID)} fluid /> </Modal.Content>
    </Modal>

        <Card.Header>{user.displayName}</Card.Header>
        <Card.Meta>{user.profile.Title}</Card.Meta>
        <Card.Description>{user.profile["About Me"]}</Card.Description>
      </Card.Content>
      <Card.Content>
            {cardMeta(user)}
      </Card.Content>
      <Card.Content extra>
      {socials(user).length === 0 ? null :
    
        <Modal size="mini" closeIcon trigger={<Button basic>
            More...
        </Button>}>
        <Modal.Header>{user.displayName}</Modal.Header>
        <Modal.Content>
        <Modal.Description>
                {socials(user)}
        </Modal.Description>
        </Modal.Content>
        </Modal>

    }
          

      </Card.Content>
    </Card>
  ));

  return (
    <div style={users.length > 0? {paddingBottom: 120} : null }>
    <Card.Group>{users}</Card.Group>
    </div>
  );
};
