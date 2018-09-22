import React from "react";
import "./style.css";
import {
  Button,
  Icon,
  Table,
  Segment,
  Header,
  Form,
  Popup
} from "semantic-ui-react";

export class InviteAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClick = () => this.setState({ active: !this.state.active });
  render() {
    const { active } = this.state;
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Invite Admin Collaborators"
          subheader="Send invite(s) to admin to generate and manage information"
        />

        <Segment>
          <Header as="h3" content="Create Invite" />

          <Form>
            <Form.Group inline widths="equal" style={{ paddingRight: 10 }}>
              <Form.Input
                fluid
                label="Email"
                placeholder="jane@placethatwework.co"
              />

              <Form.Select
                fluid
                label="Team(s) Access"
                placeholder="dropdown"
              />
              <Form.Select
                fluid
                label="Channel(s) Access"
                placeholder="dropdown"
              />
              <Form.Select fluid label="Class" placeholder="dropdown" />
              <Form.Button style={{ marginTop: 24 }} icon="plus" />
            </Form.Group>
            <Form.Group widths="equal">
              <Popup
                trigger={
                  <Form.Radio
                    toggle
                    active={active}
                    onClick={this.handleClick}
                    label="All Access"
                  />
                }
                content="Complete account access to all teams, channels, users, and settings"
              />
            </Form.Group>
          </Form>

          <Header as="h3" content="Queue" />

          <Table style={{ maxWidth: 850 }} basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Team(s) Access</Table.HeaderCell>
                <Table.HeaderCell>Channel(s) Access</Table.HeaderCell>
                <Table.HeaderCell>Class</Table.HeaderCell>

                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>John@thiscompany.com</Table.Cell>
                <Table.Cell>All</Table.Cell>
                <Table.Cell>All</Table.Cell>
                <Table.Cell>n/a</Table.Cell>

                <Table.HeaderCell>
                  <Icon name="minus circle" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Body>
          </Table>

          <div style={{ paddingTop: 15 }}>
            <Button icon labelPosition="left" circular size="small">
              <Icon name="send" />
              Send
            </Button>
          </div>
        </Segment>
      </div>
    );
  }
}
