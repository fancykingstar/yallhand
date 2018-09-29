import React from "react";
import "./style.css";
import { Form, Icon, Table } from "semantic-ui-react";
import { conditions } from "./TempObjects";

export class ConditionList extends React.Component {
  render() {
    const conditionList = conditions.map(cond => (
      <Table.Row key={cond.label}>
        <Table.Cell>{cond.label}</Table.Cell>
        <Table.Cell textAlign="center">
          <Icon name="minus circle" />
        </Table.Cell>
      </Table.Row>
    ));
    return (
      <div className="TopSpace">
        <Table basic="very" fluid="true">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Form.Input
                  fluid
                  label="Condition"
                  placeholder="If/for something..."
                  size="small"
                />
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                <Form.Button
                  primary
                  content="Add"
                  style={{ marginTop: 20 }}
                  size="small"
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body style={{ fontWeight: 200 }}>{conditionList}</Table.Body>
        </Table>
      </div>
    );
  }
}
