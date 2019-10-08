import React from "react";
import { inject, observer } from "mobx-react";
import { ChannelSelect } from "../ChannelSelect"
import { Segment, Form, Header } from "semantic-ui-react";

@inject("DataEntryStore")
@observer
export class Channel extends React.Component {
    render(){
        const {DataEntryStore} = this.props;

        const echoState = (val) => {
          DataEntryStore.set("contentmgmt", "settingsChannel", val);
          if(this.props.output) this.props.output(val);
        }

        return(
            <Segment>
        <div> 
          <Header>Channel</Header>
          <ChannelSelect
              defaultVal={this.props.defaultChannel}
              label={"Select Channel"}
              placeholder="choose channel..."
              outputVal={val => echoState(val)}
            />
        </div>
      </Segment>
        )
    }
}