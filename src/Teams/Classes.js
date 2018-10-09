import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import { Form, Segment, Header, List } from "semantic-ui-react";
import {ListTree} from "../SharedUI/BuildTree"

@inject("TeamStore")
@observer
export class Classes extends React.Component {
    constructor(props) {
      super(props)
    }
    render() {
    const {TeamStore} = this.props
    console.log(TeamStore.classes)
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
      
        <ListTree data={TeamStore.classes} id="classID"/>

        </Segment>
       
      </div>
    );
  }
}
