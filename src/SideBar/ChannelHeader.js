import React from "react";
import { PlusButton } from "../Assets/Graphics/PlusButton";
import { Modal, Button, Input } from "semantic-ui-react";
import {inject, observer} from 'mobx-react'
import "./style.css";


@inject('Store')
@observer
export class ChannelHeader extends React.Component {
  render() {
    const {Store} = this.props
    return (
      <div className="ChannelHeader">
        <div style={{ float: "left" }}>
          <h4>Channels</h4>
        </div>
        <div
          className="ChannelAdd"
          style={{ float: "right", marginRight: 50 }}
          onClick={(e) => Store.openMod(e)}
        >
          <PlusButton />
        </div>

        <Modal open={Store.addChannelMod} onClose={(e) => Store.closeMod(e)} closeIcon size="mini">
          <Modal.Header>Add Channel</Modal.Header>
          <Modal.Content>
            <h4>Channel Name</h4>
            <Input list="suggested" fluid onChange={(e, val) => Store.addTitle(val.value)} />
            <datalist id="suggested">
              <option value="HR" />
              <option value="Payroll" />
              <option value="Benefits" />
            </datalist>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              icon="checkmark"
              labelPosition="right"
              content="Submit"
              onClick={(e) => Store.addChannel(e)} />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
