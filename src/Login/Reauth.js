import React from "react"
import { Form, Divider,  } from "semantic-ui-react"
import {PillButton} from "../SharedUI/PillButton"
export const Reauth = (props) => {
    const goRegister = () => { props.register() }
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
          <PillButton iconName="google" label="Login with G-Suite" />
          <PillButton iconName="mail" label="Login with Email" />
        </Form>
      </div>
      <span className="inviteCode"
        onClick={e => goRegister()}
        style={{ marginTop: 10, marginLeft: 5, color: "#FFFFFF" }}
      >
        Did your organizaiton send you an invite code?
      </span>
    </div>

    <div />
  </React.Fragment>
    )}
