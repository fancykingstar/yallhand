import React from "react";
import {inject, observer} from "mobx-react"
import { Completed } from "./Completed"
import {Header, Segment, Icon} from "semantic-ui-react"

@inject("UIStore")
@observer
export class AnalyticsFrame extends React.Component {
  render() {
    const { UIStore } = this.props;
    return (
      <div>
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
        
      </div>
    );
  }
}
