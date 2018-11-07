import React from "react";
import { inject, observer } from "mobx-react";
import { Form } from "semantic-ui-react";

@inject("TeamStore", "DataEntryStore")
@observer
export class TeamTagSelect extends React.Component {
  render() {
    const { TeamStore } = this.props;
    const {DataEntryStore} = this.props;
    const invalidTeams = this.props.invalidTeams;
    const invalidTags = this.props.invalidTags;

    let teamList = TeamStore.structureSelect;
    teamList = teamList.filter(
      team => invalidTeams.includes(team.value) === false
    );
    let tagList = TeamStore.classesSelect;
    tagList = tagList.filter(tag => invalidTags.includes(tag.value) === false);
    const defaultTeam =
      this.props.defaultTeam === "" ? "global" : this.props.defaultTeam;
    const defaultTag =
      this.props.defaultTag === "" ? "none" : this.props.defaultTag;
    const multi = this.props.multi === true ? { multiple: true } : null;
    const isfluid = this.props.fluid === true ? { fluid: true } : { fluid: false };



    return (
     
      <React.Fragment>
        <Form.Dropdown
          label="Teams"
          placeholder="Teams"
          {...multi}
          {...isfluid}
          search
          selection
          options={teamList}
          defaultValue={defaultTeam}
          onChange={(e, val) => DataEntryStore.toggleTeam(val.value)}
          style={{ minWidth: 200 }}
        />
        <Form.Dropdown
          label="Classes (optional)"
          placeholder="classes"
          isfluid
          {...multi}
          {...isfluid}
          search
          selection
          options={tagList}
          defaultValue={defaultTag}
          onChange={(e, val) => DataEntryStore.toggleTag(val.value)}
          style={{ minWidth: 200 }}
        />
      </React.Fragment>
     
    );
  }
}
