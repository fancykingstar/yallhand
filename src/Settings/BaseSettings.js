import React from "react";
import { Header, Segment, Form, Button, Icon } from "semantic-ui-react";

export const BaseSettings = () => {
  return (
    <div style={{ padding: 15, maxWidth: 900 }}>
      <Header
        as="h2"
        content="Account Settings"
        subheader="Settings for your Hypersbase account"
      />
      <Segment>
        <div style={{ width: 400 }}>
          <Form>
            <Form.Field>
              <label>Company Name</label>
              <input placeholder="something" />
            </Form.Field>
            <Form.Field>
              <label>Company Logo</label>
              <span style={{fontSize: '.7em'}}>current: LOGO12.png</span><br/>
              <Form.Button icon labelPosition="left" size="small">
                <Icon size="small" name="upload" /> Upload
                <input hidden id="upload" multiple type="file" />
              </Form.Button>
            </Form.Field>
            <Form.Field>
              <label>Primary Account Contact</label>
              <Form.Select placeholder="something" />
            </Form.Field>
            <Button primary type='submit'>Update</Button>
          </Form>
        </div>
      </Segment>
      <br/>
      <Segment>
          <Form>
              <Form.Field>
                  <label>Delete Your Quadrance Account</label>
                  <Form.Button size="mini" negative>Delete</Form.Button>
              </Form.Field>
          </Form>
      </Segment>
    </div>
  );
};
