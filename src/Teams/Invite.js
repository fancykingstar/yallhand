import React, {useState} from 'react';
import {Button, Segment} from "semantic-ui-react"
import { UserInvite } from './UserInvite';


export const Invite = () => {
  const userObj  = {
    teamID: "global",
      teamName: "global",
      tagID: "none",
      adminConfig: "all",
      adminTeamID: "global",
      adminTagID: "none",
      date: "",
      email: "",
      boss: "",
      isAdmin: false,
      dropdown: "today",
  }
  const [userInvites, setuserInvites] = useState([userObj])
  // console.log(userInvites)
  // const reset = () => {
  //   return {
  //     teamID: "global",
  //     teamName: "global",
  //     tagID: "none",
  //     adminConfig: "all",
  //     adminTeamID: "global",
  //     adminTagID: "none",
  //     date: "",
  //     email: "",
  //     boss: "",
  //     isAdmin: false,
  //     dropdown: "today",
  //   };
  // }
  
  const handleClick = () => {
    console.log('hi')
    setuserInvites([...userInvites, userObj])
  }

  const displayUserInvites = () => {
    return userInvites.map(invite => {
      console.log('invite', invite)
      return <UserInvite info={invite}/>
    })
  }
  
  // const addUserFormField = () => {
  //   return <UserInvite/>
  // }
  return(
    <div className="Segment">
      <Segment>
      {/* {isAdmin ?
          <Header as="h2" style={{padding: 0, margin: 0}} content="Onboard Admin Collaborators" subheader="Send invite to admin to generate and manage information"/> :
          <Header as="h2" style={{padding: 0, margin: 0}} content="Onboard Users" subheader="Send invite for new user to join organization"/>} */}
        {/* <UserInvite/> */}
        {/* {addUserFormField()} */}
        {displayUserInvites()}
        <Button onClick={handleClick}> + </Button>
      </Segment>
    </div>
  )
} 