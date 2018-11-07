import React from "react";
import { Header, Segment, Form, Button} from "semantic-ui-react";

export const UserSettings = () => {
  const timezones = require('../TemplateData/timezones.json')
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
              <label>Display Name</label>
              <input placeholder="Steven Tylerico" />
            </Form.Field>
           
            <Button primary type='submit'>Update</Button>
          </Form>
        </div>
      </Segment>
      <br/>
  <Segment>
    <Form>
      <Form.Field>
        <Form.Select label="Preferred Timezone" options={timezones}/>
      </Form.Field>
    </Form>
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
