import React from "react";
import { QLogo } from "../Assets/Graphics/QLogo";
import { Divider, Grid, Message } from "semantic-ui-react";
import Reauth from "./Reauth"
import { EmailLogin } from "./EmailLogin";
import { Register } from "./Register"
import { withRouter } from "react-router-dom";

class PrimaryLogins extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      code: props.code ? props.code : '',
      errorMsg: false,
      stage: props.stage
    }
  }

  render() {
    const style = {marginTop: 10, marginLeft: 5, color: "#FFFFFF"}
    const { code, stage, errorMsg } = this.state
    const { next } = this.props

    const stages = {
      "reauth": <Reauth next={(...args) => next(...args)}/>,
      "reauthEmail": <EmailLogin/>,
      "register": <Register code={code} next={(...args) => next(...args)} setError={(e) => this.setState({errorMsg: e})}/>
    }

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
            {stages[stage]}
          </div>
          {stage === 'reauth' && <span className="btn inviteCode" onClick={e => this.setState({stage: 'register'})} style={style}>
            Did your organizaiton send you an invite code?
          </span>}
          {stage === 'register' && <span className="btn inviteCode" onClick={e => this.setState({stage: 'reauth'})} style={style}>
            Already have an account?
          </span>}
          {errorMsg && <Message  icon="warning"  content={errorMsg} negative/>}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(PrimaryLogins)