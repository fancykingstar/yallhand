import React from "react";
import {inject, observer} from "mobx-react"
import { Form, Button } from "semantic-ui-react";

@inject("TeamStore")
@observer
export class PostControls extends React.Component {
  render() {
    const {TeamStore} = this.props
    const teamList = TeamStore.structure.map(team => ({'key': team.teamID, 'value': team.teamID, 'text': team.label}) )
    teamList.unshift({'key': 'global', 'value': '', 'text': 'Global (all teams)'})
    const classList = TeamStore.classes.map(clas => ({'key': clas.classID, 'value': clas.classID, 'text': clas.label}) )
    return (
      <div className="Form">
      <div style={{paddingBottom: 5}}>
        <h4>Configure Audience</h4>
      </div>
      <Form>
        <Form.Group>
        <Form.Dropdown
      label="Teams"
        placeholder="Teams"
        fluid
        search
        selection
        options={teamList}
        defaultValue={''}
      
        style={{ width: 350 }}
      />
      <Form.Dropdown
      label="Classes (optional)"
        placeholder="classes"
        fluid
        search
        selection
        options={classList}
        style={{ width: 350 }}
      />
       <Button

      color='secondary'
      content='Upload Image'
      icon='image'
    />
        </Form.Group>
      </Form>
      
    </div>
    );
  }
}
