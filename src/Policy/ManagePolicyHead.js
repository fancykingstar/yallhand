import React from "react";
import "./style.css";
import { Input, Label, Button, Icon } from "semantic-ui-react";
import { SelectVariation } from "./SelectVariation";

export class ManagePolicyHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {qFieldDisabled: true}
  }
  handleEditQuestion = e => {
    this.setState({qFieldDisabled: !this.state.qFieldDisabled})
  }
  render() {
    return (
      <div>
        <h2>Manage Policy</h2>
        <div className="Form">
          <div>Template question</div>
          <div className="FormField">
            <Input disabled={this.state.qFieldDisabled} transparent value="How do I do that thing?" placeholder="Enter a template question..." />
       
            <Icon name='edit' onClick={e => this.handleEditQuestion(e)}/>
           
          </div>
        </div>
        <div className="Form">
          <div>Related Keywords or Phrases (optional)</div>
          <div>
            <Input
              style={{ width: 350 }}
              action="Add"
              placeholder="Enter term(s)..."
            />
          </div>
        </div>
        <div className="Form">
          <Label as="a">
            word
            <Icon name="delete" />
          </Label>
          <Label as="a">
            wordsmith
            <Icon name="delete" />
          </Label>
          <Label as="a">
            word phrase with thing
            <Icon name="delete" />
          </Label>
        </div>
        <div className="Form">
          <div>
            <SelectVariation />
            <Button style={{ display: "inline-block", marginLeft: 5 }}>
              Edit
            </Button>
            <Button color="blue" style={{ display: "inline-block" }}>
              Create New
            </Button>
          </div>
        </div>
        <div className="Form">
          <span>Required Tags: none</span>
        </div>
        <div className="Form">
          <span>Last Updated: 5.23.2018</span>
        </div>
        <div className="Form">
          <span>Resource URLs: none</span>
        </div>
        <div className="Form">
          <span>Attached Files: none</span>
        </div>
        <div className="Form">
          <span>Active Automations: none</span>
        </div>
        <div className="Form">
          <span>Owner(s): </span>
          <Label color="blue" horizontal>
            Mark Z.
          </Label>
        </div>
      </div>
    );
  }
}
