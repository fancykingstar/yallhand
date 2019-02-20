import React from "react"
import { Form, Divider,  } from "semantic-ui-react"
import {PillButton} from "../SharedUI/PillButton"
export const Register = (props) => {
    const continues = () => { props.continues() }
    return (
  <React.Fragment>
    <div className="ContainerLogin">
      <div className="Login">
        <div className="LoginWorkspace">
          <div
            className="WorkspaceLogoLogin"
            style={{
              backgroundImage: `url(https://quadrance-files.s3.amazonaws.com/central/A1_15e5d752-3c8d-441e-8f49-46253a0eb1a8.png)`
            }}
          />{" "}
          <div className="WorkspaceNameLogin">company</div>
          <div id="ERM" className="ERM">
            Employee Relationship Management
          </div>
        </div>

        <Divider />
        <Form>
           <Form.Input label="Invite Code"/>  
          <PillButton iconName="google" label="Register with G-Suite" onClick={e => continues(e)} />
          <PillButton iconName="mail" label="Register with Email" onClick={e => continues(e)} />
        </Form>
      </div>
      {/* <p
        onClick={e => continues()}
        style={{ marginTop: 10, marginLeft: 5, color: "#FFFFFF" }}
      >
        Did your organizaiton send you an invite code?
      </p> */}
    </div>

    <div />
  </React.Fragment>
    )}
