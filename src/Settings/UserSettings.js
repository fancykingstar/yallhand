import React from "react";
import { Header, Segment, Form, Button} from "semantic-ui-react";

export const UserSettings = () => {
  return (
    <div style={{ padding: 15, maxWidth: 900 }}>
      <Header
        as="h2"
        content="Your Profile Settings"
        subheader="Settings for your personal Quadrance account"
      />
      <Segment>
        <div style={{ maxWidth: 400 }}>
          <Form>
            <Form.Field>
              <label>First Name</label>
              <input placeholder="Steven" />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input placeholder="Tylerico" />
            </Form.Field>
           
            <Button primary type='submit'>Update</Button>
          </Form>
        </div>
      </Segment>
  
      <br/>
      <Segment>
          <Form>
              <Form.Field>
                  <label>Deactivate Account</label>
                  <Form.Button size="mini" negative>Deactivate</Form.Button>
              </Form.Field>
          </Form>
      </Segment>
    </div>
  );
};
