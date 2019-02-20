import React from "react";
import { inject, observer } from "mobx-react";
import { Form } from "semantic-ui-react";


@inject("TeamStore")
@observer
export class TeamSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  render() {
    const { TeamStore } = this.props;
    const label = this.props.label === "" ? "Team" : this.props.label
    let teamList = TeamStore.structureSelect;
    const valueType = this.props.value !== undefined ? 
    <Form.Dropdown
    label={label}
    placeholder={this.props.placeholder !== undefined ? this.props.placeholder : "" }
    search
    selection
    options={teamList}
    value={this.props.value}
    onChange={(e, val) => this.props.outputVal(val.value)}
    style={{ minWidth: 200 }}
  />
    :
    <Form.Dropdown
    label={label}
    placeholder={this.props.placeholder !== undefined ? this.props.placeholder : "" }
    search
    selection
    options={teamList}
    defaultValue={this.props.defaultVal !== "" ? this.props.defaultVal:"global"}
    onChange={(e, val) => this.props.outputVal(val.value)}
    style={{ minWidth: 200 }}
  /> 
    return (
      <React.Fragment>
        {valueType}
      </React.Fragment>
    );
  }
}
