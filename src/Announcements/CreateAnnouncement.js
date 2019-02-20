import React from "react";
import { Button, Modal, Form, Header} from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom"
import { initContent, initContentVariation } from "../SharedCalculations/InitThings"
// import "./card-style.css";

@inject("ChannelStore", "UserStore", "DataEntryStore", "UIStore")
@observer 
class CreateAnnouncement extends React.Component {
  render() {
    const { ChannelStore } = this.props;
    const { DataEntryStore} = this.props;
    const { UserStore } = this.props;
    const { UIStore} = this.props;
    // const newPolicyStatus = PoliciesStore._currentObjVariation.label === undefined ? {status: false, message: null, messageHide: true} : FormCharMax(PoliciesStore._currentObjVariation.label, 100)
    const closeMod = (e) => {
      DataEntryStore.setCurrentLabel("")
      UIStore.set("modal", "createAnnouncement", true);
    }
    const handleClick = (e) => {
      DataEntryStore.set("tempContent", "newTempObj", initContent())
      DataEntryStore.initContent(e, UserStore.user, ChannelStore.channelKeys[UIStore.sideNav.activePrimary], DataEntryStore.currentLabel)
      DataEntryStore.initContentVariation(UserStore.user)
      DataEntryStore.setTeam('global')
    //   UIStore.set("modal", "createAnnouncement", true)
    //   this.props.history.push('/panel/faqs/policy-variation/' + DataEntryStore.newTempObjVariation.variationID)
    }
    return (
      <div>
        <div className="CreatePost" onClick={e => UIStore.set("modal", "createAnnouncement", true)}>
          <Button circular icon="plus" color="blue" size="large" />
          <Header as="a">Create New Announcement</Header>
        </div>
        <div>
          <Modal
            open={UIStore.modal.createAnnouncement}
            onClose={e => UIStore.set("modal", "createAnnouncement", true)}
            closeIcon
            size="small"
          >
            <Modal.Header>Add New Announcement Under {UIStore.sideNav.activePrimary} Category</Modal.Header>
            <Modal.Content>
              <h4>Enter a working title for this announcement</h4>
              <Form onSubmit={e => handleClick(e)}>
              <Form.Input
                autofocus={this.focus}
                placeholder="Enter your title..."
                fluid
                onChange={(e, val) => DataEntryStore.setCurrentLabel(val.value)}
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

export default withRouter(CreateAnnouncement)
