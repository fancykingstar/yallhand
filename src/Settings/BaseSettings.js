import React from "react";
import { Header, Segment, Form, Button, Icon } from "semantic-ui-react";

export const BaseSettings = () => {
  const timezones = require('../TemplateData/timezones.json')
  return (
    <div style={{ padding: 15, maxWidth: 900 }}>
      <Header
        as="h2"
        content="Account Settings"
        subheader="Settings for your Quadrance account"
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
              <label>Alerts</label>
              <Form.Checkbox fluid label="Aging asset alert (12 months)" checked='true'/>
              <Form.Checkbox fluid label="Authorized users inactive (90 days)" checked='true'/>
              <Form.Checkbox fluid label="Broken URLs" checked='true'/>
          </Form.Field>
      </Form>
  </Segment>
  <br/>
  <Segment>
    <Form>
      <Form.Field>
        <Form.Select label="Timezone" options={timezones}/>
      </Form.Field>
    </Form>
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
