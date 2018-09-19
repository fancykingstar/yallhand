import React from "react";
import "./style.css";
import { BackToChan } from "./BackToChan";
import { Input, Icon } from "semantic-ui-react";
import { Conditionals } from './Conditionals';

export class QFields extends React.Component {
        constructor(props) {
          super(props);
          this.state = {qFieldDisabled: true}
        }
        handleEditQuestion = e => {
          this.setState({qFieldDisabled: !this.state.qFieldDisabled})
        }
  render() {
    return (
      <div className="ManagePolicy">
        <BackToChan />
        <h2>Edit Variation</h2>
        <div className="Form">
          <div>
            <span></span>
          </div>
          
          <div className="Form">
          <div style={{paddingBottom: 10}}>Question Variation (optional)</div>
          <div className="FormField">
            <Input disabled={this.state.qFieldDisabled} transparent value="How do I do that thing?" placeholder="Enter a template question..." size="huge"/>
       
            <Icon name='edit' onClick={e => this.handleEditQuestion(e)}/>
           
          </div>
          </div>
          
          {/* <div>
            <Input
              placeholder="What is the best way to..."
              label={{ basic: true, content: "?" }}
              labelPosition="right"
              style={{ width: 350 }}
            />
          </div> */}
        </div>
        
        <div className="Form" style={{maxWidth: 350}}>
       <Conditionals/>
         
        </div>
      </div>
    );
  }
}
