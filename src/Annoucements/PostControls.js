import React from "react";
import { Form, Input, Button} from "semantic-ui-react";
import { TeamTagSelect } from "../SharedUI/TeamTagSelect";

export const PostControls = () => {
  return (
    <div>
    <div className="Form">
      <div style={{ paddingBottom: 5 }}>
        <h4>Configure Audience</h4>
      </div>
      <Form>
        <Form.Group>
          <TeamTagSelect
            invalidTeams={[]}
            invalidTags={[]}
            defaultTeam={""}
            defaultTag={""}
            fluid={true}
            multi={false}
          />
        </Form.Group>
      </Form>
      </div>
      <div className="Form">
      <h4>Headline</h4>
      <Input fluid/>
      </div>


    
      </div>
  );
};
