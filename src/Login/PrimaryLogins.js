import React from "react";
import { QLogo } from "../Assets/Graphics/QLogo";
import { Divider, Grid, Message } from "semantic-ui-react";
import { Col, Row, Container} from "reactstrap";
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
              <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}> <QLogo blue width="200"/> </div> </div>
            <div className="ERM">Employee Relationship Management</div>
            <Divider />
            {stages[stage]}
          </div>
          {stage === 'reauth' && <span className="btn inviteCode" onClick={e => this.setState({stage: 'register'})} style={style}>
            Did your organization send you an invite code?
          </span>}
          {stage === 'register' && <span className="btn inviteCode" onClick={e => this.setState({stage: 'reauth'})} style={style}>
            Already have an account?
          </span>}
          {errorMsg && <div style={{maxWidth: 350, paddingTop: 10}}><Message icon="warning" content={errorMsg} negative/></div>}

        </div>
        
      </React.Fragment>
    );
  }
}

export default withRouter(PrimaryLogins)