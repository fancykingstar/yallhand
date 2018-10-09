import React from "react";
import { Button, Modal, Input, Message } from "semantic-ui-react";
import "./card-style.css";
import { NavLink } from "react-router-dom";
import { inject, observer } from "mobx-react";
import {FormCharMax} from '../SharedValidations/FormCharMax'

@inject("PoliciesStore", "SideBarStore", "UserStore")
@observer
export class CreateCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { PoliciesStore } = this.props;
    const { SideBarStore } = this.props;
    const { UserStore } = this.props;
    const newPolicyStatus = FormCharMax(PoliciesStore.policyTitle, 100)
    return (
      <div>
        <div className="CreateCard" onClick={e => PoliciesStore.openMod(e)}>
          <div className="Q">
            <Button circular icon="plus" color="blue" size="large" />
          </div>
          <div className="CreateNewHeader">
            <h3>Create a new policy</h3>
          </div>
        </div>
        <div>
          <Modal
            open={PoliciesStore.addPolicyMod}
            onClose={e => PoliciesStore.closeMod(e)}
            closeIcon
            size="small"
          >
            <Modal.Header>Add New Policy Under {SideBarStore.active} Category</Modal.Header>
            <Modal.Content>
              <h4>Enter a common query</h4>
              <Input
                placeholder="Where can I find...?"
                fluid
                onChange={(e, val) => PoliciesStore.addTitle(val.value)}
              >
                <input maxLength="100" />
              </Input>
              <Message error attached hidden={newPolicyStatus.messageHide}>
                {newPolicyStatus.message}
              </Message>
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                icon="checkmark"
                labelPosition="right"
                content="Submit"
                onClick={e => PoliciesStore.addPolicy(e, UserStore.account[0], SideBarStore.channelKeys[SideBarStore.active] )}
              />
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    );
  }
}
