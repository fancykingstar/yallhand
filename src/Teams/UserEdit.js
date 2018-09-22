import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form } from "semantic-ui-react";

export class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  render() {
    const userProfile = this.props.profileData;

    return (
      <Modal open={this.props.open} onClose={this.props.close} size="small">
        <Header icon="user" content="Edit User" />
        <Modal.Content>
          <Form size="small">
              <Form.Field>
                  <Form.Input label="First Name" value={userProfile.first_name}/>
                  <Form.Input label="Last Name" value={userProfile.last_name}/>
                  <Form.Input label="Email" value={userProfile.email}/>
                  <Form.Select label="Team(s)"/>
                  <Form.Select label="Channel(s)"/>
                  <Form.Select label="Class"/>
                  <Form.Radio toggle label="Super Admin"/>
              </Form.Field>
              
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Modal
            size="small"
            trigger={
              <div style={{ float: "left" }}>
                {" "}
                <Button negative>Delete User</Button>
              </div>
            }
          >
            <Modal.Content>
              Are you positive you want to delete this user?
            </Modal.Content>
            <Modal.Actions>
              <Button
                icon="remove user"
                negative
                content="Confirm"
                onClick={this.close}
              />
            </Modal.Actions>
          </Modal>

          <Button secondary>Cancel</Button>

          <Button primary content="Update" />
        </Modal.Actions>
      </Modal>
    );
  }
}
