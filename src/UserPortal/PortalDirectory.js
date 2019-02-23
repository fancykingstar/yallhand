import React from "react";
import { AccountStore } from "../Stores/AccountStore";
import { Card, Image, Button, Icon, Modal } from "semantic-ui-react";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";

export const PortalDirectory = () => {

  const cardMeta = (user) => {
    let meta = []
    user.profile.Department === ""? null : meta.push(<Card.Meta key={giveMeKey()} ><a style={{color: "#17b0e4"}} href={`mailto:${user.email}`}><Icon name="mail"/> {user.email}</a></Card.Meta>)
    user.profile.Department === ""? null : meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="map marker alternate"/> {user.profile.Location}</Card.Meta>)
    user.profile.Department === ""? null : meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="phone"/>  {user.profile["Phone or Extension"]}</Card.Meta>)
    user.profile.Department === ""? null : meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="mobile alternate"/> {user.profile.Mobile}</Card.Meta>)
    return meta
}

  const socials = (user) => {
      let socials = []
      user.profile.Twitter === ""? null : socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://twitter.com/${user.profile.Twitter}`}><Icon key={giveMeKey()} name="twitter"/>Twitter</a></p>)
      user.profile.Medium === ""? null : socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://medium.com/@${user.profile.Medium}`}><Icon key={giveMeKey()} name="medium"/>Medium</a></p>)
      user.profile.Github === ""? null : socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://github.com/${user.profile.Twitter}`}><Icon key={giveMeKey()} name="github"/>Github</a></p>)
      user.profile.LinkedIn === ""? null : socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://linkedin.com/${user.profile.LinkedIn}`}><Icon key={giveMeKey()} name="linkedin"/>LinkedIn</a></p>)
      return socials
    }

  const users = AccountStore.allUsers.map(user => (
    <Card key={"staffDir" + giveMeKey()}>
      <Card.Content>
        <Image floated="right" size="mini" src={user.img} />
        <Card.Header>{user.displayName}</Card.Header>
        <Card.Meta>{user.profile.Title}</Card.Meta>
        <Card.Description>{user.profile["About Me"]}</Card.Description>
      </Card.Content>
      <Card.Content>
            {cardMeta(user)}
      </Card.Content>
      <Card.Content extra>
      {socials.length === 0? null :
    
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

  return <Card.Group>{users}</Card.Group>;
};
