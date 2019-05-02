import React from "react";
import {
  Icon,
  Table,
  Segment,
  Header
} from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import UTCtoFriendly from "../../SharedCalculations/UTCtoFriendly";
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";
import { getContentObj } from "../../SharedCalculations/GetContentObj"


export class BundleContent extends React.Component {

  render() {

    const arrange = val => {
      return this.props.input.length > 1 ? (
        <React.Fragment>
          <Table.HeaderCell>
            <Icon name="arrow up" onClick={e => this.props.moveUp(val)} />
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Icon name="arrow down" onClick={e => this.props.moveDown(val)} />
          </Table.HeaderCell>
        </React.Fragment>
      ) : null;
    };
    const content = this.props.input.map(item => (
      <Table.Row key={"bundlecontent" + giveMeKey()}>
        <Table.Cell>
          {Object.keys(item)[0] === "policyID" ? "FAQ" : "Announcement"}
        </Table.Cell>
        <Table.Cell>{getContentObj(item).label}</Table.Cell>
        <Table.Cell>{UTCtoFriendly(getContentObj(item).updated)}</Table.Cell>
        {arrange(item)}
        <Table.HeaderCell>
          <Icon name="remove" onClick={e => this.props.remove(item)} />
        </Table.HeaderCell>
      </Table.Row>
    ));

    return (
      <Segment>
        <Header>Selected Content</Header>
        <Table style={{ maxWidth: 850 }} basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Last Updated</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{content}</Table.Body>
        </Table>

      </Segment>
    );
  }
}
