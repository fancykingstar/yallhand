import React from "react";
import {inject, observer} from "mobx-react"
import {Header, Segment, Icon} from "semantic-ui-react"
import { Completed } from "./Completed"
import {Views} from "./Views"

@inject("UIStore")
@observer
export class AnalyticsFrame extends React.Component {
  render() {
    const { UIStore } = this.props;
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
