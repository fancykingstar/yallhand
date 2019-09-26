import React from "react";
import { inject, observer } from "mobx-react";
import { ChannelSelect } from "../ChannelSelect"
import { Segment, Form, Header } from "semantic-ui-react";

@inject("DataEntryStore")
@observer
export class Channel extends React.Component {
    render(){
        const {DataEntryStore} = this.props;
        return(
            <Segment>
        <div style={{ maxWidth: 425 }}> 
          <h5>Channel</h5>
          <ChannelSelect
              defaultVal={this.props.defaultChannel}
              label={"Select Channel"}
              placeholder="choose channel..."
              outputVal={val => DataEntryStore.set("contentmgmt", "settingsChannel", val)}
            />
        </div>
      </Segment>
        )
    }
}