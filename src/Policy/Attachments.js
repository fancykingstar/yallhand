import React from "react";
import "./style.css";
import { Input, Form, Icon, Label, Button } from "semantic-ui-react";


export class Attachments extends React.Component {
  render() {
    return (
      <div className="ResourceLinks">
            
          <div>Attach File(s) (optional)</div>
          <div className="BuildLink">
          <Label
    as="label"
    basic
    htmlFor="upload"
>
    <Button
        icon="upload"
        label={{
            basic: true,
            content: 'Select file(s)'
        }}
        labelPosition="right"
    />
    <input
        hidden
        id="upload"
        multiple
        type="file"
    />
</Label>
            <br/>
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
