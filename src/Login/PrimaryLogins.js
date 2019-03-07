import React from "react";
import { QLogo } from "../Assets/Graphics/QLogo";
import { Divider, Grid, Message } from "semantic-ui-react";
import {Reauth} from "./Reauth"
import { EmailLogin } from "./EmailLogin";
import { Register } from "./Register"

export class PrimaryLogins extends React.Component {
    constructor(props){
        super(props)
        this.state = {errorMsg: true}
    }
  render() {
    
    const messages =  this.state.errorMsg?
        <Message 
        icon="warning" 
        content="Sorry, that invite code is invalid"
        negative/> : null


    const inviteCodeLink = this.props.stage !== "reauth"? <div/> :
      <span
        className="inviteCode"
        onClick={e => alert("hi")}
        style={{ marginTop: 10, marginLeft: 5, color: "#FFFFFF" }}
      >
        Did your organizaiton send you an invite code?
      </span>


    const stages = {"reauth":<Reauth/>, "reauthEmail": <EmailLogin/>, "register": <Register/>}
           

    const loginDisplay = stages[this.props.stage]

    return (
      <React.Fragment>
        <div className="ContainerLogin">
          <div className="Login">
            <div className="LoginWorkspace">
                <div style={{width: "100%", textAlign: "center"}}><QLogo fill="#797777" style="" width="48px" height="60px" /></div>
                <div style={{width: "100%"}}><Grid.Column width={13}><div style={{ lineHeight: "48px", textAlign: "center" ,fontSize: "2.8em" }} >yallhands</div> </Grid.Column></div>
            </div>
            <div className="ERM">Employee Relationship Management</div>
            <Divider />
            {loginDisplay}
          </div>
          {inviteCodeLink}
          {messages}
        </div>
        <div />
      </React.Fragment>
    );
  }
}
