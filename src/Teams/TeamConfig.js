import React from "react";
import {inject, observer} from "mobx-react"
import "./style.css";
import { Form, Segment, Header, List } from "semantic-ui-react";
import {ListTree} from "../SharedUI/BuildTree"

@inject("TeamStore")
@observer
export class TeamConfig extends React.Component {
    constructor(props) {
      super(props)
    }
    render() {
    const {TeamStore} = this.props
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
        
      <ListTree data={TeamStore.structure} id="teamID"/>
         
         
        </Segment>
       
      </div>
    );
  }
}
