import React from "react";
import "./style.css";
import { Input, Form, Icon } from "semantic-ui-react";


export class ResourceLinks extends React.Component {
  render() {
    return (
      <div className="ResourceLinks">
            
          <div>Add Resource URLs (optional)</div>
          <div className="BuildLink">
          <Form>
        <Form.Group widths='equal'>
          <Form.Input fluid label='URL' placeholder='example: https://www.example.com/resourcelink/' />
          <Form.Input fluid label='Label' placeholder='example: Overview of Relevant Info'/>
          <Form.Button content="Add" style={{marginTop: 25}}/>
        </Form.Group>
       
      </Form>
             <div className="Condition">
                <div className="ConditionLabel">Condition 1</div>
                <div className="ConditionCtrls">
                <Icon name="window close" />
                <Icon name="edit" /></div>
              </div><br/>

                  <div className="Condition">
                <div className="ConditionLabel">Condition 2</div>
                <div className="ConditionCtrls">
                <Icon name="window close" />
                <Icon name="edit" /></div>
              </div>

        
          </div>
   
      </div>
    );
  }
}
