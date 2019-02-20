import React from "react";
import { inject, observer } from "mobx-react";
import { Modal, Button, Input, Message } from "semantic-ui-react";
import { PlusButton } from "../Assets/Graphics/PlusButton";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { createChannel } from "../DataExchange/Up";
import { channel } from "../DataExchange/PayloadBuilder";
import { departments } from "../TemplateData/departments";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import "./style.css";

@inject("UIStore", "DataEntryStore")
@observer
export class ChannelHeader extends React.Component {
  render() {
    const { UIStore, DataEntryStore } = this.props;
    const newChannelStatus = FormCharMax(DataEntryStore.channel.label, 24);
    const addChannel = () => {
      createChannel(channel())
      UIStore.set("modal", "createChannel", false);
    };

    const deptSuggestions = departments.map(dept => (
      <option key={"dept suggestion" + giveMeKey()} value={dept} />
    ));

    return (
      <div className="ChannelHeader">
        <div style={{ float: "left" }}>
          <h4>Channels</h4>
        </div>
        <div
          className="ChannelAdd"
          style={{ float: "right", marginRight: 50 }}
          onClick={e => UIStore.set("modal", "createChannel", true)}
        >
          <PlusButton />
        </div>

        <Modal
          open={UIStore.modal.createChannel}
          onClose={e => UIStore.set("modal", "createChannel", false)}
          closeIcon
          size="mini"
        >
          <Modal.Header>Add Channel</Modal.Header>
          <Modal.Content>
            <h4>Channel Name</h4>
            <Input
              list="suggested"
              fluid
              onChange={(e, val) =>
                DataEntryStore.set("channel", "label", val.value)
              }
            >
              <input maxLength="24" />
            </Input>
            <datalist id="suggested">{deptSuggestions}</datalist>
            <Message error attached hidden={newChannelStatus.messageHide}>
              {newChannelStatus.message}
            </Message>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              icon="checkmark"
              labelPosition="right"
              content="Submit"
              onClick={e => addChannel()}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
