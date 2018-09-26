import React from "react";
import "./style.css";
import { Form, Icon, Table, Segment, Header, Button } from "semantic-ui-react";
import { PillButton } from "../SharedUI/PillButton";

export class InviteUser extends React.Component {
  render() {
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Invite Users"
          subheader="Send invite(s) to end users across your organization"
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
              <Form.Select fluid label="Team" placeholder="dropdown" />
              <Form.Select fluid label="Class" placeholder="dropdown" />
              <Form.Button style={{ marginTop: 24 }} icon="plus" />
            </Form.Group>
            <Form.Group />
          </Form>

          <Header as="h3" content="Queue" />

          <Table style={{ maxWidth: 850 }} basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Team</Table.HeaderCell>
                <Table.HeaderCell>Class</Table.HeaderCell>

                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>John</Table.Cell>
                <Table.Cell>Approved</Table.Cell>
                <Table.Cell>None</Table.Cell>

                <Table.HeaderCell>
                  <Icon name="minus circle" />
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Jamie</Table.Cell>
                <Table.Cell>Approved</Table.Cell>
                <Table.Cell>None</Table.Cell>

                <Table.HeaderCell>
                  <Icon name="minus circle" />
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Jill</Table.Cell>
                <Table.Cell>Denied</Table.Cell>
                <Table.Cell>None</Table.Cell>

                <Table.HeaderCell>
                  <Icon name="minus circle" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Body>
          </Table>

          <PillButton iconName="send" label="Send"/>
        </Segment>
        {/* <Table.Body style={{ fontWeight: 200 }}>{displayLinks}</Table.Body> */}
      </div>
    );
  }
}
