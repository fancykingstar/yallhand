import React from 'react';
import {Button, Segment, Form} from "semantic-ui-react"
import { UserInvite } from './UserInvite';
import { isValidEmail } from "../SharedValidations/InputValidations";

export class Invite extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      userInvites: [this.reset()]
    }
  }

  reset () {
    return {
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
      
    };
  }

  handleClick = () => {
    this.setState({ userInvites: [...this.state.userInvites, this.reset()]})
  }

  updateFields = (fieldObj, id) => {
    let userList = this.state.userInvites
    userList[id].email = fieldObj.email
    this.setState({userInvites: userList})
  }

  displayUserInvites = () => {
    return this.state.userInvites.map((invite, index) => {
      return <UserInvite info={invite} key={index} id={index} updateFields={this.updateFields}/>
    })
  }
  
  checkMail = () =>  {
    return this.state.userInvites.some(userInvite => {
      return !isValidEmail(userInvite.email)
    })
  }

  render() {
    return(
      <div className="Segment">
        <Segment>
          {this.displayUserInvites()}
          <Button onClick={this.handleClick}> + </Button>
          <div style={{paddingTop: 20}}>
            <Form.Group inline>
              <Form.Button size="small" content="Onboard Now" icon="street view" primary disabled={this.checkMail()}/>
            </Form.Group>
          </div>
        </Segment>
      </div>
    )
  }
} 