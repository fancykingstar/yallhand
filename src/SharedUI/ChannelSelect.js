import React from "react";
import { inject, observer } from "mobx-react";
import { Form } from "semantic-ui-react";
import { TeamStore } from "../Stores/TeamStore";


@inject("ChannelStore")
@observer
export class ChannelSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  render() {
    const { ChannelStore } = this.props;
    const label = this.props.label === "" ? "Channels" : this.props.label


    return (
      <React.Fragment>
        <Form.Select
            label={label}
            search
            selection
            options={ChannelStore._channelSelect}
            placeholder={this.props.placeholder !== undefined ? this.props.placeholder : "" }
            defaultValue={this.props.defaultVal === undefined? "" : this.props.defaultVal}
            onChange={(e, val) => this.props.outputVal(val.value)}
            style={{ minWidth: 200 }}
          />
      </React.Fragment>
    );
  }
}
