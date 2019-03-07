import React from "react";
import { QLogo } from "../Assets/Graphics/QLogo";
import { Divider, Grid, Message } from "semantic-ui-react";
import {Reauth} from "./Reauth"
import { EmailLogin } from "./EmailLogin";
import { Register } from "./Register"

export class PrimaryLogins extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      code: props.code ? props.code : '',
      errorMsg: false
    }
  }

  render() {
    const { code, errorMsg } = this.state
    const { stage, next } = this.props

    const stages = {
      "reauth": <Reauth next={(...args) => next(...args)}/>,
      "reauthEmail": <EmailLogin/>,
      "register": <Register code={code} next={(...args) => next(...args)} setError={(e) => this.setState({errorMsg: e})}/>
    }

    const loginDisplay = stages[this.props.stage]

    return (
      <React.Fragment>
        <div className="ContainerLogin">
          <div className="Login">
            <div className="LoginWorkspace">
              <div style={{width: "100%", textAlign: "center"}}><QLogo fill="#797777" style="" width="48px" height="60px" /></div>
              <div style={{width: "100%"}}>
                <Grid.Column width={13}>
                  <div style={{lineHeight: "48px", textAlign: "center", fontSize: "2.8em"}} >
                    yallhands
                  </div>
                </Grid.Column>
              </div>
            </div>
            <div className="ERM">Employee Relationship Management</div>
            <Divider />
            {loginDisplay}
          </div>
          {stage && <span className="inviteCode" onClick={e => alert("hi")} style={{marginTop: 10, marginLeft: 5, color: "#FFFFFF"}}>
            Did your organizaiton send you an invite code?
          </span>}
          {errorMsg && <Message  icon="warning"  content={errorMsg} negative/>}
        </div>
      </React.Fragment>
    );
  }
}
