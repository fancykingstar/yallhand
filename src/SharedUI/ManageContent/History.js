import React from "react";
import "./style.css";
import { Segment, Button, Header, Modal, Divider } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { history } from "../../DataExchange/Down";
import { createHistory } from "../../DataExchange/Up";
import UTCtoFriendly from "../../SharedCalculations/UTCtoFriendly";
import { displayTeamTag } from "../../SharedCalculations/DisplayTeamTag";
import { giveMeKey } from "../../SharedCalculations/GiveMeKey";

@inject("UIStore")
@observer
export class History extends React.Component {
  render() {
    const { UIStore } = this.props;

    const variDisplay = (variations) => 
      variations.map(vari => (
        <div key={"history" + giveMeKey()}>
          <p><span style={{fontWeight: 800}}>Audience Label: </span>{vari.label === "" ? "(none)" : vari.label}</p>
          <p><span style={{fontWeight: 800}}>Team / Tag: </span>{displayTeamTag(vari.teamID, vari.tags)}</p>
          <span dangerouslySetInnerHTML={{ __html: vari.contentHTML }} />
        </div>
      ));
    

    const historyDisplay = 
     UIStore.content.history.map(content => 
      <div key={"history" + giveMeKey()}>
      <Header as="h5">Updated: {UTCtoFriendly(content.updated)}</Header>
      {variDisplay(content.data.variations)}
      <Divider />
      </div>
    )

    const getHistory = () => {
      history().then(result => {
        UIStore.set("content", "history", result.filter(
          his => his.id === UIStore.content[this.props.mode + "ID"]
        ))
        UIStore.set("modal", "historyView", true);
      });
    };

    return (
      <Segment>
        <div style={{ maxWidth: 400 }}>
          <Header >History
          <Header.Subheader>View changes to published content</Header.Subheader>
          </Header>

          <Button
            onClick={e => getHistory()}
            style={{ display: "inline-block", marginLeft: 5 }}
          >
            {" "}
            View{" "}
          </Button>
          <br />
          <Modal
            open={UIStore.modal.historyView}
            onClose={e => UIStore.set("modal", "historyView", false)}
          >
            <Modal.Header>History</Modal.Header>
            <Modal.Content>
              <Modal.Description>{UIStore.content.history.length > 0? historyDisplay : "No published history to display"}</Modal.Description>
            </Modal.Content>
            <Modal.Actions />
          </Modal>
        </div>
      </Segment>
    );
  }
}
