import React from "react";
import { Button, Modal, Form} from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import {withRouter} from "react-router-dom"
import {generateID} from "../SharedCalculations/GenerateID"
import "./card-style.css";

@inject("DataEntryStore", "UIStore")
@observer 
class CreateCard extends React.Component {
  render() {
    const { DataEntryStore} = this.props;
    const { UIStore} = this.props;
    const closeMod = (e) => {
      UIStore.set("modal", "createPolicy", false)
    }
    const handleClick = (e) => {
      UIStore.set("modal", "createPolicy", false)
      DataEntryStore.set("content", "isNew", true)
      DataEntryStore.set("content", "stage", "draft")
      UIStore.set("content", "policyID", generateID())
      UIStore.set("content", "variationID", generateID())

      this.props.history.push('/panel/faqs/policy-variation/' + UIStore.content.variationID)
    }

    return (
      <div>
        <div className="CreateCard" onClick={e => UIStore.set("modal", "createPolicy", true)}>
          <div className="Q">
            <Button circular icon="plus" color="blue" size="large" />
          </div>
          <div className="CreateNewHeader">
            <h3>Create a new policy</h3>
          </div>
        </div>
        <div>
          <Modal
            open={UIStore.modal.createPolicy}
            onClose={e => closeMod(e)}
            closeIcon
            size="small"
          >
            <Modal.Header>Add New Policy Under {UIStore.sideNav.activePrimary} Category</Modal.Header>
            <Modal.Content>
              <h4>Enter a common query</h4>
              <Form onSubmit={e => handleClick(e)}>
              <Form.Input
                placeholder="example: Where can I find...?"
                fluid
                onChange={(e, val) => DataEntryStore.set("contentmgmt", "label", val.value)}
              >
                <input maxLength="100" autoFocus />
              </Form.Input>
              </Form>
              {/* <Message error attached hidden={newPolicyStatus.messageHide}>
                {newPolicyStatus.message}
              </Message> */}
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                icon="checkmark"
                labelPosition="right"
                content="Submit"
                onClick={e => handleClick(e)}
              />
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateCard)
