import React from "react";
import { inject, observer } from "mobx-react";
import { Form } from "semantic-ui-react";

@inject("TeamStore")
@observer
export class TeamTagSelect extends React.Component {
  render() {
    const { TeamStore } = this.props;
    const invalidTeams = this.props.invalidTeams;
    const invalidTags = this.props.invalidTags;

    let teamList = TeamStore.structureSelect;
    teamList = teamList.filter(
      team => invalidTeams.includes(team.value) === false
    );
    let tagList = TeamStore.classesSelect;
    tagList = tagList.filter(tag => invalidTags.includes(tag.value) === false);
    const defaultTeam = this.props.defaultTeam === '' ? teamList[0].value : this.props.defaultTeam
    const defaultTag = this.props.defaultTag === '' ? tagList[0].value : this.props.defaultTag
    return (
      <div>
        <div style={{ paddingBottom: 5 }}>
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
              defaultValue={defaultTeam}

             

              style={{ width: 350 }}
            />
            <Form.Dropdown
              label="Classes (optional)"
              placeholder="classes"
              fluid
              search
              selection
              options={tagList}
              defaultValue={defaultTag}
              style={{ width: 350 }}
            />
          </Form.Group>
        </Form>
      </div>
    );
  }
}
