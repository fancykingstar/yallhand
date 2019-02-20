import React from "react";
import { Form, Divider, Header, Button } from "semantic-ui-react";
import { InfoPopUp } from "../SharedUI/InfoPopUp.js";

export const ProfileInfo = props => {
  return (
    <React.Fragment>
      <div className="ContainerLogin">
        <div className="Login">
          <Header as="h2">Register your account</Header>
          <Divider />
          <Form>
            <Form.Input label="Full Name">
              {" "}
              <input maxLength="32" />{" "}
            </Form.Input>
            <Form.Input icon="user circle outline"
              label={
                <span style={{color: "#000000"}}>
                  Display Name
                  <InfoPopUp content="Short name or nickname" />
                </span>
              }
            >
              {" "}
              <input maxLength="16" />{" "}
            </Form.Input>
            <Form.Input icon="phone" label="mobile"/>
            <Form.Input icon="mail" label="email"/>
            <Form.Input icon="key" type="password" label="password"/>
            <Form.Input icon="key" type="password" label="pasword confirm"/>
            <Form.Button primary>Continue</Form.Button>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
};
