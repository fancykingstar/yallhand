import React from "react";
import { inject, observer } from "mobx-react";
import { Form } from "semantic-ui-react";

@inject("TeamStore")
@observer
export class TagSelect extends React.Component {
  render() {
    const { TeamStore } = this.props;
    const label = this.props.label === "" ? "Tag" : this.props.label
    const valueType = this.props.value !== undefined ?
    <Form.Dropdown
          label={label}
          placeholder={this.props.placeholder !== undefined ? this.props.placeholder : "" }
          search
          selection
          options={TeamStore.tagsSelect}
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
    options={TeamStore.tagsSelect}
    defaultValue={this.props.defaultVal === undefined ? "" : this.props.defaultVal.length === 0 ? "none": this.props.defaultVal[0]}
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
