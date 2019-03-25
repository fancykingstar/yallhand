import React from "react";
import {Header, Segment, Icon} from "semantic-ui-react"
import { Completed } from "./Completed"
import {Views} from "./Views"


export class AnalyticsFrame extends React.Component {
  render() {
    return (
      <div style={{overflowY: "auto"}}>
        <Header
          as="h2"
          content="Analytics"
          subheader="Check performance of content"
        />
        <br />
        <Segment style={{marginRight: 50}}>
        <Header as="h3"> <Icon name="mail" />Email Campaigns</Header>
        <Completed />
        </Segment>
        <br/>
         <Views/>
        
      </div>
    );
  }
}
