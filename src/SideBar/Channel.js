import React from "react";
import { inject, observer } from "mobx-react";
import { Modal, Icon, Input, Message, Form } from "semantic-ui-react";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { ConfirmDelete } from "../SharedUI/ConfirmDelete";
import { modifyChannel, deleteChannel } from "../DataExchange/Up";
import { channelUpdate } from "../DataExchange/PayloadBuilder";
import "./style.css";

export const Channel = inject(
  "UIStore",
  "DataEntryStore",
  "ChannelStore",
  "PoliciesStore"
)(
  observer(props => {
    const { UIStore, DataEntryStore, ChannelStore, PoliciesStore } = props;
    const settingsAvail =
      props.active && UIStore.sideNav.activeChannel !== "All"
        ? { float: "right", opacity: "0.7", marginTop: 5, marginRight: 3 }
        : { display: "none" };
    const newChannelStatus = FormCharMax(DataEntryStore.channel.label, 24);

    const updateChannel = () => {
        modifyChannel(channelUpdate()).then(() => {
        DataEntryStore.set("channel", "label", "")
        UIStore.set("modal", "modifyChannel", false)
      })
    };

    const delChannel = () => {
      deleteChannel(UIStore.sideNav.activeChannel).then(() => {
        UIStore.set("sideNav", "activeChannel", "All")
        DataEntryStore.set("channel", "label", "")
        UIStore.set("modal", "modifyChannel", false)
      })
    }
    const active = props.active ? "ChannelFrame ChannelActive" : "ChannelFrame";

    return (
      <div className={active}>
        <div style={{ float: "left" }}>
          <div className="ChannelText">{props.label}</div>
        </div>
        <div style={settingsAvail}>
          <Icon
            name="setting"
            onClick={e => {
              DataEntryStore.set(
                "channel",
                "label",
                ChannelStore._getChannel(UIStore.sideNav.activeChannel).label.slice()
              );
              UIStore.set("modal", "modifyChannel", true);
            }}
          />

          <Modal
            open={UIStore.modal.modifyChannel}
            size="mini"
            onClose={e => {
              DataEntryStore.reset("channel")
              UIStore.set("modal", "modifyChannel", false)
          }}
          >
            <Modal.Header>Modify Channel</Modal.Header>
            <Modal.Content>
              <h4>Channel Name</h4>
              <Input
                fluid
                value={DataEntryStore.channel.label}
                onChange={(e, val) =>
                  DataEntryStore.set("channel", "label", val.value)
                }
              >
                <input maxLength="24" />
              </Input>
              <Message error attached hidden={newChannelStatus.messageHide}>
                {newChannelStatus.message}
              </Message>
            </Modal.Content>
            <Modal.Actions>
              <Form>
                <Form.Group>
                  <Form.Button
                    primary
                    icon="checkmark"
                    labelPosition="right"
                    content="Update"
                    onClick={e => updateChannel()}
                  />
                  <ConfirmDelete
                    confirm={e => delChannel()}
                    // disabled={true}
                    //  .filter(i => i.chanID === UIStore.sideNav.activeChannel).length > 0}
                  />
                </Form.Group>
              </Form>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    );
  })
);
