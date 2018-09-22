import React from "react";
import "./style.css";
import { Form, Icon, Table, Segment, Header, List } from "semantic-ui-react";

export class Classes extends React.Component {
    
    render() {
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="User Classes"
          subheader="Create and manage user classes for tiered access to policies"
        />

        <Segment>
          <Header as="h3" content="Add New" />
          <Form>
            <Form.Group inline widths="equal" style={{ paddingRight: 10 }}>
              <Form.Input
                fluid
                label="Label"
                placeholder="Director"
              />

              <Form.Select fluid label="Extends Class (optional)" placeholder="Management" />
              <Form.Button style={{ marginTop: 24 }} icon="plus" />
            </Form.Group>
            <Form.Group />
          </Form>
          <List>
              
    <List.Item>
      <List.Icon color="blue" name='circle' />
      <List.Content>
        <List.Header>Employee</List.Header>
     </List.Content>
     </List.Item>
     <List.Item>
      <List.Icon color="blue" name='circle' />
      <List.Content>
        <List.Header>Management</List.Header>
     </List.Content>
     </List.Item>
       
   
  </List>
         
        </Segment>
       
      </div>
    );
  }
}
