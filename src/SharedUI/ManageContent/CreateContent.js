import React from "react";
import { Button, Modal, Form, Header } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import {ChannelStore} from "../../Stores/ChannelStore"
import { withRouter } from "react-router-dom";
import { generateID } from "../../SharedCalculations/GenerateID";
import "./card-style.css";

@inject("DataEntryStore", "UIStore")
@observer
class CreateContent extends React.Component {
  constructor(props) {
    super(props);
    this.mode = this.props.mode;
  }
  render() {
    const { DataEntryStore } = this.props;
    const { UIStore } = this.props;
    const closeMod = e => {
      UIStore.set("modal", "createContent", false);
    };
    const handleClick = e => {
      DataEntryStore.set("content", "contentRAW", null)
      DataEntryStore.set("content", "isNew", true);
      DataEntryStore.set("content", "stage", "draft");
      UIStore.set("modal", "createContent", false);
      UIStore.set("content", `${this.mode}ID`, generateID());
      UIStore.set("content", "variationID", generateID());
      this.mode === "policy"
        ? this.props.history.push(
            "/panel/faqs/policy-variation/" + UIStore.content.variationID
          )
        : this.props.history.push(
            "/panel/announcements/announcement-variation/" + UIStore.content.variationID
          );
    };

    const displayCard = () => {
      return this.mode === "policy" ? 
      <React.Fragment>
        <div
          className="CreateCard"
          onClick={e => UIStore.set("modal", "createContent", true)}
        >
          <div className="Q">
            <Button circular icon="plus" color="blue" size="large" />
          </div>
          <div className="CreateNewHeader">
            <h3>{`Create a new ${this.mode}`}</h3>
          </div>
        </div>
      </React.Fragment>
     : 
      <React.Fragment>
        <div
          className="CreatePost"
          onClick={e => UIStore.set("modal", "createContent", true)}
        >
          <Button circular icon="plus" color="blue" size="large" />
          <Header as="a">Create New Announcement</Header>
        </div>
      </React.Fragment>
    }
      

    return (
      <div>
        {displayCard()}
        <div>
          <Modal
            open={UIStore.modal.createContent}
            onClose={e => closeMod(e)}
            closeIcon
            size="small"
          >
            <Modal.Header>{`Add New ${this.mode.charAt(0).toUpperCase() +
              this.mode.slice(1)} Under ${ UIStore.sideNav.activeChannel === "All" ? "All" : ChannelStore._getChannel(UIStore.sideNav.activeChannel).label
              
            } Category`}</Modal.Header>
            <Modal.Content>
              <h4>Enter a common query</h4>
              <Form onSubmit={e => handleClick(e)}>
                <Form.Input
                  placeholder="example: Where can I find...?"
                  fluid
                  onChange={(e, val) =>
                    DataEntryStore.set("contentmgmt", "label", val.value)
                  }
                >
                  <input maxLength="100" autoFocus />
                </Form.Input>
              </Form>
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

export default withRouter(CreateContent);
