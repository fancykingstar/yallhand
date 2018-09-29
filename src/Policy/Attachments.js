import React from "react";
import "./style.css";
import { Icon, Button } from "semantic-ui-react";
import { AttachedList } from "./AttachedList";

export class Attachments extends React.Component {
  render() {
    return (
      <div className="ResourceLinks">
        <div style={{marginBottom: 5}}>Attach File(s) (optional)</div>
    
          <div style={{ float: "left" }}>
            <Button
              primary
              floated="left"
              icon
              labelPosition="left"
              size="small"
            >
              <Icon name="upload" /> Upload
              <input hidden id="upload" multiple type="file" />
            </Button>
          </div>
          <div style={{ float: "right" }}>
            <Button icon labelPosition="left" circular size="small">
              <Icon name="cubes" color="blue" />
              Resources
            </Button>
          </div>
          <br/>
          <AttachedList />
          <div />
      </div>
    );
  }
}
