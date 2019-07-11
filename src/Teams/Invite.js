import React, {useState} from 'react';
import {Button, Segment, Form} from "semantic-ui-react"
import { UserInvite } from './UserInvite';
import { isValidEmail } from "../SharedValidations/InputValidations";

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

  const handleClick = () => {
    setuserInvites([...userInvites, userObj])
  }

  const updateFields = (fieldObj, id) => {
    let userList = userInvites
    userList[id].email = fieldObj.email
    setuserInvites(userList)
  }

  const displayUserInvites = () => {
    return userInvites.map((invite, index) => {
      return <UserInvite info={invite} key={index} id={index} updateFields={updateFields}/>
    })
  }
  
  const checkMail =  () => {
    console.log(userInvites)
    // return !isValidEmail(props.email)
    userInvites.forEach(userInvite => {
      console.log(!isValidEmail(userInvite.email))
    })
  }

  checkMail()
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
      {/* <div style={{paddingTop: 20}}>
          <Form.Group inline>
            <Form.Button size="small" onClick={e => this.onboard()} content="Onboard Now" icon="street view" primary disabled={checkMail()}/>
          </Form.Group>
        </div> */}
    </div>
  )
} 