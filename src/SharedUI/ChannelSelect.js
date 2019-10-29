import React from "react";
import { inject, observer } from "mobx-react";
import { Form, Input, Button } from "semantic-ui-react";
import { TeamStore } from "../Stores/TeamStore";
import { channel } from "../DataExchange/PayloadBuilder";
import { createChannel } from "../DataExchange/Up";


@inject("ChannelStore")
@observer
export class ChannelSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, addField: false, addValue: "" };
  }
  render() {
    const { ChannelStore } = this.props;
    const { addField, addValue } = this.state;
    const label = this.props.label === "" ? "Channels" : this.props.label
    const opts = [...[{text: "Add...", value: "add", icon: "plus", key: "addchan"}], ...ChannelStore._channelSelect]

    const listenForAdd = (val) => {
      if(val==="add") this.setState({addField: true})
      else this.props.outputVal(val)
    }

    const addChannel = () => {
      createChannel(channel(addValue.trim()));
      this.setState({addField: false, addValue: ""})
    }


    return (
      <React.Fragment>
        {!addField &&
        <>
        <span>{label}</span>
        <Form>
        <Form.Group>
        <Form.Select
            search
            selection
            options={opts}
            placeholder={this.props.placeholder !== undefined ? this.props.placeholder : "" }
            defaultValue={this.props.defaultVal === undefined? "" : this.props.defaultVal}
            onChange={(e, val) => listenForAdd(val.value)}
            style={{ minWidth: 200 }}
          />
             {this.props.submitButton && <Form.Button onClick={()=>this.props.submit()}>Submit</Form.Button>}
             </Form.Group></Form>
          </>
        }
        {
          addField &&
          <>
          <Form>
          <Form.Group>
          <Form.Input placeholder='New channel name...' onChange={e=>this.setState({addValue: e.target.value})} /><Form.Button onClick={()=>addChannel()} primary>Add</Form.Button><Form.Button onClick={()=>this.setState({addField: false})}>Cancel</Form.Button>
          </Form.Group>
          </Form>
         
          </>
        }
      </React.Fragment>
    );
  }
}
