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
    userInvites.forEach(userInvite => {
      console.log(!isValidEmail(userInvite.email))
      if(isValidEmail(userInvite.email)) {
        return false
      }
      return true
    })
  }

  // onboard = async(later = false) => {
  //   const {AccountStore} = this.props;
  //   let newUser = this.getDataNewUser()
  //   newUser.now = !later
  //   if (later) {
  //     newUser.date = moment(this.state.date).valueOf();
  //     newUser.now = false;
  //   }
  //   await apiCall('validations', 'POST', newUser).then((res) => res.json()).then(res => {
  //     console.log(res)
  //     if(later) createSchedule(schedule(newUser.date, 'onboard user', {id: res.id}))
  //     else res.error ? this.error(res) : this.success()
  //   })
  //   await users(AccountStore.account.accountID)
  //   this.setState(this.reset());
  // }

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
        <div style={{paddingTop: 20}}>
          <Form.Group inline>
            <Form.Button size="small" content="Onboard Now" icon="street view" primary disabled={checkMail()}/>
          </Form.Group>
        </div>
      </Segment>
      {/* <div style={{paddingTop: 20}}>
        <Form.Group inline>
          <Form.Button size="small" onClick={e => this.onboard()} content="Onboard Now" icon="street view" primary disabled={checkMail()}/>
        </Form.Group>
      </div> */}
    </div>
  )
} 