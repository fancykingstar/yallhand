import React from "react";
import "./style.css";
import { Form, Segment, Header, List } from "semantic-ui-react";

export class TeamConfig extends React.Component {
    
    render() {
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Team Structure"
          subheader="Design and group your teams and subteams"
        />

        <Segment>
          <Header as="h3" content="Add New" />
          <Form>
            <Form.Group inline widths="equal" style={{ paddingRight: 10 }}>
              <Form.Input
                fluid
                label="Label"
                placeholder="Massachusetts"
              />

              <Form.Select fluid label="Subteam Of (optional)" placeholder="Northeast" />
              <Form.Button style={{ marginTop: 24 }} icon="plus" />
            </Form.Group>
            <Form.Group />
          </Form>
          <List>
              
    <List.Item>
      <List.Icon color="blue" name='circle' />
      <List.Content>
        <List.Header>USA</List.Header>
       
        <List.List>
          <List.Item>
            <List.Icon color="blue" name='triangle right' />
            <List.Content>
              <List.Header>California</List.Header>
             
    
             
              <List.List>
                <List.Item>
                  <List.Icon color="blue" name='triangle right' />
                  <List.Content>
                    <List.Header>San Diego</List.Header>
                   
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon color="blue" name='triangle right' />
                  <List.Content>
                    <List.Header>Santa Monica</List.Header>

                     </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon color="blue" name='triangle right' />
                  <List.Content>
                    <List.Header>San Francisco</List.Header>
                    
                  </List.Content>
                </List.Item>
              </List.List>
            </List.Content>
          </List.Item>
        </List.List>
      </List.Content>
    </List.Item>
  </List>
         
        </Segment>
       
      </div>
    );
  }
}
